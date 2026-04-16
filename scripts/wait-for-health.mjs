const base = process.env.PTG_BASE_URL?.trim() || "http://127.0.0.1:3000";
const retries = Number(process.env.PTG_HEALTH_RETRIES ?? 45);
const intervalMs = Number(process.env.PTG_HEALTH_INTERVAL_MS ?? 1000);

const healthUrl = new URL("/api/health", base).toString();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let lastStatus = "no_response";
for (let i = 1; i <= retries; i += 1) {
  try {
    const res = await fetch(healthUrl, {
      method: "GET",
      headers: { "User-Agent": "ptg-wait-for-health" },
    });
    lastStatus = String(res.status);
    if (res.status === 200) {
      console.log(`Health ready on attempt ${i}: ${healthUrl}`);
      process.exit(0);
    }
  } catch (error) {
    lastStatus = error instanceof Error ? error.message : String(error);
  }

  if (i < retries) {
    await sleep(intervalMs);
  }
}

console.error(`Health check not ready after ${retries} attempts (${healthUrl}). Last status: ${lastStatus}`);
process.exit(1);
