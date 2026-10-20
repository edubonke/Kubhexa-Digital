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
const define = { __KUBHEXA_STATIC_CONFIG__: JSON.stringify({ basePath: config.basePath, enquiryEndpoint: config.enquiryEndpoint }) };
await require("esbuild").build({
  absWorkingDir: project, entryPoints: ["static/render.tsx"], bundle: true,
  platform: "node", format: "cjs", jsx: "automatic", define,
  outfile: path.join(runtime, "render.cjs"), external: ["react", "react-dom", "lucide-react", "zod"], logLevel: "silent",
});
const { renderPage } = require(path.join(runtime, "render.cjs"));
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
for (const page of ["home", "privacy"]) {
  const title = page === "home" ? "Kubhexa Digital | Websites, Apps & Product Design" : "Privacy | Kubhexa Digital";
  const description = page === "home" ? "Websites and apps built for your next move. Business discovery, UI/UX design and development for growing businesses." : "How Kubhexa Digital uses project enquiry information.";
  const canonical = config.siteUrl + (page === "privacy" ? "privacy/" : "");
  const directory = page === "home" ? output : path.join(output, "privacy");
  await fs.mkdir(directory, { recursive: true });
  const html = `<!doctype html><html lang="en-ZA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#F7F8FC"><meta name="robots" content="${config.allowIndexing ? "index,follow" : "noindex,nofollow"}"><link rel="canonical" href="${escape(canonical)}"><link rel="icon" href="${escape(config.basePath)}favicon.svg"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(config.siteUrl)}assets/kubhexa-kinetic-k.webp">${styles}<script>${preference}</script></head><body><div id="site-root" data-page="${page}">${renderPage(page)}</div><noscript><p class="container">Enable JavaScript to use the interactive demonstrations and send a project enquiry.</p></noscript><script type="module" src="${escape(config.basePath + entry.file)}"></script></body></html>`;
  await fs.writeFile(path.join(directory, "index.html"), html);
}
await fs.writeFile(path.join(output, "404.html"), `<!doctype html><html lang="en-ZA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Kubhexa Digital</title>${styles}</head><body><main class="container legal-page"><h1>Let's get you back.</h1><p>This page could not be found.</p><a class="text-link" href="${escape(config.basePath)}">Return to Kubhexa Digital</a></main></body></html>`);
await fs.writeFile(path.join(output, ".nojekyll"), "");
await fs.rm(path.join(output, ".vite"), { recursive: true });
console.log("GitHub Pages build complete: out/ (home, privacy, assets and 404). No server runtime or database credentials included.");
