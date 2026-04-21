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
  borderLight: "#E8F0EB",
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

// ═══ TIMELINE STEP (centered, animated dot + progressive connector) ═══
function Step({
  num, title, text, tag, isFinal = false, isLast = false,
}: {
  num: string; title: string; text: string; tag: string; isFinal?: boolean; isLast?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setActive(true); obs.disconnect(); }
    }, { threshold: 0.35, rootMargin: "0px 0px -60px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const DOT = 56;
  const RAIL = 80;

  return (
    <div ref={ref} className="step-timeline" style={{
      position: "relative",
      display: "grid", gridTemplateColumns: `${RAIL}px 1fr`,
      columnGap: 24,
      paddingBottom: isLast ? 0 : 64,
    }}>
      {/* Rail column — dot + connector line below */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        {!isLast && (
          <div style={{
            position: "absolute", left: "50%", top: DOT,
            transform: "translateX(-50%)",
            width: 2, height: `calc(100% - ${DOT}px + 16px)`,
            background: V.border, borderRadius: 2, overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%",
              height: active ? "100%" : "0%",
              background: `linear-gradient(to bottom, ${V.sage}, ${V.sageMid})`,
              transition: "height 1400ms cubic-bezier(0.16,1,0.3,1) 350ms",
            }} />
          </div>
        )}

        <div style={{
          position: "relative", zIndex: 2,
          width: DOT, height: DOT, borderRadius: "50%",
          background: active ? V.sage : V.surface,
          border: `2px solid ${active ? V.sage : V.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: font.heading, fontSize: 18, fontWeight: 700,
          color: active ? "#fff" : V.muted,
          transition: "background 500ms cubic-bezier(0.16,1,0.3,1), border-color 500ms cubic-bezier(0.16,1,0.3,1), color 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)",
          transform: active ? "scale(1)" : "scale(0.9)",
          boxShadow: active ? "0 10px 28px rgba(58,107,76,0.25)" : "0 4px 12px rgba(26,36,32,0.04)",
          flexShrink: 0,
        }}>
          {active && (
            <>
              <span style={{
                position: "absolute", inset: -6, borderRadius: "50%",
                border: `2px solid ${V.sage}`, opacity: 0,
                animation: "pulseRing 1.6s cubic-bezier(0.16,1,0.3,1) 200ms 1",
              }} />
              <span style={{
                position: "absolute", inset: -12, borderRadius: "50%",
                border: `2px solid ${V.sageMid}`, opacity: 0,
                animation: "pulseRing 1.6s cubic-bezier(0.16,1,0.3,1) 450ms 1",
              }} />
            </>
          )}
          {num}
        </div>
      </div>

      {/* Content column (left-aligned, beside the rail) */}
      <div style={{
        paddingTop: 4, paddingBottom: 4,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 800ms cubic-bezier(0.16,1,0.3,1) 250ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 250ms",
      }}>
        {isFinal ? (
          <div style={{
            background: V.sagePale, borderRadius: 20,
            padding: "28px 32px", border: `1px solid ${V.sageTint}`,
            boxShadow: "0 12px 40px rgba(58,107,76,0.08)",
          }}>
            <p style={{ fontFamily: font.heading, fontSize: 22, fontWeight: 700, color: V.ink, letterSpacing: "-0.02em", margin: "0 0 10px", lineHeight: 1.3 }}>{title}</p>
            <p style={{ fontFamily: font.body, fontSize: 14.5, color: V.body, lineHeight: 1.65, margin: "0 0 16px" }}>{text}</p>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: font.body, fontSize: 13, fontWeight: 600, color: V.sage,
            }}>
              <span style={{ display: "inline-block", width: 16, height: 2, background: V.sage, borderRadius: 1 }} />
              {tag}
            </span>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: font.heading, fontSize: 20, fontWeight: 700, color: V.ink, letterSpacing: "-0.02em", margin: "0 0 10px", lineHeight: 1.3 }}>{title}</p>
            <p style={{ fontFamily: font.body, fontSize: 14.5, color: V.body, lineHeight: 1.65, margin: "0 0 14px", maxWidth: 560 }}>{text}</p>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: font.body, fontSize: 13, fontWeight: 600, color: V.sage,
            }}>
              <span style={{ display: "inline-block", width: 16, height: 2, background: V.sage, borderRadius: 1 }} />
              {tag}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ═══ ENTRY CARD (glass, on dark bg) ═══
function EntryCard({ scenario, response, product }: { scenario: string; response: string; product: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 20, padding: "36px 28px 28px",
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
      <p style={{
        fontFamily: font.heading, fontSize: 17, fontWeight: 600, color: "#fff",
        lineHeight: 1.4, margin: "0 0 20px", minHeight: 50,
      }}>{scenario}</p>
      <div style={{ width: 32, height: 2, background: V.sageMid, borderRadius: 1, marginBottom: 18 }} />
      <p style={{
        fontFamily: font.body, fontSize: 14, color: "rgba(255,255,255,0.5)",
        lineHeight: 1.65, flex: 1, margin: "0 0 24px",
      }}>{response}</p>
      <div style={{
        paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        <span className="product-tag">
          <span className="product-dot" />
          <span className="product-name">{product}</span>
        </span>
      </div>
    </div>
  );
}

// ═══ COMPANIES PAGE ═══
export function CompaniesPage({ onOpenForm }: { onOpenForm: () => void }) {
  const scrollToHow = () => {
    const el = document.getElementById("c-how-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ fontFamily: font.body, color: V.ink }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auroraC1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(50px,-30px) scale(1.12); } }
        @keyframes auroraC2 { 0% { transform: translate(0,0) scale(1.1); } 100% { transform: translate(-60px,20px) scale(0.92); } }
        @keyframes auroraC3 { 0% { transform: translate(0,0) scale(0.95); } 100% { transform: translate(30px,-40px) scale(1.15); } }
        @keyframes pulseRing {
          0% { opacity: 0.9; transform: scale(0.85); }
          100% { opacity: 0; transform: scale(1.55); }
        }
        @keyframes productPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(90,143,110,0.55), 0 0 14px rgba(90,143,110,0.35); transform: scale(1); }
          50% { box-shadow: 0 0 0 7px rgba(90,143,110,0), 0 0 20px rgba(90,143,110,0.65); transform: scale(1.02); }
        }
        @keyframes productDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(90,143,110,0.6), 0 0 8px rgba(90,143,110,0.6); }
          50% { opacity: 0.85; box-shadow: 0 0 0 6px rgba(90,143,110,0), 0 0 14px rgba(90,143,110,0.9); }
        }
        .product-tag {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 14px; border-radius: 100px;
          background: rgba(90,143,110,0.12);
          border: 1px solid rgba(90,143,110,0.4);
          animation: productPulse 2.4s ease-in-out infinite;
        }
        .product-tag .product-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #7FBF94;
          animation: productDot 1.6s ease-in-out infinite;
        }
        .product-tag .product-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 600;
          color: #B8E0C6; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .tax-row:hover td { background: rgba(246,250,247,0.6); }
        @media (max-width: 900px) {
          .entry-grid { grid-template-columns: 1fr !important; }
          .tax-table th, .tax-table td { padding: 14px 18px !important; font-size: 13px !important; }
        }
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
            HIRING INFRASTRUCTURE FOR ENGINEERING TEAMS
          </p>
          <h1 style={{
            fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(36px, 5vw, 64px)",
            letterSpacing: "-0.03em", lineHeight: 1.12, color: "#fff", margin: "0 0 28px",
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 200ms both",
          }}>
            Outgrow the<br />
            hiring <span style={{ color: V.sageMid, fontStyle: "italic" }}>cycle.</span>
          </h1>
          <p style={{
            fontFamily: font.body, fontWeight: 400, fontSize: "clamp(17px, 2vw, 20px)",
            lineHeight: 1.7, color: "rgba(255,255,255,0.5)", maxWidth: 580, margin: "0 auto 40px",
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 400ms both",
          }}>
            The hiring process that also onboards. Built around your actual context. Turning months into days.
          </p>
          <div style={{ animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 500ms both" }}>
            <button onClick={scrollToHow} style={{
              fontFamily: font.body, fontSize: 15, fontWeight: 600, color: "#fff",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              padding: "14px 28px", borderRadius: 30, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 10, transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(90,143,110,0.2)"; e.currentTarget.style.borderColor = V.sageMid; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            >
              See how it works
              <span style={{ fontSize: 16 }}>↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — CENTERED TIMELINE ═══ */}
      <section id="c-how-section" style={{ background: V.bg, padding: "100px 24px 120px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <p style={{ ...eyebrow, color: V.sage }}>THE PROCESS</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 style={{
              fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em", lineHeight: 1.15, color: V.ink,
              margin: "0 auto 72px", textAlign: "center", maxWidth: 560,
            }}>
              The best hires arrive ready.{" "}
              <span style={{ fontStyle: "italic", color: V.sage }}>Here's how.</span>
            </h2>
          </FadeIn>

          <div style={{ position: "relative" }}>
            <Step num="01" title="Build the candidate persona." text="A sharp picture of who you actually need — calibrated to market reality. Half the battle won before the search begins." tag="100x the JD." />
            <Step num="02" title="Find the right people." text="From our pool, your pipeline, or sourced fresh. Matched on real depth — thinking, building, problem-solving. Your team only meets people worth their time." tag="Zero wasted interviews." />
            <Step num="03" title="Assess through real work. Cross-reference everything." text="Challenges built on your actual stack and domain. Claims verified against real output. You see real thinking. They absorb your world. One step, both jobs." tag="Onboarding starts inside the hiring process itself." />
            <Step num="04" title="Notice period. Ramp already running." text="They're learning your systems, conventions, and team dynamics. You see progress in real time. Connection builds before they've officially started." tag="Candidates are invested. Offer dropouts reduced." />
            <Step num="05" title="Day one. They deliver." text={"Not orientation. Not “where’s the wiki.” Real contribution from the first morning."} tag="Day one feels like they were already here." isFinal isLast />
          </div>
        </div>
      </section>

      {/* ═══ ENTRY POINTS ═══ */}
      <section style={{ background: V.dark, padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <p style={{ ...eyebrow, color: V.sageMid }}>ENTRY POINTS</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 style={{
              fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em", lineHeight: 1.15, color: "#fff",
              margin: "0 auto 56px", textAlign: "center", maxWidth: 520,
            }}>
              One system.<br />
              <span style={{ fontStyle: "italic", color: V.sageMid }}>Enter wherever you are.</span>
            </h2>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="entry-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20,
            }}>
              <EntryCard
                scenario={"“We need to hire but the role isn’t clear yet.”"}
                response="Calibrated candidate persona built from real market intel. Who to look for, what the market can deliver, where expectations need adjusting. The search starts right."
                product="Role Blueprint"
              />
              <EntryCard
                scenario={"“We have candidates. Can’t tell who’s real.”"}
                response="Deep conversations across your pipeline — thinking patterns, proof of work, domain depth, cultural wiring. Shortlist with clear reasoning for each. Engineering time protected."
                product="Candidate Signal Layer"
              />
              <EntryCard
                scenario={"“Find us someone great. Ready from day one.”"}
                response="Full cycle — sourcing, deep matching, assessment built on your context, active ramp during notice period. Candidates arrive ready to contribute from week one."
                product="Full Stack Engine"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ HIRING TAX ═══ */}
      <section style={{ background: V.bg, padding: "100px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ ...eyebrow, color: V.sage }}>THE HIRING TAX</p>
              <h2 style={{
                fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: "-0.03em", lineHeight: 1.15, color: V.ink, margin: "0 0 16px",
              }}>
                Stop <span style={{ fontStyle: "italic", color: V.sage }}>paying it.</span>
              </h2>
              <p style={{
                fontFamily: font.body, fontSize: 14, color: V.subtitle,
                maxWidth: 420, lineHeight: 1.55, margin: "0 auto",
              }}>
                Every engineering hire carries a hidden cost. Here's what changes.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div style={{
              background: V.surface, border: `1px solid ${V.border}`, borderRadius: 16,
              overflow: "hidden", marginBottom: 56,
              boxShadow: "0 4px 24px rgba(26,36,32,0.04)",
            }}>
              <table className="tax-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: V.sagePale }}>
                  <tr>
                    <th style={{ textAlign: "left", fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 32px", color: V.subtitle }}></th>
                    <th style={{ textAlign: "left", fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 32px", color: V.muted }}>Industry average</th>
                    <th style={{ textAlign: "left", fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 32px", color: V.sage }}>With Walnutt</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Screening & filtering", "40–60 hours per role", "0 hours. Deep-signal filtered."],
                    ["Engineering interview loops", "35–40 hours wasted", "Your team meets only pre-cleared candidates."],
                    ["Interview-to-offer rate", "~30%", "71%"],
                    ["Time to hire (Offer)", "2–3 months", "~6 days"],
                  ].map(([a, b, c], i) => (
                    <tr key={i} className="tax-row">
                      <td style={{ padding: "18px 32px", fontFamily: font.body, fontSize: 14, color: V.ink, fontWeight: 500, borderTop: `1px solid ${V.borderLight}`, width: "34%", transition: "background 200ms" }}>{a}</td>
                      <td style={{ padding: "18px 32px", fontFamily: font.body, fontSize: 14, color: V.subtitle, borderTop: `1px solid ${V.borderLight}`, width: "30%", transition: "background 200ms" }}>{b}</td>
                      <td style={{ padding: "18px 32px", fontFamily: font.body, fontSize: 14, color: V.sage, fontWeight: 600, borderTop: `1px solid ${V.borderLight}`, width: "36%", transition: "background 200ms" }}>{c}</td>
                    </tr>
                  ))}
                  <tr style={{ background: V.sagePale }}>
                    <td style={{ padding: "22px 32px", fontFamily: font.body, fontSize: 15, color: V.ink, fontWeight: 700, borderTop: `2px solid ${V.border}` }}>Total hiring + onboarding cycle</td>
                    <td style={{ padding: "22px 32px", fontFamily: font.body, fontSize: 15, color: V.subtitle, fontWeight: 600, borderTop: `2px solid ${V.border}` }}>3–4 months</td>
                    <td style={{ padding: "22px 32px", fontFamily: font.body, fontSize: 16, color: V.sage, fontWeight: 700, borderTop: `2px solid ${V.border}` }}>Weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: 32, height: 2, background: V.sage, borderRadius: 1, margin: "0 auto 20px" }} />
              <p style={{
                fontFamily: font.heading, fontSize: 18, fontWeight: 500, color: V.body,
                lineHeight: 1.6, margin: "0 0 12px", fontStyle: "italic",
              }}>
                “The Walnutt conversation told us we’d been hiring for the wrong thing for 2 years.”
              </p>
              <p style={{ fontFamily: font.mono, fontSize: 11, color: V.muted, letterSpacing: "0.08em", margin: 0 }}>
                — FOUNDER, SERIES B STARTUP
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="company-cta" style={{ background: V.dark, padding: "120px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(58,107,76,0.2) 0%, transparent 70%)", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <FadeSection>
            <h2 style={{
              fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(32px, 4.5vw, 52px)",
              letterSpacing: "-0.03em", lineHeight: 1.12, color: "#fff", margin: "0 0 16px",
            }}>
              Let's plan your <span style={{ fontStyle: "italic", color: V.sageMid }}>next hire.</span>
            </h2>
            <p style={{
              fontFamily: font.body, fontWeight: 300, fontSize: "clamp(16px, 2vw, 18px)",
              color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              maxWidth: 520, margin: "0 auto 44px",
            }}>
              One conversation to see what this looks like for your team.
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
