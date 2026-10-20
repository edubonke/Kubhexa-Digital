"use client";
import { useState } from "react";
import { Globe2, Smartphone, MousePointer2, Plus, Minus, ArrowRight } from "lucide-react";
import { sitePath } from "../../lib/site-runtime";
const services=[
  {title:"Websites & digital presence",icon:Globe2,copy:"Make your offer clear and give customers a simple way to enquire, book, or buy.",details:"A considered website connects your content, brand, and customer journey. We plan the structure, design for mobile, and build around the actions that matter.",items:["Business websites","Landing pages","Enquiry & booking journeys","Launch & analytics setup"],type:"Website"},
  {title:"Apps & business systems",icon:Smartphone,copy:"Give your customers and team a better way to get things done.",details:"We focus on one useful workflow at a time, from a customer portal to a staff dashboard. A phased release helps you test the approach before expanding the product.",items:["Web & mobile applications","Customer portals","Business dashboards","Agreed integrations"],type:"App or business system"},
  {title:"UX & product design",icon:MousePointer2,copy:"Understand the journey. Test the important decisions. Build with a clearer direction.",details:"Explore your idea before investing in a full build. We turn business goals and user needs into a practical, testable product experience.",items:["User & journey research","Wireframes & prototypes","Usability testing","Interface design systems"],type:"UX and product design"},
];
export function Services(){
 const [open,setOpen]=useState<number|null>(2);
 return <div className="service-list">{services.map((s,i)=>{const Icon=s.icon;const expanded=open===i;return <article className={`service ${expanded?"is-open":""}`} key={s.title}>
   <h3><button type="button" className="service-toggle" aria-expanded={expanded} aria-controls={`service-${i}`} onClick={()=>setOpen(expanded?null:i)}><span className="service-icon"><Icon size={26} strokeWidth={1.5}/></span><span className="service-summary"><span className="service-title">{s.title}</span><span className="service-short">{s.copy}</span></span><span className="service-toggle-icon">{expanded?<Minus size={22}/>:<Plus size={22}/>}</span></button></h3>
   <div id={`service-${i}`} className="service-reveal" aria-hidden={!expanded} inert={!expanded}><div className="service-reveal-clip"><div className="service-details"><div><p>{s.details}</p><ul className="service-scope">{s.items.map(item=><li key={item}>{item}</li>)}</ul><a className="text-link" href="#contact" onClick={()=>window.dispatchEvent(new CustomEvent("kubhexa:service",{detail:s.type}))}>Find your starting point <ArrowRight size={18}/></a></div>{i===2?<img src={sitePath("/assets/booking-experience-concept.webp")} alt="An appointment booking interface concept showing a calendar and time selection" width="1440" height="1080" loading="lazy"/>:<div className="service-outcome"><span>{i===0?"A clearer path to your customers.":"One useful workflow. A better working day."}</span></div>}</div></div></div>
 </article>;})}</div>;
}
