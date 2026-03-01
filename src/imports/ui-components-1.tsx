import { useState, useEffect } from "react";

const T = {
  sage: "#3A6B4C",
  sageLight: "#5A8F6E",
  sageMuted: "#8BBD9E",
  sageBg: "#EDF4EF",
  text: "#1A1D1B",
  muted: "#6B756E",
  subtle: "#9BA39E",
  bg: "#FAFBFA",
  card: "#FFFFFF",
  border: "#E8ECE9",
  borderLight: "#F0F3F1",
  warm: "#D4A853",
};

const fd = "'Bricolage Grotesque', Georgia, serif";
const fb = "'DM Sans', system-ui, sans-serif";
const fm = "'JetBrains Mono', monospace";

function ScoreRing({ score, size = 64, sw = 4, delay = 0 }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    setP(0);
    const timer = setTimeout(() => {
      let c = 0;
      const iv = setInterval(() => {
        c += 1;
        if (c >= score) {
          setP(score);
          clearInterval(iv);
        } else {
          setP(c);
        }
      }, 12);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, delay]);
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (p / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.borderLight} strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.sage} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.12s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontWeight: 700, fontSize: size * 0.24, color: T.text, fontFamily: fd }}>{p}%</span>
      </div>
    </div>
  );
}

function TypeWriter({ text, speed = 25, delay = 0, active }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!active) { setShown(""); return; }
    setShown("");
    const timer = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
    }, delay);
    return () => clearTimeout(timer);
  }, [active, text, speed, delay]);
  return (
    <span>
      {shown}
      {shown.length < text.length && active && <span style={{ opacity: 0.5 }}>|</span>}
    </span>
  );
}

function FI({ children, delay = 0, active = true }) {
  return (
    <div style={{
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(14px)",
      transition: "all 0.5s cubic-bezier(0.22,1,0.36,1) " + delay + "ms",
    }}>
      {children}
    </div>
  );
}

function BrowserFrame({ url, children }) {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: T.card, border: "1px solid " + T.border, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
      <div style={{ padding: "10px 18px", borderBottom: "1px solid " + T.borderLight, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA41" }} />
        </div>
        <span style={{ fontSize: 11, color: T.subtle, fontFamily: fm, marginLeft: 6 }}>{url}</span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function FormOverlay({ type, onClose }) {
  const isPost = type === "post";
  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid " + T.border, fontSize: 14, fontFamily: fb, color: T.text, outline: "none", boxSizing: "border-box" };
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(15,18,17,0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
      <div style={{ width: "100%", maxWidth: 420, borderRadius: 20, padding: 32, background: T.card, boxShadow: "0 24px 80px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontFamily: fd, fontWeight: 700, fontSize: 22, color: T.text, margin: 0 }}>{isPost ? "Post a Role" : "Talk to Our Team"}</h3>
            <p style={{ fontFamily: fb, fontSize: 13, color: T.muted, margin: "4px 0 0" }}>{isPost ? "We'll match verified engineers to your JD." : "We'll reach out within 24 hours."}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontSize: 20, color: T.subtle }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: T.text, fontFamily: fb }}>Company Name</label>
            <input style={inputStyle} placeholder="Acme Inc." />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: T.text, fontFamily: fb }}>Work Email</label>
            <input type="email" style={inputStyle} placeholder="you@company.com" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: T.text, fontFamily: fb }}>{isPost ? "Job Description" : "What are you hiring for?"}</label>
            <textarea rows={isPost ? 4 : 3} style={{ ...inputStyle, resize: "none" }} placeholder={isPost ? "Paste a JD or describe your ideal engineer..." : "E.g. 2 senior full-stack engineers for our fintech..."} />
          </div>
          <button style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700, fontFamily: fb, background: T.sage, color: "#fff", cursor: "pointer" }}>
            {isPost ? "Submit Role" : "Get in Touch"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Candidate Mockups ──
function CAssess({ active }) {
  return (
    <BrowserFrame url="walnutt.com/assess">
      <FI active={active} delay={100}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: T.sageBg, color: T.sage, display: "inline-block" }}>Question 4 of 12</span>
      </FI>
      <FI active={active} delay={300}>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: fb, lineHeight: 1.5, margin: 0 }}>
          <TypeWriter active={active} delay={500} speed={20} text="Design a rate limiter for an API handling 10,000 req/s. Walk through your approach." />
        </p>
      </FI>
      <FI active={active} delay={1400}>
        <div style={{ borderRadius: 12, padding: 12, background: "#F6F8F7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.sage }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: T.sage }}>Evaluating: System Design</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Scalability", "Trade-offs", "Edge Cases"].map(s => (
              <span key={s} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: T.sageBg, color: T.sageLight }}>{s}</span>
            ))}
          </div>
        </div>
      </FI>
      <FI active={active} delay={1800}>
        <div style={{ height: 6, borderRadius: 3, background: T.borderLight, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 3, width: active ? "33%" : "0%", background: "linear-gradient(90deg," + T.sage + "," + T.sageLight + ")", transition: "width 1.2s cubic-bezier(0.22,1,0.36,1) 2s" }} />
        </div>
      </FI>
    </BrowserFrame>
  );
}

function CBuild({ active }) {
  return (
    <BrowserFrame url="walnutt.com/learn">
      <FI active={active} delay={100}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.sage }}>AI MENTOR</span>
          <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 99, background: T.sageBg, color: T.sage }}>Week 3</span>
        </div>
      </FI>
      <FI active={active} delay={300}>
        <div style={{ borderRadius: 12, padding: 14, background: T.sageBg }}>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: T.text, fontFamily: fb, margin: 0 }}>
            <TypeWriter active={active} delay={500} speed={18} text="Your URL shortener handles reads well, but the write path has a bottleneck. Try a write-behind cache. I've commented on your PR." />
          </p>
        </div>
      </FI>
      <FI active={active} delay={1800}>
        <div style={{ borderRadius: 12, padding: 12, background: "#F6F8F7" }}>
          <span style={{ fontSize: 11, color: T.muted }}>Progress to threshold</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.borderLight, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, width: active ? "68%" : "0%", background: "linear-gradient(90deg," + T.warm + ",#e0b85a)", transition: "width 1s cubic-bezier(0.22,1,0.36,1) 2s" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.warm }}>68%</span>
            <span style={{ fontSize: 11, color: T.subtle }}>→</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.sage }}>75%</span>
          </div>
        </div>
      </FI>
    </BrowserFrame>
  );
}

function CHire({ active }) {
  return (
    <BrowserFrame url="walnutt.com/dashboard">
      <FI active={active} delay={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ScoreRing score={active ? 82 : 0} size={64} sw={4} delay={300} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0 }}>You crossed the threshold</p>
            <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0" }}>Readiness: 82% · Full-Stack at funded startups</p>
          </div>
        </div>
      </FI>
      <FI active={active} delay={700}>
        <div style={{ borderRadius: 12, padding: 16, background: T.sageBg, border: "1px solid rgba(58,107,76,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.sage }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: T.sage }}>Roles match your profile</span>
          </div>
          <p style={{ fontSize: 12, color: T.sageLight, margin: "0 0 12px" }}>Opt in and we share your verified profile with hiring startups.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: T.sage, color: "#fff", border: "none", cursor: "pointer" }}>Yes, opt me in</button>
            <button style={{ padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: "transparent", color: T.muted, border: "1px solid " + T.border, cursor: "pointer" }}>Not now</button>
          </div>
        </div>
      </FI>

    </BrowserFrame>
  );
}

// ── Company Mockups ──
function BPost({ active }) {
  return (
    <BrowserFrame url="walnutt.com/company/post">
      <FI active={active} delay={100}><span style={{ fontSize: 11, fontWeight: 600, color: T.sage }}>DESCRIBE YOUR IDEAL HIRE</span></FI>
      <FI active={active} delay={300}>
        <div style={{ borderRadius: 12, padding: 14, background: "#F6F8F7", border: "1px solid " + T.borderLight }}>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: T.text, fontFamily: fb, margin: 0 }}>
            <TypeWriter active={active} delay={500} speed={22} text="Senior full-stack engineer, React + Node.js. System design for high-traffic apps. Remote-friendly." />
          </p>
        </div>
      </FI>
      <FI active={active} delay={2200}>
        <p style={{ fontSize: 11, color: T.muted, margin: "0 0 6px" }}>Walnutt extracted:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["React", "Node.js", "System Design", "High Traffic", "Remote OK", "3+ yrs"].map(tag => (
            <span key={tag} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, fontWeight: 500, background: T.sageBg, color: T.sage }}>{tag}</span>
          ))}
        </div>
      </FI>
    </BrowserFrame>
  );
}

function BReview({ active }) {
  const cands = [
    { init: "AM", name: "Arjun M.", score: 88, match: 94, skills: ["React", "Node.js", "AWS"], gh: true, pf: true },
    { init: "PS", name: "Priya S.", score: 82, match: 91, skills: ["TypeScript", "Python", "Docker"], gh: true },
    { init: "RK", name: "Rahul K.", score: 79, match: 87, skills: ["React", "Go", "K8s"], gh: true, pf: true },
  ];
  return (
    <BrowserFrame url="walnutt.com/company/matches">
      {cands.map((c, i) => (
        <FI key={i} active={active} delay={300 + i * 300}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 12, background: "#F9FAF9", border: "1px solid " + T.borderLight }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: T.sageBg, color: T.sage, flexShrink: 0 }}>{c.init}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{c.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.sage }}>{c.match}%</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {c.skills.map(s => <span key={s} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: T.borderLight, color: T.muted }}>{s}</span>)}
                {c.gh && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: T.sageBg, color: T.sage }}>GitHub ✓</span>}
                {c.pf && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: T.sageBg, color: T.sage }}>Portfolio ✓</span>}
              </div>
            </div>
            <ScoreRing score={active ? c.score : 0} size={38} sw={3} delay={500 + i * 300} />
          </div>
        </FI>
      ))}
    </BrowserFrame>
  );
}

function BHire({ active }) {
  const items = [
    { l: "Walnutt Assessment", s: "Passed (88%)" },
    { l: "GitHub Verified", s: "142 commits" },
    { l: "Custom Assessment", s: "Completed" },
    { l: "AI Interview", s: "Strong rec." },
  ];
  return (
    <BrowserFrame url="walnutt.com/company/hire">
      <FI active={active} delay={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: T.sageBg, color: T.sage }}>AM</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0 }}>Arjun M.</p>
            <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0" }}>Full-Stack · 94% match</p>
          </div>
        </div>
      </FI>
      {items.map((s, i) => (
        <FI key={i} active={active} delay={500 + i * 200}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, background: "#F6F8F7" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, background: T.sage, color: "#fff", flexShrink: 0 }}>✓</div>
            <span style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{s.l}</span>
            <span style={{ fontSize: 11, color: T.subtle, marginLeft: "auto" }}>{s.s}</span>
          </div>
        </FI>
      ))}
      <FI active={active} delay={1600}>
        <div style={{ borderRadius: 12, padding: 16, textAlign: "center", background: T.sageBg, border: "1px solid rgba(58,107,76,0.15)" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: T.sage, margin: 0 }}>Ready for your final call</p>
          <p style={{ fontSize: 12, color: T.sageLight, margin: "4px 0 0" }}>Pay 8-10% CTC on successful hire</p>
        </div>
      </FI>
    </BrowserFrame>
  );
}

// ═════════════════════
// MAIN
// ═════════════════════
export default function Walnutt() {
  const [mode, setMode] = useState("candidate");
  const [step, setStep] = useState(0);
  const [formType, setFormType] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const isC = mode === "candidate";

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => setStep(0), [mode]);

  const cSteps = [
    { label: "Assess", title: "See yourself clearly", desc: "Set your target role. Take an adaptive assessment. Get a readiness score across 10+ dimensions.", mock: CAssess },
    { label: "Build", title: "Close the gap with AI", desc: "Below the threshold? An AI mentor assigns projects, reviews code, and coaches you to hire-ready. ₹999/mo.", mock: CBuild },
    { label: "Get Hired", title: "Opt in to opportunities", desc: "Cross the threshold and opt in. We verify your GitHub and portfolio, then connect you to startups.", mock: CHire },
  ];
  const bSteps = [
    { label: "Post", title: "Describe your ideal hire", desc: "Share a JD or describe your ideal engineer. Our AI extracts requirements and matches verified candidates.", mock: BPost },
    { label: "Review", title: "See proof, not promises", desc: "Browse skill reports, GitHub analysis, and readiness scores. Every candidate deeply assessed.", mock: BReview },
    { label: "Hire", title: "We handle the hard parts", desc: "We deliver assessments, conduct AI interviews, and you make the final call. 8-10% CTC on success.", mock: BHire },
  ];
  const steps = isC ? cSteps : bSteps;
  const Mock = steps[step].mock;

  const gradientKeyframes = `
    @keyframes gshift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    @keyframes od1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-40px,30px) scale(1.1); } 66% { transform: translate(20px,-20px) scale(0.95); } }
    @keyframes od2 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-40px) scale(1.12); } 66% { transform: translate(-25px,15px) scale(0.92); } }
    @keyframes od3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,25px) scale(1.06); } }
    @keyframes op { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
  `;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: fb, opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}>
      <style>{gradientKeyframes}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "12px 20px", background: "rgba(250,251,250,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(232,236,233,0.6)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <path d="M20 2L37 12V28L20 38L3 28V12Z" stroke={T.sage} strokeWidth="2.5" fill="none" />
              <path d="M16 13L8 20L16 27" stroke={T.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 13L32 20L24 27" stroke={T.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: fb, fontWeight: 800, fontSize: 17, color: T.text, letterSpacing: "-0.02em" }}>
              Walnutt
              {!isC && <span style={{ fontWeight: 600, fontSize: 11, color: T.sage, marginLeft: 5 }}>for Companies</span>}
            </span>
          </div>

          <div style={{ display: "flex", gap: 3, borderRadius: 99, padding: 3, background: "rgba(0,0,0,0.03)", border: "1px solid " + T.borderLight }}>
            {["candidate", "company"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: "6px 16px", borderRadius: 99, border: "none", cursor: "pointer",
                fontFamily: fb, fontSize: 12, fontWeight: 600,
                background: mode === m ? T.card : "transparent",
                color: mode === m ? T.text : T.subtle,
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
                transition: "all 0.3s"
              }}>
                {m === "candidate" ? "For Candidates" : "For Companies"}
              </button>
            ))}
          </div>

          <button onClick={() => { if (!isC) setFormType("post"); }} style={{ padding: "8px 20px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: fb, fontSize: 13, fontWeight: 700, background: T.sage, color: "#fff" }}>
            {isC ? "Take Free Assessment" : "Post a Role"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "88vh", display: "flex", alignItems: "center" }}>
        {/* Orbs */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#f6faf7 0%,#eef5f0 30%,#f8faf9 60%,#fafbfa 100%)" }} />
          <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(58,107,76,0.14) 0%,rgba(58,107,76,0.05) 35%,transparent 65%)", top: "-15%", right: "-10%", animation: "od1 18s ease-in-out infinite, op 6s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(90,143,110,0.12) 0%,rgba(90,143,110,0.04) 35%,transparent 65%)", bottom: "-20%", left: "-12%", animation: "od2 22s ease-in-out infinite, op 8s ease-in-out infinite 2s" }} />
          <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(58,107,76,0.09) 0%,transparent 55%)", top: "25%", left: "30%", animation: "od3 15s ease-in-out infinite, op 5s ease-in-out infinite 1s" }} />
          <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,189,158,0.1) 0%,transparent 60%)", top: "60%", right: "20%", animation: "od1 12s ease-in-out infinite reverse" }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, width: "100%", padding: "100px 20px 60px", textAlign: "center" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{
              fontFamily: fd, fontWeight: 800,
              fontSize: "clamp(44px, 8vw, 88px)", lineHeight: 0.92,
              color: T.text, letterSpacing: "-0.04em", margin: "0 0 28px",
            }}>
              {isC ? (
                <>CAREER<br />ACCELERATOR<br />FOR <span style={{ background: "linear-gradient(90deg,#3A6B4C,#5A8F6E,#8BBD9E,#5A8F6E,#3A6B4C)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "gshift 4s ease-in-out infinite" }}>TECH TALENT</span></>
              ) : (
                <>YOUR NEXT<br />ENGINEER IS<br />ALREADY <span style={{ background: "linear-gradient(90deg,#3A6B4C,#5A8F6E,#8BBD9E,#5A8F6E,#3A6B4C)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "gshift 4s ease-in-out infinite" }}>VERIFIED</span></>
              )}
            </h1>

            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.5, color: T.muted, maxWidth: isC ? 420 : 460, margin: "0 auto 36px" }}>
              {isC
                ? "Assess your skills. Close the gap. Get hired by startups."
                : "Deep skill assessment. GitHub verified. Portfolio reviewed. Matched to your JD."}
            </p>

            {isC ? (
              <button style={{ padding: "16px 32px", borderRadius: 16, border: "none", cursor: "pointer", fontFamily: fb, fontSize: 15, fontWeight: 700, background: T.sage, color: "#fff" }}>
                Take the Free Assessment →
              </button>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <button onClick={() => setFormType("post")} style={{ padding: "16px 32px", borderRadius: 16, border: "none", cursor: "pointer", fontFamily: fb, fontSize: 15, fontWeight: 700, background: T.sage, color: "#fff" }}>
                  Post a Role →
                </button>
                <button onClick={() => setFormType("talk")} style={{ padding: "16px 32px", borderRadius: 16, cursor: "pointer", fontFamily: fb, fontSize: 15, fontWeight: 600, color: T.text, border: "1.5px solid " + T.border, background: "rgba(255,255,255,0.5)" }}>
                  Talk to Our Team
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "96px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: T.sage, textTransform: "uppercase", marginBottom: 10 }}>HOW IT WORKS</p>
            <h2 style={{ fontFamily: fd, fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)", color: T.text, letterSpacing: "-0.03em", margin: 0 }}>
              {isC ? "From self-doubt to job-ready" : "From JD to hire"}
            </h2>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}>
            {steps.map((s, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                padding: "10px 20px", borderRadius: 12, cursor: "pointer",
                fontFamily: fb, fontSize: 13, fontWeight: 600,
                background: step === i ? T.sage : T.card,
                color: step === i ? "#fff" : T.muted,
                border: step === i ? "none" : "1px solid " + T.border,
                boxShadow: step === i ? "0 4px 16px rgba(58,107,76,0.2)" : "0 1px 3px rgba(0,0,0,0.04)",
                transition: "all 0.3s",
              }}>
                <span style={{ fontWeight: 700, marginRight: 6, opacity: 0.6 }}>0{i + 1}</span>
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 40, alignItems: "start" }}>
            <div style={{ paddingTop: 8 }}>
              <h3 style={{ fontFamily: fd, fontWeight: 700, fontSize: 26, color: T.text, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
                {steps[step].title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: T.muted, margin: 0 }}>
                {steps[step].desc}
              </p>
              <div style={{ display: "flex", gap: 6, marginTop: 40 }}>
                {steps.map((_, i) => (
                  <div key={i} style={{ height: 4, borderRadius: 2, background: step === i ? T.sage : T.borderLight, width: step === i ? 36 : 10, transition: "all 0.5s" }} />
                ))}
              </div>
            </div>
            <div>
              <Mock active={true} key={mode + "-" + step} />
            </div>
          </div>
        </div>
      </section>

      {/* EARLY ACCESS */}
      <section style={{ padding: "96px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg," + T.sageBg + " 0%,#f5f9f6 40%," + T.bg + " 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: T.sage, textTransform: "uppercase", marginBottom: 14 }}>EARLY ACCESS</p>
          <h2 style={{ fontFamily: fd, fontWeight: 800, fontSize: "clamp(24px, 3.5vw, 32px)", color: T.text, margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            {isC ? "Take your first assessment for free" : "Get early access to verified talent"}
          </h2>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 28, lineHeight: 1.6 }}>
            {isC ? "Join engineers discovering where they really stand." : "Join startups hiring verified engineers through Walnutt."}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <input type="email" placeholder={isC ? "your@email.com" : "work@company.com"}
              style={{ width: 240, padding: "12px 16px", borderRadius: 12, border: "1.5px solid " + T.border, fontSize: 14, fontFamily: fb, color: T.text, outline: "none", background: T.card }} />
            <button style={{ padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: fb, background: T.sage, color: "#fff" }}>
              {isC ? "Get Early Access" : "Request Access"}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "28px 20px", borderTop: "1px solid " + T.borderLight }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
              <path d="M20 2L37 12V28L20 38L3 28V12Z" stroke={T.sage} strokeWidth="2.5" fill="none" />
              <path d="M16 13L8 20L16 27" stroke={T.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 13L32 20L24 27" stroke={T.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: fb, fontWeight: 800, fontSize: 14, color: T.text }}>Walnutt</span>
            <span style={{ fontSize: 11, color: T.subtle, marginLeft: 4 }}>by 3P Labs Private Limited</span>
          </div>
          <span style={{ fontSize: 11, color: T.subtle }}>© 2026 3P Labs Private Limited</span>
        </div>
      </footer>

      {formType && <FormOverlay type={formType} onClose={() => setFormType(null)} />}
    </div>
  );
}
