import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../../lib/analytics";

/**
 * For Companies — ported from the v7 draft.
 *
 * Section styling lives in src/styles/companies.css, scoped under
 * .page-companies. The draft's four inline scripts are the hooks below.
 */

const prefersReducedMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

// ═══ SCROLL REVEAL ═══
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>(".rv"));
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      targets.forEach(t => t.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [root]);
}

// ═══ LADDER BEAM + STICKY VISUAL RAIL ═══
function useLadder(
  ladder: React.RefObject<HTMLDivElement | null>,
  fill: React.RefObject<HTMLDivElement | null>,
) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ladder.current;
    if (!el) return;

    const beam = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - r.top) / r.height));
      if (fill.current) fill.current.style.height = `${p * 100}%`;

      const filledY = r.top + p * r.height;
      let lit = 0;
      el.querySelectorAll<HTMLElement>(".qrow").forEach((row, i) => {
        const isLit = row.getBoundingClientRect().top + 60 <= filledY;
        row.classList.toggle("lit", isLit);
        if (isLit) lit = i;
      });
      setActive(lit);
    };

    window.addEventListener("scroll", beam, { passive: true });
    window.addEventListener("resize", beam);
    beam();
    return () => {
      window.removeEventListener("scroll", beam);
      window.removeEventListener("resize", beam);
    };
  }, [ladder, fill]);

  return active;
}

// ═══ MATCH SCORE COUNT-UP ═══
const FINAL_SCORE = 0.94;

function useScore(section: React.RefObject<HTMLElement | null>) {
  const [score, setScore] = useState("0.00");

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    let raf = 0;
    const run = () => {
      el.classList.add("seen");
      if (prefersReducedMotion()) {
        setScore(FINAL_SCORE.toFixed(2));
        return;
      }
      const t0 = performance.now();
      const step = (ts: number) => {
        const k = Math.min(1, (ts - t0) / 1500);
        const eased = 1 - Math.pow(1 - k, 3);
        setScore((FINAL_SCORE * eased).toFixed(2));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        io.disconnect();
        run();
      }
    }, { threshold: 0.35 });
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [section]);

  return score;
}

// ═══ MACHINERY SEQUENCER ═══
const STAGE_POS = ["12.5%", "37.5%", "62.5%", "87.5%"];

function useMachinery(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const cols = Array.from(el.querySelectorAll<HTMLElement>(".scol"));
    const nodes = Array.from(el.querySelectorAll<HTMLElement>(".spine .nd"));
    const dot = el.querySelector<HTMLElement>(".spine .sdot");

    if (prefersReducedMotion()) {
      cols.forEach(c => c.classList.add("lit"));
      nodes.forEach(n => n.classList.add("lit"));
      return;
    }

    // The draft loops forever; every timer is tracked so unmount can clear it.
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
    };

    let i = -1;
    const step = () => {
      i++;
      if (i >= cols.length) {
        later(() => {
          dot?.classList.remove("go");
          cols.forEach(c => c.classList.remove("lit"));
          nodes.forEach(n => n.classList.remove("lit"));
          i = -1;
          if (dot) dot.style.left = STAGE_POS[0];
          later(step, 800);
        }, 2600);
        return;
      }
      if (dot) { dot.classList.add("go"); dot.style.left = STAGE_POS[i]; }
      cols[i].classList.add("lit");
      nodes[i]?.classList.add("lit");
      later(step, 1250);
    };

    let started = false;
    const start = () => { if (!started) { started = true; step(); } };

    let io: IntersectionObserver | undefined;
    const scols = el.querySelector(".scols");
    if ("IntersectionObserver" in window && scols) {
      io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) start();
      }, { threshold: 0.25 });
      io.observe(scols);
    } else {
      start();
    }

    return () => {
      io?.disconnect();
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [root]);
}

// ═══ PAGE ═══
export function CompaniesPage({ onOpenForm }: { onOpenForm: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const ladderRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);

  useReveal(root);
  const activeVis = useLadder(ladderRef, fillRef);
  const score = useScore(scoreRef);
  useMachinery(machineRef);

  const cta = (location: string) => () => {
    trackEvent("cta_clicked_connect", { location });
    onOpenForm();
  };

  return (
    <div className="page-companies" ref={root}>
      {/* gradient defs referenced by the gauge and the intent area fill */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3C6E4E" /><stop offset="1" stopColor="#57A874" />
          </linearGradient>
          <linearGradient id="joinFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(87,168,116,.28)" /><stop offset="1" stopColor="rgba(87,168,116,0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* ═══ HERO ═══ */}
      <header className="hero" id="hero">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="grid-bg" />
        <div className="wrap hero-in">
          <div>
            <h1>
              <span className="hl">Great companies</span>
              <span className="hl">are built on</span>
              <span className="hl traj">great hires.</span>
            </h1>
            <div className="hero-cta">
              <button className="btn" onClick={cta("companies_hero")}>
                Start a role <span className="ar">→</span>
              </button>
              <a className="btn-ghost" href="#match">See what makes a great hire</a>
            </div>
          </div>
          <div className="kcurve" aria-hidden="true">
            <svg viewBox="70 70 440 340">
              <path className="k-in" d="M96 246 L226 246" />
              <path className="k-dn" d="M226 246 C300 246, 348 276, 470 366" />
              <path className="k-up" d="M226 246 C300 246, 348 216, 470 118" />
              <circle className="k-node" cx="226" cy="246" r="4.5" />
              <text className="k-lab dim" x="96" y="274">company growth</text>
              <text className="k-lab up" x="400" y="100">great hire</text>
              <g className="kmotion">
                <circle className="cdot-up" r="6" cx="0" cy="0">
                  <animateMotion dur="4.2s" begin="1s" repeatCount="indefinite"
                    path="M96 246 L226 246 C300 246, 348 216, 470 118" />
                  <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.08;0.78;0.9;1" dur="4.2s" begin="1s" repeatCount="indefinite" />
                </circle>
                <circle className="cdot-dn" r="5" cx="0" cy="0">
                  <animateMotion dur="4.2s" begin="1.35s" repeatCount="indefinite"
                    path="M96 246 L226 246 C300 246, 348 276, 470 366" />
                  <animate attributeName="opacity" values="0;.85;.85;0;0" keyTimes="0;0.08;0.78;0.9;1" dur="4.2s" begin="1.35s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
        </div>
      </header>

      {/* ═══ THE THREE QUESTIONS ═══ */}
      <section id="match">
        <div className="wrap">
          <div className="rv"><h2>What makes the difference.</h2></div>
          <div className="lgrid">
            <div className="ladder" ref={ladderRef}>
              <div className="track"><div className="fill" ref={fillRef} /></div>

              <div className="qrow">
                <div className="qnode">01</div>
                <div>
                  <span className="slabel">Capability Score</span>
                  <h3>Can they do it?</h3>
                  <p className="qs">Depth in the exact work this role demands, proven in what they've shipped.</p>
                </div>
              </div>
              <div className="qrow">
                <div className="qnode">02</div>
                <div>
                  <span className="slabel">Fit Score</span>
                  <h3>How well they fit?</h3>
                  <p className="qs">Six dimensions of the person, mapped from behaviour over time.</p>
                </div>
              </div>
              <div className="qrow">
                <div className="qnode">03</div>
                <div>
                  <span className="slabel">Intent Score</span>
                  <h3>Will they join?</h3>
                  <p className="qs">Joining intent, measured through the last mile and held to day one.</p>
                </div>
              </div>
            </div>

            <div className="rail">
              <div className="rail-stick">
                {/* 01 — capability */}
                <div className={`vis${activeVis === 0 ? " on" : ""}`}>
                  <div className="chrome">
                    <span className="dots"><i /><i /><i /></span>
                    <span className="ct">Capability Score</span>
                    <span className="vtag">Role calibrated</span>
                  </div>
                  <div className="vbody">
                    <div className="meta-row">
                      <span className="mchip">Candidate 0142</span>
                      <span className="mchip">Backend platform</span>
                      <span className="mchip">L5</span>
                    </div>
                    <div className="cap">
                      {([["System design", "0.94", "94%"], ["Debugging", "0.91", "91%"], ["Code quality", "0.96", "96%"], ["Judgment", "0.92", "92%"]] as const).map(([label, v, w]) => (
                        <div className="cr" key={label}>
                          <div className="cl"><span>{label}</span><span className="v">{v}</span></div>
                          <div className="tr"><div className="fl" style={{ "--w": w } as React.CSSProperties} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="vfoot"><span className="ok">Verified against shipped work</span><span>Capability 0.96</span></div>
                </div>

                {/* 02 — fit */}
                <div className={`vis${activeVis === 1 ? " on" : ""}`}>
                  <div className="chrome">
                    <span className="dots"><i /><i /><i /></span>
                    <span className="ct">Fit Score</span>
                    <span className="vtag">Six dimensions</span>
                  </div>
                  <div className="vbody">
                    <div className="fitwrap">
                      <div className="radar">
                        <svg viewBox="-62 -18 324 238" aria-label="Six dimension map">
                          <polygon className="web" points="100,20 169.3,60 169.3,140 100,180 30.7,140 30.7,60" />
                          <polygon className="web" points="100,45 147.6,72.5 147.6,127.5 100,155 52.4,127.5 52.4,72.5" />
                          <polygon className="web" points="100,70 126,85 126,115 100,130 74,115 74,85" />
                          <line className="spoke" x1="100" y1="100" x2="100" y2="20" />
                          <line className="spoke" x1="100" y1="100" x2="169.3" y2="60" />
                          <line className="spoke" x1="100" y1="100" x2="169.3" y2="140" />
                          <line className="spoke" x1="100" y1="100" x2="100" y2="180" />
                          <line className="spoke" x1="100" y1="100" x2="30.7" y2="140" />
                          <line className="spoke" x1="100" y1="100" x2="30.7" y2="60" />
                          <polygon className="data" points="100,25.6 159.6,65.6 166.5,138.4 100,170.4 36.9,136.4 41.8,66.4" />
                          <circle className="dot" cx="100" cy="25.6" r="3" /><circle className="dot" cx="159.6" cy="65.6" r="3" />
                          <circle className="dot" cx="166.5" cy="138.4" r="3" /><circle className="dot" cx="100" cy="170.4" r="3" />
                          <circle className="dot" cx="36.9" cy="136.4" r="3" /><circle className="dot" cx="41.8" cy="66.4" r="3" />
                          <text x="100" y="8" textAnchor="middle">personality</text>
                          <text x="176" y="52" textAnchor="start">consistency</text>
                          <text x="176" y="152" textAnchor="start">integrity</text>
                          <text x="100" y="198" textAnchor="middle">cognition</text>
                          <text x="24" y="152" textAnchor="end">growth</text>
                          <text x="24" y="52" textAnchor="end">relationships</text>
                        </svg>
                      </div>
                      <div className="dimlist">
                        {([["Integrity", "0.96"], ["Growth", "0.91"], ["Cognition", "0.88"], ["Consistency", "0.86"]] as const).map(([label, v]) => (
                          <div className="d" key={label}><span>{label}</span><span className="v">{v}</span></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="vfoot"><span className="ok">Behaviour over time</span><span>Fit 0.93</span></div>
                </div>

                {/* 03 — intent */}
                <div className={`vis${activeVis === 2 ? " on" : ""}`}>
                  <div className="chrome">
                    <span className="dots"><i /><i /><i /></span>
                    <span className="ct">Intent Score</span>
                    <span className="vtag">The last mile</span>
                  </div>
                  <div className="vbody">
                    <div className="join">
                      <div className="big">
                        <span className="num">0.91</span>
                        <span className="lab">Joining intent</span>
                        <span className="status">Intent holding</span>
                      </div>
                      <svg viewBox="0 0 360 122">
                        <line className="base" x1="0" y1="108" x2="360" y2="108" />
                        <path className="area" d="M6 88 C90 84, 150 70, 210 50 C260 36, 310 26, 352 20 L352 108 L6 108 Z" />
                        <path className="sig" d="M6 88 C90 84, 150 70, 210 50 C260 36, 310 26, 352 20" />
                        <circle className="mk" cx="6" cy="88" r="4" />
                        <circle className="mk" cx="180" cy="59" r="4" />
                        <circle className="mk" cx="352" cy="20" r="5" />
                      </svg>
                      <div className="steps">
                        <span className="st done">Offer</span>
                        <span className="st done">Notice period</span>
                        <span className="st now">Day one</span>
                      </div>
                    </div>
                  </div>
                  <div className="vfoot"><span className="ok">Tracked to day one</span><span>Intent 0.91</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ONE SCORE ═══ */}
      <section id="score" ref={scoreRef}>
        <div className="wrap">
          <div className="shead rv"><h2>The answers meet in one score.</h2></div>
          <div className="converge rv">
            <div className="reads">
              {([["Capability Score", "0.96", "96%"], ["Fit Score", "0.93", "93%"], ["Intent Score", "0.91", "91%"]] as const).map(([label, v, w]) => (
                <div className="read" key={label}>
                  <div className="rl"><span>{label}</span><span className="v">{v}</span></div>
                  <div className="tr"><div className="fl" style={{ "--w": w } as React.CSSProperties} /></div>
                </div>
              ))}
            </div>
            <div className="clines" aria-hidden="true">
              <svg viewBox="0 0 150 320">
                <path d="M0 55 C60 55, 90 160, 148 160" />
                <path d="M0 160 L148 160" />
                <path d="M0 265 C60 265, 90 160, 148 160" />
                <path className="pulse" d="M0 55 C60 55, 90 160, 148 160" />
                <path className="pulse" style={{ animationDelay: ".7s" }} d="M0 160 L148 160" />
                <path className="pulse" style={{ animationDelay: "1.4s" }} d="M0 265 C60 265, 90 160, 148 160" />
              </svg>
            </div>
            <div className="hexgauge">
              <svg viewBox="-120 -120 240 240" aria-hidden="true">
                <path className="hex-bg" d="M0 -100 L86.6 -50 L86.6 50 L0 100 L-86.6 50 L-86.6 -50 Z" />
                <path className="hex-fg" d="M0 -100 L86.6 -50 L86.6 50 L0 100 L-86.6 50 L-86.6 -50 Z" />
              </svg>
              <div className="hexval">
                <span className="num">{score}</span>
                <span className="lab">Match Score</span>
              </div>
            </div>
          </div>
          <p className="scap rv">Scored for this person, in this role.</p>
        </div>
      </section>

      {/* ═══ THE MACHINERY ═══ */}
      <section id="machine" ref={machineRef}>
        <div className="grid-bg" />
        <div className="wrap" style={{ position: "relative" }}>
          <div className="rv">
            <h2>The machinery behind the matching.</h2>
            <p className="lede">From the first conversation to day one.</p>
          </div>
          <div className="spine rv" aria-hidden="true">
            {STAGE_POS.map(left => <span className="nd" key={left} style={{ left }} />)}
            <span className="sdot" />
          </div>
          <div className="scols rv">
            <div className="scol">
              <div className="shead2">
                <span className="lt">A</span>
                <span><span className="sn">Context Capture</span><span className="ss">the role, understood</span></span>
              </div>
              <div className="sitem">
                <div className="in1">Role Brief <span className="tag">AI + Human</span></div>
                <p>The role from one conversation: team, product, where the friction sits.</p>
              </div>
            </div>
            <div className="scol">
              <div className="shead2">
                <span className="lt">B</span>
                <span><span className="sn">Sourcing</span><span className="ss">the right people, found</span></span>
              </div>
              <div className="sitem">
                <div className="in1">Warm Network <span className="tag">Human</span></div>
                <p>First degree and second degree. High trust.</p>
              </div>
              <div className="sitem">
                <div className="in1">Agentic Headhunting <span className="tag">AI</span></div>
                <p>The right shape of person, found even when they're not looking.</p>
              </div>
              <div className="sitem">
                <div className="in1">Recruiter Network <span className="tag">Human</span></div>
                <p>Specialist recruiters, plugged into the system.</p>
              </div>
            </div>
            <div className="scol">
              <div className="shead2">
                <span className="lt">C</span>
                <span><span className="sn">Screening</span><span className="ss">the person, assessed</span></span>
              </div>
              <div className="sitem">
                <div className="in1">Role-calibrated Assessments <span className="tag">AI</span></div>
                <p>System design, debugging, judgment, code quality.</p>
              </div>
              <div className="sitem">
                <div className="in1">Tech Interviews <span className="tag">Human</span></div>
                <p>Run live by engineers who ship in the same domain.</p>
              </div>
            </div>
            <div className="scol">
              <div className="shead2">
                <span className="lt">D</span>
                <span><span className="sn">Joining</span><span className="ss">the last mile, held</span></span>
              </div>
              <div className="sitem">
                <div className="in1">Intent Tracking <span className="tag">AI + Human</span></div>
                <p>Joining intent, tracked from offer to day one.</p>
              </div>
              <div className="sitem">
                <div className="in1">Early Warning <span className="tag">AI + Human</span></div>
                <p>If intent shifts, you know first.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE TWO DOORS ═══ */}
      <section id="begin">
        <div className="wrap">
          <div className="rv" style={{ textAlign: "center" }}><h2>Get Started.</h2></div>
          <div className="doors">
            <div className="door door-1 rv">
              <h3>Need the hire.</h3>
              <p>Brief us the role. The system takes it from there.</p>
              <div className="act">
                <button className="btn" onClick={cta("companies_door_hire")}>
                  Find me a great hire <span className="ar">→</span>
                </button>
              </div>
            </div>
            <div className="door door-2 rv">
              <h3>The offer is out.</h3>
              <p>Know whether this candidate will join, before you plan around them.</p>
              <div className="act">
                <button className="btn-ghost" onClick={cta("companies_door_intent")}>
                  Will they join? <span className="ar">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
