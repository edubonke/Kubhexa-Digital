"use client";
import { useState } from "react";
import { ArrowRight, Check, Plus, RotateCcw } from "lucide-react";
import { addOns, carePlans, estimateWebsite, formatRand, packageEnquiry, supportsCare, templateFamilies, websitePackages, type CareId, type EstimateOptions, type PackageId } from "../../lib/packages";
import { findTemplate, templateCatalog, type TemplateId } from "../../lib/templates";

export function PackageEstimator({ options, onChange }: { options: EstimateOptions; onChange: (value: EstimateOptions) => void }) {
  const [notice, setNotice] = useState("");
  const estimate = estimateWebsite(options);
  const update = (value: Partial<EstimateOptions>) => { setNotice(""); onChange({ ...options, ...value }); };
  const changePackage = (packageId: PackageId) => update({ packageId, templateId: undefined, productBatches: packageId === "shop" ? options.productBatches : 0, careId: supportsCare(packageId, options.careId) ? options.careId : "none" });
  const selection = packageEnquiry(options);
  return <div id="website-estimate" className="package-estimator" aria-labelledby="estimate-title">
    <div className="estimate-controls">
      <span className="package-eyebrow">Make it yours</span>
      <h3 id="estimate-title" tabIndex={-1}>Build your estimate.</h3>
      <p>Choose your starting point and the extras you need. Review the scope with us before paying a deposit.</p>
      <div className="estimate-field"><label htmlFor="estimate-package">Website package</label><select id="estimate-package" value={options.packageId} onChange={event => changePackage(event.target.value as PackageId)}>{websitePackages.map(plan => <option key={plan.id} value={plan.id}>{plan.name} — {formatRand(plan.price)} once-off</option>)}</select></div>
      <div className="estimate-field"><label htmlFor="estimate-family">Business type <span>optional</span></label><select id="estimate-family" value={options.familyId ?? ""} onChange={event => update({ familyId: event.target.value as EstimateOptions["familyId"], templateId: undefined })}><option value="">Choose a business type</option>{templateFamilies.map(family => <option key={family.id} value={family.id}>{family.name}</option>)}</select></div>
      <div className="estimate-field"><label htmlFor="estimate-template">Template <span>optional</span></label><select id="estimate-template" value={options.templateId ?? ""} onChange={event => { const template = findTemplate(event.target.value); update({ templateId: template?.id as TemplateId | undefined, ...(template ? { familyId: template.familyId } : {}) }); }}><option value="">Choose later</option>{templateCatalog.filter(template => template.packageId === options.packageId).map(template => <option key={template.id} value={template.id}>{template.name} · {template.category}</option>)}</select></div>
      <div className="estimate-field"><label htmlFor="estimate-care">Monthly care <span>optional</span></label><select id="estimate-care" value={options.careId} onChange={event => update({ careId: event.target.value as CareId })}><option value="none">No care plan — arrange hosting separately</option>{carePlans.filter(plan => supportsCare(options.packageId, plan.id)).map(plan => <option key={plan.id} value={plan.id}>{plan.name} — {formatRand(plan.price)}/month</option>)}</select><p className="estimate-help">Care is separate from the build. Changing packages removes any incompatible care or product-upload extras.</p></div>
      <fieldset className="estimate-addons"><legend>Optional extras</legend>
        <div className="estimate-quantity"><label htmlFor="estimate-pages">Additional pages <small>{formatRand(750)} each · existing layout</small></label><select id="estimate-pages" value={options.extraPages ?? 0} onChange={event => update({ extraPages: Number(event.target.value) })}>{Array.from({ length: 11 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></div>
        {options.packageId === "shop" && <div className="estimate-quantity"><label htmlFor="estimate-products">Extra product batches <small>10 simple products · {formatRand(750)} per batch</small></label><select id="estimate-products" value={options.productBatches ?? 0} onChange={event => update({ productBatches: Number(event.target.value) })}>{Array.from({ length: 11 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></div>}
        {addOns.filter(item => item.id === "copywriting" || item.id === "brandKit" || item.id === "blog").map(item => {
          const key = item.id as "copywriting" | "brandKit" | "blog";
          return <label className="estimate-check" key={item.id}><input type="checkbox" checked={Boolean(options[key])} onChange={event => update({ [key]: event.target.checked })}/><span><strong>{item.name}</strong><small>{item.description}</small></span><span className="estimate-addon-price">+{formatRand(item.price)}</span></label>;
        })}
      </fieldset>
      <button className="text-link estimate-reset" type="button" onClick={() => { onChange({ packageId: "business", careId: "none" }); setNotice("Estimate reset to Business, with no care plan or extras."); }}><RotateCcw size={15}/> Reset estimate</button>
      <p className="sr-only" role="status">{notice}</p>
    </div>
    <aside className="estimate-summary" aria-labelledby="estimate-summary-title">
      <div className="estimate-summary-heading"><span className="estimate-summary-icon" aria-hidden="true"><Plus size={22}/></span><span>Your next move</span></div>
      <h4 id="estimate-summary-title">Kubhexa {estimate.plan.name}</h4>
      {estimate.template && <p className="estimate-preview-template">Template: {estimate.template.name}</p>}
      <div className="estimate-live" aria-live="polite" aria-atomic="true">
        <dl className="estimate-breakdown"><div><dt>Website build</dt><dd>{formatRand(estimate.plan.price)}</dd></div><div><dt>Selected extras</dt><dd>{formatRand(estimate.addOnTotal)}</dd></div><div className="estimate-total"><dt>Once-off estimate</dt><dd>{formatRand(estimate.onceOff)}</dd></div><div className="estimate-monthly"><dt>Optional monthly care</dt><dd>{formatRand(estimate.monthly)}<small>/month</small></dd></div><div className="estimate-year"><dt>First-year Kubhexa fees</dt><dd>{formatRand(estimate.firstYearFees)}</dd></div></dl>
        <p className="estimate-basis">Build + extras + 12 months of selected care. Domains, external subscriptions and VAT if applicable are additional.</p>
      </div>
      {estimate.extras.length > 0 && <ul className="estimate-selected-extras" aria-label="Selected extras">{estimate.extras.map(item => <li key={item.name}><Check size={14}/><span>{item.quantity > 1 ? `${item.quantity} × ` : ""}{item.name}</span><span>{formatRand(item.price)}</span></li>)}</ul>}
      <div className="estimate-scope"><p>{estimate.plan.scope}</p><p>Estimated delivery: {estimate.plan.delivery}, after complete content and access.</p></div>
      <a className="button" href="#contact" onClick={() => {
        window.dispatchEvent(new CustomEvent("kubhexa:package", { detail: options }));
        requestAnimationFrame(() => document.getElementById("name")?.focus({ preventScroll: true }));
      }}>Request this estimate <ArrowRight size={18}/></a>
      <p className="estimate-no-payment">Your selection goes with your enquiry. No payment is taken here.</p>
      <span className="sr-only">{selection.title}: {formatRand(selection.onceOff)} once-off and {formatRand(selection.monthly)} per month.</span>
    </aside>
  </div>;
}
