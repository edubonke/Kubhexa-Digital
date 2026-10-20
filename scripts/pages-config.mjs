export function pagesConfig(environment) {
  let basePath = environment.PAGES_BASE_PATH || "/";
  if (!basePath.startsWith("/")) throw new Error("PAGES_BASE_PATH must start with a slash.");
  if (!basePath.endsWith("/")) basePath += "/";
  if (!/^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(basePath) || basePath.split("/").some(part => part === "." || part === "..")) {
    throw new Error("PAGES_BASE_PATH must be a repository path, for example /kubhexa-digital/.");
  }
  const parseHttps = (value, name) => {
    if (!value) throw new Error(`${name} is required. See docs/github-pages-supabase.md.`);
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error(`${name} must be a public HTTPS URL without credentials, a query, or a fragment.`);
    return url;
  };
  const supabase = parseHttps(environment.KUBHEXA_SUPABASE_URL, "KUBHEXA_SUPABASE_URL");
  if (supabase.pathname !== "/") throw new Error("KUBHEXA_SUPABASE_URL must be the project origin, without a path.");
  const site = parseHttps(environment.PAGES_SITE_URL, "PAGES_SITE_URL");
  if (`${site.pathname.replace(/\/+$/, "")}/` !== basePath) throw new Error("PAGES_SITE_URL and PAGES_BASE_PATH must identify the same site path.");
  return {
    basePath,
    siteUrl: `${site.origin}${basePath}`,
    enquiryEndpoint: `${supabase.origin}/functions/v1/kubhexa-enquiries`,
    allowIndexing: environment.PAGES_ALLOW_INDEXING === "true",
  };
}
