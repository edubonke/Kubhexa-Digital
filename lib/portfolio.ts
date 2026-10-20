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
    description: "An education platform exploring admissions, attendance, assessments, portfolio evidence and finance in one workspace. The public demonstration offers separate student and staff experiences.",
    scope: ["Product & interface design", "Student and staff workflows", "Interactive web application"],
    note: "The preview uses synthetic information and needs no account. It demonstrates the product experience; it is not a live college deployment.",
  },
  {
    id: "shiftstart", name: "ShiftStart", category: "IT support platform", status: "Independent product",
    image: "/assets/projects/shiftstart.webp",
    imageAlt: "ShiftStart's public IT support library with search and symptom wizard controls",
    websiteUrl: "https://h9b4y8mf87-bit.github.io/Shift-Start-IT-Support-assistent/",
    previewUrl: "https://h9b4y8mf87-bit.github.io/Shift-Start-IT-Support-assistent/",
    introduction: "Searchable support knowledge, shaped around a technician's next step.",
    description: "An IT support knowledge platform with procedure search, a symptom wizard and a structured reading workspace. The interface makes content status and review requirements visible alongside the guidance.",
    scope: ["Knowledge architecture", "Search & guided troubleshooting", "Responsive interface development"],
    note: "Explore the public interface. Procedure verification status is shown within ShiftStart; inclusion here does not certify the technical guidance.",
  },
  {
    id: "alphasonic", name: "Alphasonic International", category: "Construction & renovations", status: "Business website",
    image: "/assets/projects/alphasonic.webp",
    imageAlt: "Alphasonic International's construction website showing a finished kitchen and site assessment call to action",
    websiteUrl: "https://edubonke.github.io/Alphasonic-International/",
    previewUrl: "https://edubonke.github.io/Alphasonic-International/",
    introduction: "Real project work and a clear route from browsing to a site assessment.",
    description: "A service-led construction and renovation website bringing project photographs, video, service information and site assessment enquiries into one responsive experience.",
    scope: ["Business website design", "Project & video gallery", "Site assessment enquiry journey"],
    note: "This is the live business website. Enquiry forms and contact links connect to Alphasonic.",
  },
];
