import { spawn } from "node:child_process";
import { withPublicBetaEnv } from "./lib/e2e-env.mjs";

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

/**
 * Si `next start` quitte tout de suite (ex. EADDRINUSE), on échoue avant les smoke
 * au lieu de valider un serveur déjà présent sur le port.
 */
function waitForEarlyProcessExit(child, ms) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, ms);
    child.once("exit", (code) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      resolve(code ?? 0);
    });
    child.once("error", () => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      resolve(1);
    });
  });
}

/** Port d’écoute pour `next start` (évite EADDRINUSE si 3000 est pris). */
function resolvePort() {
  const raw = process.env.PTG_CHECK_PORT?.trim() || process.env.PORT?.trim() || "3000";
  return /^\d+$/.test(raw) ? raw : "3000";
}

async function main() {
  const withBetaSeo = process.argv.includes("--with-beta-seo");
  const port = resolvePort();
  const explicitBase = process.env.PTG_BASE_URL?.trim().replace(/\/+$/, "");
  const baseUrl = explicitBase && explicitBase.length > 0 ? explicitBase : `http://127.0.0.1:${port}`;

  if (withBetaSeo) {
    console.log("[checks:prod-local] Build production en mode beta…");
    await run("npm", ["run", "build:beta"], { env: process.env, shell: process.platform === "win32" });
  }

  const childEnv = {
    ...process.env,
    PORT: port,
    PTG_BASE_URL: baseUrl,
  };
  const runtimeEnv = withBetaSeo ? withPublicBetaEnv(childEnv) : childEnv;
  console.log(`[checks:prod-local] next start -p ${port} · PTG_BASE_URL=${baseUrl}`);

  const server = spawn("npm", ["run", "start", "--", "-p", port], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: runtimeEnv,
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
    const earlyCode = await waitForEarlyProcessExit(server, 4000);
    if (earlyCode !== null && earlyCode !== 0) {
      throw new Error(
        `next start a quitté avec le code ${earlyCode} (souvent EADDRINUSE sur le port ${port}). Ferme l’autre processus (next dev, ancien next start) ou lance avec PTG_CHECK_PORT=3010 et PTG_BASE_URL=http://127.0.0.1:3010.`,
      );
    }
    await run("npm", ["run", "wait:health"], { env: runtimeEnv, shell: process.platform === "win32" });
    await run("npm", ["run", "smoke:public"], { env: runtimeEnv, shell: process.platform === "win32" });
    if (withBetaSeo) {
      await run("npm", ["run", "assert:beta-seo"], { env: runtimeEnv, shell: process.platform === "win32" });
    }
  } finally {
    stopServer();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
