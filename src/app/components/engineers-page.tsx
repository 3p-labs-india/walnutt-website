import React, { useState, useEffect, useRef, useCallback } from "react";
import { buildAppUrl, trackEvent } from "../../lib/analytics";
import { Briefcase, PenLine, User } from "lucide-react";

// ═══ V2 DESIGN TOKENS ═══
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
  amber: "#D4803A",
  amberLight: "#F5E6D0",
};

const font = {
  serif: "'Fraunces', serif",
  body: "'DM Sans', sans-serif",
  heading: "'Bricolage Grotesque', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ═══ SCROLL FADE-IN ═══
function FadeIn({ children, className = "", delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
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
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ═══ DARK STRIP TYPEWRITER ═══
const darkStripText = "The best interviews you've ever had were conversations, not tests. ";
const darkStripBold = "Walnutt is that conversation. ";
const darkStripFaint = "It listens. It follows up. It meets you where you are.";
const fullDarkText = darkStripText + darkStripBold + darkStripFaint;

function DarkStripTypewriter() {
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
    const interval = setInterval(() => {
      setCharCount(prev => {
        if (prev >= fullDarkText.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [visible]);

  const shown = fullDarkText.slice(0, charCount);
  const part1End = darkStripText.length;
  const part2End = part1End + darkStripBold.length;

  return (
    <div ref={ref} style={{ background: V.dark, padding: "44px 48px", textAlign: "center" }}>
      <p style={{ fontFamily: font.heading, fontWeight: 400, fontSize: "clamp(17px, 2vw, 21px)", letterSpacing: "-0.01em", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{shown.slice(0, part1End)}</span>
        <span style={{ color: "#fff", fontWeight: 700 }}>{shown.slice(part1End, part2End)}</span>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>{shown.slice(part2End)}</span>
        {charCount < fullDarkText.length && (
          <span style={{ display: "inline-block", width: 2, height: 18, background: V.sage, marginLeft: 2, animation: "blink 1s step-end infinite", verticalAlign: "text-bottom" }} />
        )}
      </p>
    </div>
  );
}

// ═══ HERO AURORA ═══
function HeroVisual() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Aurora blob 1 — large, center-left, slow */}
      <div style={{
        position: "absolute", top: "30%", left: "35%",
        width: 600, height: 500, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(58,107,76,0.30) 0%, rgba(58,107,76,0.08) 50%, transparent 70%)",
        filter: "blur(80px)",
        animation: "aurora1 18s ease-in-out infinite alternate",
      }} />
      {/* Aurora blob 2 — center-right, offset phase */}
      <div style={{
        position: "absolute", top: "25%", left: "55%",
        width: 500, height: 450, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(90,143,110,0.25) 0%, rgba(90,143,110,0.06) 50%, transparent 70%)",
        filter: "blur(70px)",
        animation: "aurora2 22s ease-in-out infinite alternate",
      }} />
      {/* Aurora blob 3 — teal accent, lower */}
      <div style={{
        position: "absolute", top: "50%", left: "45%",
        width: 450, height: 400, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(14,165,165,0.12) 0%, rgba(14,165,165,0.03) 50%, transparent 70%)",
        filter: "blur(90px)",
        animation: "aurora3 25s ease-in-out infinite alternate",
      }} />
      {/* Aurora blob 4 — bright core behind text */}
      <div style={{
        position: "absolute", top: "35%", left: "50%", transform: "translate(-50%, -50%)",
        width: 350, height: 300, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(58,107,76,0.20) 0%, transparent 60%)",
        filter: "blur(50px)",
        animation: "aurora4 15s ease-in-out infinite alternate",
      }} />
    </div>
  );
}

// ═══ CTA BUTTON (pill style) ═══
function SageBtn({ children, href, eventName, variant = "sage", style: extraStyle }: {
  children: React.ReactNode; href?: string; eventName?: string; variant?: "sage" | "white"; style?: React.CSSProperties;
}) {
  const handleClick = () => { if (eventName) trackEvent(eventName, { location: "engineers_v2" }); };
  const isSage = variant === "sage";
  const base: React.CSSProperties = {
    display: "inline-block", padding: "14px 32px", borderRadius: 30,
    background: isSage ? V.sage : "white", color: isSage ? "#fff" : V.ink,
    fontFamily: font.body, fontSize: 15, fontWeight: 600,
    textDecoration: "none", border: "none", cursor: "pointer", transition: "all 200ms", ...extraStyle,
  };
  const onEnter = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    t.style.background = isSage ? V.sageHover : V.sageTint;
    t.style.transform = "translateY(-1px)";
    t.style.boxShadow = isSage ? "0 4px 16px rgba(58,107,76,0.25)" : "0 4px 20px rgba(0,0,0,0.2)";
  };
  const onLeave = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    t.style.background = isSage ? V.sage : "white";
    t.style.transform = "translateY(0)"; t.style.boxShadow = "none";
  };
  if (href) return <a href={buildAppUrl(href)} target="_blank" rel="noopener noreferrer" style={base} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={handleClick}>{children}</a>;
  return <button style={base} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={handleClick}>{children}</button>;
}

// ═══ FAQ ACCORDION ═══
function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid #E8F0EB" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontFamily: font.body, fontSize: 16, fontWeight: 600, color: V.ink, flex: 1, paddingRight: 16 }}>{q}</span>
        <span style={{ fontSize: 20, color: open ? V.sage : V.muted, fontWeight: 300, lineHeight: 1, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 200ms, color 200ms", flexShrink: 0 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 300ms ease" }}>
        <p style={{ fontFamily: font.body, fontSize: 15, color: V.subtitle, lineHeight: 1.65, paddingBottom: 20 }}>{a}</p>
      </div>
    </div>
  );
}

// ═══ WALNUTT HEXAGON LOGO (sage green) ═══
function WalnuttHex({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 1 L22 6.5 L22 17.5 L12 23 L2 17.5 L2 6.5 Z" stroke={V.sage} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M10 7 L5.5 12 L10 17" stroke={V.sage} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 7 L18.5 12 L14 17" stroke={V.sage} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ═══ HOW IT WORKS — LIGHT APP MOCKUPS ═══

function ConversationMockup({ active }: { active: boolean }) {
  const answerText = "We were migrating a monolithic API to microservices, about 200 endpoints, 50K DAU. I introduced Redis caching as an intermediary layer during the transition to avoid a full cutover. The tricky part was managing cache invalidation across services that were still partially coupled...";
  const [typedLen, setTypedLen] = useState(0);
  const [timerSecs, setTimerSecs] = useState(112);

  useEffect(() => {
    if (!active) { setTypedLen(0); setTimerSecs(112); return; }
    const interval = setInterval(() => {
      setTypedLen(prev => { if (prev >= answerText.length) { clearInterval(interval); return prev; } return prev + 1; });
    }, 30);
    return () => clearInterval(interval);
  }, [active]);

  // Timer countdown
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTimerSecs(prev => { if (prev <= 0) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const mins = Math.floor(timerSecs / 60);
  const secs = timerSecs % 60;
  const timerFraction = timerSecs / 120; // assume 2 min total
  const circumference = 2 * Math.PI * 11;

  return (
    <div style={{ background: V.surface, borderRadius: 16, border: `1px solid ${V.border}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top bar with logo + tabs */}
      <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: `1px solid ${V.border}`, gap: 20, overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <WalnuttHex size={22} />
          <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: 800, color: V.sage }}>walnutt</span>
        </div>
        <div style={{ width: 1, height: 20, background: V.border, flexShrink: 0 }} />
        {["01  Your Story", "02  Design", "03  Debug", "04  Situational", "05  Culture"].map((tab, i) => (
          <span key={tab} style={{
            fontFamily: font.body, fontSize: 12, fontWeight: i === 0 ? 700 : 500, whiteSpace: "nowrap",
            color: i === 0 ? V.ink : V.muted, paddingBottom: 2,
            borderBottom: i === 0 ? `2px solid ${V.sage}` : "2px solid transparent",
          }}>{tab}</span>
        ))}
      </div>

      <div style={{ padding: "28px 32px 32px" }}>
        {/* Section label + Timer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontFamily: font.mono, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: V.muted }}>
            SECTION 01 / YOUR STORY
          </span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 100, background: V.dark, color: "#fff" }}>
            <svg width={28} height={28} viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
              <circle cx="14" cy="14" r="11" stroke={V.sage} strokeWidth="2" fill="none"
                strokeDasharray={`${circumference}`} strokeDashoffset={`${circumference * (1 - timerFraction)}`}
                strokeLinecap="round" transform="rotate(-90 14 14)" style={{ transition: "stroke-dashoffset 1s linear" }} />
              <text x="14" y="14.5" textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: font.mono, fontSize: 7, fill: "white", fontWeight: 500 }}>{mins}:{secs.toString().padStart(2, "0")}</text>
            </svg>
            <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: 600 }}>{mins}:{secs.toString().padStart(2, "0")} remaining</span>
          </div>
        </div>

        {/* Question */}
        <h3 style={{ fontFamily: font.heading, fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: V.ink, lineHeight: 1.25, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Tell us about the most interesting engineering problem you tackled recently.
        </h3>
        <p style={{ fontFamily: font.body, fontSize: 14, color: V.subtitle, margin: "0 0 24px", lineHeight: 1.5 }}>
          Be brief and concise. Just share the high level details of the product
        </p>

        {/* Textarea card */}
        <div style={{ background: V.surface, borderRadius: 14, padding: "20px 24px", minHeight: 140 }}>
          <div style={{ background: V.bg, border: `1px solid ${V.border}`, borderRadius: 10, padding: "20px 22px", minHeight: 140 }}>
            <p style={{ fontFamily: font.body, fontSize: 14, color: active && typedLen > 0 ? V.body : V.muted, lineHeight: 1.7, margin: 0 }}>
              {active && typedLen > 0 ? answerText.slice(0, typedLen) : "Describe the problem, your approach, and the outcome..."}
              {active && typedLen < answerText.length && typedLen > 0 && (
                <span style={{ display: "inline-block", width: 2, height: 16, background: V.sage, marginLeft: 1, animation: "blink 1s step-end infinite", verticalAlign: "text-bottom" }} />
              )}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontFamily: font.mono, fontSize: 11, color: V.muted }}>{active ? typedLen : 0} / 250 characters</span>
            <button style={{
              fontFamily: font.body, fontSize: 14, fontWeight: 600, padding: "10px 28px", borderRadius: 30, border: "none", cursor: "default",
              background: active && typedLen > 50 ? V.sageTint : V.bg, color: active && typedLen > 50 ? V.sage : V.muted, transition: "all 300ms",
            }}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportMockup({ active }: { active: boolean }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!active) { setScrollY(0); return; }
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setScrollY(prev => { if (prev >= 280) { clearInterval(interval); return prev; } return prev + 1; });
      }, 25);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timeout);
  }, [active]);

  return (
    <div style={{ background: V.surface, borderRadius: 16, border: `1px solid ${V.border}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${V.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <WalnuttHex size={22} />
          <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: 800, color: V.sage }}>walnutt</span>
        </div>
        <span style={{ fontFamily: font.mono, fontSize: 11, color: V.sage, fontWeight: 600 }}>Complete</span>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${V.sage}, ${V.sageTint})` }} />

      <div style={{ maxHeight: 460, overflow: "hidden", position: "relative" }}>
        <div style={{ transform: `translateY(-${scrollY}px)`, transition: "transform 25ms linear", padding: "32px 28px 40px" }}>
          <h3 style={{ fontFamily: font.heading, fontSize: 24, fontWeight: 800, color: V.ink, textAlign: "center", margin: "0 0 16px" }}>Here's what stood out.</h3>
          <p style={{ fontFamily: font.body, fontSize: 14, color: V.subtitle, lineHeight: 1.7, textAlign: "center", maxWidth: 480, margin: "0 auto 32px" }}>
            Your <em style={{ color: V.sage, fontStyle: "italic" }}>Redis migration story</em> revealed someone who thinks in systems before solutions. You instinctively mapped failure modes before writing the first line. When the whiteboard pushed you toward scale, your <em style={{ color: V.sage, fontStyle: "italic", textDecoration: "underline" }}>CRDT reasoning</em> showed genuine depth.
          </p>

          <p style={{ fontFamily: font.mono, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: V.muted, margin: "0 0 14px" }}>WHAT YOU DO WELL</p>
          {[
            { title: "You design for failure first", body: "In the system design round, you placed a circuit breaker and retry queue before anyone asked about failure handling. When we introduced the 10,000-user constraint, you immediately identified the WebSocket connection pool as the bottleneck, not the database." },
            { title: "You build context before you build code", body: "Your voice story wasn't a feature list. It was a narrative with decisions, trade-offs, and timestamps. You explained why you chose LRU eviction over TTL-based, referencing specific peak-hour metrics." },
          ].map((item, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${V.sage}`, borderRadius: "0 12px 12px 0", padding: "18px 22px", marginBottom: 14, background: V.surface, border: `1px solid ${V.border}`, borderLeftColor: V.sage, borderLeftWidth: 3 }}>
              <p style={{ fontFamily: font.body, fontSize: 15, fontWeight: 700, color: V.ink, margin: "0 0 8px" }}>{item.title}</p>
              <p style={{ fontFamily: font.body, fontSize: 13, color: V.subtitle, lineHeight: 1.6, margin: 0 }}>{item.body}</p>
            </div>
          ))}

          <p style={{ fontFamily: font.mono, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: V.muted, margin: "24px 0 14px" }}>WHERE TO SHARPEN</p>
          {[
            { title: "Lead with the 'why' before the 'how'", body: "In your behavioral responses, you jumped to the technical solution within the first sentence.", tip: "Try this: start with \"The problem was...\" before \"The solution was...\"" },
            { title: "Name the trade-offs you didn't choose", body: "When you chose eventual consistency, you defended it well, but didn't acknowledge what you were giving up.", tip: "Try this: after stating your choice, add \"What this means we lose is...\"" },
          ].map((item, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${V.amber}`, borderRadius: "0 12px 12px 0", padding: "18px 22px", marginBottom: 14, background: V.surface, border: `1px solid ${V.border}`, borderLeftColor: V.amber, borderLeftWidth: 3 }}>
              <p style={{ fontFamily: font.body, fontSize: 15, fontWeight: 700, color: V.ink, margin: "0 0 8px" }}>{item.title}</p>
              <p style={{ fontFamily: font.body, fontSize: 13, color: V.subtitle, lineHeight: 1.6, margin: "0 0 8px" }}>{item.body}</p>
              <p style={{ fontFamily: font.body, fontSize: 13, color: V.sage, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>{item.tip}</p>
            </div>
          ))}

          <p style={{ fontFamily: font.mono, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: V.muted, margin: "24px 0 14px" }}>WHERE YOU'D THRIVE</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { title: "High autonomy roles", sub: "Self-directed, owns outcomes" },
              { title: "Infrastructure teams", sub: "Thinks in systems and failure modes" },
              { title: "AI-forward orgs", sub: "Uses tooling as force multiplier" },
            ].map(t => (
              <div key={t.title} style={{ flex: 1, minWidth: 120, textAlign: "center", padding: "14px 10px", borderRadius: 10, border: `1px solid ${V.border}` }}>
                <p style={{ fontFamily: font.body, fontSize: 13, fontWeight: 700, color: V.ink, margin: "0 0 4px" }}>{t.title}</p>
                <p style={{ fontFamily: font.body, fontSize: 11, color: V.muted, margin: 0 }}>{t.sub}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: font.body, fontSize: 14, color: V.subtitle, textAlign: "center", lineHeight: 1.6 }}>
            You prefer depth over breadth and ownership over delegation. You'd thrive where engineering decisions are made close to the code.
          </p>
        </div>
      </div>
    </div>
  );
}

function MatchMockup({ active }: { active: boolean }) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!active) { setClicked(false); return; }
    const timeout = setTimeout(() => setClicked(true), 3000);
    return () => clearTimeout(timeout);
  }, [active]);

  return (
    <div style={{ background: V.surface, borderRadius: 16, border: `1px solid ${V.border}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.04)", display: "flex", height: "100%" }}>
      {/* Sidebar with proper line icons */}
      <div className="hidden md:flex" style={{ width: 180, flexShrink: 0, borderRight: `1px solid ${V.border}`, padding: "16px 0", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", marginBottom: 24 }}>
          <WalnuttHex size={22} />
          <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: 800, color: V.sage }}>walnutt</span>
        </div>
        {[
          { label: "Matches", isActive: true, Icon: Briefcase },
          { label: "Work Log", isActive: false, Icon: PenLine },
          { label: "Profile", isActive: false, Icon: User },
        ].map(item => (
          <div key={item.label} style={{
            padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "default",
            background: item.isActive ? V.sagePale : "transparent",
            borderRadius: item.isActive ? 8 : 0,
            margin: item.isActive ? "0 8px" : "0 8px",
          }}>
            <item.Icon size={16} strokeWidth={1.8} color={item.isActive ? V.sage : V.muted} />
            <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: item.isActive ? 600 : 400, color: item.isActive ? V.sage : V.subtitle }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${V.sage}, ${V.sageTint})` }} />
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: V.sage, animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: font.mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: V.sage, textTransform: "uppercase" }}>NEW MATCH</span>
            </div>
            <span style={{ fontFamily: font.mono, fontSize: 11, color: V.amber, fontWeight: 600 }}>⏱ 47h 23m</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${V.sage}, ${V.sageMid})`, color: "#fff",
              fontFamily: font.heading, fontSize: 20, fontWeight: 700,
            }}>R</div>
            <div>
              <p style={{ fontFamily: font.heading, fontSize: 20, fontWeight: 700, color: V.ink, margin: 0 }}>Razorpay</p>
              <p style={{ fontFamily: font.body, fontSize: 12, color: V.muted, margin: 0 }}>Series D · Bangalore · 400+ engineers</p>
            </div>
          </div>

          <p style={{ fontFamily: font.heading, fontSize: 18, fontWeight: 800, color: V.ink, margin: "0 0 2px" }}>Backend Engineer</p>
          <p style={{ fontFamily: font.body, fontSize: 13, color: V.subtitle, margin: "0 0 20px" }}>Payments Infrastructure</p>

          <p style={{ fontFamily: font.mono, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: V.muted, margin: "0 0 10px" }}>WHY YOU MATCHED</p>
          <div style={{ borderLeft: `3px solid ${V.sage}`, paddingLeft: 16, marginBottom: 20 }}>
            <p style={{ fontFamily: font.body, fontSize: 14, color: V.body, lineHeight: 1.65, margin: 0 }}>
              Your systems thinking and Go experience align directly with their payments infrastructure rebuild. They're looking for engineers who've built caching at scale, and your Redis Cluster work stands out. Your preference for greenfield matches their new platform initiative.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {["Systems Design", "Go", "Greenfield", "CTC fit"].map(t => (
              <span key={t} style={{ fontFamily: font.body, fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 20, border: `1px solid ${V.border}`, color: V.sage }}>✓ {t}</span>
            ))}
            <span style={{ fontFamily: font.body, fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 20, border: `1px solid ${V.amberLight}`, color: V.amber }}>Team size smaller</span>
          </div>

          <p style={{ fontFamily: font.mono, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: V.muted, margin: "0 0 10px" }}>WHAT THEY'RE BUILDING</p>
          <p style={{ fontFamily: font.body, fontSize: 13, color: V.body, lineHeight: 1.6, margin: "0 0 14px" }}>
            Rebuilding their core payments gateway to handle 10M+ daily transactions. The team works on distributed systems, event-driven architecture, and real-time settlement.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {["Go", "Kubernetes", "Kafka", "PostgreSQL", "AWS"].map(t => (
              <span key={t} style={{ fontFamily: font.mono, fontSize: 11, fontWeight: 500, padding: "5px 12px", borderRadius: 6, border: `1px solid ${V.border}`, color: V.body }}>{t}</span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button style={{
              flex: 1, padding: "14px 20px", borderRadius: 30, border: "none", cursor: "pointer",
              background: clicked ? V.sageHover : V.sage, color: "#fff",
              fontFamily: font.body, fontSize: 15, fontWeight: 600,
              transform: clicked ? "scale(0.97)" : "scale(1)", transition: "all 300ms",
            }}>{clicked ? "✓ Interest sent!" : "I'm interested"}</button>
            <button style={{
              flex: 1, padding: "14px 20px", borderRadius: 30, border: `1.5px solid ${V.border}`, background: "transparent",
              fontFamily: font.body, fontSize: 15, fontWeight: 600, color: V.body, cursor: "pointer",
              opacity: clicked ? 0.4 : 1, transition: "opacity 300ms",
            }}>Not for me</button>
          </div>

          <p style={{ fontFamily: font.body, fontSize: 12, color: V.muted, textAlign: "center", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: V.sage }} />
            <span>Want to know more about Razorpay's eng culture?</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══ HOW IT WORKS ═══
const howSteps = [
  { number: "01", label: "INTERVIEW", title: "Have a real conversation.", description: "No multiple choice. No timed puzzles. Just a conversation about your real work, one that adapts to you in real time. The kind that reveals what you actually know." },
  { number: "02", label: "DISCOVER", title: "See yourself clearly.", description: "Not a score and a goodbye. A full narrative of your engineering strengths, growth areas, and exactly what to work on next. The kind of feedback you'd normally need five interviews to get." },
  { number: "03", label: "GET FOUND", title: "Companies come to you.", description: "Cross the readiness threshold and your verified profile goes live, visible to engineering-led companies hiring for depth. Below threshold? You get a roadmap, improve, and reassess free." },
];

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [mockKey, setMockKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const progressRef = useRef<ReturnType<typeof setInterval>>();

  const DURATION = 8000;
  const TICK = 50;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return prev;
        return prev + (TICK / DURATION) * 100;
      });
    }, TICK);

    timerRef.current = setInterval(() => {
      setActiveStep(p => (p + 1) % 3);
      setMockKey(k => k + 1);
      setProgress(0);
    }, DURATION);
  }, []);

  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); if (progressRef.current) clearInterval(progressRef.current); }; }, [resetTimer]);

  const handleStepClick = (i: number) => { setActiveStep(i); setMockKey(k => k + 1); setProgress(0); resetTimer(); };

  return (
    <section style={{ background: V.bg, padding: "100px 24px" }} className="md:px-12">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontFamily: font.body, fontSize: 12, fontWeight: 600, letterSpacing: 2.5, color: V.sage, textTransform: "uppercase", marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(30px, 4vw, 48px)", color: V.ink, letterSpacing: "-0.03em" }}>
              From invisible to{" "}<span style={{ fontStyle: "italic", color: V.sage }}>undeniable</span>
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left - Steps with progress bar */}
            <div className="w-full lg:w-80 lg:sticky lg:top-[100px] lg:self-start">
              <div className="hidden lg:block">
                {howSteps.map((step, i) => (
                  <div key={i} onClick={() => handleStepClick(i)} style={{
                    borderLeft: `2px solid ${i === activeStep ? V.sage : V.border}`, padding: "28px 24px", cursor: "pointer",
                    background: i === activeStep ? V.sagePale : "transparent", borderRadius: i === activeStep ? "0 12px 12px 0" : 0, transition: "all 0.4s",
                  }}>
                    <div style={{ fontFamily: font.mono, fontSize: 11, color: i === activeStep ? V.sage : V.muted, marginBottom: 4 }}>{step.number}</div>
                    <div style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: i === activeStep ? V.sage : V.muted, marginBottom: 6 }}>{step.label}</div>
                    <div style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 20, color: i === activeStep ? V.ink : V.muted, letterSpacing: "-0.01em", marginBottom: i === activeStep ? 10 : 0 }}>{step.title}</div>
                    <div style={{ fontFamily: font.body, fontSize: 14, color: i === activeStep ? V.subtitle : V.muted, lineHeight: 1.6, maxHeight: i === activeStep ? 200 : 0, overflow: "hidden", transition: "max-height 400ms, color 400ms" }}>{step.description}</div>
                    {/* Progress bar */}
                    {i === activeStep && (
                      <div style={{ height: 2, borderRadius: 100, background: V.border, marginTop: 14, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: V.sage, width: `${progress}%`, transition: "width 50ms linear", borderRadius: 100 }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="lg:hidden overflow-x-auto flex gap-4 pb-4" style={{ scrollbarWidth: "none" }}>
                {howSteps.map((step, i) => (
                  <div key={i} onClick={() => handleStepClick(i)} style={{
                    minWidth: 200, borderBottom: `2px solid ${i === activeStep ? V.sage : V.border}`,
                    padding: "16px 16px 20px", cursor: "pointer", background: i === activeStep ? V.sagePale : "transparent",
                    borderRadius: i === activeStep ? "12px 12px 0 0" : 0, transition: "all 0.4s", flexShrink: 0,
                  }}>
                    <div style={{ fontFamily: font.mono, fontSize: 11, color: i === activeStep ? V.sage : V.muted }}>{step.number}</div>
                    <div style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: i === activeStep ? V.sage : V.muted, marginBottom: 4 }}>{step.label}</div>
                    <div style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 17, color: i === activeStep ? V.ink : V.muted, letterSpacing: "-0.01em" }}>{step.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1" style={{ minWidth: 0 }}>
              <div key={mockKey} style={{ animation: "fadeCard 400ms ease", height: 620 }}>
                {activeStep === 0 && <div style={{ height: "100%" }}><ConversationMockup active={true} /></div>}
                {activeStep === 1 && <div style={{ height: "100%" }}><ReportMockup active={true} /></div>}
                {activeStep === 2 && <div style={{ height: "100%" }}><MatchMockup active={true} /></div>}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ═══ WHY WALNUTT — 6 VALUE PROPS (SVG illustrations) ═══

function ConversationSVG() {
  return (
    <svg width="100%" height="90" viewBox="0 0 200 90" fill="none">
      {/* Chat bubbles — adaptive conversation */}
      <rect x="20" y="10" width="90" height="24" rx="12" stroke={V.sageMid} strokeWidth="1.2" opacity="0.3" />
      <line x1="32" y1="22" x2="80" y2="22" stroke={V.sageMid} strokeWidth="1.5" opacity="0.2" />
      <rect x="90" y="40" width="90" height="24" rx="12" stroke={V.sageMid} strokeWidth="1.2" opacity="0.4" />
      <line x1="102" y1="52" x2="155" y2="52" stroke={V.sageMid} strokeWidth="1.5" opacity="0.25" />
      {/* Follow-up arrow curving to next bubble */}
      <path d="M65 34 Q75 38 90 40" stroke={V.sageMid} strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="3 3" />
      <rect x="30" y="70" width="110" height="14" rx="7" stroke={V.sageMid} strokeWidth="1.2" opacity="0.5" />
      <line x1="42" y1="77" x2="120" y2="77" stroke={V.sageMid} strokeWidth="1.5" opacity="0.3" />
      {/* Adaptive dot */}
      <circle cx="135" cy="52" r="3" fill={V.sageMid} opacity="0.5" />
      <path d="M138 52 Q145 60 140 70" stroke={V.sageMid} strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="3 3" />
    </svg>
  );
}

function GitHubSVG() {
  return (
    <svg width="100%" height="90" viewBox="0 0 200 90" fill="none">
      {/* Contribution grid */}
      {[0,1,2,3,4,5,6,7,8,9].map(col =>
        [0,1,2,3,4].map(row => (
          <rect key={`${col}-${row}`} x={25 + col * 16} y={10 + row * 16} width="11" height="11" rx="2"
            fill={V.sageMid} opacity={[0.08, 0.15, 0.25, 0.4, 0.55][[3,1,0,2,4,1,3,0,2,4][col] % 5]} />
        ))
      )}
      {/* Verified badge */}
      <circle cx="185" cy="45" r="12" stroke={V.sageMid} strokeWidth="1.5" opacity="0.4" />
      <path d="M180 45 L183 48 L190 41" stroke={V.sageMid} strokeWidth="1.8" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FiveDimensionsSVG() {
  return (
    <svg width="100%" height="90" viewBox="0 0 200 90" fill="none">
      {/* Pentagon with 5 points — radar chart */}
      <polygon points="100,12 145,38 130,78 70,78 55,38" stroke={V.sageMid} strokeWidth="1" opacity="0.15" fill="none" />
      <polygon points="100,25 132,42 122,70 78,70 68,42" stroke={V.sageMid} strokeWidth="1" opacity="0.25" fill="none" />
      {/* Filled shape (score) */}
      <polygon points="100,20 140,40 125,75 72,68 60,38" fill={V.sageMid} opacity="0.08" stroke={V.sageMid} strokeWidth="1.5" opacity="0.4" />
      {/* Dimension dots */}
      <circle cx="100" cy="20" r="3" fill={V.sageMid} opacity="0.5" />
      <circle cx="140" cy="40" r="3" fill={V.sageMid} opacity="0.5" />
      <circle cx="125" cy="75" r="3" fill={V.sageMid} opacity="0.5" />
      <circle cx="72" cy="68" r="3" fill={V.sageMid} opacity="0.5" />
      <circle cx="60" cy="38" r="3" fill={V.sageMid} opacity="0.5" />
      {/* Labels */}
      <text x="100" y="8" fontFamily="'JetBrains Mono'" fontSize="6" fill="rgba(255,255,255,0.2)" textAnchor="middle">story</text>
      <text x="152" y="40" fontFamily="'JetBrains Mono'" fontSize="6" fill="rgba(255,255,255,0.2)">design</text>
      <text x="132" y="84" fontFamily="'JetBrains Mono'" fontSize="6" fill="rgba(255,255,255,0.2)">debug</text>
      <text x="42" y="84" fontFamily="'JetBrains Mono'" fontSize="6" fill="rgba(255,255,255,0.2)">situational</text>
      <text x="32" y="40" fontFamily="'JetBrains Mono'" fontSize="6" fill="rgba(255,255,255,0.2)">culture</text>
    </svg>
  );
}

function OneMatchSVG() {
  return (
    <svg width="100%" height="90" viewBox="0 0 200 90" fill="none">
      {/* Multiple candidates faded */}
      <circle cx="40" cy="45" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <circle cx="70" cy="45" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <circle cx="100" cy="45" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      {/* Arrow pointing to the one */}
      <path d="M115 45 L140 45" stroke={V.sageMid} strokeWidth="1.5" opacity="0.4" />
      <path d="M136 41 L140 45 L136 49" stroke={V.sageMid} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* The one match — highlighted */}
      <circle cx="160" cy="45" r="14" stroke={V.sageMid} strokeWidth="2" opacity="0.6" />
      <circle cx="160" cy="42" r="4" fill={V.sageMid} opacity="0.4" />
      <path d="M153 52 Q160 57 167 52" stroke={V.sageMid} strokeWidth="1.2" opacity="0.4" fill="none" />
      {/* Your choice indicator */}
      <text x="160" y="72" fontFamily="'JetBrains Mono'" fontSize="7" fill={V.sageMid} opacity="0.4" textAnchor="middle">you decide</text>
    </svg>
  );
}

function ReportSVG() {
  return (
    <svg width="100%" height="90" viewBox="0 0 200 90" fill="none">
      {/* Document outline */}
      <rect x="55" y="5" width="90" height="80" rx="8" stroke={V.sageMid} strokeWidth="1.2" opacity="0.25" />
      {/* Content lines */}
      <line x1="68" y1="20" x2="110" y2="20" stroke={V.sageMid} strokeWidth="2" opacity="0.3" />
      <line x1="68" y1="32" x2="130" y2="32" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <line x1="68" y1="40" x2="125" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      {/* Strength bar */}
      <rect x="68" y="52" width="60" height="5" rx="2.5" fill={V.sageMid} opacity="0.3" />
      <rect x="68" y="52" width="45" height="5" rx="2.5" fill={V.sageMid} opacity="0.5" />
      {/* Growth bar */}
      <rect x="68" y="62" width="60" height="5" rx="2.5" fill={V.sageMid} opacity="0.15" />
      <rect x="68" y="62" width="30" height="5" rx="2.5" fill="#D4803A" opacity="0.4" />
      {/* Sparkle */}
      <path d="M130 15 L132 11 L134 15 L138 17 L134 19 L132 23 L130 19 L126 17 Z" fill={V.sageMid} opacity="0.3" />
    </svg>
  );
}

function FreeSVG() {
  return (
    <svg width="100%" height="90" viewBox="0 0 200 90" fill="none">
      {/* Price tag crossed out */}
      <rect x="40" y="30" width="50" height="30" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <text x="65" y="50" fontFamily="'JetBrains Mono'" fontSize="12" fill="rgba(255,255,255,0.15)" textAnchor="middle">$$$</text>
      <line x1="38" y1="62" x2="92" y2="28" stroke="rgba(255,100,100,0.3)" strokeWidth="1.5" />
      {/* Free / heart */}
      <circle cx="140" cy="45" r="18" stroke={V.sageMid} strokeWidth="1.5" opacity="0.35" />
      <path d="M132 42 C132 36 140 34 140 40 C140 34 148 36 148 42 C148 50 140 54 140 54 C140 54 132 50 132 42Z" fill={V.sageMid} opacity="0.3" />
      {/* Zero line */}
      <text x="140" y="72" fontFamily="'JetBrains Mono'" fontSize="7" fill={V.sageMid} opacity="0.4" textAnchor="middle">always free</text>
    </svg>
  );
}

const whyItems = [
  { visual: <ConversationSVG />, title: "Real conversation, not a quiz", desc: "Adaptive follow-ups based on your actual answers. No multiple choice. No trick questions." },
  { visual: <GitHubSVG />, title: "GitHub verified", desc: "We see your actual work. Commits, contributions, and the projects you've shipped." },
  { visual: <FiveDimensionsSVG />, title: "Five dimensions, one conversation", desc: "System design, debugging, situational thinking, culture, and your story. All in under 30 minutes." },
  { visual: <OneMatchSVG />, title: "One match at a time. You decide", desc: "No spam. No mass applications. You see the company, the role, and why you matched before anything is shared." },
  { visual: <ReportSVG />, title: "A report worth reading", desc: "A full narrative of your strengths, growth areas, and what to sharpen next. Valuable even if you're not job hunting." },
  { visual: <FreeSVG />, title: "Completely free for engineers", desc: "No placement fees. No hidden charges. No catch. Just have a conversation." },
];

function WhyWalnutt() {
  return (
    <section style={{ background: V.dark, padding: "100px 24px" }} className="md:px-12">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: font.body, fontSize: 12, fontWeight: 600, letterSpacing: 2.5, color: V.sageMid, textTransform: "uppercase", marginBottom: 12 }}>WHY WALNUTT</div>
            <h2 style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 42px)", color: "white", letterSpacing: "-0.03em", maxWidth: 680, margin: "0 auto", lineHeight: 1.15 }}>
              A hiring system that actually{" "}<span style={{ fontStyle: "italic", color: V.sageMid }}>understands engineers</span>
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 960, margin: "0 auto" }}>
            {whyItems.map((item, i) => (
              <WhyCard key={i} visual={item.visual} title={item.title} desc={item.desc} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function WhyCard({ visual, title, desc }: { visual: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: 20, padding: "32px 28px 28px",
      border: "1px solid rgba(255,255,255,0.06)",
      transition: "all 400ms cubic-bezier(0.16,1,0.3,1)", cursor: "default",
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
      <div style={{ marginBottom: 20, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {visual}
      </div>
      <p style={{ fontFamily: font.heading, fontSize: 17, fontWeight: 600, color: "white", margin: "0 0 10px", lineHeight: 1.3 }}>{title}</p>
      <p style={{ fontFamily: font.body, fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

// ═══ WHO IT'S FOR ═══
const roleCards = [
  {
    role: "Backend Engineers",
    tagline: "You think in systems. Let that show.",
    body: "You've designed APIs that handle real traffic, debugged production incidents at 2am, and made database decisions that actually held up. But your resume says 'Java, Spring Boot, PostgreSQL', just like ten thousand others. Walnutt's conversation goes where resumes can't: your reasoning under constraints, how you handle failure modes, and why you made the tradeoffs you did.",
    proof: "From first API to distributed systems, the conversation meets you where you are.",
  },
  {
    role: "Full-Stack Engineers",
    tagline: "You connect the dots others don't see.",
    body: "You're the one who knows why the frontend is slow before anyone checks the backend. You think across layers: component architecture, API contracts, data flow, deployment. Most assessments test you on one side or the other. Walnutt has a conversation about the whole picture: how you make decisions that cross boundaries, and why your systems actually work end-to-end.",
    proof: "Whether you started with React or Rails, the conversation adapts to your stack and your story.",
  },
  {
    role: "Applied AI Engineers",
    tagline: "You ship models. Not just notebooks.",
    body: "You've moved past tutorials. You know the difference between a model that demos well and one that serves real users. Walnutt's conversation explores what most interviews skip: your pipeline thinking, your deployment tradeoffs, how you handle data quality in the real world, and whether you reach for the right tool or the trendy one.",
    proof: "Fine-tuning your first LLM or scaling inference in production, the conversation finds your edge.",
  },
];

function WhoItsFor() {
  const [activeRole, setActiveRole] = useState(0);
  return (
    <section style={{ background: V.bg, padding: "80px 24px" }} className="md:px-12">
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: font.body, fontSize: 12, fontWeight: 600, letterSpacing: 2.5, color: V.sage, textTransform: "uppercase", marginBottom: 12 }}>WHO IT'S FOR</div>
            <h2 style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 42px)", color: V.ink, letterSpacing: "-0.03em", marginBottom: 16 }}>
              For engineers who'd rather{" "}<span style={{ fontStyle: "italic", color: V.sage }}>show it</span>{" "}than list it
            </h2>
            <p style={{ fontFamily: font.body, fontSize: 17, color: V.subtitle, maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
              Fresher or 10-year veteran. Tier-1 or self-taught. The conversation doesn't care where you've been. It listens to how you think.
            </p>
          </div>
        </FadeIn>

        {/* Role pills */}
        <FadeIn delay={100}>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            {roleCards.map((card, i) => (
              <button key={card.role} onClick={() => setActiveRole(i)} style={{
                fontFamily: font.body, fontSize: 14, fontWeight: 600, color: i === activeRole ? V.sage : V.subtitle,
                background: i === activeRole ? V.sagePale : "white", border: `1.5px solid ${i === activeRole ? V.sage : V.border}`,
                borderRadius: 100, padding: "10px 24px", cursor: "pointer", transition: "all 200ms",
              }}>{card.role}</button>
            ))}
          </div>
        </FadeIn>

        {/* Active role card */}
        <FadeIn delay={200}>
          <div key={activeRole} style={{
            background: "white", borderRadius: 20, padding: "40px 36px",
            border: `1px solid ${V.border}`, maxWidth: 720, margin: "0 auto",
            animation: "fadeCard 400ms ease",
          }}>
            <p style={{ fontFamily: font.heading, fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: V.ink, marginBottom: 16, letterSpacing: "-0.02em" }}>
              "{roleCards[activeRole].tagline}"
            </p>
            <p style={{ fontFamily: font.body, fontSize: 15, color: V.subtitle, lineHeight: 1.7, marginBottom: 20 }}>
              {roleCards[activeRole].body}
            </p>
            <p style={{ fontFamily: font.body, fontSize: 14, fontStyle: "italic", color: V.sage, lineHeight: 1.6 }}>
              {roleCards[activeRole].proof}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <SageBtn href="/" eventName="cta_clicked_whosfor">Have a Conversation →</SageBtn>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ═══ ENGINEERS PAGE (V2) ═══
export function EngineersPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How long does it take?", a: "Less than 30 minutes. Five adaptive rounds: your story, system design, debugging, situational thinking, and culture fit. Most people say it went faster than they expected." },
    { q: "Do I need to prepare?", a: "No. This isn't a test you cram for. The conversation is about your real work, your real decisions, and how you actually think. Show up as you are." },
    { q: "Is the conversation really free?", a: "Yes. Completely free. No credit card. No trial period. You get a detailed skill report with a full narrative assessment, regardless of the outcome." },
    { q: "What happens during the conversation?", a: "Five personalized rounds that adapt to you in real time. Your Story: tell us about your real engineering work. System Design: think through architecture with real constraints. Debugging: trace through a problem live. Situational: how you handle real engineering decisions. Culture: what kind of team brings out your best. Every follow-up is based on what you said." },
    { q: "Can I use AI tools during the conversation?", a: "You won't need to. Walnutt doesn't test how you code. It explores how you think and what you've built. Every question is personalized to your answers, so there's nothing to look up." },
    { q: "How does matching work?", a: "It's not a pass/fail. Walnutt understands your engineering profile, your strengths, your style, the kind of work that fits you, and matches you with companies looking for exactly that. We're actively partnering with engineering-led companies to bring you the right opportunities. No spam. No mass applications." },
    { q: "Is my data shared with companies?", a: "Only after you say yes. When a company wants to connect, you see the match first: why they're interested, what they're building, and whether it fits. Your data goes to them only when you accept. No surprise calls. You decide." },
    { q: "What does Walnutt charge candidates?", a: "Nothing. Ever. No placement fees, no success fees, no hidden charges. Walnutt is free for candidates. If it helped you, just spread the word." },
    { q: "I'm not actively job hunting. Should I still do it?", a: "Yes. We're pretty confident you'll enjoy the conversation itself. It's unlike any interview you've had. You get a detailed report showing exactly where you stand. And you can pause anytime, choose not to share your profile for jobs, and just keep the insights." },
  ];

  const animStyle = (delay: number) => ({ animation: `fadeInUp 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` });

  return (
    <div style={{ fontFamily: font.body, color: V.ink, background: V.bg }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeCard { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(90,143,110,0.0); }
          50% { box-shadow: 0 0 50px rgba(90,143,110,0.3); }
        }
        @keyframes aurora1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes aurora2 {
          0% { transform: translate(0, 0) scale(1.1); }
          100% { transform: translate(-80px, 30px) scale(0.9); }
        }
        @keyframes aurora3 {
          0% { transform: translate(0, 0) scale(0.9); }
          100% { transform: translate(40px, -50px) scale(1.2); }
        }
        @keyframes aurora4 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh",
        background: V.dark,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "100px 24px 60px",
        position: "relative", overflow: "hidden",
      }}>
        <HeroVisual />

        {/* H1 */}
        <h1 style={{
          fontFamily: font.heading, fontWeight: 600, fontSize: "clamp(36px, 5vw, 64px)",
          letterSpacing: "-0.02em", lineHeight: 1.12, textAlign: "center", maxWidth: 860,
          color: "#fff", marginBottom: 24, position: "relative", ...animStyle(100),
        }}>
          Outgrow the<br />
          hiring <span style={{ color: V.sageMid, fontStyle: "italic" }}>audition.</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: font.body, fontWeight: 300, fontSize: "clamp(16px, 1.8vw, 19px)",
          color: "rgba(255,255,255,0.5)", maxWidth: 720, lineHeight: 1.65, textAlign: "center", marginBottom: 44, position: "relative", ...animStyle(250),
        }}>
          No applications. No wasted hours. One real conversation, and the right companies start finding you.
        </p>

        {/* CTA with breathing glow */}
        <div style={{ position: "relative", ...animStyle(400) }}>
          <div style={{ position: "absolute", inset: -10, borderRadius: 38, animation: "ctaGlow 3s ease-in-out infinite", pointerEvents: "none" }} />
          <SageBtn href="/" eventName="cta_clicked_hero">Have a Conversation →</SageBtn>
        </div>

        {/* Single italic line */}
        <p style={{ fontFamily: font.heading, fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.3)", marginTop: 24, position: "relative", ...animStyle(500) }}>
          Unlike any interview you've ever given.
        </p>
      </section>

      {/* ═══ DARK STRIP (typewriter) ═══ */}
      <DarkStripTypewriter />

      {/* ═══ HOW IT WORKS ═══ */}
      <HowItWorks />

      {/* ═══ WHY WALNUTT ═══ */}
      <WhyWalnutt />

      {/* ═══ WHO IT'S FOR ═══ */}
      <WhoItsFor />

      {/* ═══ NUMBERS ═══ */}
      <section style={{ background: V.bg, padding: "72px 24px", borderTop: `1px solid ${V.border}`, borderBottom: `1px solid ${V.border}` }} className="md:px-12">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div className="numbers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
              {[
                { value: "30 min", label: "One conversation.\nThat's the starting commitment." },
                { value: "71%", label: "Of candidates at final\ninterviews get offers." },
                { value: "100%", label: "Get detailed feedback.\nEvery single engagement." },
                { value: "0", label: "Applications to send.\nCompanies find you." },
                { value: "Free", label: "Always. For engineers.\nNo catch." },
              ].map((n, i, arr) => (
                <div key={i} style={{
                  textAlign: "center", padding: "28px 16px", position: "relative",
                  borderRight: i < arr.length - 1 ? `1px solid ${V.border}` : "none",
                }}>
                  <div style={{
                    fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 3.2vw, 36px)",
                    color: V.ink, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10,
                  }}>
                    {n.value}
                  </div>
                  <div style={{
                    fontFamily: font.body, fontSize: 13, color: V.subtitle,
                    lineHeight: 1.5, whiteSpace: "pre-line",
                  }}>
                    {n.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px 0 !important; }
            .numbers-grid > div { border-right: none !important; border-bottom: 1px solid ${V.border}; padding-bottom: 24px !important; }
          }
        `}</style>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ background: "white", padding: "80px 24px" }} className="md:px-12">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 32, color: V.ink, textAlign: "center", marginBottom: 40, letterSpacing: "-0.02em" }}>
              Questions you're probably asking
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section id="engineer-cta" style={{ background: V.dark, padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }} className="md:px-12">
        {/* Decorative arcs (white, faint) */}
        <div style={{ position: "absolute", top: -150, right: -150, width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -200, left: -150, width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <h2 style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)", color: "white", letterSpacing: "-0.03em", marginBottom: 36, lineHeight: 1.15 }}>
              You've been ready{" "}<span style={{ fontStyle: "italic", color: V.sageMid }}>The right companies just don't know it yet</span>
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <SageBtn href="/" eventName="cta_clicked_closing" variant="white">Have a Conversation →</SageBtn>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
