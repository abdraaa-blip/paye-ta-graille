import { spawn } from "node:child_process";

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with code ${code ?? "null"}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  const withBetaSeo = process.argv.includes("--with-beta-seo");

  const server = spawn("npm", ["run", "start"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  const stopServer = () => {
    if (!server.killed) {
      server.kill("SIGTERM");
    }
  };

  process.on("SIGINT", () => {
    stopServer();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    stopServer();
    process.exit(143);
  });

  try {
    await run("npm", ["run", "wait:health"]);
    await run("npm", ["run", "smoke:public"]);
    if (withBetaSeo) {
      await run("npm", ["run", "assert:beta-seo"]);
    }
  } finally {
    stopServer();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
