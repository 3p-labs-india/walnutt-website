import { createBrowserRouter, redirect } from "react-router";
import { HomePage, CompaniesHomePage } from "./components/home-page";
import { PrivacyPolicy } from "./components/privacy-policy";
import { TermsConditions } from "./components/terms-conditions";

export const router = createBrowserRouter(
  [
    { path: "/", Component: CompaniesHomePage },
    { path: "/engineers", Component: HomePage },
    { path: "/companies", Component: CompaniesHomePage },
    // For Recruiters was retired — keep old links working.
    { path: "/recruiters", loader: () => redirect("/") },
    { path: "/privacy", Component: PrivacyPolicy },
    { path: "/terms", Component: TermsConditions },
  ],
  { basename: import.meta.env.BASE_URL }
);
