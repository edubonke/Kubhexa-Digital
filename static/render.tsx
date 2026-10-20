import { renderToString } from "react-dom/server";
import Home from "../app/page";
import Privacy from "../app/privacy/page";
import { MotionProvider } from "../app/components/MotionSystem";
import { TemplateCatalogue, TemplateShowcase } from "../app/templates/TemplatePages";
import TemplateDemo from "../app/templates/TemplateDemo";
import { findTemplate, templateCatalog } from "../lib/templates";

export type SitePage = "home" | "privacy" | "templates" | "template" | "demo";
export const pageDefinitions = [
  { kind: "home", path: "", title: "Kubhexa Digital | Websites, Apps & Product Design", description: "Websites and apps built for your next move. Explore customised small-business website packages from R2,990, interactive templates, UI/UX design and custom development." },
  { kind: "privacy", path: "privacy/", title: "Privacy | Kubhexa Digital", description: "How Kubhexa Digital uses project enquiry information." },
  { kind: "templates", path: "templates/", title: "Interactive Website Templates | Kubhexa Digital", description: "Explore six interactive small-business website templates. Try service enquiries, menus, portfolios, booking and a sample online shop." },
  ...templateCatalog.flatMap(template => [
    { kind: "template", path: `templates/${template.id}/`, templateId: template.id, title: `${template.name} Website Template | Kubhexa Digital`, description: template.description },
    { kind: "demo", path: `templates/${template.id}/preview/`, templateId: template.id, title: `${template.brand} | Interactive Template Demo`, description: `A fictional ${template.category.toLowerCase()} website demonstrating ${template.name}. Forms and transactions are simulated.` },
  ]),
];

export function renderPage(page: SitePage, templateId?: string) {
  const template = findTemplate(templateId);
  if ((page === "template" || page === "demo") && !template) throw new Error("Cannot render an unknown template.");
  const content = page === "privacy" ? <Privacy/> : page === "templates" ? <TemplateCatalogue/> : page === "template" ? <TemplateShowcase template={template!}/> : page === "demo" ? <TemplateDemo template={template!}/> : <Home/>;
  return renderToString(<MotionProvider>{content}</MotionProvider>);
}
