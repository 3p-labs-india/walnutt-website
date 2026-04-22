import React, { useState, useEffect, useRef } from "react";
import { FadeSection } from "./shared";
import { trackEvent } from "../../lib/analytics";

// ═══ DESIGN TOKENS (aligned with companies page) ═══
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

const eyebrow: React.CSSProperties = {
  fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
  textTransform: "uppercase", marginBottom: 20, lineHeight: 1,
};

// ═══ SCROLL FADE-IN ═══
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
        filter: "blur(80px)", animation: "auroraR1 18s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", top: "25%", left: "55%", width: 500, height: 450, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(90,143,110,0.20) 0%, rgba(90,143,110,0.04) 50%, transparent 70%)",
        filter: "blur(70px)", animation: "auroraR2 22s ease-in-out infinite alternate",
      }} />
    </div>
  );
}

// ═══ STEP CARD ═══
function StepCard({ num, label, title, text }: { num: string; label: string; title: string; text: string }) {
  return (
    <div style={{
      background: V.surface, border: `1px solid ${V.border}`, borderRadius: 16,
      padding: "28px 24px 30px", position: "relative", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(26,36,32,0.03)",
      transition: "transform 300ms, border-color 300ms, box-shadow 300ms",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = V.sageTint;
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(58,107,76,0.10)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = V.border;
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,36,32,0.03)";
      }}
    >
      <div style={{
        position: "absolute", top: 20, right: 22,
        fontFamily: font.mono, fontSize: 12, fontWeight: 500,
        color: V.muted, letterSpacing: "0.04em",
      }}>{num}</div>
      <div style={{
        fontFamily: font.mono, fontSize: 10.5, fontWeight: 600,
        color: V.sage, letterSpacing: "0.18em", marginBottom: 14,
      }}>{label}</div>
      <div style={{
        fontFamily: font.heading, fontSize: 17, fontWeight: 600,
        color: V.ink, lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 10,
      }}>{title}</div>
      <div style={{
        fontFamily: font.body, fontSize: 13.5, color: V.body,
        lineHeight: 1.6,
      }}>{text}</div>
    </div>
  );
}

// ═══ VALUE ROW ═══
function ValueRow({ strong, body }: { strong: string; body: string }) {
  return (
    <li style={{
      display: "flex", gap: 14, alignItems: "flex-start",
      fontFamily: font.body, fontSize: 14.5, lineHeight: 1.55,
    }}>
      <span style={{
        fontFamily: font.mono, fontSize: 15, color: V.sage,
        flexShrink: 0, lineHeight: 1.5, fontWeight: 600,
      }}>→</span>
      <span>
        <strong style={{ color: V.ink, fontWeight: 600 }}>{strong}</strong>{" "}
        <span style={{ color: V.body }}>{body}</span>
      </span>
    </li>
  );
}

// ═══ RECRUITERS PAGE ═══
export function RecruitersPage({ onOpenForm }: { onOpenForm: () => void }) {
  const scrollToHow = () => {
    const el = document.getElementById("r-how-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ fontFamily: font.body, color: V.ink }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auroraR1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(50px,-30px) scale(1.12); } }
        @keyframes auroraR2 { 0% { transform: translate(0,0) scale(1.1); } 100% { transform: translate(-60px,20px) scale(0.92); } }
        @media (max-width: 900px) {
          .r-steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 620px) {
          .r-steps-grid { grid-template-columns: 1fr !important; }
          .r-compare-head { grid-template-columns: 1fr !important; }
          .r-compare-head > div:nth-child(2) { display: none !important; }
          .r-compare-head > div:last-child { padding-top: 6px !important; }
          .r-compare-row { grid-template-columns: 1fr !important; }
          .r-compare-row > div:nth-child(1) { padding-bottom: 4px !important; }
          .r-compare-row > div:nth-child(2) {
            transform: rotate(90deg);
            padding: 2px 0 !important;
          }
          .r-compare-row > div:nth-child(3) { padding-top: 4px !important; padding-bottom: 18px !important; }
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", background: V.dark,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <HeroAurora />
        <div style={{ position: "relative", maxWidth: 820, textAlign: "center" }}>
          <p style={{
            ...eyebrow, color: V.sageMid, marginBottom: 32,
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 100ms both",
          }}>
            WALNUTT FOR RECRUITERS & AGENCIES
          </p>
          <h1 style={{
            fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(36px, 5vw, 64px)",
            letterSpacing: "-0.03em", lineHeight: 1.08, color: "#fff", margin: "0 0 32px",
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 200ms both",
          }}>
            <span style={{ color: V.sageMid, fontStyle: "italic" }}>More</span> placements.<br />
            Less of your time.
          </h1>
          <p style={{
            fontFamily: font.heading, fontWeight: 500, fontSize: "clamp(17px, 2vw, 21px)",
            letterSpacing: "-0.01em", lineHeight: 1.4, color: "rgba(255,255,255,0.75)",
            margin: "0 auto 44px", maxWidth: 560,
            animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 400ms both",
          }}>
            You own the client.{" "}
            <span style={{ color: V.sageMid, fontStyle: "italic" }}>We</span> own the pipeline.
          </p>
          <div style={{ animation: "fadeInUp 800ms cubic-bezier(0.16,1,0.3,1) 550ms both" }}>
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

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="r-how-section" style={{ background: V.bg, padding: "100px 24px 120px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <p style={{ ...eyebrow, color: V.sage }}>HOW IT WORKS</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 style={{
              fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em", lineHeight: 1.15, color: V.ink,
              margin: "0 auto 64px", textAlign: "center", maxWidth: 620,
            }}>
              Every candidate you send{" "}
              <span style={{ fontStyle: "italic", color: V.sage }}>arrives ready.</span>
            </h2>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="r-steps-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20,
            }}>
              <StepCard
                num="01"
                label="SOURCE"
                title="AI agent, matched to the JD"
                text="Our AI agent sources from Walnutt's candidate pool and actively searches Naukri, LinkedIn, X, and other platforms. Filtered to the role before any human touch."
              />
              <StepCard
                num="02"
                label="ASSESS"
                title="Technical skills, calibrated to the role"
                text="Our AI runs an adaptive evaluation across system design, debugging, situational judgement, code quality, and culture fit. Plus a detailed GitHub review as proof of work."
              />
              <StepCard
                num="03"
                label="TECH INTERVIEW"
                title="By working engineers"
                text="Live technical interview by our network of engineers at Groww, Finbox, Blinkit, Opendoor, and others. Real signal from people who ship for a living."
              />
              <StepCard
                num="04"
                label="SHORTLIST"
                title="Closure-ready"
                text="Handpicked candidates with logistics pre-aligned: compensation, location, preferences, availability. No surprises at offer stage."
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ WHAT CHANGES FOR YOU ═══ */}
      <section style={{ background: V.surface, padding: "100px 24px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ ...eyebrow, color: V.sage }}>WHAT CHANGES FOR YOU</p>
              <h2 style={{
                fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: "-0.03em", lineHeight: 1.15, color: V.ink, margin: "0 0 14px",
              }}>
                More roles. More placements.{" "}
                <span style={{ fontStyle: "italic", color: V.sage }}>Same you.</span>
              </h2>
              <p style={{
                fontFamily: font.body, fontSize: 14, color: V.subtitle,
                maxWidth: 460, lineHeight: 1.55, margin: "0 auto",
              }}>
                You win clients and manage relationships. We handle the manual ops.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div style={{
              background: V.surface, border: `1px solid ${V.border}`, borderRadius: 16,
              overflow: "hidden", boxShadow: "0 4px 24px rgba(26,36,32,0.04)",
            }}>
              <div className="r-compare-head" style={{
                display: "grid", gridTemplateColumns: "1fr 48px 1fr",
                background: V.sagePale,
                padding: "16px 0", alignItems: "center",
              }}>
                <div style={{
                  fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: V.muted, padding: "0 32px",
                }}>Today</div>
                <div />
                <div style={{
                  fontFamily: font.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: V.sage, padding: "0 32px",
                }}>With Walnutt</div>
              </div>

              {[
                { before: "Weeks per placement", after: "Days per placement" },
                { before: "Hours lost to sourcing & screening", after: "Zero sourcing & screening on your plate" },
                { before: "Selling resumes to clients", after: "Sending hire-ready candidates" },
                { before: "Passing on engineering mandates", after: "Closing engineering mandates" },
              ].map((row, i, arr) => (
                <div
                  key={i}
                  className="r-compare-row"
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 48px 1fr",
                    alignItems: "center",
                    borderTop: `1px solid ${V.borderLight}`,
                    minHeight: 64,
                  }}
                >
                  <div style={{
                    padding: "18px 32px",
                    fontFamily: font.body, fontSize: 15, fontWeight: 500,
                    color: V.subtitle,
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(107,125,116,0.35)",
                    textDecorationThickness: "1px",
                  }}>{row.before}</div>
                  <div style={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    color: V.sageMid,
                  }}>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                      <path d="M0 6H18M18 6L13 1M18 6L13 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{
                    padding: "18px 32px",
                    fontFamily: font.body, fontSize: 15, fontWeight: 600,
                    color: V.ink,
                  }}>{row.after}</div>
                  {i === arr.length - 1 && null}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div style={{ maxWidth: 620, margin: "40px auto 0", textAlign: "center" }}>
              <div style={{ width: 32, height: 2, background: V.sage, borderRadius: 1, margin: "0 auto 20px" }} />
              <p style={{
                fontFamily: font.heading, fontSize: 17, fontWeight: 500, color: V.body,
                lineHeight: 1.6, margin: 0,
              }}>
                More roles worked, more placements closed,{" "}
                <span style={{ color: V.sage, fontWeight: 600 }}>more revenue.</span>{" "}
                On the same bandwidth.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="recruiter-cta" style={{ background: V.dark, padding: "120px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(58,107,76,0.2) 0%, transparent 70%)", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <FadeSection>
            <p style={{ ...eyebrow, color: V.sageMid, marginBottom: 24 }}>NEXT STEP</p>
            <h2 style={{
              fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(30px, 4.2vw, 48px)",
              letterSpacing: "-0.03em", lineHeight: 1.15, color: "#fff", margin: "0 0 16px",
            }}>
              Share one open role. See the{" "}
              <span style={{ fontStyle: "italic", color: V.sageMid }}>shortlist</span> before you commit.
            </h2>
            <p style={{
              fontFamily: font.body, fontWeight: 300, fontSize: "clamp(16px, 2vw, 18px)",
              color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              maxWidth: 520, margin: "0 auto 44px",
            }}>
              One conversation to see if the partnership fits your book of business.
            </p>
            <button onClick={() => { trackEvent("cta_clicked_recruiters_connect", { location: "recruiters_close" }); onOpenForm(); }} style={{
              fontFamily: font.body, fontSize: 16, fontWeight: 600, color: V.dark,
              background: "#fff", padding: "16px 40px", borderRadius: 30, border: "none",
              cursor: "pointer", transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = V.sagePale; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,255,255,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Partner with us →
            </button>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}
