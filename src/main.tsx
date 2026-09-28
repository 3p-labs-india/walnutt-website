import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { initPostHog } from "./lib/analytics";
import { prefetchSpotlight } from "./lib/spotlight";

initPostHog();

// The Spotlight count comes from a slow endpoint; ask before React renders.
if (/^\/spotlight\/?$/.test(window.location.pathname)) prefetchSpotlight();

createRoot(document.getElementById("root")!).render(<App />);
