import React, { useState, useEffect } from "react";
import { C, FadeSection, BrowserFrame, TypeWriter, FI, PrimaryBtn, EngineersHeroIllustration } from "./shared";
import { Code2, Layers, GitBranch, Bug, Plug, MessageSquare, Github, ExternalLink, Download } from "lucide-react";

const fm = "'JetBrains Mono', monospace";

// ═══ CYCLING OVERLINE ═══
const roles = ["Backend Engineers", "Full-stack Engineers", "Applied AI Engineers", "Frontend Engineers"];

function CyclingOverline() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(p => (p + 1) % roles.length); setVisible(true); }, 300);
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
        For {roles[idx]}
      </span>
    </div>
  );
}

// ═══ ENGINEER MOCKUPS ═══
function MockAssess({ active }: { active: boolean }) {
  return (
    <BrowserFrame url="walnutt.com/assess">
      {/* Header row */}
      <FI active={active} delay={100}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 4, background: C.sageLight, color: C.sageDark, display: "inline-block" }}>AI-Adaptive</span>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gray500 }}>SUBJECTIVE</span>
          </div>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: C.sageLight, color: C.sageDark }}>Question 4 of 12</span>
        </div>
      </FI>

      {/* Question */}
      <FI active={active} delay={300}>
        <p style={{ fontSize: 15, fontWeight: 600, color: C.black, lineHeight: 1.5, margin: 0 }}>
          <TypeWriter active={active} delay={400} speed={20} text="Find the bug in the following SQL query and explain how you'd fix it:" />
        </p>
      </FI>

      {/* Code block */}
      <FI active={active} delay={1400}>
        <div style={{
          borderRadius: 10, padding: 14, background: "#1E1E1E", fontFamily: fm, fontSize: 13,
          lineHeight: 1.7, color: "#D4D4D4", overflowX: "auto",
        }}>
          <div><span style={{ color: "#569CD6" }}>SELECT</span> u.name, <span style={{ color: "#CE9178" }}>COUNT</span>(o.id)</div>
          <div><span style={{ color: "#569CD6" }}>FROM</span> users u</div>
          <div><span style={{ color: "#569CD6" }}>LEFT JOIN</span> orders o <span style={{ color: "#569CD6" }}>ON</span> u.id = o.user_id</div>
          <div><span style={{ color: "#569CD6" }}>WHERE</span> o.status = <span style={{ color: "#CE9178" }}>'completed'</span></div>
          <div><span style={{ color: "#569CD6" }}>GROUP BY</span> u.name;</div>
        </div>
      </FI>

      {/* Skill tags */}
      <FI active={active} delay={1800}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["SQL", "Debugging", "Edge Cases"].map(s => (
            <span key={s} style={{ fontSize: 13, padding: "5px 10px", borderRadius: 6, background: C.sageLight, color: C.sageDark, fontWeight: 500 }}>{s}</span>
          ))}
        </div>
      </FI>

      {/* Progress bar */}
      <FI active={active} delay={2100}>
        <div style={{ height: 4, borderRadius: 100, background: "#E5E7EB", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 100, width: active ? "33%" : "0%", background: C.sage, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1) 2.4s" }} />
        </div>
      </FI>
    </BrowserFrame>
  );
}

function MockBuild({ active }: { active: boolean }) {
  return (
    <BrowserFrame url="walnutt.com/build">
      {/* Git link input */}
      <FI active={active} delay={100}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gray500 }}>PROJECT REVIEW</span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: C.sageLight, color: C.sageDark }}>Step 1 of 3</span>
        </div>
      </FI>
      <FI active={active} delay={250}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.black, display: "block", marginBottom: 6 }}>Submit your GitHub repo</label>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10,
          border: `1.5px solid ${C.gray300}`, background: "#FAFBFA",
        }}>
          <Github size={16} color={C.gray500} />
          <span style={{ fontSize: 14, color: C.gray500, fontFamily: fm, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            github.com/akumar/url-shortener
          </span>
          <ExternalLink size={14} color={C.sage} />
        </div>
      </FI>

      {/* Explanation */}
      <FI active={active} delay={600}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.black, display: "block", marginBottom: 6 }}>Explain your approach</label>
        <div style={{
          padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.gray300}`,
          background: C.white, fontSize: 14, color: C.gray800, lineHeight: 1.6, minHeight: 60,
        }}>
          <TypeWriter active={active} delay={800} speed={18} text="I used a base62 encoding strategy with a Redis cache for fast lookups. The write path uses async queue processing to handle high throughput..." />
        </div>
      </FI>

      {/* AI Coach Review */}
      <FI active={active} delay={1600}>
        <div style={{ borderRadius: 10, padding: 14, background: C.sageLight, borderLeft: `3px solid ${C.sage}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: C.sageDark }}>AI COACH REVIEW</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: C.black, margin: 0 }}>
            <TypeWriter active={active} delay={1800} speed={16} text="Good use of Redis for caching. Consider adding a write-behind pattern to decouple the encoding step. Your collision handling is solid. Try documenting the retry logic for clarity." />
          </p>
        </div>
      </FI>
    </BrowserFrame>
  );
}

function MockStandOut({ active }: { active: boolean }) {
  const darkGreen = "#1E3A2B";
  const skills = [
    { name: "DSA", level: "Intermediate", score: 5, max: 10 },
    { name: "System Design", level: "Beginner", score: 3, max: 10 },
    { name: "Web Development", level: "Intermediate", score: 5, max: 10 },
    { name: "Programming", level: "Intermediate", score: 6, max: 10 },
    { name: "CS Fundamentals", level: "Beginner", score: 4, max: 10 },
  ];

  return (
    <div style={{ display: "flex", gap: 0, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} className="flex-col sm:flex-row">
      {/* Left dark panel */}
      <div style={{
        background: darkGreen, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center",
        minWidth: 220,
      }}>
        <FI active={active} delay={100}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4A843", margin: "0 0 8px" }}>OVERALL READINESS</p>
          <p style={{ fontSize: 48, fontWeight: 800, color: C.white, margin: "0 0 4px", lineHeight: 1 }}>50%</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 0 16px" }}>For mid stage product based startup</p>
          <div style={{ height: 6, borderRadius: 100, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 100, width: active ? "50%" : "0%", background: "#4A8C62", transition: "width 1.2s cubic-bezier(0.22,1,0.36,1) 0.5s" }} />
          </div>
        </FI>

        <FI active={active} delay={500}>
          <div style={{ marginTop: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4A843", margin: "0 0 4px" }}>ASSESSMENT TAKEN</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.white, margin: "0 0 14px" }}>Feb 18, 2026</p>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4A843", margin: "0 0 4px" }}>TIME TAKEN</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.white, margin: 0 }}>38 mins 24 secs</p>
          </div>
        </FI>
      </div>

      {/* Right skill scores panel */}
      <div style={{ flex: 1, background: C.white, padding: "28px 24px" }}>
        <FI active={active} delay={200}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gray500, margin: "0 0 20px" }}>SKILL SCORES</p>
        </FI>

        {skills.map((skill, i) => (
          <FI active={active} delay={300 + i * 120} key={skill.name}>
            <div style={{ marginBottom: i < skills.length - 1 ? 18 : 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.black }}>{skill.name}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.black }}>{skill.score}/{skill.max}</span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 500, color: skill.level === "Beginner" ? "#D4A843" : "#4A8C62", margin: "0 0 6px" }}>{skill.level}</p>
              <div style={{ height: 5, borderRadius: 100, background: "#E5E7EB", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 100,
                  width: active ? `${(skill.score / skill.max) * 100}%` : "0%",
                  background: darkGreen,
                  transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${0.6 + i * 0.15}s`,
                }} />
              </div>
            </div>
          </FI>
        ))}

        <FI active={active} delay={1000}>
          <button style={{
            width: "100%", padding: "14px 20px", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 15, fontWeight: 600, background: darkGreen, color: C.white,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Download size={16} /> Download Full Report
          </button>
        </FI>
      </div>
    </div>
  );
}

// ═══ DIMENSION CARDS ═══
const dimensions = [
  { icon: Layers, title: "System Design", desc: "Architect for scale and reliability" },
  { icon: Code2, title: "Code Quality", desc: "Clean, tested, maintainable code" },
  { icon: GitBranch, title: "Trade-off Analysis", desc: "Reason through real constraints" },
  { icon: Bug, title: "Debugging", desc: "Navigate the unknown systematically" },
  { icon: Plug, title: "API Design", desc: "Think about your consumers" },
  { icon: MessageSquare, title: "Communication", desc: "Explain your decisions clearly" },
];

// ═══ ENGINEERS PAGE ═══
export function EngineersPage() {
  const steps = [
    { label: "Assess", num: "01", title: "See yourself clearly.", desc: "Pick your target role. Our AI adapts in real-time, adjusting depth, difficulty, and focus based on how you respond. It doesn't just score you. It understands how you think through system design, architecture, debugging, and more. Get a readiness score across 10+ dimensions that's deeply personal, not one-size-fits-all.", mock: MockAssess },
    { label: "Build", num: "02", title: "Close the gaps with your AI mentor.", desc: "Your assessment unlocks a personal AI mentor that knows exactly where you stand. Submit your GitHub projects, explain your approach, and get targeted coaching. It builds a learning path around your weak spots: curated resources, practice problems, and projects that adapt as you improve.", mock: MockBuild },
    { label: "Stand Out", num: "03", title: "Let your profile do the talking.", desc: "Your Walnutt profile is a verified skill map that shows what you can actually do. When you're ready, companies that value engineering depth find you. No cold applications. No keyword games. Walnutt is completely free for candidates — no placement fees, no hidden charges, ever.", mock: MockStandOut },
  ];

  const roleTags = ["SDE 1", "SDE 2", "SDE 3", "Backend", "Full-stack", "Applied AI"];

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <EngineersHeroIllustration />
        <div style={{ position: "relative", zIndex: 10, width: "100%", padding: "120px 24px 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <CyclingOverline />
            <h1 style={{
              fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, lineHeight: 1.05,
              letterSpacing: "-0.02em", color: C.black, margin: "0 0 24px", textTransform: "uppercase",
            }}>
              CAREER ACCELERATOR FOR{" "}
              <span style={{ color: C.sage }}>TECH TALENT</span>
            </h1>
            <p style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 500, color: C.gray800, lineHeight: 1.5, maxWidth: 540, margin: "0 auto 36px" }}>
              Assess your real skills. Build with an AI mentor.<br />
              <span style={{ color: C.sage, fontWeight: 600 }}>Stand out to companies that matter.</span>
            </p>
            <PrimaryBtn href="https://app.walnutt.co" eventName="cta_clicked_hero">Take the Free Assessment →</PrimaryBtn>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.gray500 }}>AI-adaptive difficulty</span>
              </div>
              <div style={{ width: 1, height: 14, background: C.gray300 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.gray500 }}>10+ skill dimensions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", color: C.sage, textTransform: "uppercase", marginBottom: 16 }}>HOW IT WORKS</p>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.black, margin: 0 }}>
                From self-doubt to job-ready
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
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
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

      {/* ═══ BUILT FOR EVERY STAGE ═══ */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", color: C.sage, textTransform: "uppercase", marginBottom: 16 }}>WHO IT'S FOR</p>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.black, margin: "0 0 16px" }}>
                For engineers who'd rather know than wonder.
              </h2>
              <p style={{ fontSize: 17, fontWeight: 400, color: C.gray800, lineHeight: 1.6, maxWidth: 620, margin: "0 auto 32px" }}>
                First role or fifth. Walnutt shows you where you stand, what to work on, and how to prove it. On your terms, at your pace.
              </p>
            </div>
          </FadeSection>

          {/* Role tag pills */}
          <FadeSection>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
              {roleTags.map(tag => (
                <span key={tag} style={{ fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 100, background: C.sageLight, color: C.sageDark }}>{tag}</span>
              ))}
            </div>
          </FadeSection>

          {/* Dimension cards */}
          <FadeSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dimensions.map((d, i) => {
                const Icon = d.icon;
                return (
                  <DimensionCard key={d.title} icon={<Icon size={24} color={C.sage} />} title={d.title} desc={d.desc} />
                );
              })}
            </div>
          </FadeSection>

          <FadeSection className="text-center mt-12">
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <PrimaryBtn href="https://app.walnutt.co" eventName="cta_clicked_bottom">Start Your Assessment →</PrimaryBtn>
            </div>
          </FadeSection>
        </div>
      </section>
    </>
  );
}

function DimensionCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: C.white, border: "1px solid #E5E7EB", borderRadius: 12, padding: 24,
      transform: hover ? "translateY(-2px)" : "translateY(0)",
      boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "all 200ms ease-out", cursor: "default",
    }}>
      {icon}
      <p style={{ fontSize: 17, fontWeight: 600, color: C.black, margin: "12px 0 6px" }}>{title}</p>
      <p style={{ fontSize: 15, fontWeight: 400, color: C.gray500, margin: 0 }}>{desc}</p>
    </div>
  );
}