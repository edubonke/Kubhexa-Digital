export type PortfolioProject = {
  id: string; name: string; category: string; status: string;
  image: string; imageAlt: string; websiteUrl: string; previewUrl: string;
  introduction: string; description: string; scope: readonly string[]; note: string;
};

export function previewSandbox(previewUrl: string, parentOrigin: string) {
  const preview = new URL(previewUrl);
  if (preview.protocol !== "https:") throw new Error("Project previews require HTTPS.");
  const permissions = "allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox";
  // Cross-origin projects may use their own browser storage. Same-host projects
  // retain an opaque origin so scripts cannot reach the portfolio document.
  return parentOrigin && preview.origin !== parentOrigin ? `${permissions} allow-same-origin` : permissions;
}

export const portfolioProjects: readonly PortfolioProject[] = [
  {
    id: "edubonke", name: "EduBonke", category: "Education platform", status: "Product prototype",
    image: "/assets/projects/edubonke.webp",
    imageAlt: "EduBonke's college administration website and example learner dashboard",
    websiteUrl: "https://edubonke.github.io/EduBonke/",
    previewUrl: "https://edubonke.github.io/EduBonke/demo/",
    introduction: "A connected experience for college administration and the learner journey.",
    description: "A South African college administration prototype connecting admissions, enrolments, attendance, assessments, portfolio evidence, finance, reporting and privacy workflows. Explore the updated student and staff demonstrations, including role-specific tools and printable academic progress records.",
    scope: ["Student and staff workflows", "POE, assessment and reporting", "Role-specific prototype safeguards"],
    note: "The preview uses synthetic information and needs no account. It demonstrates the product experience; it is not a live college deployment.",
  },
  {
    id: "shiftstart", name: "ShiftStart", category: "IT support platform", status: "Independent product",
    image: "/assets/projects/shiftstart.webp",
    imageAlt: "ShiftStart's redesigned dark operational support dashboard with knowledge coverage and verification controls",
    websiteUrl: "https://edubonke.github.io/Shift-Start/",
    previewUrl: "https://edubonke.github.io/Shift-Start/",
    introduction: "An operational IT knowledge library with guided troubleshooting and an interactive operations lab.",
    description: "The redesigned ShiftStart combines procedure search, the symptom wizard, knowledge health indicators and a three-pane procedure workspace. Its operations lab uses synthetic endpoints to demonstrate incident handover, retry and recovery workflows.",
    scope: ["Knowledge architecture & verification", "Search & guided troubleshooting", "Operations training simulation"],
    note: "Procedure verification status is shown within ShiftStart; inclusion here does not certify the technical guidance. The operations lab is a simulation. Open the full website for browser-storage features.",
  },
  {
    id: "alphasonic", name: "Alphasonic International", category: "Construction & renovations", status: "Business website",
    image: "/assets/projects/alphasonic.webp",
    imageAlt: "Alphasonic International's redesigned construction homepage featuring an actual kitchen renovation and site assessment call to action",
    websiteUrl: "https://edubonke.github.io/Alphasonic-International/",
    previewUrl: "https://edubonke.github.io/Alphasonic-International/",
    introduction: "Real project work and a clear route from browsing to a site assessment.",
    description: "The redesigned construction and renovation website presents seven service disciplines, an authentic project photo and video portfolio, and a dedicated site assessment experience with clearly scoped quote requests.",
    scope: ["Responsive business website redesign", "Original project photo & video gallery", "Site assessment enquiry journey"],
    note: "This is the live business website. Enquiry forms and contact links connect to Alphasonic.",
  },
  {
    id: "auntie-uncle", name: "Auntie & Uncle", category: "Household services marketplace", status: "Marketplace prototype",
    image: "/assets/projects/auntie-uncle.webp",
    imageAlt: "Auntie & Uncle's redesigned household services marketplace with service search, location filter and welcoming home imagery",
    websiteUrl: "https://edubonke.github.io/Auntie-Uncle-V2/",
    previewUrl: "https://edubonke.github.io/Auntie-Uncle-V2/",
    introduction: "A marketplace designed to connect South African households with independent helpers.",
    description: "Explore six household service categories, a searchable example helper directory, a fair-pay earnings simulator and sample booking and helper workflows. The V2 website presents a warmer, more accessible marketplace experience.",
    scope: ["Marketplace UX & search", "Helper profiles and booking journeys", "Budget & earnings simulator"],
    note: "The public preview currently uses fictional helper profiles and example rates. It is not a verified live marketplace. Do not enter real personal details or make a real booking in the portfolio preview.",
  },
];
