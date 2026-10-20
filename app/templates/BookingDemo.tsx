"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3 } from "lucide-react";
import { bookingServices, demoDays, demoTimes } from "../../lib/template-demo-data";
import { formatRand } from "../../lib/packages";
import type { TemplateDefinition } from "../../lib/templates";
import { DemoFooter, DemoHeader } from "./DemoShared";
import { TemplateArt } from "./TemplateArt";

function BookingWidget({ serviceId, setServiceId }: { serviceId: string; setServiceId: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [stylist, setStylist] = useState("Any sample stylist");
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => { setStep(0); setConfirmed(false); setDay(""); setTime(""); }, [serviceId]);
  const service = bookingServices.find(item => item.id === serviceId);
  const summary = <dl className="demo-booking-summary"><div><dt>Service</dt><dd>{service?.name}</dd></div><div><dt>Sample slot</dt><dd>{day} · {time}</dd></div><div><dt>Stylist</dt><dd>{stylist}</dd></div><div><dt>Duration</dt><dd>{service?.duration} minutes</dd></div><div><dt>Illustrative price</dt><dd>{formatRand(service?.price ?? 0)}</dd></div></dl>;
  return <div className="demo-booking-widget"><span className="demo-kicker">Try the experience</span><h3>{confirmed ? "A moment, imagined." : "Find a little time for you."}</h3><p>Sample availability and prices. No real booking is made.</p>
    {!confirmed && <ol className="demo-booking-steps" aria-label="Booking progress">{["Service", "Time", "Review"].map((label, i) => <li key={label} aria-current={step === i ? "step" : undefined}><span>{i + 1}</span>{label}</li>)}</ol>}
    {confirmed ? <div className="demo-booking-confirmation" role="status"><Check size={36}/><h4>That’s the booking journey.</h4>{summary}<p>This confirmation is simulated. No appointment was reserved, no payment was taken and no details were sent.</p><button className="demo-button" type="button" onClick={() => { setConfirmed(false); setStep(0); setDay(""); setTime(""); }}>Try another booking <ArrowRight size={16}/></button></div> : <>
      {step === 0 && <fieldset className="demo-booking-services"><legend>Choose a sample service</legend>{bookingServices.map(item => <label key={item.id}><input type="radio" name="sample-service" value={item.id} checked={serviceId === item.id} onChange={() => setServiceId(item.id)}/><span><strong>{item.name}</strong><small>{item.duration} minutes</small></span><span>{formatRand(item.price)}</span></label>)}</fieldset>}
      {step === 1 && <div className="demo-booking-times"><label>Sample stylist<select value={stylist} onChange={event => setStylist(event.target.value)}><option>Any sample stylist</option><option>Sample stylist A</option><option>Sample stylist B</option></select></label><label>Sample day<select value={day} onChange={event => { setDay(event.target.value); setTime(""); }}><option value="">Choose a day</option>{demoDays.map(value => <option key={value}>{value}</option>)}</select></label><fieldset><legend>Choose a sample time</legend><div className="demo-time-options">{demoTimes.map(value => <button key={value} type="button" disabled={!day} aria-pressed={time === value} onClick={() => setTime(value)}>{value}</button>)}</div></fieldset><p>These are illustrative weekly slots, not a live calendar.</p></div>}
      {step === 2 && summary}
      <div className="demo-booking-actions">{step > 0 && <button className="demo-plain-button" type="button" onClick={() => setStep(step - 1)}><ArrowLeft size={16}/> Back</button>}<button className="demo-button" type="button" disabled={step === 0 ? !service : !day || !time} onClick={() => step === 2 ? setConfirmed(true) : setStep(step + 1)}>{step === 0 ? "Choose a time" : step === 1 ? "Review sample booking" : "Simulate booking"}<ArrowRight size={16}/></button></div>
    </>}
  </div>;
}

export function LumaDemo({ template, brand }: { template: TemplateDefinition; brand: string }) {
  const [serviceId, setServiceId] = useState("");
  return <><DemoHeader brand={brand} links={[["services", "The services"], ["studio", "The studio"]]} action={["booking", "Find your moment"]}/><main>
    <section className="demo-hero" id="demo-home"><div><span className="demo-kicker">An unhurried kind of care</span><h1>A little time.<br/><em>Just for you.</em></h1><p>A quiet pause, a thoughtful consultation and a finish that feels entirely your own.</p><a className="demo-button" href="#booking">Explore the booking experience <ArrowRight size={16}/></a></div><div className="demo-hero-art"><TemplateArt kind="luma"/><span className="demo-art-caption">Space to settle. Time to feel like you.</span></div></section>
    <section className="demo-section" id="services"><div className="demo-section-heading"><div><span className="demo-kicker">The sample service menu</span><h2>A considered touch.</h2></div><p>Explore three illustrative services, then try the booking journey.</p></div><div className="demo-luma-services">{bookingServices.map((item, i) => <article key={item.id}><span>0{i + 1}</span><h3>{item.name}</h3><p>{item.copy}</p><div><span><Clock3 size={14}/> {item.duration} min · {formatRand(item.price)}</span><a href="#booking" onClick={() => setServiceId(item.id)}>Try this service <ArrowRight size={15}/></a></div></article>)}</div></section>
    <section className="demo-section demo-studio-story" id="studio"><span className="demo-kicker">An approach with a little more space</span><h2>Carefully considered.<br/><em>Comfortably you.</em></h2><p>This is where your studio’s story, approach and real team would come to life. Luma is a fictional brand created to demonstrate a welcoming, contemporary booking website.</p></section>
    <section className="demo-section demo-booking-section" id="booking"><div><span className="demo-kicker">Make a little room</span><h2>Your next<br/><em>quiet moment.</em></h2><p>Choose a service, explore the sample availability and see a booking confirmation. Everything in this preview stays in your browser page.</p></div><BookingWidget serviceId={serviceId} setServiceId={setServiceId}/></section>
  </main><DemoFooter template={template}/></>;
}
