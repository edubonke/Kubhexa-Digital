import fs from "node:fs/promises";

const settings = JSON.parse(await fs.readFile(new URL("../site.config.json", import.meta.url), "utf8"));
const origin = new URL(settings.siteUrl).origin;
const endpoint = `${settings.supabaseUrl.replace(/\/$/, "")}/functions/v1/kubhexa-enquiries`;
const response = await fetch(endpoint, {
  method: "OPTIONS",
  headers: { Origin: origin, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" },
  signal: AbortSignal.timeout(15000),
});
if (response.status !== 204 || response.headers.get("Access-Control-Allow-Origin") !== origin) {
  throw new Error(`The enquiry function is not ready for ${origin} (HTTP ${response.status}). Follow docs/github-pages-supabase.md before publishing.`);
}
console.log("The configured enquiry function accepts this website's browser origin. Verify a saved enquiry after deployment.");
