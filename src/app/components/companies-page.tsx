import React, { useState, useEffect } from "react";
import { C, FadeSection, BrowserFrame, TypeWriter, FI, ScoreRing, PrimaryBtn, SecondaryBtn, CompaniesHeroIllustration } from "./shared";
import { ClipboardCheck, Mic, Users } from "lucide-react";

// ═══ COMPANY MOCKUPS ═══
function MockPost({ active }: { active: boolean }) {
  return (
    <BrowserFrame url="walnutt.com/company/post">
      <FI active={active} delay={100}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.sage, textTransform: "uppercase", letterSpacing: "0.05em" }}>Describe your ideal hire</span>
      </FI>
      <FI active={active} delay={300}>
        <div style={{ borderRadius: 10, padding: 14, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: C.black, margin: 0 }}>
            <TypeWriter active={active} delay={500} speed={22} text="Senior full-stack engineer, React + Node.js. System design for high-traffic apps. Remote-friendly." />
          </p>
        </div>
      </FI>
      <FI active={active} delay={2200}>
        <p style={{ fontSize: 12, color: C.gray500, margin: "0 0 6px" }}>Walnutt extracted:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["React", "Node.js", "System Design", "High Traffic", "Remote OK", "3+ yrs"].map(tag => (
            <span key={tag} style={{ fontSize: 13, padding: "5px 10px", borderRadius: 6, fontWeight: 500, background: C.sageLight, color: C.sageDark }}>{tag}</span>
          ))}
        </div>
      </FI>
    </BrowserFrame>
  );
}

function MockReview({ active }: { active: boolean }) {
  const cands = [
    { init: "AM", name: "Arjun M.", score: 88, match: 94, skills: ["React", "Node.js", "AWS"] },
    { init: "PS", name: "Priya S.", score: 82, match: 91, skills: ["TypeScript", "Python", "Docker"] },
    { init: "RK", name: "Rahul K.", score: 79, match: 87, skills: ["React", "Go", "K8s"] },
  ];
  return (
    <BrowserFrame url="walnutt.com/company/review">
      {cands.map((c, i) => (
        <FI key={c.init} active={active} delay={300 + i * 300}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 12, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: C.sageLight, color: C.sageDark, flexShrink: 0 }}>{c.init}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.black }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.sage }}>{c.match}% match</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {c.skills.map(s => <span key={s} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "#F3F4F6", color: C.gray500 }}>{s}</span>)}
              </div>
            </div>
            <ScoreRing score={active ? c.score : 0} size={38} sw={3} delay={500 + i * 300} />
          </div>
        </FI>
      ))}
    </BrowserFrame>
  );
}

function MockHire({ active }: { active: boolean }) {
  const items = [
    { l: "Walnutt Assessment", s: "Passed (88%)" },
    { l: "GitHub Verified", s: "142 commits" },
    { l: "AI Interview", s: "Strong recommendation" },
    { l: "JD Match", s: "94% fit" },
  ];
  return (
    <BrowserFrame url="walnutt.com/company/hire">
      <FI active={active} delay={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, background: C.sageLight, color: C.sageDark }}>AM</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.black, margin: 0 }}>Arjun M.</p>
            <p style={{ fontSize: 13, color: C.gray500, margin: "2px 0 0" }}>Full-Stack · 94% match</p>
          </div>
        </div>
      </FI>
      {items.map((s, i) => (
        <FI key={s.l} active={active} delay={500 + i * 200}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, background: "#F9FAFB" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, background: C.sage, color: "#fff", flexShrink: 0 }}>✓</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.black }}>{s.l}</span>
            <span style={{ fontSize: 12, color: C.gray500, marginLeft: "auto" }}>{s.s}</span>
          </div>
        </FI>
      ))}
      <FI active={active} delay={1600}>
        <div style={{ borderRadius: 10, padding: 16, textAlign: "center", background: C.sageLight, border: "1px solid rgba(58,107,76,0.15)" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.sage, margin: 0 }}>Ready for your final call</p>
          <p style={{ fontSize: 13, color: C.sageDark, margin: "4px 0 0" }}>Pre-assessed and AI-interviewed</p>
        </div>
      </FI>
    </BrowserFrame>
  );
}

// ═══ VALUE CARD ═══
function ValueCard({ icon, title, desc }: {
  icon: React.ReactNode; title: string; desc: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: C.white, borderRadius: 16, padding: 28,
      border: "1px solid #E5E7EB",
      boxShadow: hover ? "0 12px 32px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
      transform: hover ? "translateY(-3px)" : "translateY(0)",
      transition: "all 250ms ease-out",
    }}>
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12, background: C.sageLight,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
      }}>
        {icon}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 20, fontWeight: 700, color: C.black, margin: "0 0 8px" }}>{title}</h3>
      <p style={{ fontSize: 15, fontWeight: 400, color: C.gray500, lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

// ═══ CYCLING OVERLINE (Companies) ═══
const companyLines = [
  "For companies where every engineer matters",
  "For startups that need to ship next week",
  "For teams tired of hiring resumes",
];

function CompanyCyclingOverline() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(p => (p + 1) % companyLines.length); setVisible(true); }, 300);
    }, 3000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ height: 28, overflow: "hidden", marginBottom: 20 }}>
      <span style={{
        fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: C.sage,
        display: "inline-block",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "opacity 300ms ease-out, transform 300ms ease-out",
      }}>
        {companyLines[idx]}
      </span>
    </div>
  );
}

// ═══ COMPANIES PAGE ═══
export function CompaniesPage({ onOpenForm }: { onOpenForm: () => void }) {
  const steps = [
    { label: "Post", num: "01", title: "Describe your ideal hire.", desc: "Share a JD or describe your ideal engineer in plain English. Our AI extracts the skills, experience level, and must-haves, then matches against candidates who've been deeply assessed, not just keyword-filtered.", mock: MockPost },
    { label: "Review", num: "02", title: "See proof, not promises.", desc: "Every candidate comes with an AI-generated skill profile: adaptive assessment scores across 10+ dimensions, GitHub activity analysis, and a readiness match percentage. Filter by skill, experience, and availability.", mock: MockReview },
    { label: "Hire", num: "03", title: "Interview with confidence.", desc: "Candidates are AI-assessed and pre-vetted. Your conversations focus on culture and fit, not whether they can build. An accelerated hiring process that saves your team weeks.", mock: MockHire },
  ];

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <CompaniesHeroIllustration />
        <div style={{ position: "relative", zIndex: 10, width: "100%", padding: "120px 24px 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <CompanyCyclingOverline />
            <h1 style={{
              fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, lineHeight: 1.05,
              letterSpacing: "-0.02em", color: C.black, margin: "0 0 24px", textTransform: "uppercase",
            }}>
              YOUR NEXT ENGINEER IS ALREADY{" "}
              <span style={{ color: C.sage }}>VERIFIED</span>
            </h1>
            <p style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 500, color: C.gray800, lineHeight: 1.5, maxWidth: 580, margin: "0 auto 36px" }}>
              AI-assessed across 10+ dimensions. GitHub verified.<br />
              <span style={{ color: C.sage, fontWeight: 600 }}>Skip the screen. Meet the engineer.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <PrimaryBtn onClick={() => onOpenForm()}>Post a Role →</PrimaryBtn>
              <SecondaryBtn onClick={() => onOpenForm()}>Talk to Our Team</SecondaryBtn>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.gray500 }}>Pre-assessed candidates</span>
              </div>
              <div style={{ width: 1, height: 14, background: C.gray300 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.gray500 }}>AI-matched to your JD</span>
              </div>
              <div style={{ width: 1, height: 14, background: C.gray300 }} className="hidden sm:block" />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="hidden sm:flex">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.gray500 }}>Pay on hire</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — VERTICAL LAYOUT ═══ */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", color: C.sage, textTransform: "uppercase", marginBottom: 16 }}>HOW IT WORKS</p>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.black, margin: 0 }}>
                From JD to hire
              </h2>
            </div>
          </FadeSection>

          {/* All steps stacked vertically */}
          <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
            {steps.map((s, i) => {
              const Mock = s.mock;
              const isReversed = i % 2 === 1;
              return (
                <FadeSection key={s.label}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 100,
                      background: C.sage, color: C.white,
                    }}>
                      {s.num}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.sage, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {s.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div style={{ order: isReversed ? 2 : 1 }} className="order-1 md:order-none">
                      <h3 style={{ fontSize: 28, fontWeight: 600, color: C.black, margin: "0 0 16px", lineHeight: 1.3 }}>
                        {s.title}
                      </h3>
                      <p style={{ fontSize: 17, fontWeight: 400, color: C.gray800, lineHeight: 1.7, margin: 0 }}>
                        {s.desc}
                      </p>
                    </div>
                    <div style={{ order: isReversed ? 1 : 2 }} className="order-2 md:order-none">
                      <Mock active={true} />
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
                      <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.gray300}, transparent)` }} />
                    </div>
                  )}
                </FadeSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ WHY WALNUTT ═══ */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", color: C.sage, textTransform: "uppercase", marginBottom: 16 }}>WHY WALNUTT</p>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.black, margin: "0 0 16px" }}>
                We handle the hard parts. You make the final call.
              </h2>
              <p style={{ fontSize: 17, fontWeight: 400, color: C.gray800, lineHeight: 1.6, maxWidth: 700, margin: "0 auto" }}>
                Walnutt runs the entire top-of-funnel: skill assessments, AI-powered interviews, and candidate matching, so your team only spends time on engineers worth talking to.
              </p>
            </div>
          </FadeSection>

          {/* Value cards — 3 column grid */}
          <FadeSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ValueCard
                icon={<ClipboardCheck size={22} color={C.sage} />}
                title="Assessed"
                desc="Every candidate completes a deep adaptive assessment across 10+ engineering dimensions. No self-reported skills. No guesswork."
              />
              <ValueCard
                icon={<Mic size={22} color={C.sage} />}
                title="Interviewed"
                desc="Our AI conducts structured technical interviews calibrated to your role requirements. You get the scorecard, not the scheduling headache."
              />
              <ValueCard
                icon={<Users size={22} color={C.sage} />}
                title="Matched"
                desc="Candidates are ranked by fit against your JD. You review verified profiles, pick who to meet, and move straight to final rounds."
              />
            </div>
          </FadeSection>

          {/* Pricing + CTAs */}
          <FadeSection>
            <div style={{
              marginTop: 48, padding: "32px 28px", borderRadius: 16,
              background: "linear-gradient(135deg, #F9FAFB 0%, #F0F5F1 100%)",
              border: "1px solid #E5E7EB",
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
            }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: C.gray800, margin: "0 0 6px" }}>
                Simple, outcome-based pricing
              </p>
              <p style={{ fontSize: 14, color: C.gray500, margin: "0 0 24px" }}>
                You pay only when you've found the right engineer.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <PrimaryBtn onClick={() => onOpenForm()}>Post a Role →</PrimaryBtn>
                <SecondaryBtn onClick={() => onOpenForm()}>Talk to Our Team</SecondaryBtn>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>
    </>
  );
}