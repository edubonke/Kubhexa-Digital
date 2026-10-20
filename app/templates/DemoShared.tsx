"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Menu, X } from "lucide-react";
import { sitePath } from "../../lib/site-runtime";
import type { TemplateDefinition } from "../../lib/templates";

export function useDemoView(allowed: readonly string[]) {
  const [view, setView] = useState(allowed[0]);
  useEffect(() => {
    const sync = () => { const hash = window.location.hash.slice(1); setView(allowed.includes(hash) ? hash : allowed[0]); window.scrollTo({ top: 0, behavior: "instant" }); };
    sync(); window.addEventListener("hashchange", sync); return () => window.removeEventListener("hashchange", sync);
  }, [allowed]);
  return view;
}

export function DemoHeader({ brand, links, active, action, trailing }: { brand: string; links: readonly (readonly [string, string])[]; active?: string; action?: readonly [string, string]; trailing?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return <header className="demo-header"><a className="demo-brand" href={active ? "#home" : "#demo-home"}>{brand}<span aria-hidden="true">.</span></a><button className="demo-menu" type="button" aria-expanded={open} aria-label={open ? "Close sample navigation" : "Open sample navigation"} onClick={() => setOpen(!open)} ref={button}>{open ? <X size={20}/> : <Menu size={20}/>}</button><nav className={open ? "is-open" : ""} aria-label="Sample business navigation" onKeyDown={event => { if(event.key === "Escape"){setOpen(false);button.current?.focus();} }}>{links.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? "page" : undefined} onClick={() => setOpen(false)}>{label}</a>)}{action && <a className="demo-button" href={`#${action[0]}`} onClick={() => setOpen(false)}>{action[1]}<ArrowRight size={15}/></a>}</nav>{trailing}</header>;
}

export function DemoEnquiry({ title = "Tell us what you have in mind.", label = "Project or enquiry", headingLevel = 3 }: { title?: string; label?: string; headingLevel?: 2 | 3 }) {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const status = useRef<HTMLDivElement>(null);
  const Title = headingLevel === 2 ? "h2" : "h3";
  useEffect(() => setReady(true), []);
  useEffect(() => { if(name !== null) status.current?.focus(); }, [name]);
  if(name !== null) return <div className="demo-form-success" role="status" tabIndex={-1} ref={status}><Check size={30}/><Title>That’s the experience, {name || "there"}.</Title><p>This is a demo confirmation. Nothing was sent or saved, and nobody will contact you from this sample form.</p><button className="demo-button" type="button" onClick={() => setName(null)}>Try the form again <ArrowRight size={16}/></button></div>;
  return <form className="demo-enquiry" onSubmit={event => { event.preventDefault(); setName(String(new FormData(event.currentTarget).get("sampleName") || "").trim().slice(0, 60)); }}>
    <Title>{title}</Title><p>Try with example details. This form stays in this page and sends nothing.</p><label>Your name<input name="sampleName" placeholder="Example Visitor" required maxLength={60} autoComplete="off"/></label><label>Email address<input name="sampleEmail" type="email" placeholder="visitor@example.com" required maxLength={254} autoComplete="off"/></label><label>{label}<textarea name="sampleMessage" placeholder="Tell us a little about what you need…" required minLength={20} maxLength={1000} rows={4}/></label><button type="submit" className="demo-button" disabled={!ready}>Try sample enquiry <ArrowRight size={16}/></button><small>Demo only · no message is sent</small>
  </form>;
}

export function DemoDialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const element = dialog.current; if(!element) return;
    if(open && !element.open){opener.current = document.activeElement as HTMLElement; element.showModal();}
    if(!open){if(element.open)element.close();opener.current?.focus({ preventScroll: true });}
  }, [open]);
  return <dialog className="demo-dialog" ref={dialog} aria-label={title} onCancel={onClose} onClose={onClose}><div className="demo-dialog-top"><span>{title}</span><button type="button" aria-label="Close sample dialog" onClick={onClose}><X size={20}/></button></div>{children}</dialog>;
}

export function DemoFooter({ template }: { template: TemplateDefinition }) {
  return <footer className="demo-footer"><strong>{template.brand}</strong><span>Fictional business · illustrative content</span><a href={`${sitePath("/")}?template=${template.id}#contact`} target="_blank" rel="noopener noreferrer">Make this template yours <ArrowRight size={15}/><span className="sr-only"> (opens Kubhexa in a new tab)</span></a></footer>;
}
