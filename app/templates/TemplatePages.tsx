import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { formatRand, websitePackages } from "../../lib/packages";
import { sitePath, siteUrl } from "../../lib/site-runtime";
import { templatePath, type TemplateDefinition } from "../../lib/templates";
import { Logo, Navigation } from "../components/Navigation";
import { MotionToggle } from "../components/MotionSystem";
import { TemplateGallery } from "../components/TemplateGallery";
import { WebsitePreview } from "../components/WebsitePreview";

export function TemplateCatalogue() {
  return <><a className="skip-link" href="#main">Skip to content</a><Navigation home={false}/><main id="main" className="container template-catalogue"><a className="text-link" href={`${sitePath("/")}#packages`}><ArrowLeft size={16}/> Back to website packages</a><div className="template-catalogue-intro"><span className="package-eyebrow">The Kubhexa template collection</span><h1>Your next website.<br/><span className="text-blue">Open for exploring.</span></h1><p>Browse six distinct starting points. Every template opens as a complete interactive website, with desktop, laptop, tablet and phone previews.</p></div><TemplateGallery headingLevel={2} readFilter/></main><footer className="container template-catalogue-footer"><Logo/><a href={`${sitePath("/")}#contact`}>Discuss your website <ArrowRight size={16}/></a><MotionToggle/><a href={sitePath("/privacy/")}>Privacy</a></footer></>;
}

export function TemplateShowcase({ template }: { template: TemplateDefinition }) {
  const plan = websitePackages.find(plan => plan.id === template.packageId)!;
  const previewUrl = new URL(sitePath(templatePath(template.id, true)), siteUrl).href;
  return <><a className="skip-link" href="#template-preview">Skip to interactive preview</a><header className="template-showcase-header"><a href={sitePath("/")} aria-label="Kubhexa Digital home"><Logo/></a><a className="text-link" href={sitePath("/templates/")}><ArrowLeft size={15}/> All templates</a><a className="button" href={`${sitePath("/")}?template=${template.id}#contact`}>Use {template.name} <ArrowRight size={17}/></a></header><main className="template-showcase-main"><div className="template-showcase-intro"><div><span className="package-eyebrow">{template.category} / Interactive sample</span><h1>{template.name}</h1><p>{template.description}</p></div><div><strong>{plan.name} package · {formatRand(plan.price)} once-off</strong><p>Brand customisation within the agreed scope. Care, external fees and VAT if applicable are separate.</p><a href={`${sitePath("/")}#packages`}>Compare the packages <ArrowUpRight size={13}/></a></div></div><div id="template-preview" className="template-showcase-preview"><WebsitePreview project={{ name: template.name, websiteUrl: previewUrl, previewUrl }} responsiveTools/></div><div className="template-showcase-foot"><p><strong>Try it:</strong> {template.interactions.join(" · ")}. Sample businesses, service prices and transactions are illustrative. Forms, reservations and checkout are simulated.</p><MotionToggle/></div></main></>;
}
