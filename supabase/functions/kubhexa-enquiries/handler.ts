import { enquirySchema } from "../../../lib/enquiry-validation.ts";

type Dependencies = { env: (name: string) => string | undefined; fetch: typeof fetch };
const maximumBytes = 20000;
// The website origin is public configuration, so deployment needs no secret-write permission.
// An explicit environment override supports another domain; an empty override disables enquiries.
const defaultAllowedOrigins = "https://edubonke.github.io";

async function limitedJson(request: Request) {
  const length = request.headers.get("content-length");
  if (length && Number(length) > maximumBytes) throw new RangeError("Payload too large");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("No body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximumBytes) { await reader.cancel(); throw new RangeError("Payload too large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function serverKey(env: Dependencies["env"]) {
  const named = env("SUPABASE_SECRET_KEYS");
  if (named) {
    try { const keys = JSON.parse(named); if (typeof keys.default === "string") return keys.default; } catch { /* configuration error handled below */ }
  }
  return env("SUPABASE_SECRET_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");
}

export function createEnquiryHandler(dependencies: Dependencies) {
  return async function handle(request: Request): Promise<Response> {
    const allowed = (dependencies.env("KUBHEXA_ALLOWED_ORIGINS") ?? defaultAllowedOrigins).split(",").map(value => value.trim()).filter(Boolean);
    const origin = request.headers.get("origin");
    const originAllowed = Boolean(origin && allowed.includes(origin));
    const headers: Record<string, string> = { "Cache-Control": "no-store", "Vary": "Origin", "X-Content-Type-Options": "nosniff" };
    if (originAllowed) Object.assign(headers, { "Access-Control-Allow-Origin": origin!, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Access-Control-Max-Age": "600" });
    const json = (body: unknown, status: number) => Response.json(body, { status, headers });
    if (!allowed.length) return json({ error: "Enquiries are temporarily unavailable. Please try again shortly." }, 503);
    if (!originAllowed) return json({ error: "Please send your enquiry from the Kubhexa website." }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "Use the project enquiry form." }), { status: 405, headers: { ...headers, "Content-Type": "application/json", "Allow": "POST, OPTIONS" } });
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return json({ error: "Please submit the project enquiry form." }, 415);
    let raw: unknown;
    try { raw = await limitedJson(request); } catch (error) {
      return json({ error: error instanceof RangeError ? "Your enquiry is too long." : "We could not read your enquiry. Please try again." }, error instanceof RangeError ? 413 : 400);
    }
    const parsed = enquirySchema.safeParse(raw);
    if (!parsed.success) return json({ error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, 400);
    const data = parsed.data;
    if (data.website) return json({ error: "We could not save this enquiry. Please try again." }, 400);
    const url = dependencies.env("SUPABASE_URL");
    const key = serverKey(dependencies.env);
    if (!url || !key) return json({ error: "Enquiries are temporarily unavailable. Please try again shortly." }, 503);
    const databaseHeaders: Record<string, string> = { "Content-Type": "application/json", "apikey": key };
    // Legacy JWT service-role keys also require the authorization header.
    if (!key.startsWith("sb_secret_")) databaseHeaders.Authorization = `Bearer ${key}`;
    try {
      const { website: _website, ...payload } = data;
      const response = await dependencies.fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/kubhexa_submit_enquiry`, { method: "POST", headers: databaseHeaders, body: JSON.stringify({ payload }), signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error("Enquiry storage unavailable");
      const result = await response.json();
      if (result.status === "rate_limited") return new Response(JSON.stringify({ error: "Several enquiries have already been received from this email. Please try again in an hour." }), { status: 429, headers: { ...headers, "Content-Type": "application/json", "Retry-After": "3600" } });
      if (result.status === "conflict") return json({ error: "This reference was already used for different details. Submit again to send these as a new enquiry. Your details are still in the form." }, 409);
      if (result.status !== "received" || result.reference !== data.id) throw new Error("No saved receipt");
      return json({ received: true, reference: data.id }, 201);
    } catch {
      // Never log enquiry fields, credentials or raw upstream responses.
      return json({ error: "We could not confirm that your enquiry was saved. Please try again shortly. Your details are still in the form." }, 503);
    }
  };
}
