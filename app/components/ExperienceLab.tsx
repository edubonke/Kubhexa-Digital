"use client";
import { useRef, useState } from "react";
import { Monitor, Smartphone, Moon, RotateCcw, Check, ArrowUpRight, Layers, LayoutDashboard, MessageSquare, CircleCheck, ArrowRight } from "lucide-react";
import { useSiteMotion } from "./MotionSystem";

const initialTasks=[{title:"Clarify the goal",description:"Agree what success looks like.",done:true},{title:"Explore the prototype",description:"Review the important screens.",done:true},{title:"Test the journey",description:"Try the experience with your team.",done:false},{title:"Prepare for launch",description:"Check the details and hand over.",done:false}];

export function ExperienceLab(){
 const motion=useSiteMotion();
 const [mobile,setMobile]=useState(false);const [dark,setDark]=useState(false);const [replay,setReplay]=useState(0);
 const [tab,setTab]=useState("Tasks");const [tasks,setTasks]=useState(initialTasks);const [activity,setActivity]=useState<Array<{id:number;text:string}>>([]);
 const activitySequence=useRef(0);
 const completed=tasks.filter(t=>t.done).length;
 function toggleTask(index:number){const done=!tasks[index].done;const id=++activitySequence.current;setTasks(previous=>previous.map((task,i)=>i===index?{...task,done}:task));setActivity(previous=>[{id,text:`${tasks[index].title}: ${done?"completed":"reopened"}`},...previous].slice(0,5));}
 return <section className="experience-lab" aria-labelledby="lab-title">
  <div className="lab-heading"><h3 id="lab-title">See the details in action.</h3><p>Switch the layout, change the theme, and try the interface. A working concept you can explore.</p></div>
  <div className="lab-toolbar"><div className="lab-device-controls" role="group" aria-label="Preview layout"><button type="button" aria-pressed={!mobile} onClick={()=>setMobile(false)}><Monitor size={17}/><span>Desktop</span></button><button type="button" aria-pressed={mobile} onClick={()=>setMobile(true)}><Smartphone size={17}/><span>Mobile</span></button></div><div className="lab-extra-controls"><button type="button" aria-pressed={dark} onClick={()=>setDark(!dark)}><Moon size={16}/><span>Dark preview</span></button><button type="button" disabled={!motion} onClick={()=>setReplay(replay+1)} title={motion?"Replay the interface entrance":"Enable site motion to replay the introduction"}><RotateCcw size={16}/><span>Replay intro</span></button></div></div>
  <div className="lab-stage"><div className="lab-preview" data-viewport={mobile?"mobile":"desktop"} data-theme={dark?"dark":"light"}>
   <div className="lab-browser-bar"><Layers size={15}/><span>{mobile?"Mobile experience":"Digital workspace"}</span><span className="lab-concept-label">Interactive concept</span></div>
   <div className="lab-dashboard" key={replay}>
    <aside className="lab-sidebar" aria-label="Preview description"><span className="lab-app-brand"><Layers size={20}/> Workspace</span><div><LayoutDashboard size={17}/> Project overview</div><p>Everything you need to take the next step.</p><span className="lab-sidebar-bottom">Built with intention.<ArrowUpRight size={17}/></span></aside>
    <div className="lab-main"><div className="lab-welcome"><span>Your next release</span><h4>Good ideas.<br/>Taking shape.</h4></div><div className="lab-progress-label"><span>Project checklist</span><strong aria-live="polite">{completed} of {tasks.length} complete</strong></div><div className="lab-progress-track" aria-hidden="true"><span style={{transform:`scaleX(${completed/tasks.length})`}}/></div>
     <div className="lab-tabs" role="tablist" aria-label="Workspace preview">{["Tasks","Activity"].map((label,i)=><button key={label} id={`lab-tab-${i}`} type="button" role="tab" aria-selected={tab===label} aria-controls="lab-panel" tabIndex={tab===label?0:-1} onClick={()=>setTab(label)} onKeyDown={e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();const next=i===0?1:0;setTab(next===0?"Tasks":"Activity");document.getElementById(`lab-tab-${next}`)?.focus();}}}>{label==="Tasks"?<CircleCheck size={16}/>:<MessageSquare size={16}/>} {label}</button>)}</div>
     <div id="lab-panel" className="lab-panel" key={tab} role="tabpanel" aria-labelledby={`lab-tab-${tab==="Tasks"?0:1}`} tabIndex={0}>{tab==="Tasks"?<ul className="lab-tasks">{tasks.map((task,i)=><li key={task.title}><button type="button" role="checkbox" aria-checked={task.done} className={task.done?"is-complete":""} onClick={()=>toggleTask(i)}><span className="lab-check" aria-hidden="true">{task.done&&<Check size={14}/>}</span><span><strong>{task.title}</strong><span>{task.description}</span></span><ArrowRight size={16} className="lab-task-arrow" aria-hidden="true"/></button></li>)}</ul>:<div className="lab-activity">{activity.length?<ul>{activity.map(item=><li key={item.id}><Check size={16}/><span>{item.text}</span></li>)}</ul>:<div className="lab-empty"><MessageSquare size={25}/><p>Complete or reopen a task to see the activity appear here.</p><button type="button" onClick={()=>{setTab("Tasks");document.getElementById("lab-tab-0")?.focus();}}>Try the checklist <ArrowRight size={15}/></button></div>}</div>}</div>
     <p className="lab-demo-note">Sample workflow. Changes stay in this demonstration.</p>
    </div>
   </div>
  </div></div>
 </section>;
}
