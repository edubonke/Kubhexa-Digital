"use client";
import { useState } from "react";
import type { TemplateDefinition } from "../../lib/templates";
import { MotionToggle } from "../components/MotionSystem";
import { NeighbourDemo, NorthlineDemo } from "./ServiceDemos";
import { LumaDemo } from "./BookingDemo";
import { FieldformDemo, RestaurantDemo } from "./ShowcaseDemos";
import { RetailDemo } from "./RetailDemo";

export default function TemplateDemo({ template }: { template: TemplateDefinition }) {
  const [name, setName] = useState("");
  const [palette, setPalette] = useState("original");
  const brand = name.trim() || template.brand;
  const sample = { ...template, brand };
  return <div className={`demo-site template-tone-${template.id} demo-palette-${palette}`}><a className="demo-skip" href="#sample-content">Skip to sample website</a><div className="demo-notice"><strong>Kubhexa template demo</strong><span>Fictional business · sample forms, bookings and purchases send nothing</span></div><details className="demo-customiser"><summary>Try your brand on this design</summary><div><label>Preview business name<input value={name} maxLength={36} onChange={event => setName(event.target.value)} placeholder={template.brand} autoComplete="off"/></label><fieldset><legend>Preview colour direction</legend>{[["original", "Original"], ["forest", "Forest"], ["cobalt", "Cobalt"]].map(([value, label]) => <button key={value} type="button" aria-pressed={palette === value} onClick={() => setPalette(value)}>{label}</button>)}</fieldset><button type="button" className="demo-plain-button" onClick={() => { setName(""); setPalette("original"); }}>Reset style</button><MotionToggle/></div><p>Style changes stay in this demo. Your final brand details are agreed with Kubhexa.</p></details><div id="sample-content">
    {template.id === "neighbour" && <NeighbourDemo template={sample} brand={brand}/>}
    {template.id === "northline" && <NorthlineDemo template={sample} brand={brand}/>}
    {template.id === "luma" && <LumaDemo template={sample} brand={brand}/>}
    {template.id === "fieldform" && <FieldformDemo template={sample} brand={brand}/>}
    {template.id === "table-thyme" && <RestaurantDemo template={sample} brand={brand}/>}
    {template.id === "morrow" && <RetailDemo template={sample} brand={brand}/>}
  </div></div>;
}
