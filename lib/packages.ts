import { findTemplate, type TemplateId } from "./templates";

export const formatRand = (value: number) => `R${value.toLocaleString("en-ZA", { maximumFractionDigits: 0 }).replace(/\s/g, ",")}`;

export const websitePackages = [
  { id: "start", name: "Start", price: 2990, purpose: "Get your business online.", audience: "Sole traders, freelancers and home businesses.", delivery: "3–5 working days", scope: "One page · up to 6 sections", features: ["Services overview and business details", "Contact form and WhatsApp button", "Social links, hours and location"], recommended: false },
  { id: "business", name: "Business", price: 5990, purpose: "Turn interest into enquiries.", audience: "Trades, consultants, cleaning companies and service businesses.", delivery: "7–10 working days", scope: "Up to 5 pages", features: ["Individual service information", "Gallery and FAQ section", "One quote or enquiry form", "Your supplied customer testimonials"], recommended: true },
  { id: "showcase", name: "Showcase", price: 8990, purpose: "Give your work room to shine.", audience: "Restaurants, photographers, venues and construction businesses.", delivery: "10–15 working days", scope: "Up to 8 pages · 20 entries", features: ["Business package features", "Menu, portfolio or enquiry catalogue", "An editor for your 20 entries", "30-minute training session"], recommended: false },
  { id: "bookings", name: "Bookings", price: 11990, purpose: "Make it easier to book you.", audience: "Salons, barbers, tutors, trainers and appointment-based businesses.", delivery: "10–15 working days", scope: "Up to 5 pages + booking integration", features: ["One location, up to 3 staff and 10 services", "Supported third-party booking platform", "Availability, confirmations and cancellation settings", "One-hour handover"], recommended: false },
  { id: "shop", name: "Shop", price: 17990, purpose: "Open your online shop.", audience: "Boutiques, beauty brands, craftspeople and small retailers.", delivery: "15–20 working days", scope: "5 content pages + store pages", features: ["Upload of 30 products, up to 60 variants/SKUs", "One supported payment gateway and stock management", "Collection and up to 3 simple delivery zones", "Order emails, checkout tests and one-hour training"], recommended: false },
] as const;
export type PackageId = typeof websitePackages[number]["id"];

export const carePlans = [
  { id: "essential", name: "Essential Care", price: 349, for: "For low-change brochure websites", packages: ["start", "business", "showcase"], features: ["Standard hosting and SSL", "Uptime monitoring and daily backups", "Routine technical maintenance", "Content changes quoted separately"] },
  { id: "business", name: "Business Care", price: 749, for: "For content and booking websites", packages: ["start", "business", "showcase", "bookings"], features: ["Essential hosting and monitoring", "CMS and plugin maintenance where applicable", "30 minutes of content changes each month"] },
  { id: "commerce", name: "Commerce Care", price: 1499, for: "For online stores and active websites", packages: ["start", "business", "showcase", "bookings", "shop"], features: ["Hosting suited to the agreed store size", "Backups and routine maintenance", "A monthly checkout check for stores", "1 hour of product or content changes monthly"] },
] as const;
export type CareId = "none" | typeof carePlans[number]["id"];
export const supportsCare = (packageId: PackageId, careId: CareId) => careId === "none" || Boolean(carePlans.find(plan => plan.id === careId)?.packages.some(id => id === packageId));

export const templateFamilies = [
  { id: "services", name: "Services & Trades", examples: "Plumbers, electricians, cleaners, security and local services", packageId: "business" },
  { id: "professional", name: "Professional Services", examples: "Consultants, accountants, agencies and advisers", packageId: "business" },
  { id: "wellness", name: "Beauty & Wellness", examples: "Salons, barbers, personal trainers and appointment businesses", packageId: "bookings" },
  { id: "hospitality", name: "Food & Hospitality", examples: "Restaurant menus, catering enquiries, venues and guesthouses", packageId: "showcase" },
  { id: "creative", name: "Creative & Portfolio", examples: "Photographers, designers, makers and project portfolios", packageId: "showcase" },
  { id: "retail", name: "Retail", examples: "Fashion, cosmetics, gifts, crafts and small online shops", packageId: "shop" },
] as const;
export type FamilyId = typeof templateFamilies[number]["id"];

export const addOns = [
  { id: "extraPages", name: "Additional page", description: "Uses an existing layout", price: 750, unit: "/ page" },
  { id: "copywriting", name: "Website copywriting", description: "Up to 5 pages, maximum 400 words per page", price: 2000, unit: "" },
  { id: "brandKit", name: "Starter logo kit", description: "2 concepts, 2 revision rounds, final logo files and colour palette", price: 2500, unit: "" },
  { id: "productBatches", name: "10 extra simple products", description: "Shop only; complete product information supplied", price: 750, unit: "/ batch" },
  { id: "blog", name: "Blog setup", description: "Includes formatting and publishing 1 supplied article", price: 1500, unit: "" },
] as const;

export type EstimateOptions = { packageId: PackageId; careId: CareId; familyId?: FamilyId | ""; templateId?: TemplateId; extraPages?: number; productBatches?: number; copywriting?: boolean; brandKit?: boolean; blog?: boolean };
const count = (value: number | undefined) => {
  if (value === undefined) return 0;
  if (!Number.isInteger(value) || value < 0 || value > 10) throw new Error("Choose a quantity from 0 to 10.");
  return value;
};
const checked = (value: boolean | undefined) => {
  if (value === undefined) return false;
  if (typeof value !== "boolean") throw new Error("Choose a valid add-on.");
  return value;
};

export function estimateWebsite(options: EstimateOptions) {
  const plan = websitePackages.find(plan => plan.id === options.packageId);
  if (!plan) throw new Error("Choose a website package.");
  const care = carePlans.find(plan => plan.id === options.careId);
  if (options.careId !== "none" && !care) throw new Error("Choose a care plan.");
  if (!supportsCare(plan.id, options.careId)) throw new Error("Choose a care plan suited to this package.");
  const family = templateFamilies.find(family => family.id === options.familyId);
  if (options.familyId && !family) throw new Error("Choose a business type.");
  const template = findTemplate(options.templateId);
  if (options.templateId && !template) throw new Error("Choose a known template.");
  if (template && (template.packageId !== plan.id || (family && template.familyId !== family.id))) throw new Error("Choose a template that matches this package and business type.");
  const extraPages = count(options.extraPages);
  const productBatches = count(options.productBatches);
  if (productBatches && plan.id !== "shop") throw new Error("Extra product uploads are available with Shop.");
  const quantities = { extraPages, productBatches, copywriting: Number(checked(options.copywriting)), brandKit: Number(checked(options.brandKit)), blog: Number(checked(options.blog)) };
  const extras = addOns.filter(item => quantities[item.id] > 0).map(item => ({ name: item.name, quantity: quantities[item.id], price: item.price * quantities[item.id] }));
  const addOnTotal = extras.reduce((sum, item) => sum + item.price, 0);
  const onceOff = plan.price + addOnTotal;
  const monthly = care?.price ?? 0;
  return { plan, care, family, template, extras, addOnTotal, onceOff, monthly, firstYearFees: onceOff + monthly * 12 };
}

export function packageEnquiry(options: EstimateOptions) {
  const estimate = estimateWebsite(options);
  const { plan, care, family, template, extras, onceOff, monthly, firstYearFees } = estimate;
  const summary = [
    "Selected small-business website estimate",
    `Package: Kubhexa ${plan.name} — ${formatRand(plan.price)} once-off`,
    ...(family ? [`Business type: ${family.name}`] : []),
    ...(template ? [`Template: ${template.name} (${template.id})`] : []),
    `Add-ons: ${extras.length ? extras.map(item => `${item.quantity} × ${item.name} (${formatRand(item.price)})`).join("; ") : "None"}`,
    `Once-off estimate: ${formatRand(onceOff)}`,
    `Care: ${care ? `${care.name} — ${formatRand(monthly)}/month` : "No Kubhexa care plan; arrange hosting separately"}`,
    `First-year Kubhexa fees: ${formatRand(firstYearFees)} (build plus 12 months of selected care)`,
    "Estimate excludes domains, third-party fees and VAT if applicable. Scope and final quote to be confirmed before a deposit.",
  ].join("\n");
  const budget = onceOff < 15000 ? "Under R15,000" : onceOff <= 40000 ? "R15,000 to R40,000" : onceOff <= 100000 ? "R40,000 to R100,000" : "R100,000+";
  return { title: `Kubhexa ${plan.name}`, templateName: template?.name ?? "", onceOff, monthly, summary, budget };
}
export type PackageEnquiry = ReturnType<typeof packageEnquiry>;

export function includePackageInBrief(brief: string, selection: PackageEnquiry | null) {
  const value = brief.trim();
  if (value.length < 20) throw new Error("Tell us about your business and what you need (at least 20 characters).");
  const combined = selection ? `${value}\n\n${selection.summary}` : value;
  if (combined.length > 4000) throw new Error("Please shorten your brief so it fits with your selected estimate (4,000 characters in total).");
  return combined;
}
