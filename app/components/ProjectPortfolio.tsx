"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Maximize2, Minimize2, X } from "lucide-react";
import { portfolioProjects } from "../../lib/portfolio";
import { sitePath } from "../../lib/site-runtime";
import { WebsitePreview } from "./WebsitePreview";

export function ProjectPortfolio() {
  const [active, setActive] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const project = portfolioProjects.find(item => item.id === active);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active) {
      if (!dialog.open) dialog.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; };
    }
    if (dialog.open) dialog.close();
    openerRef.current?.focus({ preventScroll: true });
  }, [active]);
  const close = () => { setActive(null); setExpanded(false); };
  return <>
    <p className="portfolio-attribution">Selected work by Kubhexa founder Phumlane Kubheka. Explore the websites and product experiences below.</p>
    <div className="portfolio-grid">
      {portfolioProjects.map((item, index) => <article className="portfolio-project" key={item.id}>
        <button className="portfolio-image-button" type="button" aria-label={`Explore ${item.name}`} aria-haspopup="dialog" onClick={event => { openerRef.current = event.currentTarget; setActive(item.id); }}>
          <span className="portfolio-browser-chrome" aria-hidden="true"><span><i /><i /><i /></span><span>{item.name}</span><ArrowUpRight size={15} /></span>
          <img src={sitePath(item.image)} alt={item.imageAlt} width={1100} height={756} loading="lazy" />
          <span className="portfolio-image-action">Explore project <ArrowUpRight size={17} /></span>
        </button>
        <div className="portfolio-project-meta"><span>0{index + 1} / {item.category}</span><span>{item.status}</span></div>
        <h3>{item.name}</h3><p>{item.introduction}</p>
        <button type="button" className="text-link" aria-haspopup="dialog" onClick={event => { openerRef.current = event.currentTarget; setActive(item.id); }}>Explore {item.name} <ArrowRight size={17} /></button>
      </article>)}
    </div>
    <dialog ref={dialogRef} className={`case-modal portfolio-modal ${expanded ? "is-expanded" : ""}`} aria-labelledby="portfolio-preview-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {project && <>
        <header className="portfolio-modal-heading"><div><span>{project.category} <span aria-hidden="true">/</span> {project.status}</span><h2 id="portfolio-preview-title">{project.name}</h2></div><div className="portfolio-window-controls"><button className="icon-button" type="button" onClick={() => setExpanded(value => !value)} aria-label={expanded ? "Restore preview size" : "Expand preview"}>{expanded ? <Minimize2 size={19} /> : <Maximize2 size={19} />}</button><button className="icon-button" type="button" onClick={close} aria-label="Close website preview"><X size={22} /></button></div></header>
        <details className="portfolio-details"><summary>About this project</summary><div><p>{project.description}</p><ul>{project.scope.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><p className="small-text">{project.note}</p></div></details>
        <WebsitePreview key={project.id} project={project} />
      </>}
    </dialog>
  </>;
}
