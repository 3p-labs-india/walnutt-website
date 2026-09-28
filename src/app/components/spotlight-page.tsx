import { useEffect, useRef, useState } from "react";
import { buildAppUrl, trackEvent } from "../../lib/analytics";
import { seoFor, useSeo } from "../../lib/seo";
import { formatWeek, currentWeekStartIST, useSpotlightWeek, type SpotlightState } from "../../lib/spotlight";
import { prefersReducedMotion, useReveal } from "./reveal";
import { SiteFooter, SiteNav } from "./site-chrome";

/**
 * Spotlight — the weekly, capped, hand-picked intro Walnutt sends on an
 * engineer's behalf. Ported from the Spotlight draft artifact onto the site's
 * type and palette; section styles live in src/styles/spotlight.css.
 *
 * The count and week are live (see src/lib/spotlight.ts); the cap flows from
 * the same response into every place the page says "40".
 */

const EMAIL = "hello@walnutt.co";

// ═══ COUNT-UP ═══
function useCountUp(target: number | null, delay = 350, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const timer = setTimeout(() => {
      let start: number | null = null;
      const step = (t: number) => {
        start ??= t;
        const p = Math.min(1, (t - start) / duration);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, delay, duration]);

  return value;
}

// ═══ STAGE: lamp, beam, this week's count ═══
function Stage({ week }: { week: SpotlightState }) {
  const [on, setOn] = useState(true);

  const ready = week.status === "ready";
  const sent = week.status === "ready" ? week.sent : null;
  const shown = useCountUp(sent);
  const [fill, setFill] = useState(0);
  useEffect(() => {
    if (sent === null) return;
    // one frame at 0 first, so the bar grows rather than appearing
    const raf = requestAnimationFrame(() => setFill(Math.min(1, sent / week.cap)));
    return () => cancelAnimationFrame(raf);
  }, [sent, week.cap]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    trackEvent("spotlight_lamp_toggled", { on: next });
  };

  const weekStart = ready ? week.weekStart : currentWeekStartIST();

  // The flicker only rides along while the light is on. Its fill-mode pins
  // opacity at 1, so it must be gone for "off" to dim anything; and because
  // the class comes back each time the light does, the flicker replays.
  return (
    <header className={`stage ${on ? "flicker" : "off"}`}>
      <div className="beam" />
      <div className="pool" />

      <button
        className="lamp"
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Turn the light off" : "Turn the light on"}
      >
        <svg viewBox="0 0 120 92" aria-hidden="true">
          <line className="cord" x1="60" y1="0" x2="60" y2="34" />
          <circle className="halo" cx="60" cy="66" r="22" />
          <path className="shade" d="M42 36h36l10 26H32z" />
          <ellipse className="bulb" cx="60" cy="64" rx="11" ry="6" />
        </svg>
      </button>
      <button className="switch" type="button" onClick={toggle} tabIndex={-1} aria-hidden="true">
        {on ? "Light off" : "Light on"}
      </button>

      <div className="lit">
        <h1>Walnutt Spotlight</h1>

        {week.status === "unavailable" ? (
          <>
            <p className="count" aria-hidden="true"><span className="n">{week.cap}</span></p>
            <p className="label">Spotlights a week, at most</p>
          </>
        ) : (
          <>
            {/* hidden while loading: holds its height, never flashes 0 */}
            <p className={`count${ready ? "" : " pending"}`} aria-hidden="true">
              <span className="n">{shown}</span>
              <span className="s">/</span>
              <span className="t">{week.cap}</span>
            </p>
            {ready && (
              <span className="sr-only">{week.sent} of {week.cap} Spotlights sent this week.</span>
            )}
            <div className="track" aria-hidden="true"><i style={{ width: `${fill * 100}%` }} /></div>
            <p className="label">Spotlights this week</p>
            <p className="week">{formatWeek(weekStart)}</p>
          </>
        )}

        <a className="down" href="#what">
          What's a Spotlight?
          <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 5l5 5 5-5" /></svg>
        </a>
      </div>
    </header>
  );
}

// ═══ PILLARS ═══
function Pillars({ cap }: { cap: number }) {
  return (
    <section className="pillars" aria-label="What's behind every Spotlight">
      <div className="pl rv">
        <div className="mark">
          <svg viewBox="0 0 72 72" aria-hidden="true">
            <path className="cone" d="M36 6L62 60H10z" />
            <circle className="hi" cx="36" cy="46" r="5" />
            <circle className="dim" cx="22" cy="52" r="3" />
            <circle className="dim" cx="50" cy="52" r="3" />
          </svg>
        </div>
        <div>
          <h3>Hand-picked</h3>
          <p>One engineer per role, picked against what the role asks for.</p>
        </div>
      </div>

      <div className="pl rv">
        <div className="mark">
          <svg viewBox="0 0 72 72" aria-hidden="true">
            <line className="cord" x1="36" y1="4" x2="36" y2="20" />
            <path className="shade" d="M24 20h24l7 18H17z" />
            <ellipse className="bulb" cx="36" cy="39" rx="8" ry="4" />
            <path className="tick" d="M27 56l6 6 12-12" />
          </svg>
        </div>
        <div>
          <h3>Walnutt's name on it</h3>
          <p>Nobody is sent until Walnutt has screened them.</p>
        </div>
      </div>

      <div className="pl rv">
        <div className="mark">
          <svg viewBox="0 0 72 72" aria-hidden="true">
            <text className="num" x="36" y="46" textAnchor="middle">{cap}</text>
            <rect className="hi" x="16" y="54" width="40" height="3" rx="1.5" />
          </svg>
        </div>
        <div>
          <h3>Capped at {cap}</h3>
          <p>Across all companies, all roles, every week.</p>
        </div>
      </div>

      <div className="pl rv">
        <div className="mark">
          <svg viewBox="0 0 72 72" aria-hidden="true">
            <circle className="dim" cx="18" cy="36" r="4" />
            <circle className="mid" cx="36" cy="36" r="4" />
            <circle className="hi dot" cx="54" cy="36" r="6" />
            <circle className="ring dot" cx="54" cy="36" r="11" />
            <line className="link" x1="22" y1="36" x2="32" y2="36" />
            <line className="link" x1="40" y1="36" x2="48" y2="36" />
          </svg>
        </div>
        <div>
          <h3>Live status</h3>
          <p>The engineer sees where their Spotlight stands: sent, opened, in conversation.</p>
        </div>
      </div>
    </section>
  );
}

// ═══ COPYABLE ADDRESS ═══
function CopyAddress() {
  const code = useRef<HTMLElement>(null);
  const [label, setLabel] = useState("Copy");

  const select = () => {
    const el = code.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    setLabel("Selected");
  };

  const copy = () => {
    trackEvent("spotlight_email_copied");
    if (!navigator.clipboard) return select();
    navigator.clipboard.writeText(EMAIL).then(() => setLabel("Copied"), select);
  };

  return (
    <div className="addr">
      <code ref={code}>{EMAIL}</code>
      <button type="button" onClick={copy}>{label}</button>
    </div>
  );
}

// ═══ PAGE ═══
export function SpotlightPage() {
  useSeo(seoFor("/spotlight"));
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const week = useSpotlightWeek();

  return (
    <>
      <SiteNav mode="engineers" />

      <main className="page-spotlight" ref={root}>
        <div className="wrap">
          <Stage week={week} />

          <section className="what" id="what">
            <div className="card rv">
              <span className="eyebrow">What is a Spotlight</span>
              <p>
                A Spotlight is something we put together and send to hiring teams when we see a strong
                fit between an engineer and an open role. We only send it when we're confident enough
                to <b>put our name on it</b>, so a good engineer doesn't get lost in the pile.
              </p>
            </div>
          </section>

          <Pillars cap={week.cap} />

          <section className="invite" id="invite">
            <div className="rv">
              <span className="tag"><i />Invite only</span>
              <h2>How do I get a Spotlight <span className="hl">on me?</span></h2>
              <p className="lead">
                Each week we run matches across open public roles and pick the <b>{week.cap}</b> where
                a Walnutt engineer is the strongest fit, and where we're confident enough to say so.
                Those engineers get a Spotlight, by name, to that company.
              </p>
            </div>

            <div className="special rv">
              <h3>Not invited, but certain?</h3>
              <p>
                If there's a role you know you'd be the best person for, write to us with the role
                link and the sharpest one line on why you. We read every one.
              </p>
              <CopyAddress />
              <small>
                Prerequisite: a completed profile on Walnutt, at{" "}
                <a href={buildAppUrl("/")} target="_blank" rel="noopener noreferrer">app.walnutt.co</a>.
              </small>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter mode="engineers" />
    </>
  );
}
