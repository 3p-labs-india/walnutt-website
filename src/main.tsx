
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { initPostHog } from "./lib/analytics";

  initPostHog();

  createRoot(document.getElementById("root")!).render(<App />);
