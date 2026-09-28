import { useEffect, useState } from "react";

/**
 * Where this week's Spotlight numbers come from.
 *
 * For now: a Google Apps Script web app reading the ops sheet — source in
 * scripts/spotlight-apps-script.gs. Later: the learning-engine route
 * `https://api.walnutt.co/api/public/spotlight/week`, which will answer with
 * the same shape, so switching over is this one line.
 *
 * Left empty, the page skips the fetch and shows the cap on its own.
 */
export const SPOTLIGHT_URL = "https://script.google.com/macros/s/AKfycbwS1fJKfWey5ZwGe5dhUUiBYLjvCq0YnvEmCuOmcDmWb5dKcBUolTpi0Uz45l53f_K6Sw/exec";

/** Spotlights per week, across every company and role. */
export const DEFAULT_CAP = 40;

/** The endpoint contract. `week_start` is that week's Monday, in IST. */
export type SpotlightWeek = { sent: number; cap: number; week_start: string };

export type SpotlightState =
  | { status: "loading"; cap: number }
  | { status: "ready"; cap: number; sent: number; weekStart: string }
  | { status: "unavailable"; cap: number };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;
const IST_OFFSET_MS = 330 * 60_000; // UTC+5:30, no DST
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Monday of the current week in IST, as YYYY-MM-DD. The week turns over at
 * midnight Sunday in Bengaluru, wherever the visitor is.
 */
export function currentWeekStartIST(now = Date.now()): string {
  const ist = new Date(now + IST_OFFSET_MS);
  const sinceMonday = (ist.getUTCDay() + 6) % 7;
  return new Date(ist.getTime() - sinceMonday * DAY_MS).toISOString().slice(0, 10);
}

/** "2026-09-28" → "28 Sep – 04 Oct". Pure date arithmetic, no timezone. */
export function formatWeek(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d));
  const end = new Date(start.getTime() + 6 * DAY_MS);
  const fmt = (t: Date) => `${String(t.getUTCDate()).padStart(2, "0")} ${MONTHS[t.getUTCMonth()]}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

function isCount(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

type Ready = Extract<SpotlightState, { status: "ready" }>;

/** Anything off-contract is treated as no data, never shown as a number. */
function parse(body: unknown): Ready | null {
  if (!body || typeof body !== "object") return null;
  const { sent, cap, week_start } = body as Partial<SpotlightWeek>;
  if (!isCount(sent)) return null;
  const safeCap = isCount(cap) && cap > 0 ? cap : DEFAULT_CAP;
  const weekStart = typeof week_start === "string" && ISO_DATE.test(week_start)
    ? week_start
    : currentWeekStartIST();
  return { status: "ready", sent, cap: safeCap, weekStart };
}

// ── last-seen count ─────────────────────────────────────────────────────────
// Apps Script answers in 1.3–2.5s, most of it Google spinning the script up.
// A returning visitor gets the count they last saw straight away, and the
// fresh one replaces it when it lands. Only this week's count is reused —
// last week's number is not "this week" on a Monday.
const STORAGE_KEY = "walnutt_spotlight_week";

function readLastSeen(): Ready | null {
  try {
    const hit = parse(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"));
    return hit && hit.weekStart === currentWeekStartIST() ? hit : null;
  } catch {
    return null;
  }
}

function writeLastSeen(week: Ready) {
  try {
    const body: SpotlightWeek = { sent: week.sent, cap: week.cap, week_start: week.weekStart };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(body));
  } catch {
    /* private mode or storage blocked: the page just waits for the fetch */
  }
}

// ── the request ─────────────────────────────────────────────────────────────
let inflight: Promise<Ready | null> | null = null;

/**
 * Starts the request (once per page load) and returns it. main.tsx calls this
 * before React renders when the URL is /spotlight, so the wait overlaps with
 * boot rather than following it; the hook below picks up the same promise.
 */
export function prefetchSpotlight(): Promise<Ready | null> {
  if (!SPOTLIGHT_URL) return Promise.resolve(null);
  inflight ??= (async () => {
    const ctrl = new AbortController();
    // Apps Script cold starts can take a few seconds; past this, give up.
    const timeout = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch(SPOTLIGHT_URL, { signal: ctrl.signal });
      const week = r.ok ? parse(await r.json()) : null;
      if (week) writeLastSeen(week);
      return week;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  })();
  return inflight;
}

export function useSpotlightWeek(): SpotlightState {
  const [state, setState] = useState<SpotlightState>(() => {
    if (!SPOTLIGHT_URL) return { status: "unavailable", cap: DEFAULT_CAP };
    return readLastSeen() ?? { status: "loading", cap: DEFAULT_CAP };
  });

  useEffect(() => {
    if (!SPOTLIGHT_URL) return;
    let unmounted = false;
    prefetchSpotlight().then(fresh => {
      if (unmounted) return;
      // a failed refresh keeps a last-seen count rather than dropping it
      setState(prev => fresh ?? (prev.status === "ready" ? prev : { status: "unavailable", cap: DEFAULT_CAP }));
    });
    return () => { unmounted = true; };
  }, []);

  return state;
}
