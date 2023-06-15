import net from "net";

class CodeError<T extends string> extends Error {
  constructor(public code: T, msg: string) {
    super(msg);
  }
}
class SocketError extends CodeError<"ECONNREFUSED" | "ECONNTIMEOUT"> {}
class HttpError extends CodeError<"EREQTIMEOUT" | "ERESPONSE"> {}

interface RequestParams {
  path: string;
  protocol: string;
  host: string;
  port: number;
}

async function createSocket(options: RequestParams, timeout: number) {
  return new Promise<net.Socket>((resolve, reject) => {
    let timer: NodeJS.Timer | undefined = undefined;

    const socket: net.Socket = net.createConnection(
      { port: options.port, host: options.host, family: 4 },
      () => {
        clearTimeout(timer);
        resolve(socket);
      }
    );

    const handleReject = (error: unknown) => {
      socket.destroy();
      clearTimeout(timer);
      reject(error);
    };

    socket.on("error", (error) => {
      if (error.message.includes("ECONNREFUSED")) {
        handleReject(new SocketError("ECONNREFUSED", `Connection to ${options.host}:${options.port} refused`));
      } else {
        handleReject(error);
      }
    });

    timer = setTimeout(() => {
      handleReject(
        new SocketError(
          "ECONNTIMEOUT",
          `Timeout trying to open socket to ${options.host}:${options.port}`
        )
      );
    }, timeout);
  });
}

function checkHttp(socket: net.Socket, params: RequestParams, timeout: number) {
  return new Promise<void>((resolve, reject) => {
    const request = `GET ${params.path} HTTP/1.1\r\nHost: ${params.host}:${params.port}\r\n\r\n`;
    const timer = setTimeout(() => {
      reject(
        new HttpError(
          "EREQTIMEOUT",
          `Timeout waiting for data from ${params.host}:${params.port}`
        )
      );
    }, timeout);

    socket.once("data", function (data) {
      const response = data.toString();
      const statusLine = response.split("\n")[0];

      clearTimeout(timer);
      const statusLineParts = statusLine.split(" ");
      if (statusLineParts.length < 2) {
        return reject(
          new HttpError("ERESPONSE", "Invalid response from server")
        );
      }

      resolve();
    });

    // Send the request.
    socket.write(request);
  });
}

async function tryConnect(options: RequestParams, timeout: number) {
  try {
    const socket = await createSocket(options, timeout);
    try {
      if (options.protocol === "http") {
        await checkHttp(socket, options, timeout);
      }
    } catch (e) {
      if (e instanceof HttpError) return false;
      throw e;
    } finally {
      socket.destroy();
    }
  } catch (e) {
    if (e instanceof SocketError) return false;
    throw e;
  }

  return true;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitPort({
  port,
  host = "127.0.0.1",
  protocol = "http",
  path = "/",
}: {
  port: number;
  host?: string;
  protocol?: string;
  path?: string;
}) {
  while (true) {
    if (await tryConnect({ port, host, protocol, path }, 1500)) {
      break;
    }

    await wait(500);
  }
}
