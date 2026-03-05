import posthog from "posthog-js";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const POSTHOG_KEY = "phc_j70UHuZRuQa2jPtfSWjc8Boc2EHBKT7Vo9X6zHL0HUn";
const POSTHOG_HOST = "https://us.i.posthog.com";
const APP_BASE_URL = "https://app.walnutt.co";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const SESSION_KEY = "walnutt_utm";

// ─── INIT ─────────────────────────────────────────────────────────────────────
export function initPostHog() {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,       // auto-tracks page views
    capture_pageleave: true,      // auto-tracks bounces
    persistence: "localStorage",
  });

  // Capture & store UTMs from the landing page URL
  storeUtmParams();
}

// ─── UTM HELPERS ──────────────────────────────────────────────────────────────
function storeUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) utms[k] = v;
  });
  if (Object.keys(utms).length > 0) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(utms));
    // Also identify UTMs as super properties so every future event carries them
    posthog.register(utms);
  }
}

export function getStoredUtms(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
}

// ─── URL BUILDER ──────────────────────────────────────────────────────────────
/**
 * Builds an app.walnutt.co URL with UTM params forwarded from the landing page.
 * e.g. walnutt.co?utm_source=linkedin → app.walnutt.co?utm_source=linkedin
 */
export function buildAppUrl(path = ""): string {
  const utms = getStoredUtms();

  // Also grab from current URL in case storeUtmParams hasn't run (SSR edge cases)
  const current = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach((k) => {
    if (!utms[k]) {
      const v = current.get(k);
      if (v) utms[k] = v;
    }
  });

  const base = `${APP_BASE_URL}${path}`;
  if (Object.keys(utms).length === 0) return base;
  return `${base}?${new URLSearchParams(utms).toString()}`;
}

// ─── EVENT TRACKING ───────────────────────────────────────────────────────────
export function trackEvent(name: string, props?: Record<string, unknown>) {
  posthog.capture(name, props);
}
