import { renderToString } from "react-dom/server";
import Home from "../app/page";
import Privacy from "../app/privacy/page";
import { MotionProvider } from "../app/components/MotionSystem";

export function renderPage(page: "home" | "privacy") {
  const Page = page === "privacy" ? Privacy : Home;
  return renderToString(<MotionProvider><Page /></MotionProvider>);
}
