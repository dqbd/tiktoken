import { execa } from "execa";
import { spawn } from "cross-spawn";
import kill from "tree-kill";
import { waitPort } from "./waitPort";

export async function fetchText(port: number, path: string) {
  return fetch(`http://127.0.0.1:${port}${path}`).then((a) => a.text());
}

export async function waitForStart(appPath: string, port: number) {
  const result = await execa("yarn", ["install", "--frozen-lockfile"], {
    stdout: "ignore",
    cwd: appPath,
  });

  if (result.exitCode !== 0) throw new Error("Failed to install dependencies");
  const start = spawn("yarn", ["start"], {
    stdio: ["ignore", "pipe", "pipe"],
    cwd: appPath,
  });

  // start.stdout.on("data", (d) => console.log(d.toString()));
  // start.stderr.on("data", (d) => console.log(d.toString()));

  await waitPort({ port });
  return async () => {
    const pid = start.pid;
    if (pid != null) {
      await new Promise<void>((resolve, reject) =>
        kill(pid, "SIGKILL", (err) => {
          if (err) return reject(err);
          resolve();
        })
      );
    }
  };
}
