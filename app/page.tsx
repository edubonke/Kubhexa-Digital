import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Navigation, Logo } from "./components/Navigation";
import { WorkGallery } from "./components/WorkGallery";
import { ProjectPortfolio } from "./components/ProjectPortfolio";
import { Services } from "./components/Services";
import { EnquiryForm } from "./components/EnquiryForm";
import { ExperienceLab } from "./components/ExperienceLab";
import { WebsitePackages } from "./components/WebsitePackages";
import { MotionToggle } from "./components/MotionSystem";
import { sitePath } from "../lib/site-runtime";
const steps = [
 { title: "Understand", copy: "Your goals, your customers, and where the current experience gets in the way." },
 { title: "Shape", copy: "A clear first release and a prototype you can explore before we start building." },
 { title: "Build", copy: "Thoughtful development, with agreed milestones and regular demonstrations." },
 { title: "Launch & improve", copy: "Release checks, a considered handover, and a plan for what comes next." },
];
export default function Home() {
 return <>
  <a className="skip-link" href="#main">Skip to content</a><Navigation />
  <main id="main">
   <section className="hero container" aria-labelledby="hero-title">
    <div className="hero-copy"><h1 id="hero-title"><span>Websites and apps.</span><span>Built for your</span><span className="text-blue">next move.</span></h1><p className="hero-description">We turn business challenges into digital experiences that work.</p><div className="hero-actions"><a className="button" href="#contact">Start a project <ArrowRight size={19}/></a><a className="text-link" href="#work">Explore our work <ArrowUpRight size={17}/></a></div><a className="hero-package-link" href="#packages">Small-business websites from R2,990 <ArrowRight size={16}/></a></div>
    <div className="hero-art"><img src={sitePath("/assets/kubhexa-kinetic-k.webp")} alt="A sculptural cobalt blue K with a lime inset, the Kubhexa signature" width="1100" height="1100" fetchPriority="high"/></div>
   </section>
   <section id="work" className="section container work-section" aria-labelledby="work-title"><div className="section-intro"><h2 id="work-title">Real projects.<br/><span className="text-blue">Ready to explore.</span></h2><p>Go beyond the screenshot. Open a project, scroll through the website, and try the experience.</p></div><ProjectPortfolio/><details className="concept-studies"><summary>Explore our interface concepts</summary><p>Two focused design studies, with working booking and customer workspace demonstrations.</p><WorkGallery/></details><ExperienceLab/></section>
   <section id="services" className="section container" aria-labelledby="services-title"><div className="section-intro"><h2 id="services-title">Digital that does<br/>more for your <span className="text-blue">business.</span></h2><p>From your first website to the system your team uses every day. We help you find the right place to start.</p></div><Services/></section>
   <WebsitePackages/>
   <section id="approach" className="section container approach-section" aria-labelledby="approach-title"><div className="section-intro"><h2 id="approach-title">Clarity first.<br/><span className="text-blue">Then we build.</span></h2><p>A practical process, with you involved at every step.</p></div><ol className="process-grid">{steps.map((step,i)=><li key={step.title}><span className="step-number">0{i+1}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol><div className="clarity-note"><Check size={20}/><p><strong>Know what you are investing in.</strong> We agree the scope, milestones, and handover before development begins.</p></div>
    <div id="studio" className="studio-block"><div className="studio-symbol" aria-hidden="true"><Logo symbolOnly/></div><div className="studio-copy"><h2>A personal standard<br/>for every project.</h2><p>Kubhexa takes its name from our founder, Kubheka. That personal connection shapes how we work: understand the business, communicate clearly, and take care with the details.</p><p className="founder-name">Phumlane Kubheka <span>Founder</span></p></div></div>
   </section>
   <section id="contact" className="section container contact-section" aria-labelledby="contact-title"><div className="contact-copy"><h2 id="contact-title">What is your<br/><span className="text-blue">next move?</span></h2><p className="contact-lead">Tell us what you want to build or make better.</p><p>Have a clear brief or just a business problem? Both are good places to start.</p><div className="contact-expectation"><h3>What happens next?</h3><p>We review your enquiry and use your details to discuss the scope and a practical next step.</p></div></div><EnquiryForm/></section>
   <section className="container faq-section" aria-labelledby="faq-title"><h2 id="faq-title">A few things you might be wondering.</h2><div className="faq-grid"><details><summary>Can we start small?</summary><p>Yes. Our template-based small-business websites start at R2,990. Choose a package and we customise it to your brand. A focused workflow or discovery sprint can also be a practical first step for a custom system. <a href="#packages">Explore website packages.</a></p></details><details><summary>What does a project cost?</summary><p>Website packages range from R2,990 to R17,990 for the stated scope, with optional extras and care. Domains, external subscriptions and VAT if applicable are additional. Custom apps and integrations are scoped separately. You receive a final quote before paying a deposit.</p></details><details><summary>What happens after launch?</summary><p>Website packages include 30 days of fixes for defects in the delivered work. Optional care starts at R349/month, with the scope and hosting agreed in writing. Handover, access and any included training are part of your package.</p></details><details><summary>Are the work examples client projects?</summary><p>The portfolio includes business websites and independent products built by our founder. Each project is labelled, including EduBonke's synthetic-data prototype. The separate interface concepts demonstrate design ideas. We do not claim measured client results for these examples.</p></details></div></section>
  </main>
  <footer className="container footer"><a className="footer-brand" href="#main" aria-label="Kubhexa Digital home"><Logo/></a><nav aria-label="Footer navigation"><a href="#work">Work</a><a href="#services">Services</a><a href="#packages">Packages</a><a href="#approach">Approach</a><a href="#studio">Studio</a></nav><div className="footer-meta"><span>© 2026 Kubhexa Digital</span><MotionToggle/><a href={sitePath("/privacy/")}>Privacy</a></div></footer>
 </>;
}
