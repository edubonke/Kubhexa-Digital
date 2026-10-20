"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

const MotionContext=createContext({enabled:true,systemReduced:false,toggle:()=>{}});
const preferenceKey="kubhexa-motion";

export function MotionProvider({children}:{children:React.ReactNode}){
 const [paused,setPaused]=useState(false);
 const [systemReduced,setSystemReduced]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const sync=()=>setSystemReduced(media.matches);sync();media.addEventListener("change",sync);
  try{setPaused(sessionStorage.getItem(preferenceKey)==="off");}catch{}
  setReady(true);
  return()=>media.removeEventListener("change",sync);
 },[]);
 const enabled=!paused&&!systemReduced;
 useEffect(()=>{if(ready)document.documentElement.dataset.motion=enabled?"on":"off";},[enabled,ready]);
 const toggle=()=>setPaused(previous=>{const next=!previous;try{sessionStorage.setItem(preferenceKey,next?"off":"on");}catch{}return next;});
 return <MotionContext.Provider value={{enabled,systemReduced,toggle}}><MotionEngine enabled={ready&&enabled}/>{children}</MotionContext.Provider>;
}

export function MotionToggle(){
 const {enabled,systemReduced,toggle}=useContext(MotionContext);
 return <button className="motion-toggle" type="button" aria-pressed={enabled} disabled={systemReduced} onClick={toggle} title={systemReduced?"Your device's reduced-motion setting is respected":"Turn optional site animations on or off"}>{enabled?<Pause size={13}/>:<Play size={13}/>}<span>{systemReduced?"Reduced motion":`Motion: ${enabled?"On":"Off"}`}</span></button>;
}

export function useSiteMotion(){return useContext(MotionContext).enabled;}

function MotionEngine({enabled}:{enabled:boolean}){
 useEffect(()=>{
  if(!enabled||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const animations=new Set<Animation>();
  const cleanups:Array<()=>void>=[];
  let observer:IntersectionObserver|undefined;
  const targets=document.querySelectorAll<HTMLElement>(".section-intro,.project-card,.process-grid>li,.studio-symbol,.studio-copy,.contact-copy,.enquiry-form,.faq-section>h2,.lab-heading,.lab-stage,.website-package,.package-industries,.package-estimator");
  if("IntersectionObserver" in window&&typeof Element.prototype.animate==="function"){
   observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
     if(!entry.isIntersecting)continue;
     const element=entry.target as HTMLElement;observer?.unobserve(element);
     if(element.dataset.motionSeen)continue;element.dataset.motionSeen="true";
     if(element.contains(document.activeElement))continue;
     const siblings=element.parentElement?.classList.contains("process-grid")?Array.from(element.parentElement.children):[];
     const delay=siblings.length?siblings.indexOf(element)*65:element.classList.contains("project-1")?90:0;
     const animation=element.animate([{opacity:0,transform:"translateY(24px)"},{opacity:1,transform:"translateY(0)"}],{id:"kubhexa-reveal",duration:650,delay,easing:"cubic-bezier(.2,.7,.2,1)",fill:"backwards"});
     animations.add(animation);animation.onfinish=()=>animations.delete(animation);
    }
   },{threshold:.08,rootMargin:"0px 0px -36px 0px"});
   targets.forEach(el=>{if(!el.dataset.motionSeen)observer?.observe(el);});
   const showFocused=(event:FocusEvent)=>{if(!(event.target instanceof Element))return;for(const a of animations){const effect=a.effect as KeyframeEffect|null;const el=effect?.target;if(el instanceof Element&&el.contains(event.target)){a.cancel();animations.delete(a);}}};
   document.addEventListener("focusin",showFocused);cleanups.push(()=>document.removeEventListener("focusin",showFocused));
  }
  const pointer=window.matchMedia("(hover: hover) and (pointer: fine)");
  if(pointer.matches){
   const elements=document.querySelectorAll<HTMLElement>(".hero-art,.project-media,.hero-actions .button,.nav-contact");
   for(const element of elements){
    const magnetic=element.matches(".button");let rect:DOMRect|undefined;let frame=0;
    const reset=()=>{cancelAnimationFrame(frame);frame=0;for(const key of ["--tilt-x","--tilt-y","--magnet-x","--magnet-y","--cursor-x","--cursor-y"])element.style.removeProperty(key);element.removeAttribute("data-pointer-active");rect=undefined;};
    const enter=()=>{rect=element.getBoundingClientRect();element.dataset.pointerActive="true";};
    const move=(event:PointerEvent)=>{if(event.pointerType!=="mouse")return;const x=event.clientX,y=event.clientY;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const box=rect??element.getBoundingClientRect();const px=Math.max(-.5,Math.min(.5,(x-box.left)/box.width-.5));const py=Math.max(-.5,Math.min(.5,(y-box.top)/box.height-.5));if(magnetic){element.style.setProperty("--magnet-x",`${px*10}px`);element.style.setProperty("--magnet-y",`${py*8}px`);}else{element.style.setProperty("--tilt-x",`${-py*7}deg`);element.style.setProperty("--tilt-y",`${px*9}deg`);element.style.setProperty("--cursor-x",`${Math.max(60,Math.min(box.width-60,x-box.left))}px`);element.style.setProperty("--cursor-y",`${Math.max(28,Math.min(box.height-28,y-box.top))}px`);}});};
    element.addEventListener("pointerenter",enter);element.addEventListener("pointermove",move);element.addEventListener("pointerleave",reset);element.addEventListener("pointercancel",reset);
    window.addEventListener("resize",reset);
    cleanups.push(()=>{reset();element.removeEventListener("pointerenter",enter);element.removeEventListener("pointermove",move);element.removeEventListener("pointerleave",reset);element.removeEventListener("pointercancel",reset);window.removeEventListener("resize",reset);});
   }
  }
  return()=>{observer?.disconnect();animations.forEach(a=>a.cancel());cleanups.forEach(cleanup=>cleanup());};
 },[enabled]);
 return <div className="reading-progress" aria-hidden="true"/>;
}
