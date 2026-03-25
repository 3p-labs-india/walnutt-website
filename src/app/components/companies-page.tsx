import React, { useState, useEffect, useRef } from "react";
import { FadeSection } from "./shared";
import { trackEvent } from "../../lib/analytics";

// ═══ DESIGN TOKENS ═══
const V = {
  dark: "#1A2420",
  sage: "#3A6B4C",
  sageMid: "#5A8F6E",
  sagePale: "#EDF4EF",
  ink: "#1A2420",
  body: "#2D3D36",
  subtitle: "#6B7D74",
  muted: "#A8B8B0",
  border: "#D8E6DC",
  bg: "#F4F8F5",
  surface: "#FFFFFF",
};

const font = {
  serif: "'Fraunces', serif",
  body: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Shared eyebrow style
const eyebrow: React.CSSProperties = {
  fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
  textTransform: "uppercase", marginBottom: 20, lineHeight: 1,
};

// Shared H2 style
const h2Style: React.CSSProperties = {
  fontFamily: font.serif, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0,
};

// Shared body style
const bodyText: React.CSSProperties = {
  fontFamily: font.body, fontSize: 17, lineHeight: 1.75, margin: 0,
};

// ═══ CYCLING PERSONA ═══
const personas = [
  "Founders making their first engineering hire",
  "CTOs scaling a platform",
  "Engineering managers protecting their team's DNA",
  "Talent leaders who want signal, not noise",
];

function CyclingPersona() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(p => (p + 1) % personas.length);
        setVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ height: 28, overflow: "hidden", marginBottom: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{
        fontFamily: font.body, fontSize: 15, fontWeight: 500, letterSpacing: "0.03em",
        color: V.sageMid, margin: 0,
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease",
      }}>
        {personas[idx]}
      </p>
    </div>
  );
}

// ═══ HERO TYPEWRITER ═══
const heroLine1 = "No upfront fees. We earn our place on your team the same way your engineer does. ";
const heroLine2 = "One month at a time.";
const fullHeroText = heroLine1 + heroLine2;

function HeroTypewriter() {
  const [charCount, setCharCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCharCount(prev => {
          if (prev >= fullHeroText.length) { clearInterval(interval); return prev; }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timeout);
  }, [visible]);

  const shown = fullHeroText.slice(0, charCount);

  return (
    <div ref={ref} style={{ maxWidth: 580, margin: "0 auto", minHeight: 60 }}>
      <p style={{
        fontFamily: font.body, fontWeight: 400, fontSize: "clamp(18px, 2.2vw, 22px)",
        lineHeight: 1.7, margin: 0, textAlign: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{shown.slice(0, heroLine1.length)}</span>
        <span style={{ color: V.sageMid, fontWeight: 500 }}>{shown.slice(heroLine1.length)}</span>
        {charCount < fullHeroText.length && charCount > 0 && (
          <span style={{ display: "inline-block", width: 2, height: 20, background: V.sageMid, marginLeft: 2, animation: "blink 1s step-end infinite", verticalAlign: "text-bottom" }} />
        )}
      </p>
    </div>
  );
}

// ═══ COMPANIES PAGE ═══
export function CompaniesPage({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <div style={{ fontFamily: font.body, color: V.ink }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
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
        {/* Aurora */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "30%", left: "35%", width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(58,107,76,0.25) 0%, rgba(58,107,76,0.06) 50%, transparent 70%)", filter: "blur(80px)", animation: "auroraC1 18s ease-in-out infinite alternate" }} />
          <div style={{ position: "absolute", top: "25%", left: "55%", width: 500, height: 450, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(90,143,110,0.20) 0%, rgba(90,143,110,0.04) 50%, transparent 70%)", filter: "blur(70px)", animation: "auroraC2 22s ease-in-out infinite alternate" }} />
          <div style={{ position: "absolute", top: "50%", left: "45%", width: 450, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(14,165,165,0.10) 0%, rgba(14,165,165,0.02) 50%, transparent 70%)", filter: "blur(90px)", animation: "auroraC3 25s ease-in-out infinite alternate" }} />
        </div>

        <div style={{ position: "relative", maxWidth: 780, textAlign: "center" }}>
          <p style={{ ...eyebrow, color: V.sageMid, marginBottom: 28, animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 100ms both" }}>
            WALNUTT FOR COMPANIES
          </p>
          <h1 style={{
            fontFamily: font.serif, fontWeight: 600, fontSize: "clamp(36px, 5vw, 64px)",
            letterSpacing: "-0.02em", lineHeight: 1.12, color: "#fff", marginBottom: 28,
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 200ms both",
          }}>
            Hire now.<br /><span style={{ color: V.sageMid, fontStyle: "italic" }}>Pay later.</span>
          </h1>
          <HeroTypewriter />
        </div>
      </section>

      {/* ═══ THE INDICTMENT ═══ */}
      <section style={{ background: V.bg, padding: "100px 24px" }} className="md:px-12">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeSection>
            <p style={{ ...eyebrow, color: V.sage }}>THE BROKEN CONTRACT</p>
            <h2 style={{ ...h2Style, fontSize: "clamp(26px, 3.5vw, 38px)", color: V.ink, marginBottom: 28 }}>
              Placement closed. Invoice sent.{" "}
              <span style={{ color: V.subtitle }}>What happened next was your problem.</span>
            </h2>
            <p style={{
              fontFamily: font.serif, fontSize: "clamp(19px, 2.5vw, 24px)", fontWeight: 400,
              color: V.body, lineHeight: 1.6, letterSpacing: "-0.01em", marginBottom: 0,
            }}>
              You paid 10-15% of annual CTC before the engineer wrote a single line of code. Industry data shows nearly 1 in 3 tech hires leave within the first year. When yours did, the agency offered a "replacement guarantee" that restarted the same process that failed the first time.{" "}
              <span style={{ color: V.muted }}>That's not accountability. That's a refund policy disguised as confidence.</span>
            </p>
            <div style={{ width: 40, height: 2, background: V.border, margin: "32px 0" }} />
            <p style={{
              fontFamily: font.serif, fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 400,
              fontStyle: "italic", color: V.subtitle, lineHeight: 1.6, margin: 0,
            }}>
              The real cost was never the fee. It was the six months you lost before realizing the hire wasn't right. Nobody in hiring had skin in that game, until now.
            </p>
          </FadeSection>
        </div>
      </section>

      {/* ═══ THE INVERSION ═══ */}
      <section style={{ background: V.surface, padding: "100px 24px" }} className="md:px-12">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeSection>
            <p style={{ ...eyebrow, color: V.sage }}>WHAT WE CHANGED</p>
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)", color: V.ink, marginBottom: 32 }}>
              Our revenue depends on getting it{" "}
              <span style={{ fontStyle: "italic", color: V.sage }}>right</span>. Not getting it done.
            </h2>
            <p style={{
              fontFamily: font.serif, fontSize: "clamp(19px, 2.5vw, 24px)", fontWeight: 400,
              color: V.body, lineHeight: 1.6, letterSpacing: "-0.01em", margin: 0,
            }}>
              You pay nothing upfront. Zero. We find the match, you hire, and you pay in small monthly installments over 12 months. Your first payment starts only after the engineer has been in the seat for 30 days.{" "}
              <span style={{ color: V.sage, fontWeight: 500 }}>If the hire doesn't work out, we stop getting paid.</span>
            </p>
            <div style={{ width: 40, height: 2, background: V.border, margin: "32px 0" }} />
            <p style={{
              fontFamily: font.serif, fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 400,
              fontStyle: "italic", color: V.sage, lineHeight: 1.6, margin: 0,
            }}>
              When your success is our revenue model, retention stops being a hope and starts being a business imperative.
            </p>
          </FadeSection>
        </div>
      </section>

      {/* ═══ THE DEPTH ═══ */}
      <section style={{ background: V.bg, padding: "100px 24px" }} className="md:px-12">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeSection>
            <p style={{ ...eyebrow, color: V.sage }}>THE WALNUTT WAY</p>
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 44px)", color: V.ink, marginBottom: 32 }}>
              Skin in the game.{" "}
              <span style={{ fontStyle: "italic", color: V.sage }}>If you win, we win.</span>
            </h2>
            <p style={{
              fontFamily: font.serif, fontSize: "clamp(19px, 2.5vw, 24px)", fontWeight: 400,
              color: V.body, lineHeight: 1.6, letterSpacing: "-0.01em", margin: 0,
            }}>
              Our system maps your team's technical DNA and culture, then matches it against deeply assessed engineers. But here's what makes us different: we spread our fee over 12 months. If the match doesn't hold, we stop earning.{" "}
              <span style={{ color: V.sage, fontWeight: 500 }}>That's it. You hire. We stay accountable.</span>
            </p>
            <div style={{ width: 40, height: 2, background: V.border, margin: "32px 0" }} />
            <p style={{
              fontFamily: font.serif, fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 400,
              fontStyle: "italic", color: V.sage, lineHeight: 1.6, margin: 0,
            }}>
              We built Walnutt to be the best matchmaker in tech. And to back it up, we put our revenue on the line.
            </p>
          </FadeSection>
        </div>
      </section>

      {/* ═══ THE INVITATION + CTA ═══ */}
      <section id="company-cta" style={{ background: V.dark, padding: "120px 24px" }} className="md:px-12">
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <FadeSection>
            <p style={{
              fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
              textTransform: "uppercase", color: V.sageMid, marginBottom: 24,
            }}>
              Walnutt with you from Day 1 to Day 1000 and beyond
            </p>

            <h2 style={{
              ...h2Style, fontSize: "clamp(32px, 4.5vw, 48px)",
              color: "#fff", marginBottom: 28,
            }}>
              For the ones building{" "}
              <span style={{ fontStyle: "italic", color: V.sageMid }}>teams that last</span>.
            </h2>

            <p style={{
              fontFamily: font.body, fontWeight: 300, fontSize: "clamp(17px, 2vw, 20px)",
              color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              maxWidth: 560, margin: "0 auto 44px",
            }}>
              Great companies are built on great teams. The first five engineers set the culture. The next fifty scale it. One wrong hire changes the trajectory.
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
