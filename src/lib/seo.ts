import { useEffect } from "react";
import siteMeta from "./routes-meta.json";

/**
 * Per-route metadata, shared by two consumers so they cannot drift:
 *  - scripts/build-routes.mjs bakes it into a real HTML file per route
 *  - useSeo() below keeps it correct across client-side navigation
 */

type RouteMeta = { path: string; title: string; description: string; canonical?: string };

export const ORIGIN: string = siteMeta.origin;
const ROUTES = siteMeta.routes as RouteMeta[];

export type Seo = { title: string; description: string; canonical?: string; noindex?: boolean };

export function seoFor(path: string): Seo {
  const route = ROUTES.find(r => r.path === path) ?? ROUTES[0];
  return {
    title: route.title,
    description: route.description,
    canonical: ORIGIN + (route.canonical ?? route.path),
  };
}

function upsert(selector: string, create: () => Element, attr: string, value: string | null) {
  const existing = document.head.querySelector(selector);
  if (value === null) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.head.appendChild(create());
  el.setAttribute(attr, value);
}

/**
 * The build step already wrote these tags into the HTML for the initial load;
 * this keeps them right when the router swaps pages without a reload.
 */
export function useSeo({ title, description, canonical, noindex = false }: Seo) {
  useEffect(() => {
    document.title = title;

    const meta = (key: string, value: string | null, asProperty = false) => {
      const attr = asProperty ? "property" : "name";
      upsert(`meta[${attr}="${key}"]`, () => {
        const el = document.createElement("meta");
        el.setAttribute(attr, key);
        return el;
      }, "content", value);
    };

    meta("description", description);
    meta("robots", noindex ? "noindex, nofollow" : "index, follow");
    meta("og:title", title, true);
    meta("og:description", description, true);
    meta("og:url", canonical ?? null, true);
    meta("twitter:title", title);
    meta("twitter:description", description);

    upsert('link[rel="canonical"]', () => {
      const el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      return el;
    }, "href", canonical ?? null);
  }, [title, description, canonical, noindex]);
}
