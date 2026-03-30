import React, { useState, useEffect, useRef } from "react";
import { FadeSection } from "./shared";
import { trackEvent } from "../../lib/analytics";

// ═══ DESIGN TOKENS (matching engineers page) ═══
const V = {
  bg: "#F4F8F5",
  surface: "#FFFFFF",
  sage: "#3A6B4C",
  sageHover: "#2E5540",
  sagePale: "#EDF4EF",
  sageTint: "#DFF0E5",
  sageMid: "#5A8F6E",
  ink: "#1A2420",
  body: "#2D3D36",
  subtitle: "#6B7D74",
  muted: "#A8B8B0",
  border: "#D8E6DC",
  dark: "#1A2420",
};

const font = {
  body: "'DM Sans', sans-serif",
  heading: "'Bricolage Grotesque', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Shared styles
const eyebrow: React.CSSProperties = {
  fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
  textTransform: "uppercase", marginBottom: 20, lineHeight: 1,
};

// ═══ SCROLL FADE-IN (local, matching engineers page) ═══
function FadeIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ═══ HERO AURORA ═══
function HeroAurora() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "30%", left: "35%", width: 600, height: 500, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(58,107,76,0.25) 0%, rgba(58,107,76,0.06) 50%, transparent 70%)",
        filter: "blur(80px)", animation: "auroraC1 18s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", top: "25%", left: "55%", width: 500, height: 450, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(90,143,110,0.20) 0%, rgba(90,143,110,0.04) 50%, transparent 70%)",
        filter: "blur(70px)", animation: "auroraC2 22s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "45%", width: 450, height: 400, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(14,165,165,0.10) 0%, rgba(14,165,165,0.02) 50%, transparent 70%)",
        filter: "blur(90px)", animation: "auroraC3 25s ease-in-out infinite alternate",
      }} />
    </div>
  );
}

// ═══ SVG VISUALS FOR EACH LENS ═══
function CommitGraph() {
  return (
    <svg width="100%" height="100" viewBox="0 0 200 100" fill="none">
      {/* Git commit line */}
      <line x1="30" y1="50" x2="170" y2="50" stroke="rgba(90,143,110,0.15)" strokeWidth="1.5" />
      {/* Commits */}
      {[40, 75, 105, 130, 160].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="50" r={i === 2 ? 6 : 4} fill="none" stroke={V.sageMid} strokeWidth="1.5" opacity={0.4 + i * 0.12} />
          {i === 2 && <circle cx={x} cy="50" r="2.5" fill={V.sageMid} opacity="0.8" />}
        </g>
      ))}
      {/* Branch */}
      <path d="M75 50 Q85 28 105 28" stroke="rgba(90,143,110,0.25)" strokeWidth="1.5" fill="none" />
      <circle cx="105" cy="28" r="3" fill="none" stroke={V.sageMid} strokeWidth="1.5" opacity="0.35" />
      <path d="M105 28 Q120 28 130 50" stroke="rgba(90,143,110,0.25)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function SystemNodes() {
  return (
    <svg width="100%" height="100" viewBox="0 0 200 100" fill="none">
      {/* Central node */}
      <rect x="80" y="30" width="40" height="40" rx="8" stroke={V.sageMid} strokeWidth="1.5" opacity="0.5" />
      <rect x="88" y="38" width="24" height="24" rx="4" stroke={V.sageMid} strokeWidth="1" opacity="0.25" />
      {/* Connected nodes */}
      <line x1="80" y1="50" x2="35" y2="35" stroke="rgba(90,143,110,0.2)" strokeWidth="1" />
      <circle cx="30" cy="32" r="8" stroke={V.sageMid} strokeWidth="1.5" opacity="0.3" />
      <line x1="120" y1="50" x2="165" y2="35" stroke="rgba(90,143,110,0.2)" strokeWidth="1" />
      <circle cx="170" cy="32" r="8" stroke={V.sageMid} strokeWidth="1.5" opacity="0.3" />
      <line x1="100" y1="70" x2="100" y2="90" stroke="rgba(90,143,110,0.2)" strokeWidth="1" />
      <circle cx="100" cy="95" r="5" stroke={V.sageMid} strokeWidth="1.5" opacity="0.3" />
      {/* Decision arrow */}
      <path d="M35 40 L30 35 L25 40" stroke={V.sageMid} strokeWidth="1" opacity="0.4" fill="none" />
    </svg>
  );
}

function DebugTrace() {
  return (
    <svg width="100%" height="100" viewBox="0 0 200 100" fill="none">
      {/* Narrowing funnel lines */}
      <path d="M20 20 L100 50" stroke="rgba(90,143,110,0.12)" strokeWidth="1" />
      <path d="M180 15 L100 50" stroke="rgba(90,143,110,0.12)" strokeWidth="1" />
      <path d="M15 80 L100 50" stroke="rgba(90,143,110,0.12)" strokeWidth="1" />
      <path d="M185 85 L100 50" stroke="rgba(90,143,110,0.12)" strokeWidth="1" />
      {/* Search rings */}
      <circle cx="100" cy="50" r="24" stroke={V.sageMid} strokeWidth="1.5" opacity="0.2" />
      <circle cx="100" cy="50" r="14" stroke={V.sageMid} strokeWidth="1.5" opacity="0.35" />
      <circle cx="100" cy="50" r="5" fill={V.sageMid} opacity="0.5" />
      {/* Cross markers on eliminated paths */}
      <g opacity="0.2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
        <line x1="38" y1="28" x2="44" y2="34" /><line x1="44" y1="28" x2="38" y2="34" />
        <line x1="158" y1="72" x2="164" y2="78" /><line x1="164" y1="72" x2="158" y2="78" />
      </g>
    </svg>
  );
}

function AICollab() {
  return (
    <svg width="100%" height="100" viewBox="0 0 200 100" fill="none">
      {/* Human bracket */}
      <path d="M50 25 L35 25 L35 75 L50 75" stroke={V.sageMid} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <text x="42" y="54" fontFamily="'JetBrains Mono'" fontSize="9" fill={V.sageMid} opacity="0.5">you</text>
      {/* AI bracket */}
      <path d="M150 25 L165 25 L165 75 L150 75" stroke={V.sageMid} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <text x="148" y="54" fontFamily="'JetBrains Mono'" fontSize="9" fill={V.sageMid} opacity="0.5" textAnchor="end">ai</text>
      {/* Connection / flow between */}
      <line x1="65" y1="40" x2="135" y2="40" stroke="rgba(90,143,110,0.15)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="65" y1="55" x2="135" y2="55" stroke="rgba(90,143,110,0.25)" strokeWidth="1.5" />
      {/* Merge point */}
      <circle cx="100" cy="55" r="4" fill={V.sageMid} opacity="0.45" />
      <circle cx="100" cy="55" r="8" stroke={V.sageMid} strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

function TeamScenario() {
  return (
    <svg width="100%" height="100" viewBox="0 0 200 100" fill="none">
      {/* PR / merge conflict visual */}
      {/* Your branch */}
      <line x1="20" y1="35" x2="85" y2="35" stroke="rgba(90,143,110,0.3)" strokeWidth="1.5" />
      <text x="20" y="28" fontFamily="'JetBrains Mono'" fontSize="7" fill="rgba(255,255,255,0.2)">your-branch</text>
      {/* Their branch */}
      <line x1="20" y1="65" x2="85" y2="65" stroke="rgba(90,143,110,0.3)" strokeWidth="1.5" />
      <text x="20" y="58" fontFamily="'JetBrains Mono'" fontSize="7" fill="rgba(255,255,255,0.2)">teammate</text>
      {/* Commits on each */}
      <circle cx="45" cy="35" r="3" fill={V.sageMid} opacity="0.4" />
      <circle cx="70" cy="35" r="3" fill={V.sageMid} opacity="0.5" />
      <circle cx="55" cy="65" r="3" fill={V.sageMid} opacity="0.4" />
      <circle cx="75" cy="65" r="3" fill={V.sageMid} opacity="0.5" />
      {/* Conflict zone */}
      <rect x="82" y="25" width="36" height="50" rx="6" stroke="rgba(255,180,100,0.3)" strokeWidth="1" strokeDasharray="3 3" fill="rgba(255,180,100,0.03)" />
      <text x="100" y="52" fontFamily="'JetBrains Mono'" fontSize="7" fill="rgba(255,180,100,0.4)" textAnchor="middle">conflict</text>
      {/* Resolution — merged line */}
      <path d="M118 35 Q130 35 135 50 Q130 65 118 65" stroke="rgba(90,143,110,0.2)" strokeWidth="1" fill="none" />
      <line x1="135" y1="50" x2="180" y2="50" stroke={V.sageMid} strokeWidth="1.5" opacity="0.5" />
      <circle cx="180" cy="50" r="4" fill={V.sageMid} opacity="0.5" />
      {/* Resolved checkmark */}
      <path d="M176 49 L179 52 L184 47" stroke="#fff" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CulturePulse() {
  return (
    <svg width="100%" height="100" viewBox="0 0 200 100" fill="none">
      {/* Team members as nodes */}
      <circle cx="60" cy="40" r="10" stroke={V.sageMid} strokeWidth="1.5" opacity="0.4" />
      <circle cx="60" cy="37" r="3.5" fill={V.sageMid} opacity="0.3" />
      <path d="M53 47 Q60 52 67 47" stroke={V.sageMid} strokeWidth="1" opacity="0.3" fill="none" />

      <circle cx="140" cy="40" r="10" stroke={V.sageMid} strokeWidth="1.5" opacity="0.4" />
      <circle cx="140" cy="37" r="3.5" fill={V.sageMid} opacity="0.3" />
      <path d="M133 47 Q140 52 147 47" stroke={V.sageMid} strokeWidth="1" opacity="0.3" fill="none" />

      <circle cx="100" cy="75" r="10" stroke={V.sageMid} strokeWidth="1.5" opacity="0.5" />
      <circle cx="100" cy="72" r="3.5" fill={V.sageMid} opacity="0.4" />
      <path d="M93 82 Q100 87 107 82" stroke={V.sageMid} strokeWidth="1" opacity="0.4" fill="none" />

      {/* Bi-directional feedback arrows */}
      <line x1="72" y1="44" x2="88" y2="68" stroke="rgba(90,143,110,0.25)" strokeWidth="1.5" />
      <line x1="128" y1="44" x2="112" y2="68" stroke="rgba(90,143,110,0.25)" strokeWidth="1.5" />
      <line x1="73" y1="38" x2="127" y2="38" stroke="rgba(90,143,110,0.25)" strokeWidth="1.5" />

      {/* Feedback loop arrows */}
      <path d="M76 36 L73 38 L76 40" stroke={V.sageMid} strokeWidth="1" opacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M124 36 L127 38 L124 40" stroke={V.sageMid} strokeWidth="1" opacity="0.4" fill="none" strokeLinecap="round" />

      {/* Small signal dots showing active collaboration */}
      <circle cx="85" cy="54" r="2" fill={V.sageMid} opacity="0.35" />
      <circle cx="115" cy="54" r="2" fill={V.sageMid} opacity="0.35" />
      <circle cx="100" cy="36" r="2" fill={V.sageMid} opacity="0.35" />
    </svg>
  );
}

// ═══ LENS CARD (glass + visual) ═══
function LensCard({ num, title, desc, visual }: { num: string; title: string; desc: string; visual: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 20, padding: "32px 28px 28px",
      display: "flex", flexDirection: "column",
      transition: "border-color 400ms, background 400ms, transform 400ms",
      cursor: "default",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(90,143,110,0.25)";
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Visual */}
      <div style={{ marginBottom: 24, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {visual}
      </div>
      {/* Number */}
      <span style={{
        fontFamily: font.mono, fontSize: 11, fontWeight: 400, letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.2)", marginBottom: 12,
      }}>{num}</span>
      <p style={{ fontFamily: font.heading, fontSize: 17, fontWeight: 600, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>{title}</p>
      <p style={{ fontFamily: font.body, fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

// ═══ COMPANIES PAGE ═══
export function CompaniesPage({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <div style={{ fontFamily: font.body, color: V.ink }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auroraC1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(50px,-30px) scale(1.12); } }
        @keyframes auroraC2 { 0% { transform: translate(0,0) scale(1.1); } 100% { transform: translate(-60px,20px) scale(0.92); } }
        @keyframes auroraC3 { 0% { transform: translate(0,0) scale(0.95); } 100% { transform: translate(30px,-40px) scale(1.15); } }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", background: V.dark,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <HeroAurora />
        <div style={{ position: "relative", maxWidth: 780, textAlign: "center" }}>
          <p style={{
            ...eyebrow, color: V.sageMid, marginBottom: 32,
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 100ms both",
          }}>
            WALNUTT FOR COMPANIES
          </p>
          <h1 style={{
            fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(36px, 5vw, 64px)",
            letterSpacing: "-0.03em", lineHeight: 1.12, color: "#fff", margin: "0 0 28px",
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 200ms both",
          }}>
            The hiring infrastructure<br />
            your engineering team{" "}
            <span style={{ color: V.sageMid, fontStyle: "italic" }}>deserves</span>
          </h1>
          <p style={{
            fontFamily: font.body, fontWeight: 400, fontSize: "clamp(17px, 2vw, 20px)",
            lineHeight: 1.7, color: "rgba(255,255,255,0.5)", maxWidth: 580, margin: "0 auto",
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 400ms both",
          }}>
            So you stop running a hiring process and start meeting engineers who are ready to build with you.
          </p>
        </div>
      </section>

      {/* ═══ SECTION 1: WHAT YOU'RE REALLY LOOKING FOR ═══ */}
      <section style={{ background: V.bg, padding: "100px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <p style={{ ...eyebrow, color: V.sage }}>WHAT YOU'RE REALLY LOOKING FOR</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 style={{
              fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em", lineHeight: 1.15, color: V.ink, margin: "0 0 28px",
            }}>
              You know the engineer you need{" "}
              <span style={{ color: V.subtitle }}>Finding them is the{" "}
                <span style={{ fontStyle: "italic", color: V.sage }}>hard part</span>
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p style={{
              fontFamily: font.body, fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 400,
              color: V.body, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 20px",
            }}>
              You already know what great looks like. Thinks in systems. Debugs with instinct. Builds with AI. Elevates the team.{" "}
              <span style={{ color: V.sage, fontWeight: 500 }}>That's who we find.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ SECTION 2: THE WALNUTT EXPERIENCE ═══ */}
      <section style={{ background: V.dark, padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <p style={{ ...eyebrow, color: V.sageMid }}>HOW WE DO IT — THE WALNUTT EXPERIENCE</p>
              <h2 style={{
                fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: "-0.03em", lineHeight: 1.15, color: "#fff", margin: 0,
              }}>
                More depth. More clarity.{" "}
                <span style={{ fontStyle: "italic", color: V.sageMid }}>Better hires</span>
              </h2>
            </div>
          </FadeIn>

          {/* Engineering Depth — 2x2 glass cards */}
          <FadeIn delay={100}>
            <p style={{
              fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
              textTransform: "uppercase", color: V.sageMid, marginBottom: 24, textAlign: "center",
            }}>
              ENGINEERING DEPTH
            </p>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}>
              <LensCard num="01" title="What they've built" desc="Their projects, their commits, their architectural choices over time." visual={<CommitGraph />} />
              <LensCard num="02" title="How they think" desc="System design problems with no right answer. We see what they prioritize." visual={<SystemNodes />} />
              <LensCard num="03" title="How they debug" desc="Something's broken. We watch how they narrow the search space." visual={<DebugTrace />} />
              <LensCard num="04" title="How they code with AI" desc="Whether they use AI as a lever or a crutch." visual={<AICollab />} />
            </div>
          </FadeIn>

          {/* Beyond The Code — 2 cards */}
          <FadeIn delay={200} style={{ marginTop: 48 }}>
            <p style={{
              fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
              textTransform: "uppercase", color: V.sageMid, marginBottom: 24, textAlign: "center",
            }}>
              BEYOND THE CODE
            </p>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}>
              <LensCard num="05" title="How they'd act on your team" desc="Real engineering scenarios: conflicting PRs, production bugs, pushing back on decisions." visual={<TeamScenario />} />
              <LensCard num="06" title="Culture & mindset" desc="How they collaborate, take feedback, and fit into a team's rhythm." visual={<CulturePulse />} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ SECTION 3: HIRE NOW PAY LATER ═══ */}
      <section style={{ background: V.bg, padding: "100px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <FadeSection>
            <p style={{ ...eyebrow, color: V.sage }}>HIRE NOW PAY LATER</p>
            <h2 style={{
              fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em", lineHeight: 1.15, color: V.ink, margin: "0 0 28px",
            }}>
              We don't get paid<br />
              unless it{" "}
              <span style={{ fontStyle: "italic", color: V.sage }}>works</span>
            </h2>
            <p style={{
              fontFamily: font.body, fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 400,
              color: V.body, lineHeight: 1.7, maxWidth: 560, margin: "0 auto",
            }}>
              Zero upfront fees. You pay monthly over 12 months, starting 30 days after the engineer joins. If it doesn't work out, we stop earning. Simple.
            </p>
          </FadeSection>
        </div>
      </section>

      {/* ═══ SECTION 4: CTA ═══ */}
      <section id="company-cta" style={{ background: V.dark, padding: "120px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <FadeSection>
            <p style={{
              fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
              textTransform: "uppercase", color: V.sageMid, marginBottom: 24,
            }}>
              WALNUTT WITH YOU FROM DAY 1 TO DAY 1000 AND BEYOND
            </p>
            <h2 style={{
              fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(32px, 4.5vw, 52px)",
              letterSpacing: "-0.03em", lineHeight: 1.12, color: "#fff", margin: "0 0 24px",
            }}>
              For the ones building{" "}
              <span style={{ fontStyle: "italic", color: V.sageMid }}>teams that last</span>
            </h2>
            <p style={{
              fontFamily: font.body, fontWeight: 300, fontSize: "clamp(17px, 2vw, 20px)",
              color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              maxWidth: 560, margin: "0 auto 44px",
            }}>
              Great companies are built on great teams. The first five engineers set the culture. Every hire after shapes how far it goes.
            </p>
            <button onClick={() => { trackEvent("cta_clicked_companies_connect", { location: "companies_close" }); onOpenForm(); }} style={{
              fontFamily: font.body, fontSize: 16, fontWeight: 600, color: V.dark,
              background: "#fff", padding: "16px 40px", borderRadius: 30, border: "none",
              cursor: "pointer", transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = V.sagePale; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,255,255,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Connect with us →
            </button>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}
