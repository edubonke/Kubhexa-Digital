import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
const runtime = new URL("../.sites-runtime/test/", import.meta.url);
await fs.mkdir(runtime, { recursive: true });
for (const [entry, name] of [["lib/packages.ts", "packages"], ["lib/enquiry-validation.ts", "package-validation"]]) {
  await require("esbuild").build({ entryPoints: [new URL(`../${entry}`, import.meta.url).pathname], bundle: true, platform: "node", format: "cjs", external: ["zod"], logLevel: "silent", outfile: new URL(`${name}.cjs`, runtime).pathname });
}
const { estimateWebsite, packageEnquiry, includePackageInBrief, formatRand, websitePackages, carePlans, templateFamilies } = require(new URL("packages.cjs", runtime).pathname);
const { enquirySchema } = require(new URL("package-validation.cjs", runtime).pathname);
const base = { packageId: "business", careId: "none" };

test("each package starts at its published price without recurring fees or hidden extras", () => {
  const expected = { start: 2990, business: 5990, showcase: 8990, bookings: 11990, shop: 17990 };
  for (const [packageId, price] of Object.entries(expected)) {
    const quote = estimateWebsite({ packageId, careId: "none" });
    assert.equal(quote.onceOff, price);
    assert.equal(quote.monthly, 0);
    assert.equal(quote.firstYearFees, price);
    assert.deepEqual(quote.extras, []);
  }
  assert.equal(formatRand(17990), "R17,990");
});

test("one-off extras and optional care are calculated separately without double charging", () => {
  const quote = estimateWebsite({ ...base, careId: "essential", extraPages: 2, copywriting: true, brandKit: true, blog: true });
  assert.equal(quote.addOnTotal, 7500);
  assert.equal(quote.onceOff, 13490);
  assert.equal(quote.monthly, 349);
  assert.equal(quote.firstYearFees, 17678);
  assert.equal(quote.firstYearFees + 110, 17788);
  assert.equal(quote.extras.find(item => item.name === "Additional page").quantity, 2);
});

test("the published first-year example agrees with the catalogue prices", () => {
  const quote = estimateWebsite({ ...base, careId: "essential" });
  assert.equal(quote.firstYearFees, 10178);
  assert.equal(quote.firstYearFees + 110, 10288);
});

test("store uploads are bounded and brochure websites cannot accidentally buy product batches", () => {
  assert.equal(estimateWebsite({ packageId: "shop", careId: "commerce", productBatches: 2 }).onceOff, 19490);
  assert.throws(() => estimateWebsite({ ...base, productBatches: 1 }), /Shop/);
  for (const value of [-1, 1.5, 11, Infinity, NaN, "2"]) {
    assert.throws(() => estimateWebsite({ ...base, extraPages: value }), /quantity/);
  }
  assert.throws(() => estimateWebsite({ ...base, copywriting: "yes" }), /add-on/);
});

test("unknown selections and incompatible care cannot produce a valid priced estimate", () => {
  assert.throws(() => estimateWebsite({ ...base, packageId: "unknown" }), /package/);
  assert.throws(() => estimateWebsite({ ...base, careId: "unknown" }), /care/);
  assert.throws(() => estimateWebsite({ packageId: "shop", careId: "essential" }), /suited/);
  assert.throws(() => estimateWebsite({ packageId: "bookings", careId: "business", familyId: "unknown" }), /business type/);
  for (const family of templateFamilies) assert.ok(websitePackages.some(plan => plan.id === family.packageId));
});

test("every supported package and care selection passes the existing server enquiry schema", () => {
  for (const plan of websitePackages) {
    for (const careId of ["none", ...carePlans.filter(care => care.packages.includes(plan.id)).map(care => care.id)]) {
      const selection = packageEnquiry({ packageId: plan.id, careId });
      const brief = includePackageInBrief("Synthetic verification only. A business website with a clear service enquiry journey.", selection);
      const parsed = enquirySchema.safeParse({ id: crypto.randomUUID(), name: "Synthetic Package Test", email: "package-test@example.com", company: "Synthetic verification only", projectType: "Website", budget: selection.budget, timeline: "Exploring options", brief, consent: true, website: "" });
      assert.equal(parsed.success, true);
      assert.ok(brief.includes(selection.title));
      assert.ok(brief.includes(formatRand(selection.onceOff)));
    }
  }
});

test("package handoff preserves the customer's brief, includes precise selections, and chooses the right budget", () => {
  const selection = packageEnquiry({ packageId: "shop", careId: "commerce", familyId: "retail", productBatches: 2, brandKit: true });
  const original = "Our business sells handmade products and needs collection and delivery.";
  const brief = includePackageInBrief(original, selection);
  assert.ok(brief.startsWith(original + "\n\n"));
  assert.match(brief, /Retail/);
  assert.match(brief, /2 × 10 extra simple products/);
  assert.match(brief, /R21,990/);
  assert.match(brief, /R1,499\/month/);
  assert.equal(selection.budget, "R15,000 to R40,000");
  assert.equal(packageEnquiry(base).budget, "Under R15,000");
  assert.equal(includePackageInBrief(original, null), original);
});

test("a selected estimate cannot replace the required customer brief or silently truncate it", () => {
  const selection = packageEnquiry(base);
  assert.throws(() => includePackageInBrief("", selection), /at least 20/);
  assert.throws(() => includePackageInBrief("a".repeat(4000), selection), /shorten/);
  const exactFit = "a".repeat(4000 - selection.summary.length - 2);
  assert.equal(includePackageInBrief(exactFit, selection).length, 4000);
});
