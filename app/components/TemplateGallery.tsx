"use client";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Play, RotateCcw } from "lucide-react";
import { formatRand, templateFamilies, websitePackages } from "../../lib/packages";
import { filterTemplates, templatePath, type TemplateDefinition } from "../../lib/templates";
import { sitePath } from "../../lib/site-runtime";
import { TemplateArt } from "../templates/TemplateArt";

export function TemplateGallery({ onChoose, headingLevel = 3, readFilter = false }: { onChoose?: (template: TemplateDefinition) => void; headingLevel?: 2 | 3; readFilter?: boolean }) {
  const [family, setFamily] = useState("");
  const [packageId, setPackageId] = useState("");
  useEffect(() => { if(readFilter){const id = new URLSearchParams(window.location.search).get("package");if(websitePackages.some(plan => plan.id === id))setPackageId(id!);} }, [readFilter]);
  const templates = filterTemplates(family, packageId);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const CardHeading = headingLevel === 2 ? "h3" : "h4";
  return <div id="templates" className="template-gallery" aria-labelledby="template-gallery-title"><div className="template-gallery-heading"><div><span className="package-eyebrow">Explore before you choose</span><Heading id="template-gallery-title">See it. Try it.<br/><span className="text-blue">Make it yours.</span></Heading></div><p>Six original website templates, ready to explore. Scroll the pages, try the interactions and see the layout on different screens. Every business and transaction in the demos is fictional.</p></div>
    <div className="template-gallery-filters"><div><label htmlFor="template-family-filter">Business type</label><select id="template-family-filter" value={family} onChange={event => setFamily(event.target.value)}><option value="">All business types</option>{templateFamilies.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div><div><label htmlFor="template-package-filter">Website package</label><select id="template-package-filter" value={packageId} onChange={event => setPackageId(event.target.value)}><option value="">All packages</option>{websitePackages.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div><p role="status">{templates.length} {templates.length === 1 ? "template" : "templates"} to explore</p>{(family || packageId) && <button type="button" className="text-link" onClick={() => { setFamily(""); setPackageId(""); }}><RotateCcw size={14}/> Reset filters</button>}</div>
    <div className="template-gallery-grid">{templates.map(template => {
      const plan = websitePackages.find(plan => plan.id === template.packageId)!;
      return <article className="template-card" key={template.id}><a className={`template-card-art template-tone-${template.id}`} href={sitePath(templatePath(template.id))} aria-label={`Preview ${template.name} template`}><div className="template-card-browser"><span aria-hidden="true">● ● ●</span><span>Interactive website demo</span><ArrowUpRight size={13}/></div><div className="template-card-composition"><div><span>{template.category}</span><strong>{template.headline}</strong><span className="template-card-mini-button">Explore <ArrowRight size={11}/></span></div><TemplateArt kind={template.id}/></div><span className="template-card-play"><Play size={13}/> Try the live demo</span></a><div className="template-card-meta"><span>{template.category}</span><span>{plan.name} · {formatRand(plan.price)}</span></div><CardHeading>{template.name}</CardHeading><p>{template.description}</p><ul>{template.interactions.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul><div className="template-card-actions"><a className="text-link" href={sitePath(templatePath(template.id))}>Preview {template.name} <ArrowUpRight size={15}/></a>{onChoose ? <button type="button" className="template-use-button" onClick={() => onChoose(template)}>Use this template <ArrowRight size={14}/></button> : <a className="template-use-button" href={`${sitePath("/")}?template=${template.id}#contact`}>Use this template <ArrowRight size={14}/></a>}</div></article>;
    })}</div>
    {!templates.length && <div className="template-gallery-empty"><h4>Let’s open up the options.</h4><p>No demo matches both filters. Try another package or view the full collection.</p><button type="button" className="button" onClick={() => { setFamily(""); setPackageId(""); }}>Show every template <ArrowRight size={17}/></button></div>}
    <p className="template-gallery-note">Demos show the starting design and sample interactions. Your brand, content, supported integrations and final scope are confirmed in your quote. Sample forms, bookings and checkout send nothing.</p>
  </div>;
}
