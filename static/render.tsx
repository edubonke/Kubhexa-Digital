import { renderToString } from "react-dom/server";
import Home from "../app/page";
import Privacy from "../app/privacy/page";
import { MotionProvider } from "../app/components/MotionSystem";
import { TemplateCatalogue, TemplateShowcase } from "../app/templates/TemplatePages";
import TemplateDemo from "../app/templates/TemplateDemo";
import { findTemplate, templateCatalog } from "../lib/templates";
import { seoPages, seoPage, schemasFor } from "../lib/seo";
import { SeoLanding } from "../app/SeoLanding";
export { schemasFor };

export type SitePage = "home" | "privacy" | "templates" | "template" | "demo" | "landing";
type Definition={kind:SitePage;path:string;title:string;description:string;indexable:boolean;templateId?:string;landingPath?:string};
export const pageDefinitions: Definition[] = [
  ...seoPages.map((page):Definition=>({kind:page.path==="/"?"home":page.path==="/privacy/"?"privacy":page.path==="/templates/"?"templates":page.kind==="Template sales"?"template":"landing",path:page.path.slice(1),title:page.title,description:page.desc,indexable:page.path!=="/privacy/",...(page.kind==="Template sales"?{templateId:page.path.split("/")[2]}:{landingPath:page.path})})),
  ...templateCatalog.map((template):Definition=>({kind:"demo",path:`templates/${template.id}/preview/`,templateId:template.id,title:`${template.brand} | Interactive Template Demo`,description:`A fictional ${template.category.toLowerCase()} website demonstrating ${template.name}. Forms and transactions are simulated.`,indexable:false}))
];

export function renderPage(page: SitePage, templateId?: string, landingPath?:string) {
  const template = findTemplate(templateId);
  if ((page === "template" || page === "demo") && !template) throw new Error("Cannot render an unknown template.");
  const content = page === "landing" ? <SeoLanding path={seoPage(landingPath!).path}/> : page === "privacy" ? <Privacy/> : page === "templates" ? <TemplateCatalogue/> : page === "template" ? <TemplateShowcase template={template!}/> : page === "demo" ? <TemplateDemo template={template!}/> : <Home/>;
  return renderToString(<MotionProvider>{content}</MotionProvider>);
}
