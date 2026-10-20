"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Download, RotateCcw } from "lucide-react";
import { z } from "zod";
import { enquirySchema, projectTypes, budgetRanges, timelines } from "../../lib/enquiry-validation";
import { enquiryEndpoint, sitePath } from "../../lib/site-runtime";
import { formatRand, includePackageInBrief, packageEnquiry, type EstimateOptions, type PackageEnquiry } from "../../lib/packages";

type Errors=Record<string,string[]|undefined>;
type Receipt={reference:string;name:string;email:string;company:string;projectType:string;budget:string;timeline:string;brief:string};
const responseSchema=z.object({received:z.boolean().optional(),reference:z.string().uuid().optional(),error:z.string().optional(),fields:z.record(z.array(z.string()).optional()).optional()});

export function EnquiryForm(){
 const [errors,setErrors]=useState<Errors>({});const [message,setMessage]=useState("");const [sending,setSending]=useState(false);const [receipt,setReceipt]=useState<Receipt|null>(null);
 const [selection,setSelection]=useState<PackageEnquiry|null>(null);
 const formRef=useRef<HTMLFormElement>(null);const statusRef=useRef<HTMLDivElement>(null);const requestId=useRef("");
 useEffect(()=>{const choose=(event:Event)=>{const type=(event as CustomEvent).detail;const select=formRef.current?.elements.namedItem("projectType") as HTMLSelectElement|null;if(select&&projectTypes.includes(type))select.value=type;};window.addEventListener("kubhexa:service",choose);return()=>window.removeEventListener("kubhexa:service",choose);},[]);
 useEffect(()=>{const choose=(event:Event)=>{try{const next=packageEnquiry((event as CustomEvent<EstimateOptions>).detail);setSelection(next);setReceipt(null);setErrors({});setMessage("");requestId.current="";}catch{}};window.addEventListener("kubhexa:package",choose);return()=>window.removeEventListener("kubhexa:package",choose);},[]);
 useEffect(()=>{if(!selection)return;const type=formRef.current?.elements.namedItem("projectType") as HTMLSelectElement|null;const budget=formRef.current?.elements.namedItem("budget") as HTMLSelectElement|null;if(type)type.value="Website";if(budget)budget.value=selection.budget;},[selection]);
 useEffect(()=>{if(receipt)statusRef.current?.focus();},[receipt]);
 const showErrors=(fields:Errors)=>{setErrors(fields);const key=Object.keys(fields).find(k=>fields[k]?.length);if(key)(formRef.current?.elements.namedItem(key) as HTMLElement|null)?.focus();};
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(sending)return;
  setMessage("");setErrors({});
  const fd=new FormData(event.currentTarget);if(!requestId.current)requestId.current=crypto.randomUUID();
  const values={id:requestId.current,name:String(fd.get("name")||""),email:String(fd.get("email")||""),company:String(fd.get("company")||""),projectType:fd.get("projectType"),budget:fd.get("budget"),timeline:fd.get("timeline"),brief:String(fd.get("brief")||""),consent:fd.get("consent")==="on",website:String(fd.get("website")||"")};
  const parsed=enquirySchema.safeParse(values);
  if(!parsed.success){showErrors(parsed.error.flatten().fieldErrors);setMessage("Please check the fields below.");return;}
  let brief:string;try{brief=includePackageInBrief(parsed.data.brief,selection);}catch(error){showErrors({brief:[error instanceof Error?error.message:"Please check your brief."]});setMessage("Please check your brief below.");return;}
  const submission={...parsed.data,brief};
  setSending(true);
  try{
   const response=await fetch(enquiryEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(submission),signal:AbortSignal.timeout(15000)});
   const result=responseSchema.parse(await response.json());
   if(!response.ok){if(response.status===409)requestId.current="";if(result.fields)showErrors(result.fields);setMessage(result.error||"We could not confirm your enquiry. Please try again.");return;}
   if(!result.received||result.reference!==submission.id)throw new Error("No matching receipt");
   setReceipt({...submission,reference:result.reference});requestId.current="";
  }catch{setMessage("We could not confirm that your enquiry was saved. Please check your connection and try again. Your details are still here.");}
  finally{setSending(false);}
 }
 function saveReceipt(){if(!receipt)return;const text=`KUBHEXA DIGITAL\nProject enquiry\nReference: ${receipt.reference}\n\nName: ${receipt.name}\nEmail: ${receipt.email}\nCompany: ${receipt.company}\nProject: ${receipt.projectType}\nBudget: ${receipt.budget}\nTimeline: ${receipt.timeline}\n\n${receipt.brief}\n\nYour enquiry has been saved for review.`;const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="kubhexa-project-enquiry.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const err=(key:string)=>errors[key]?.length?<span className="field-error" id={`${key}-error`}>{errors[key]![0]}</span>:null;
 const attrs=(key:string)=>({"aria-invalid":errors[key]?.length?true:undefined,"aria-describedby":errors[key]?.length?`${key}-error`:undefined});
 if(receipt)return <div className="enquiry-success" role="status" tabIndex={-1} ref={statusRef}><span className="success-icon"><Check size={34}/></span><h3>Your next move<br/>starts here.</h3><p>Your project enquiry has been saved, {receipt.name.split(" ")[0]}. We will use the details you provided to discuss a practical next step.</p><div className="receipt-reference"><span>Enquiry reference</span><code>KX-{receipt.reference.slice(0,8).toUpperCase()}</code></div><p className="small-text">Keep a copy of your enquiry for your records.</p><div className="success-actions"><button className="button" type="button" onClick={saveReceipt}>Download enquiry <Download size={18}/></button><button className="text-link" type="button" onClick={()=>{setReceipt(null);setErrors({});setMessage("");setSelection(null);}}><RotateCcw size={16}/> Send another enquiry</button></div></div>;
 return <form className="enquiry-form" ref={formRef} method="post" action={enquiryEndpoint} onSubmit={submit} noValidate aria-label="Project enquiry" aria-busy={sending}>
  {selection&&<div className="enquiry-package-selection"><div><span>Your selected website estimate</span><strong>{selection.title}</strong><p>{formatRand(selection.onceOff)} once-off{selection.monthly?` + ${formatRand(selection.monthly)}/month care`:" · no care plan selected"}</p></div><button className="text-link" type="button" onClick={()=>setSelection(null)}>Remove selection</button><details><summary>View selected scope and costs</summary><pre>{selection.summary}</pre></details><p>Your selection will be included with your brief. We confirm the final quote before a deposit.</p></div>}
  <div className="form-grid">
   <div className="field"><label htmlFor="name">Your name <span aria-hidden="true">*</span></label><input id="name" name="name" autoComplete="name" placeholder="Your full name" maxLength={100} required {...attrs("name")}/>{err("name")}</div>
   <div className="field"><label htmlFor="email">Work email <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.co.za" maxLength={254} required {...attrs("email")}/>{err("email")}</div>
   <div className="field"><label htmlFor="company">Company <span className="optional">optional</span></label><input id="company" name="company" autoComplete="organization" placeholder="Your business name" maxLength={160} {...attrs("company")}/>{err("company")}</div>
   <div className="field"><label htmlFor="projectType">Project type <span aria-hidden="true">*</span></label><select id="projectType" name="projectType" defaultValue="" required {...attrs("projectType")}><option value="" disabled>Select a project type</option>{projectTypes.map(v=><option key={v}>{v}</option>)}</select>{err("projectType")}</div>
   <div className="field full-width"><label htmlFor="brief">What would you like to build or improve? <span aria-hidden="true">*</span></label><textarea id="brief" name="brief" rows={4} minLength={20} maxLength={selection?4000-selection.summary.length-2:4000} required placeholder="Tell us about your idea, who it is for, and what you want it to do." {...attrs("brief")}/>{err("brief")}</div>
   <div className="field"><label htmlFor="budget">Budget range <span aria-hidden="true">*</span></label><select id="budget" name="budget" defaultValue="" required {...attrs("budget")}><option value="" disabled>Select a range</option>{budgetRanges.map(v=><option key={v}>{v}</option>)}</select>{err("budget")}</div>
   <div className="field"><label htmlFor="timeline">Ideal timing <span aria-hidden="true">*</span></label><select id="timeline" name="timeline" defaultValue="" required {...attrs("timeline")}><option value="" disabled>Select timing</option>{timelines.map(v=><option key={v}>{v}</option>)}</select>{err("timeline")}</div>
  </div>
  <p className="form-hint">Budget ranges help us explore the right scope. They are not quotations.</p>
  <div className="form-honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
  <label className="consent-label" htmlFor="consent"><input id="consent" name="consent" type="checkbox" required {...attrs("consent")}/><span>I agree that Kubhexa Digital may use my details to respond to this project enquiry.</span></label>{err("consent")}
  <p className="form-privacy">Your details are used to discuss your project. <a href={sitePath("/privacy/")} target="_blank" rel="noopener noreferrer">Read the privacy notice<span className="sr-only"> (opens in a new tab)</span></a>.</p>
  {message&&<p className="form-message" role="alert">{message}</p>}
  <button className="button submit-button" type="submit" disabled={sending}>{sending?"Saving your enquiry...":"Send project enquiry"}{!sending&&<ArrowRight size={20}/>}</button>
  <p className="required-note">* Required fields</p>
 </form>;
}
