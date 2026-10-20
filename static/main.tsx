import { hydrateRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "../app/globals.css";
import "../app/motion.css";
import "../app/portfolio.css";
import "../app/packages.css";
import "../app/templates.css";
import "../app/template-demos.css";
import Home from "../app/page";
import Privacy from "../app/privacy/page";
import { MotionProvider } from "../app/components/MotionSystem";
import { findTemplate } from "../lib/templates";

const root = document.getElementById("site-root");
if (!root) throw new Error("The page content is missing.");
async function hydratePage() {
  if(!root)return;
  const page = root.dataset.page;
  let content: React.ReactNode;
  if(page === "demo" || page === "template") {
    const template = findTemplate(root.dataset.template);
    if(!template)throw new Error("This template is unavailable.");
    if(page === "demo") { const { default: Demo } = await import("../app/templates/TemplateDemo"); content = <Demo template={template}/>; }
    else { const { TemplateShowcase } = await import("../app/templates/TemplatePages"); content = <TemplateShowcase template={template}/>; }
  } else if(page === "templates") { const { TemplateCatalogue } = await import("../app/templates/TemplatePages"); content = <TemplateCatalogue/>; }
  else content = page === "privacy" ? <Privacy/> : <Home/>;
  hydrateRoot(root, <MotionProvider>{content}</MotionProvider>);
}
void hydratePage();
