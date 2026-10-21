import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
const runtime = new URL("../.sites-runtime/test/", import.meta.url);
await fs.mkdir(runtime, { recursive: true });
for (const [entry, name] of [["lib/templates.ts", "template-catalogue"], ["lib/packages.ts", "template-offer"], ["lib/template-demo-data.ts", "template-data"]]) {
  await require("esbuild").build({ entryPoints: [new URL(`../${entry}`, import.meta.url).pathname], bundle: true, platform: "node", format: "cjs", logLevel: "silent", outfile: new URL(`${name}.cjs`, runtime).pathname });
}
const { templateCatalog, templateIds, templatePath, templateOptions, templateFromSearch, filterTemplates } = require(new URL("template-catalogue.cjs", runtime).pathname);
const { websitePackages, estimateWebsite, packageEnquiry } = require(new URL("template-offer.cjs", runtime).pathname);
const { demoCartTotal } = require(new URL("template-data.cjs", runtime).pathname);

await require("esbuild").build({ entryPoints: [new URL("../static/render.tsx", import.meta.url).pathname], bundle: true, platform: "node", format: "cjs", jsx: "automatic", define: { __KUBHEXA_STATIC_CONFIG__: JSON.stringify({ basePath: "/Kubhexa-Digital/", siteUrl: "https://studio-test.github.io/Kubhexa-Digital/", enquiryEndpoint: "https://project-test.supabase.co/functions/v1/kubhexa-enquiries" }) }, external: ["react", "react-dom", "lucide-react", "zod"], logLevel: "silent", outfile: new URL("template-render.cjs", runtime).pathname });
const { pageDefinitions, renderPage } = require(new URL("template-render.cjs", runtime).pathname);

test("the six templates cover every package and business family with safe unique routes", () => {
  assert.equal(templateCatalog.length, 6);
  assert.equal(new Set(templateIds).size, 6);
  assert.equal(new Set(templateCatalog.map(item => item.familyId)).size, 6);
  for (const plan of websitePackages) assert.ok(templateCatalog.some(template => template.packageId === plan.id));
  for (const template of templateCatalog) {
    assert.match(templatePath(template.id), /^\/templates\/[a-z-]+\/$/);
    assert.equal(templatePath(template.id, true), `/templates/${template.id}/preview/`);
  }
  assert.throws(() => templatePath("../private"), /Unknown/);
  assert.equal(pageDefinitions.length, 15);
  assert.equal(new Set(pageDefinitions.map(page => page.path)).size, 15);
});

test("catalogue filters support package links and an honest empty result", () => {
  assert.equal(filterTemplates("", "showcase").length, 2);
  assert.equal(filterTemplates("retail", "shop")[0].id, "morrow");
  assert.deepEqual(filterTemplates("wellness", "shop"), []);
});

test("template enquiries derive their package price and retain the selected name", () => {
  for (const template of templateCatalog) {
    const options = templateOptions(template.id);
    const selection = packageEnquiry(options);
    const plan = websitePackages.find(plan => plan.id === template.packageId);
    assert.equal(selection.onceOff, plan.price);
    assert.equal(selection.templateName, template.name);
    assert.ok(selection.summary.includes(`Template: ${template.name}`));
  }
  assert.throws(() => estimateWebsite({ packageId: "start", careId: "none", templateId: "morrow" }), /matches/);
  assert.throws(() => estimateWebsite({ packageId: "shop", careId: "none", templateId: "unknown" }), /known template/);
});

test("URL selection accepts only known templates and ignores caller-supplied prices", () => {
  const template = templateFromSearch("?template=morrow&package=start&price=1");
  assert.equal(template.id, "morrow");
  assert.equal(estimateWebsite(templateOptions(template.id)).onceOff, 17990);
  assert.equal(templateFromSearch("?template=unknown"), undefined);
  assert.equal(templateFromSearch("?template=__proto__"), undefined);
});

test("sample cart quantities, discount and delivery calculate without double charging", () => {
  const items = [{ productId: "vase", colour: "Sand", quantity: 2 }, { productId: "cup", colour: "Charcoal", quantity: 1 }];
  assert.deepEqual(demoCartTotal(items, "delivery", true), { subtotal: 880, discount: 88, delivery: 65, total: 857 });
  assert.equal(demoCartTotal(items, "collection", false).total, 880);
  assert.deepEqual(demoCartTotal([], "delivery", true), { subtotal: 0, discount: 0, delivery: 0, total: 0 });
  for (const quantity of [-1, 0, 1.5, 11, Infinity]) assert.throws(() => demoCartTotal([{ productId: "vase", colour: "Sand", quantity }], "collection", false), /Invalid/);
  assert.throws(() => demoCartTotal([{ productId: "unknown", colour: "Sand", quantity: 1 }], "collection", false), /Invalid/);
  assert.throws(() => demoCartTotal([], "unknown", false), /delivery/);
});

test("every demo and preview prerenders at the correct nested Pages path", () => {
  const catalogue = renderPage("templates");
  assert.equal((catalogue.match(/class="template-card"/g) || []).length, 6);
  assert.equal((catalogue.match(/<iframe/g) || []).length, 0);
  for (const template of templateCatalog) {
    const preview = renderPage("template", template.id);
    assert.equal((preview.match(/<iframe/g) || []).length, 1);
    assert.doesNotMatch(preview, /<iframe[^>]*\ssrc=/, "The frame must start after hydration so cached demo loads are observed");
    assert.ok(preview.includes(`https://studio-test.github.io/Kubhexa-Digital/templates/${template.id}/preview/`));
    assert.ok(preview.includes(`?template=${template.id}#contact`));
    const demo = renderPage("demo", template.id);
    assert.equal((demo.match(/<h1[ >]/g) || []).length, 1);
    assert.equal((demo.match(/<iframe/g) || []).length, 0);
    assert.match(demo, /Fictional business/);
    assert.doesNotMatch(demo, /aria-label="Project enquiry"/);
  }
  assert.throws(() => renderPage("demo", "unknown"), /unknown template/);
});
