import content from "./seo-content.json";
import { siteUrl } from "./site-runtime";
import { websitePackages } from "./packages";

export const seoPages = content.pages;
export const seoArticles = content.articles as Record<string, {answer:string; faqs:string[][]}>;
export function seoPage(path: string) {
  const page = seoPages.find(p => p.path === path);
  if (!page) throw new Error(`Unknown marketing page: ${path}`);
  return page;
}
export const packageFaqs = [
  ["How much does a small-business website cost?", "Kubhexa Digital's five packages start at R2,990, R5,990, R8,990, R11,990 and R17,990. Hosting, domain registration, external subscriptions and VAT if applicable are additional unless specified."],
  ["How long does a website take?", "Start takes 3–5 working days, Business 7–10, Showcase and Bookings 10–15, and Shop 15–20, after complete content, access and deposit."],
  ["Can I preview a website before buying?", "Yes. Six fictional-business templates demonstrate representative experiences, with simulated transactions."],
  ["What happens after launch?", "Packages include 30 days of fixes for delivered-work defects. Optional care starts at R349 per month; ownership, access, scope and ongoing costs are confirmed in your quotation."]
];
const orgId = `${siteUrl}#organization`;
export function schemasFor(path:string) {
  const page=seoPage(path), url=siteUrl+path.slice(1);
  const graph: object[]=[];
  if(path==="/") graph.push({"@type":"Organization","@id":orgId,name:"Kubhexa Digital",url:siteUrl,logo:siteUrl+"favicon.svg",founder:{"@type":"Person",name:"Phumlane Kubheka"},areaServed:{"@type":"Country",name:"South Africa"}},{"@type":"WebSite","@id":siteUrl+"#website",name:"Kubhexa Digital",url:siteUrl,publisher:{"@id":orgId},inLanguage:"en-ZA"});
  else {
    const parts=path.split("/").filter(Boolean);
    const crumbs=[{name:"Home",url:siteUrl}];
    if(parts.length>1){const parent=seoPages.find(p=>p.path===`/${parts[0]}/`);if(parent)crumbs.push({name:parent.h1,url:siteUrl+parts[0]+"/"});}
    crumbs.push({name:page.h1,url});
    graph.push({"@type":"BreadcrumbList",itemListElement:crumbs.map((item,i)=>({"@type":"ListItem",position:i+1,name:item.name,item:item.url}))});
  }
  if(page.kind==="Service") graph.push({"@type":"Service",name:page.h1,description:page.desc,url,provider:{"@type":"Organization","@id":orgId,name:"Kubhexa Digital",url:siteUrl},areaServed:{"@type":"Country",name:"South Africa"}});
  if(page.kind==="Pricing") graph.push({"@type":"ItemList",itemListElement:websitePackages.map((p,i)=>({"@type":"ListItem",position:i+1,item:{"@type":"Service",name:`${p.name} website package`,url:url+"#"+p.id,offers:{"@type":"Offer",price:p.price,priceCurrency:"ZAR",description:"Starting price for stated scope"}}}))});
  let faqs:string[][]|undefined;
  if(page.kind==="Pricing") faqs=packageFaqs;
  if(page.kind==="Article") {faqs=seoArticles[path.split("/")[2]].faqs;graph.push({"@type":"Article",headline:page.h1,description:page.desc,inLanguage:"en-ZA",mainEntityOfPage:url,author:{"@type":"Organization",name:"Kubhexa Digital",url:siteUrl},publisher:{"@id":orgId}});}
  if(faqs) graph.push({"@type":"FAQPage",mainEntity:faqs.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))});
  return {"@context":"https://schema.org","@graph":graph};
}
