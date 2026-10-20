import type { EstimateOptions, FamilyId, PackageId } from "./packages";

export const templateIds = ["neighbour", "northline", "luma", "fieldform", "table-thyme", "morrow"] as const;
export type TemplateId = typeof templateIds[number];
export type TemplateDefinition = { id: TemplateId; name: string; brand: string; familyId: FamilyId; packageId: PackageId; category: string; description: string; headline: string; action: string; interactions: readonly string[] };

export const templateCatalog: readonly TemplateDefinition[] = [
  { id: "neighbour", name: "Neighbour", brand: "Neighbour Home Care", familyId: "services", packageId: "start", category: "Local services", description: "A welcoming one-page website for trades, cleaning and home services.", headline: "Good care. Close to home.", action: "Try a quote enquiry", interactions: ["Browse service options", "Open FAQs", "Try a validated enquiry form"] },
  { id: "northline", name: "Northline", brand: "Northline Advisory", familyId: "professional", packageId: "business", category: "Professional services", description: "A confident five-view business website for consultants and service firms.", headline: "A clearer direction for your business.", action: "Explore the business site", interactions: ["Navigate five sample pages", "Filter services", "Read sample insights", "Try the contact form"] },
  { id: "luma", name: "Luma", brand: "Luma Studio", familyId: "wellness", packageId: "bookings", category: "Beauty & wellness", description: "A calm, editorial website with a complete sample appointment journey.", headline: "A little time. Just for you.", action: "Try the booking journey", interactions: ["Choose a service", "Pick a sample day and time", "Review a simulated booking"] },
  { id: "fieldform", name: "Fieldform", brand: "Field & Form", familyId: "creative", packageId: "showcase", category: "Creative portfolio", description: "An expressive portfolio for studios, photographers and creative businesses.", headline: "Thoughtful work. Distinctive by design.", action: "Explore the project gallery", interactions: ["Filter sample projects", "Open project stories", "Try a project enquiry"] },
  { id: "table-thyme", name: "Table & Thyme", brand: "Table & Thyme", familyId: "hospitality", packageId: "showcase", category: "Food & hospitality", description: "A warm restaurant and catering website with an interactive sample menu.", headline: "Good food. Better company.", action: "Browse the sample menu", interactions: ["Filter the menu", "Show vegetarian dishes", "Open dish details", "Try a catering enquiry"] },
  { id: "morrow", name: "Morrow", brand: "Morrow Goods", familyId: "retail", packageId: "shop", category: "Retail & online shops", description: "A considered storefront with product browsing, a cart and simulated checkout.", headline: "Everyday objects. A little extraordinary.", action: "Try shopping the collection", interactions: ["Filter and search products", "Choose a colour", "Add and edit cart items", "Try a demo discount and checkout"] },
];

export const findTemplate = (id: string | null | undefined) => templateCatalog.find(template => template.id === id);
export function templatePath(id: TemplateId, preview = false) {
  if (!findTemplate(id)) throw new Error("Unknown template.");
  return `/templates/${id}/${preview ? "preview/" : ""}`;
}
export function templateOptions(id: TemplateId): EstimateOptions {
  const template = findTemplate(id);
  if (!template) throw new Error("Unknown template.");
  return { packageId: template.packageId, careId: "none", familyId: template.familyId, templateId: template.id };
}
export const templateFromSearch = (search: string) => findTemplate(new URLSearchParams(search).get("template"));
export function filterTemplates(familyId: string, packageId: string) {
  return templateCatalog.filter(template => (!familyId || template.familyId === familyId) && (!packageId || template.packageId === packageId));
}
