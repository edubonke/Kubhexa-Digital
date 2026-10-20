"use client";
import { useState } from "react";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { formatRand, supportsCare, templateFamilies, websitePackages, type EstimateOptions, type PackageId } from "../../lib/packages";
import { PackageEstimator } from "./PackageEstimator";
import { PackageDetails } from "./PackageDetails";

export function WebsitePackages() {
  const [options, setOptions] = useState<EstimateOptions>({ packageId: "business", careId: "none" });
  const [recommendation, setRecommendation] = useState("");
  const choose = (packageId: PackageId) => {
    setOptions(previous => ({ ...previous, packageId, productBatches: packageId === "shop" ? previous.productBatches : 0, careId: supportsCare(packageId, previous.careId) ? previous.careId : "none" }));
    requestAnimationFrame(() => { document.getElementById("website-estimate")?.scrollIntoView({ block: "start" }); document.getElementById("estimate-title")?.focus({ preventScroll: true }); });
  };
  return <section id="packages" className="section container website-packages" aria-labelledby="packages-title">
    <div className="package-intro section-intro"><div><span className="package-eyebrow">Small business. Big possibilities.</span><h2 id="packages-title">Your starting point.<br/><span className="text-blue">Your brand.</span></h2></div><div className="package-intro-copy"><p>A website that feels like your business. Choose a template package and we’ll customise it to your brand, content and customers.</p><span className="package-starting-price">Website builds from <strong>R2,990</strong> once-off</span></div></div>
    <nav className="package-jump-links" aria-label="Website package sections"><a href="#website-options">Compare packages</a><a href="#website-estimate">Build your estimate</a><a href="#website-care">Monthly care</a><a href="#website-process">How it works</a></nav>
    <div id="website-options" className="package-grid">{websitePackages.map((plan, index) => <article className={`website-package${plan.recommended ? " package-recommended" : ""}`} key={plan.id} aria-labelledby={`package-${plan.id}`}>
      <div className="package-card-top"><span>0{index + 1}</span>{plan.recommended && <span className="package-recommendation"><Check size={13}/> Recommended for services</span>}</div>
      <h3 id={`package-${plan.id}`}>{plan.name}</h3><p className="package-purpose">{plan.purpose}</p><p className="package-price">{formatRand(plan.price)}<span>once-off</span></p><p className="package-audience">{plan.audience}</p>
      <p className="package-scope">{plan.scope}</p><ul>{plan.features.map(feature => <li key={feature}><Check size={16}/><span>{feature}</span></li>)}</ul><p className="package-delivery"><Clock3 size={14}/>{plan.delivery}</p>
      <button className="button" type="button" onClick={() => choose(plan.id)}>Build my {plan.name} estimate <ArrowRight size={17}/></button>
    </article>)}</div>
    <p className="package-pricing-note">Prices in ZAR for the stated scope. Hosting, domains and external subscriptions are separate unless selected. VAT is added only if applicable. Delivery starts after complete content, access and deposit.</p>
    <div className="package-industries"><div><span className="package-eyebrow">Find your fit</span><h3>Built around your business.</h3><p>Choose a business type for a suggested package. We confirm the template and share a demo with your quote.</p></div><div><div className="package-family-grid">{templateFamilies.map(family => <button key={family.id} type="button" aria-pressed={options.familyId === family.id} onClick={() => {
      const packageId = family.packageId;
      setOptions(previous => ({ ...previous, familyId: family.id, packageId, productBatches: packageId === "shop" ? previous.productBatches : 0, careId: supportsCare(packageId, previous.careId) ? previous.careId : "none" }));
      setRecommendation(`${family.name}: ${websitePackages.find(plan => plan.id === packageId)!.name} selected in your estimate.`);
    }}><strong>{family.name}<ArrowRight size={16}/></strong><span>{family.examples}</span></button>)}</div><p className="package-family-status" role="status">{recommendation || "Each package is tailored to an agreed scope. Specialist systems are quoted separately."}</p></div></div>
    <PackageEstimator options={options} onChange={setOptions}/>
    <PackageDetails/>
  </section>;
}
