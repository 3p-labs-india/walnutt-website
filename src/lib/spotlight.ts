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

/** Anything off-contract is treated as no data, never shown as a number. */
function parse(body: unknown): SpotlightState | null {
  if (!body || typeof body !== "object") return null;
  const { sent, cap, week_start } = body as Partial<SpotlightWeek>;
  if (!isCount(sent)) return null;
  const safeCap = isCount(cap) && cap > 0 ? cap : DEFAULT_CAP;
  const weekStart = typeof week_start === "string" && ISO_DATE.test(week_start)
    ? week_start
    : currentWeekStartIST();
  return { status: "ready", sent, cap: safeCap, weekStart };
}

export function useSpotlightWeek(): SpotlightState {
  const [state, setState] = useState<SpotlightState>(
    SPOTLIGHT_URL ? { status: "loading", cap: DEFAULT_CAP } : { status: "unavailable", cap: DEFAULT_CAP },
  );

  useEffect(() => {
    if (!SPOTLIGHT_URL) return;
    let unmounted = false;
    const ctrl = new AbortController();
    // Apps Script cold starts can take a few seconds; past this, give up.
    const timeout = setTimeout(() => ctrl.abort(), 8000);

    fetch(SPOTLIGHT_URL, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then(body => parse(body))
      .catch(() => null)
      .then(next => {
        clearTimeout(timeout);
        if (!unmounted) setState(next ?? { status: "unavailable", cap: DEFAULT_CAP });
      });

    return () => {
      unmounted = true;
      clearTimeout(timeout);
      ctrl.abort();
    };
  }, []);

  return state;
}
