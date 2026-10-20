import { hydrateRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "../app/globals.css";
import "../app/motion.css";
import "../app/portfolio.css";
import "../app/packages.css";
import Home from "../app/page";
import Privacy from "../app/privacy/page";
import { MotionProvider } from "../app/components/MotionSystem";

const root = document.getElementById("site-root");
if (!root) throw new Error("The page content is missing.");
const Page = root.dataset.page === "privacy" ? Privacy : Home;
hydrateRoot(root, <MotionProvider><Page /></MotionProvider>);
