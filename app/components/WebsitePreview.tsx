"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ExternalLink, Monitor, RotateCcw, Smartphone, Tablet } from "lucide-react";
import { previewSandbox } from "../../lib/portfolio";
import { sitePath } from "../../lib/site-runtime";

type PreviewTarget = { name: string; websiteUrl: string; previewUrl: string; image?: string };
type PreviewDevice = "desktop" | "laptop" | "tablet" | "mobile" | "compact";
export function WebsitePreview({ project, responsiveTools = false }: { project: PreviewTarget; responsiveTools?: boolean }) {
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<"loading" | "loaded" | "slow" | "error">("loading");
  const [bounds, setBounds] = useState({ width: 1120, height: 560 });
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(max-width: 760px)").matches) setDevice("mobile");
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => setBounds({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setState("loading");
    const timer = window.setTimeout(() => setState(value => value === "loading" ? "slow" : value), 15000);
    return () => window.clearTimeout(timer);
  }, [attempt]);

  const width = device === "mobile" ? 390 : device === "compact" ? 320 : device === "tablet" ? 768 : device === "laptop" ? 1024 : responsiveTools ? 1440 : 1280;
  const scale = Math.min(1, Math.max(bounds.width, 1) / width);
  const height = Math.max(400, Math.floor(Math.max(bounds.height, 1) / scale));
  const frameStyle = { "--preview-width": `${width}px`, "--preview-height": `${height}px`, "--preview-scale": scale } as CSSProperties;
  return <div className="website-preview">
    <div className="website-toolbar">
      <div className="website-device-controls" role="group" aria-label="Website preview size">
        <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}><Monitor size={16} /> Desktop</button>
        {responsiveTools && <><button type="button" aria-pressed={device === "laptop"} onClick={() => setDevice("laptop")}><Monitor size={16}/> Laptop</button><button type="button" aria-pressed={device === "tablet"} onClick={() => setDevice("tablet")}><Tablet size={16}/> Tablet</button></>}
        <button type="button" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}><Smartphone size={16} /> Mobile</button>
        {responsiveTools && <button type="button" aria-pressed={device === "compact"} onClick={() => setDevice("compact")}><Smartphone size={16}/> Small phone</button>}
      </div>
      <div className="website-tools">
        <button type="button" onClick={() => { setState("loading"); setAttempt(value => value + 1); }} aria-label={`Reload ${project.name} preview`}><RotateCcw size={16} /><span>Reload</span></button>
        <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">Open website <ExternalLink size={15} /><span className="sr-only"> in a new tab</span></a>
      </div>
    </div>
    <div className="website-browser-bar"><span aria-hidden="true" className="website-browser-dots"><i /><i /><i /></span><span>{new URL(project.previewUrl).hostname}{new URL(project.previewUrl).pathname}</span></div>
    <div className="website-preview-stage" ref={stageRef} data-device={device}>
      {state !== "error" && <div className="website-frame-canvas" style={frameStyle}>
        <iframe key={attempt} title={`${project.name} interactive preview`} src={project.previewUrl}
          sandbox={previewSandbox(project.previewUrl, typeof window === "undefined" ? "" : window.location.origin)}
          allow="camera 'none'; microphone 'none'; geolocation 'none'; payment 'none'"
          referrerPolicy="no-referrer" onLoad={() => setState("loaded")} onError={() => setState("error")} />
      </div>}
      {state === "loading" && <div className="website-loading" role="status">{project.image && <img src={sitePath(project.image)} alt="" />}<div><span className="website-loading-line" /><p>Opening {project.name}…</p></div></div>}
      {(state === "slow" || state === "error") && <div className={`website-load-notice ${state === "error" ? "is-error" : ""}`} role="status"><p>{state === "error" ? "This preview could not be opened." : "Taking a little longer to open."}</p><a href={project.previewUrl} target="_blank" rel="noopener noreferrer">Explore in a new tab <ExternalLink size={15} /></a></div>}
    </div>
    <p className="website-preview-help">Scroll and interact inside the preview. If your browser cannot display it, <a href={project.previewUrl} target="_blank" rel="noopener noreferrer">open the experience in a new tab<span className="sr-only"> for {project.name}</span></a>.</p>
  </div>;
}
