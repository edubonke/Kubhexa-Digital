"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { sitePath } from "../../lib/site-runtime";

export function Logo({ symbolOnly = false }: { symbolOnly?: boolean }) {
  return <span className={symbolOnly ? "brand-symbol" : "brand-lockup"}>
    <svg className="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M5 4h11v18L34 4h13L26 25l21 19H32L16 28v16H5V4Z" fill="currentColor"/><path d="m16 22 13-13h9L16 31v-9Z" fill="var(--lime)"/></svg>
    {!symbolOnly && <span className="brand-wordmark">kubhexa<span> digital</span></span>}
  </span>;
}
const links = [["work","Work"],["services","Services"],["packages","Packages"],["approach","Approach"]];
export function Navigation({ home = true }: { home?: boolean }) {
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState("");
  const [mobile,setMobile]=useState(false);
  const buttonRef=useRef<HTMLButtonElement>(null);
  const prefix=home ? "" : sitePath("/");
  useEffect(()=>{const media=window.matchMedia("(max-width: 760px)");const sync=()=>{setMobile(media.matches);if(!media.matches)setOpen(false);};sync();media.addEventListener("change",sync);return()=>media.removeEventListener("change",sync);},[]);
  useEffect(()=>{
    if (!home) return;
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id);},{rootMargin:"-18% 0px -60% 0px",threshold:0});
    for(const [id] of links){const el=document.getElementById(id);if(el)observer.observe(el);}
    return ()=>observer.disconnect();
  },[home]);
  useEffect(()=>{const handle=(event:KeyboardEvent)=>{if(event.key==="Escape"&&open){setOpen(false);buttonRef.current?.focus();}};document.addEventListener("keydown",handle);return()=>document.removeEventListener("keydown",handle);},[open]);
  return <header className="site-header"><div className="container nav-inner">
    <a className="brand-home" href={home ? "#main" : sitePath("/")} aria-label="Kubhexa Digital home"><Logo /></a>
    <nav id="primary-navigation" className={`main-nav ${open?"is-open":""}`} aria-label="Main navigation" aria-hidden={mobile&&!open?true:undefined} inert={mobile&&!open?true:undefined}>{links.map(([id,label])=><a key={id} href={`${prefix}#${id}`} aria-current={active===id?"location":undefined} onClick={()=>setOpen(false)}>{label}</a>)}<a className="button mobile-contact" href={`${prefix}#contact`} onClick={()=>setOpen(false)}>Start a project <ArrowRight size={18}/></a></nav>
    <a className="button nav-contact" href={`${prefix}#contact`}>Start a project <ArrowRight size={18}/></a>
    <button className="menu-button" type="button" ref={buttonRef} aria-label={open?"Close navigation":"Open navigation"} aria-controls="primary-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </div></header>;
}
