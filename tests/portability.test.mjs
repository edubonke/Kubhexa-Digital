import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import { pagesConfig } from "../scripts/pages-config.mjs";

const require = createRequire(import.meta.url);
await fs.mkdir(new URL("../.sites-runtime/test/", import.meta.url), { recursive: true });
await require("esbuild").build({
  entryPoints: [new URL("../supabase/functions/kubhexa-enquiries/handler.ts", import.meta.url).pathname],
  bundle: true, platform: "node", format: "cjs", external: ["zod"], logLevel: "silent",
  outfile: new URL("../.sites-runtime/test/enquiry-handler.cjs", import.meta.url).pathname,
});
const { createEnquiryHandler } = require("../.sites-runtime/test/enquiry-handler.cjs");
await require("esbuild").build({
  entryPoints: [new URL("../lib/portfolio.ts", import.meta.url).pathname],
  bundle: true, platform: "node", format: "cjs", logLevel: "silent",
  outfile: new URL("../.sites-runtime/test/portfolio.cjs", import.meta.url).pathname,
});
const { previewSandbox } = require("../.sites-runtime/test/portfolio.cjs");
const origin = "https://studio-test.github.io";
const fixture = () => ({ id: crypto.randomUUID(), name: "Example Founder", email: "FOUNDER@example.com", company: "Example Studio", projectType: "Website", budget: "R15,000 to R40,000", timeline: "Within 1 to 3 months", brief: "A focused business website with a useful customer enquiry journey.", consent: true, website: "" });
function setup(overrides = {}, upstream) {
  const environment = { KUBHEXA_ALLOWED_ORIGINS: origin, SUPABASE_URL: "https://project-test.supabase.co", SUPABASE_SECRET_KEYS: '{"default":"sb_secret_test_only"}', ...overrides };
  const calls = [];
  const handler = createEnquiryHandler({
    env: name => environment[name],
    fetch: async (input, init) => {
      calls.push({ input, init });
      const payload = JSON.parse(init.body).payload;
      return upstream ? upstream(payload) : Response.json({ status: "received", reference: payload.id });
    },
  });
  return { handler, calls };
}
const request = (body = fixture(), headers = {}, method = "POST") => new Request("https://project-test.supabase.co/functions/v1/kubhexa-enquiries", { method, headers: { Origin: origin, "Content-Type": "application/json", ...headers }, ...(method === "POST" ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}) });

test("repository and root deployments produce the correct public paths", () => {
  const root = pagesConfig({ KUBHEXA_SUPABASE_URL: "https://project-test.supabase.co", PAGES_SITE_URL: "https://studio-test.github.io" });
  assert.equal(root.basePath, "/");
  const repo = pagesConfig({ KUBHEXA_SUPABASE_URL: "https://project-test.supabase.co/", PAGES_SITE_URL: `${origin}/kubhexa-digital`, PAGES_BASE_PATH: "/kubhexa-digital" });
  assert.equal(repo.basePath, "/kubhexa-digital/");
  assert.equal(repo.enquiryEndpoint, "https://project-test.supabase.co/functions/v1/kubhexa-enquiries");
  assert.equal(repo.allowIndexing, false);
});

test("interactive previews preserve parent isolation while cross-origin sites can use their own storage", () => {
  const parent = "https://edubonke.github.io";
  const sameHost = previewSandbox(`${parent}/EduBonke/demo/`, parent).split(" ");
  assert.ok(sameHost.includes("allow-scripts"));
  assert.ok(!sameHost.includes("allow-same-origin"));
  assert.ok(!sameHost.includes("allow-top-navigation"));
  const otherHost = previewSandbox("https://h9b4y8mf87-bit.github.io/Shift-Start-IT-Support-assistent/", parent).split(" ");
  assert.ok(otherHost.includes("allow-same-origin"));
  assert.ok(!otherHost.includes("allow-top-navigation"));
  assert.ok(!previewSandbox(`${parent}/EduBonke/demo/`, "").split(" ").includes("allow-same-origin"));
  assert.throws(() => previewSandbox("http://example.com/", parent), /HTTPS/);
});

test("a Pages production build fails early without a real configuration", () => {
  assert.throws(() => pagesConfig({}), /KUBHEXA_SUPABASE_URL is required/);
  assert.throws(() => pagesConfig({ KUBHEXA_SUPABASE_URL: "http://project-test.supabase.co", PAGES_SITE_URL: origin }), /HTTPS/);
  assert.throws(() => pagesConfig({ KUBHEXA_SUPABASE_URL: "https://user:password@project-test.supabase.co", PAGES_SITE_URL: origin }), /credentials/);
  assert.throws(() => pagesConfig({ KUBHEXA_SUPABASE_URL: "https://project-test.supabase.co", PAGES_SITE_URL: origin, PAGES_BASE_PATH: "/../" }), /repository path/);
  assert.throws(() => pagesConfig({ KUBHEXA_SUPABASE_URL: "https://project-test.supabase.co", PAGES_SITE_URL: origin, PAGES_BASE_PATH: "/repo/" }), /same site path/);
});

test("allowed preflight succeeds without database access", async () => {
  const { handler, calls } = setup();
  const response = await handler(request(undefined, {}, "OPTIONS"));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(response.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
  assert.equal(calls.length, 0);
});

test("the deployed website origin works without a configuration secret and rejects other origins", async () => {
  const settings = JSON.parse(await fs.readFile(new URL("../site.config.json", import.meta.url), "utf8"));
  const websiteOrigin = new URL(settings.siteUrl).origin;
  const { handler, calls } = setup({ KUBHEXA_ALLOWED_ORIGINS: undefined });
  const preflight = await handler(request(undefined, { Origin: websiteOrigin }, "OPTIONS"));
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Origin"), websiteOrigin);
  for (const other of [origin, "https://unrelated.example", `${websiteOrigin}.unrelated.example`]) {
    const response = await handler(request(fixture(), { Origin: other }));
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
  }
  assert.equal(calls.length, 0);
  const value = fixture();
  const saved = await handler(request(value, { Origin: websiteOrigin }));
  assert.equal(saved.status, 201);
  assert.deepEqual(await saved.json(), { received: true, reference: value.id });
  assert.equal(calls.length, 1);
});

test("unknown and missing origins are rejected without reading or writing enquiries", async () => {
  const { handler, calls } = setup();
  const wrong = await handler(request(fixture(), { Origin: "https://unrelated.example" }));
  assert.equal(wrong.status, 403);
  assert.equal(wrong.headers.get("Access-Control-Allow-Origin"), null);
  const missing = request(); missing.headers.delete("Origin");
  assert.equal((await handler(missing)).status, 403);
  assert.equal(calls.length, 0);
});

test("missing server configuration fails closed", async () => {
  for (const overrides of [{ KUBHEXA_ALLOWED_ORIGINS: "" }, { SUPABASE_SECRET_KEYS: "", SUPABASE_SECRET_KEY: "", SUPABASE_SERVICE_ROLE_KEY: "" }, { SUPABASE_URL: "" }]) {
    const { handler, calls } = setup(overrides);
    const response = await handler(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).reference, undefined);
    assert.equal(calls.length, 0);
  }
});

test("GET cannot list enquiries and the endpoint accepts only JSON POSTs", async () => {
  const { handler, calls } = setup();
  const response = await handler(request(undefined, {}, "GET"));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST, OPTIONS");
  assert.equal((await handler(request(fixture(), { "Content-Type": "text/plain" }))).status, 415);
  assert.equal(calls.length, 0);
});

test("malformed and oversized bodies are rejected before storage", async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request("{bad json"))).status, 400);
  assert.equal((await handler(request(fixture(), { "Content-Length": "25000" }))).status, 413);
  assert.equal((await handler(request(" ".repeat(20001)))).status, 413);
  assert.equal(calls.length, 0);
});

test("consent and field validation are enforced on the server", async () => {
  const { handler, calls } = setup();
  const value = { ...fixture(), consent: false, email: "invalid-email", brief: "short" };
  const response = await handler(request(value));
  const result = await response.json();
  assert.equal(response.status, 400);
  assert.ok(result.fields.consent.length);
  assert.ok(result.fields.email.length);
  assert.ok(result.fields.brief.length);
  assert.equal(calls.length, 0);
});

test("honeypot requests never receive a saved receipt", async () => {
  const { handler, calls } = setup();
  const response = await handler(request({ ...fixture(), website: "spam.example" }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).received, undefined);
  assert.equal(calls.length, 0);
});

test("a valid submission returns only its reference after the database acknowledges it", async () => {
  const { handler, calls } = setup();
  const value = fixture();
  const response = await handler(request(value));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { received: true, reference: value.id });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].input, "https://project-test.supabase.co/rest/v1/rpc/kubhexa_submit_enquiry");
  assert.equal(calls[0].init.headers.apikey, "sb_secret_test_only");
  assert.equal(calls[0].init.headers.Authorization, undefined);
  const payload = JSON.parse(calls[0].init.body).payload;
  assert.equal(payload.email, "founder@example.com");
  assert.equal(payload.website, undefined);
});

test("legacy server credentials remain server-side and use their authorization header", async () => {
  const { handler, calls } = setup({ SUPABASE_SECRET_KEYS: "", SUPABASE_SERVICE_ROLE_KEY: "legacy-test-token" });
  const response = await handler(request());
  assert.equal(response.status, 201);
  assert.equal(calls[0].init.headers.Authorization, "Bearer legacy-test-token");
  assert.doesNotMatch(await response.text(), /legacy-test-token/);
});

test("rate-limited and conflicting submissions cannot claim to have been saved", async () => {
  for (const [status, http] of [["rate_limited", 429], ["conflict", 409]]) {
    const { handler } = setup({}, () => Response.json({ status }));
    const response = await handler(request());
    assert.equal(response.status, http);
    if (http === 429) assert.equal(response.headers.get("Retry-After"), "3600");
    assert.equal((await response.json()).received, undefined);
  }
});

test("upstream errors and mismatched references never expose details or generate false receipts", async () => {
  for (const upstream of [() => new Response("private backend details", { status: 500 }), () => { throw new Error("private backend details"); }, () => Response.json({ status: "received", reference: crypto.randomUUID() }), () => Response.json({ unexpected: true })]) {
    const { handler } = setup({}, upstream);
    const response = await handler(request());
    assert.equal(response.status, 503);
    const text = await response.text();
    assert.doesNotMatch(text, /private backend details|sb_secret_test_only|reference|Example Founder/);
  }
});
