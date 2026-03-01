import { createBrowserRouter } from "react-router";
import { HomePage } from "./components/home-page";
import { PrivacyPolicy } from "./components/privacy-policy";
import { TermsConditions } from "./components/terms-conditions";

export const router = createBrowserRouter(
  [
    { path: "/", Component: HomePage },
    { path: "/privacy", Component: PrivacyPolicy },
    { path: "/terms", Component: TermsConditions },
  ],
  { basename: import.meta.env.BASE_URL }
);
