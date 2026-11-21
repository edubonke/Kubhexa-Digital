import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { build, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { pagesConfig } from "./pages-config.mjs";

const project = fileURLToPath(new URL("../", import.meta.url));
const settings = JSON.parse(await fs.readFile(path.join(project, "site.config.json"), "utf8"));
const environment = { KUBHEXA_SUPABASE_URL: settings.supabaseUrl, PAGES_SITE_URL: settings.siteUrl, PAGES_BASE_PATH: settings.basePath, PAGES_ALLOW_INDEXING: String(settings.allowIndexing), ...loadEnv("production", project, ""), ...process.env };
const config = pagesConfig(environment);
const output = path.join(project, "out");
const runtime = path.join(project, ".sites-runtime", "pages-render");
await fs.mkdir(runtime, { recursive: true });

const require = createRequire(import.meta.url);
const define = { __KUBHEXA_STATIC_CONFIG__: JSON.stringify({ basePath: config.basePath, enquiryEndpoint: config.enquiryEndpoint, siteUrl: config.siteUrl }) };
await require("esbuild").build({
  absWorkingDir: project, entryPoints: ["static/render.tsx"], bundle: true,
  platform: "node", format: "cjs", jsx: "automatic", define,
  outfile: path.join(runtime, "render.cjs"), external: ["react", "react-dom", "lucide-react", "zod"], logLevel: "silent",
});
const { renderPage, pageDefinitions, schemasFor } = require(path.join(runtime, "render.cjs"));
await build({
  configFile: false, root: project, base: config.basePath, plugins: [react()], define,
  build: { outDir: output, emptyOutDir: true, manifest: true, rollupOptions: { input: path.join(project, "static/main.tsx") } },
});
const manifest = JSON.parse(await fs.readFile(path.join(output, ".vite/manifest.json"), "utf8"));
const entry = Object.values(manifest).find(value => value.isEntry);
if (!entry) throw new Error("The static client entry was not built.");
const css = new Set();
function collectCss(chunk) { for (const file of chunk.css || []) css.add(file); for (const dependency of chunk.imports || []) collectCss(manifest[dependency]); }
collectCss(entry);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const styles = [...css].map(file => `<link rel="stylesheet" href="${escape(config.basePath + file)}">`).join("");
const preference = "try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('kubhexa-motion')==='off')document.documentElement.dataset.motion='off';}catch{}";
const measurementId=settings.analyticsMeasurementId;
if(measurementId&&!/^G-[A-Z0-9]+$/.test(measurementId))throw new Error("Invalid GA4 Measurement ID.");
const analyticsEnabled=Boolean(measurementId&&config.allowIndexing&&config.siteUrl===settings.siteUrl);
function analyticsMarkup(canonical){
  return `<aside id="analytics-preferences" class="analytics-preferences" aria-label="Optional analytics preferences" hidden><strong>Help us improve Kubhexa Digital</strong><p>With your permission, Google Analytics measures site visits and confirmed enquiries. It is optional; the website works without it. No enquiry details are sent to Analytics. Read our <a href="${escape(config.basePath)}privacy/">privacy notice</a>.</p><div class="analytics-actions"><button id="analytics-accept" type="button">Accept analytics</button><button id="analytics-decline" type="button">Decline</button></div></aside><button type="button" id="analytics-settings" class="analytics-settings" aria-controls="analytics-preferences" aria-expanded="false" hidden>Analytics settings</button><span id="analytics-choice-status" class="sr-only" role="status"></span><script defer src="${escape(config.basePath)}analytics.js" data-measurement-id="${escape(measurementId)}" data-canonical="${escape(canonical)}" data-base-path="${escape(config.basePath)}"></script>`;
}
for (const page of pageDefinitions) {
  const { title, description } = page;
  const canonical = config.siteUrl + page.path;
  const robots = config.allowIndexing && page.indexable ? "index,follow" : page.kind === "privacy" ? "noindex,follow" : "noindex,nofollow";
  const schema = page.kind === "demo" || page.kind === "privacy" ? "" : `<script type="application/ld+json">${JSON.stringify(schemasFor('/'+page.path)).replace(/</g,"\\u003c")}</script>`;
  const directory = path.join(output, page.path);
  await fs.mkdir(directory, { recursive: true });
  const html = `<!doctype html><html lang="en-ZA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#F7F8FC"><meta name="robots" content="${robots}"><link rel="canonical" href="${escape(canonical)}"><link rel="icon" href="${escape(config.basePath)}favicon.svg"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(config.siteUrl)}assets/kubhexa-kinetic-k.webp">${schema}${styles}<script>${preference}</script></head><body><div id="site-root" data-page="${escape(page.kind)}"${page.templateId ? ` data-template="${escape(page.templateId)}"` : ""}${page.landingPath ? ` data-landing="${escape(page.landingPath)}"` : ""}>${renderPage(page.kind, page.templateId, page.landingPath)}</div><noscript><p class="container">Enable JavaScript to use the interactive demonstrations and send a project enquiry.</p></noscript>${analyticsEnabled&&page.kind!=="demo"?analyticsMarkup(canonical):""}<script type="module" src="${escape(config.basePath + entry.file)}"></script></body></html>`;
  await fs.writeFile(path.join(directory, "index.html"), html);
}
await fs.writeFile(path.join(output, "sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageDefinitions.filter(p=>config.allowIndexing&&p.indexable).map(p=>`  <url><loc>${escape(config.siteUrl+p.path)}</loc></url>`).join("\n")}\n</urlset>\n`);
if(config.basePath==="/"&&config.allowIndexing)await fs.writeFile(path.join(output,"robots.txt"),`User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}sitemap.xml\n`);
await fs.writeFile(path.join(output, "404.html"), `<!doctype html><html lang="en-ZA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | Kubhexa Digital</title>${styles}</head><body><main class="container legal-page"><h1>Let's get you back.</h1><p>This page could not be found.</p><a class="text-link" href="${escape(config.basePath)}">Return to Kubhexa Digital</a></main></body></html>`);
await fs.writeFile(path.join(output, ".nojekyll"), "");
await fs.rm(path.join(output, ".vite"), { recursive: true });
console.log(`GitHub Pages build complete: ${pageDefinitions.length} prerendered pages, assets and 404. No server runtime or database credentials included.`);
