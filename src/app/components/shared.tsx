import { useState, useEffect, useRef, type ReactNode } from "react";
import { X, CheckCircle } from "lucide-react";

// ═══ DESIGN TOKENS ═══
export const C = {
  sage: "#3A6B4C",
  sageDark: "#2D5A3D",
  sageLight: "#E8F0EB",
  black: "#1A1A1A",
  gray800: "#374151",
  gray500: "#6B7280",
  gray400: "#9CA3AF",
  gray300: "#D1D5DB",
  gray100: "#F3F4F6",
  white: "#FFFFFF",
  bg: "#FAFBF9",
};

export const fm = "'JetBrains Mono', monospace";

// ═══ GLOBAL KEYFRAMES ═══
export const globalKeyframes = `
  @keyframes meshDrift1 {
    0%   { transform: translate(0%, 0%); }
    100% { transform: translate(-12%, 8%); }
  }
  @keyframes meshDrift2 {
    0%   { transform: translate(0%, 0%); }
    100% { transform: translate(8%, -10%); }
  }
  @keyframes meshDrift3 {
    0%   { transform: translate(0%, 0%); }
    100% { transform: translate(10%, -6%); }
  }
  @keyframes meshDrift4 {
    0%   { transform: translate(0%, 0%); }
    100% { transform: translate(-6%, 10%); }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0s !important;
      animation-play-state: paused !important;
    }
  }
`;

// ═══ SCROLL FADE-IN ═══
export function FadeSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 350ms ease-out, transform 350ms ease-out",
    }}>
      {children}
    </div>
  );
}

// ═══ BROWSER MOCKUP FRAME ═══
export function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: 12, borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27C93F" }} />
        </div>
        <span style={{ fontSize: 13, color: C.gray400, fontFamily: fm, marginLeft: 8 }}>{url}</span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

// ═══ TYPEWRITER ═══
export function TypeWriter({ text, speed = 25, delay = 0, active }: { text: string; speed?: number; delay?: number; active: boolean }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const span = spanRef.current;
    const cursor = cursorRef.current;
    if (!span) return;
    if (!active) { span.textContent = ""; if (cursor) cursor.style.opacity = "0"; return; }
    span.textContent = "";
    if (cursor) cursor.style.opacity = "0.5";
    let i = 0;
    let iv: ReturnType<typeof setInterval>;
    const timer = setTimeout(() => {
      iv = setInterval(() => {
        i++;
        span.textContent = text.slice(0, i);
        if (i >= text.length) { clearInterval(iv); if (cursor) cursor.style.opacity = "0"; }
      }, speed);
    }, delay);
    return () => { clearTimeout(timer); clearInterval(iv); };
  }, [active, text, speed, delay]);
  return <span><span ref={spanRef} /><span ref={cursorRef} style={{ opacity: 0 }}>|</span></span>;
}

// ═══ FADE-IN WRAPPER ═══
export function FI({ children, delay = 0, active = true }: { children: ReactNode; delay?: number; active?: boolean }) {
  return (
    <div style={{
      opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(14px)",
      transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>{children}</div>
  );
}

// ═══ SCORE RING ═══
export function ScoreRing({ score, size = 48, sw = 3, delay = 0 }: { score: number; size?: number; sw?: number; delay?: number }) {
  const circleRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  useEffect(() => {
    const circle = circleRef.current;
    const label = labelRef.current;
    if (!circle) return;
    circle.style.strokeDashoffset = String(circ);
    if (label) label.textContent = "0%";
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      let c = 0;
      iv = setInterval(() => {
        c++;
        circle.style.strokeDashoffset = String(circ - (c / 100) * circ);
        if (label) label.textContent = `${c}%`;
        if (c >= score) clearInterval(iv);
      }, 12);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [score, delay, circ]);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={sw} />
        <circle ref={circleRef} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.sage} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.12s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span ref={labelRef} style={{ fontWeight: 700, fontSize: size * 0.24, color: C.black }}>0%</span>
      </div>
    </div>
  );
}

// ═══ WALNUTT LOGO ═══
export function WalnuttLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 2L37 12V28L20 38L3 28V12Z" stroke={C.sage} strokeWidth="2.5" fill="none" />
      <path d="M16 13L8 20L16 27" stroke={C.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 13L32 20L24 27" stroke={C.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ═══ MODE SWITCH ═══
export function ModeSwitch({ mode, onChange }: { mode: "engineers" | "companies"; onChange: (m: "engineers" | "companies") => void }) {
  const isCompany = mode === "companies";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        fontSize: 13, fontWeight: isCompany ? 400 : 600,
        color: isCompany ? C.gray400 : C.black,
        transition: "all 200ms",
      }}>Engineers</span>
      <button
        onClick={() => onChange(isCompany ? "engineers" : "companies")}
        aria-label={`Switch to ${isCompany ? "engineers" : "companies"}`}
        style={{
          position: "relative", width: 44, height: 24, borderRadius: 12,
          border: "none", cursor: "pointer", padding: 0,
          background: C.sage,
          transition: "background 200ms",
        }}
      >
        <div style={{
          position: "absolute", top: 2, width: 20, height: 20,
          borderRadius: "50%", background: C.white,
          left: isCompany ? 22 : 2,
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          transition: "left 250ms cubic-bezier(0.65, 0, 0.35, 1)",
        }} />
      </button>
      <span style={{
        fontSize: 13, fontWeight: isCompany ? 600 : 400,
        color: isCompany ? C.black : C.gray400,
        transition: "all 200ms",
      }}>Companies</span>
    </div>
  );
}

// ═══ PRIMARY BUTTON ═══
export function PrimaryBtn({ children, onClick, style: s, href }: { children: ReactNode; onClick?: () => void; style?: React.CSSProperties; href?: string }) {
  const [hover, setHover] = useState(false);
  const styles: React.CSSProperties = {
    display: "inline-block", padding: "14px 28px", borderRadius: 10, border: "none", cursor: "pointer",
    fontSize: 15, fontWeight: 600, fontFamily: "'Inter', sans-serif",
    background: hover ? C.sageDark : C.sage, color: C.white, textDecoration: "none",
    transform: hover ? "translateY(-1px)" : "translateY(0)",
    boxShadow: hover ? "0 4px 12px rgba(58,107,76,0.25)" : "none",
    transition: "all 180ms ease-out", ...s,
  };
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={styles}>{children}</a>
    );
  }
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={styles}>{children}</button>
  );
}

// ═══ SECONDARY BUTTON ═══
export function SecondaryBtn({ children, onClick, style: s }: { children: ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      padding: "14px 28px", borderRadius: 10, cursor: "pointer",
      fontSize: 15, fontWeight: 600, fontFamily: "'Inter', sans-serif",
      background: hover ? C.sageLight : C.white, color: C.black,
      border: `1.5px solid ${hover ? C.sage : C.gray300}`,
      transition: "all 180ms ease-out", ...s,
    }}>{children}</button>
  );
}

// ═══ UNIFIED CONTACT MODAL ═══
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9tAZKaGWTIL5r6FW3fK4rbIUX7p1jnpc-4WHakHrhY7HgLP1uzEGVh0jLDNPD_VZh/exec";

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${C.gray300}`, fontSize: 14, fontFamily: "'Inter', sans-serif",
    color: C.black, outline: "none", boxSizing: "border-box", background: C.white,
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: C.black,
  };

  async function handleSubmit() {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ name, email, mobile, company, designation, message }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
        <div style={{
          width: "100%", maxWidth: 420, borderRadius: 20, padding: 48, background: C.white,
          boxShadow: "0 24px 80px rgba(0,0,0,0.12)", textAlign: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: C.sageLight,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          }}>
            <CheckCircle size={32} color={C.sage} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: C.black, margin: "0 0 8px" }}>We've got it!</h3>
          <p style={{ fontSize: 15, color: C.gray500, lineHeight: 1.6, margin: "0 0 24px" }}>
            Thanks for reaching out. Our team will review your details and get back to you within 24 hours.
          </p>
          <PrimaryBtn onClick={onClose} style={{ width: "100%" }}>Close</PrimaryBtn>
        </div>
      </div>
    );
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", overflowY: "auto" }}>
      <div style={{
        width: "100%", maxWidth: 460, borderRadius: 20, padding: 32, background: C.white,
        boxShadow: "0 24px 80px rgba(0,0,0,0.12)", margin: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: C.black, margin: 0 }}>Get in touch</h3>
            <p style={{ fontSize: 14, color: C.gray500, margin: "6px 0 0", lineHeight: 1.5 }}>
              Tell us what you're looking for and we'll reach out within 24 hours.
            </p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontSize: 18, color: C.gray400, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
          {/* Name + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Full Name <span style={{ color: C.gray400 }}>*</span></label>
              <input style={inputStyle} placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Work Email <span style={{ color: C.gray400 }}>*</span></label>
              <input type="email" style={inputStyle} placeholder="rahul@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Mobile + Company row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Mobile Number</label>
              <input type="tel" style={inputStyle} placeholder="+91 98765 43210" value={mobile} onChange={e => setMobile(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Company <span style={{ color: C.gray400 }}>*</span></label>
              <input style={inputStyle} placeholder="Your company name" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
          </div>

          {/* Designation */}
          <div>
            <label style={labelStyle}>Designation <span style={{ color: C.gray400 }}>*</span></label>
            <div style={{ position: "relative" }}>
              <select
                style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none", paddingRight: 40 }}
                value={designation}
                onChange={e => setDesignation(e.target.value)}
              >
                <option value="" disabled>Select your role</option>
                <option>Founder / Co-Founder</option>
                <option>CTO / VP Engineering</option>
                <option>Engineering Manager</option>
                <option>HR / Talent Acquisition</option>
                <option>Technical Recruiter</option>
                <option>Hiring Manager</option>
                <option>Other</option>
              </select>
              <svg style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5L7 9L11 5" stroke={C.gray400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Message */}
          <div>
            <label style={labelStyle}>Message / Requirement <span style={{ color: C.gray400 }}>*</span></label>
            <textarea rows={3} style={{ ...inputStyle, resize: "none" }}
              placeholder="Tell us what you're hiring for, or ask us anything..."
              value={message} onChange={e => setMessage(e.target.value)} />
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: 13, color: "#DC2626", margin: 0, textAlign: "center" }}>{error}</p>
          )}

          {/* Submit */}
          <PrimaryBtn onClick={handleSubmit} style={{ width: "100%", marginTop: 4, textAlign: "center", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Submitting…" : "Submit"}
          </PrimaryBtn>

          <p style={{ fontSize: 12, color: C.gray400, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
            We'll review your details and connect you with the right person on our team.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══ HERO BACKGROUND — ENGINEERS ═══
export function EngineersHeroIllustration() {
  return <HeroBackground />;
}

// ═══ HERO BACKGROUND — COMPANIES (Hiring Funnel Pipeline) ═══
export function CompaniesHeroIllustration() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
      {/* Base warm tint */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #FAFBF9 0%, #F2FAFA 50%, #F5FAFA 100%)" }} />

      {/* Funnel canvas */}
      <FunnelCanvas />

      {/* Text readability zone */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        background: "radial-gradient(ellipse 720px 420px at 50% 50%, rgba(250,251,249,0.55) 0%, rgba(250,251,249,0.30) 40%, transparent 70%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ═══ COMPANIES FUNNEL CANVAS ═══
interface FunnelParticle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; alive: boolean;
  filtered: boolean; filterFade: number; brightness: number; quality: number;
}

interface VerifiedBurst {
  x: number; y: number; opacity: number; size: number; timer: number;
}

function funnelLerpColor(t: number): { r: number; g: number; b: number } {
  return {
    r: Math.round(14 + (94 - 14) * t),
    g: Math.round(165 + (234 - 165) * t),
    b: Math.round(165 + (212 - 165) * t),
  };
}

function funnelCs(c: { r: number; g: number; b: number }, a: number): string {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

function FunnelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const particlesRef = useRef<FunnelParticle[]>([]);
  const verifiedRef = useRef<VerifiedBurst[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !container || !ctx) return;
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // Funnel geometry
    function funnelTop(x: number): number {
      const t = x / w;
      if (t < 0.15) return h * 0.12;
      if (t < 0.7) {
        const lt = (t - 0.15) / 0.55;
        return h * (0.12 + lt * 0.30);
      }
      const lt = (t - 0.7) / 0.3;
      return h * (0.42 - lt * 0.04);
    }

    function funnelBottom(x: number): number {
      const t = x / w;
      if (t < 0.15) return h * 0.88;
      if (t < 0.7) {
        const lt = (t - 0.15) / 0.55;
        return h * (0.88 - lt * 0.30);
      }
      const lt = (t - 0.7) / 0.3;
      return h * (0.58 + lt * 0.04);
    }

    function funnelCenter(x: number): number {
      return (funnelTop(x) + funnelBottom(x)) / 2;
    }

    function funnelWidth(x: number): number {
      return funnelBottom(x) - funnelTop(x);
    }

    // Spawn particle
    function spawnParticle(): FunnelParticle {
      const yCenter = h * 0.5;
      const spread = h * 0.32;
      return {
        x: -10 + Math.random() * w * 0.05,
        y: yCenter + (Math.random() - 0.5) * spread * 2,
        vx: 0.6 + Math.random() * 1.2,
        vy: 0,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.15 + Math.random() * 0.3,
        alive: true,
        filtered: false,
        filterFade: 1,
        brightness: 0.3 + Math.random() * 0.3,
        quality: Math.random(),
      };
    }

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < 25; i++) {
      const p = spawnParticle();
      p.x = Math.random() * w * 0.7;
      particlesRef.current.push(p);
    }

    const checkpoints = [0.28, 0.48, 0.65]; // as ratios of w

    let time = 0;
    let spawnTimer = 0;

    // Static render for reduced motion
    if (prefersReduced) {
      // Draw static funnel shape
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelTop(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      for (let x = w; x >= 0; x -= 2) {
        ctx.lineTo(x, funnelBottom(x));
      }
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(14,165,165,0.04)");
      grad.addColorStop(0.7, "rgba(94,234,212,0.06)");
      grad.addColorStop(1, "rgba(94,234,212,0.08)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw funnel edges
      const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
      lineGrad.addColorStop(0, "rgba(14,165,165,0.10)");
      lineGrad.addColorStop(0.7, "rgba(94,234,212,0.22)");
      lineGrad.addColorStop(1, "rgba(94,234,212,0.32)");

      [funnelTop, funnelBottom].forEach(fn => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = fn(x);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Static checkpoints
      checkpoints.forEach(ratio => {
        const cx = w * ratio;
        const top = funnelTop(cx);
        const bot = funnelBottom(cx);
        ctx.beginPath();
        ctx.moveTo(cx, top);
        ctx.lineTo(cx, bot);
        ctx.strokeStyle = "rgba(14,165,165,0.10)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      return () => { window.removeEventListener("resize", resize); };
    }

    // Main animation loop
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (w === 0 || h === 0) { animRef.current = requestAnimationFrame(draw); return; }

      time += 0.01;
      spawnTimer++;

      // Spawn new particles
      if (spawnTimer % 8 === 0) {
        particlesRef.current.push(spawnParticle());
      }

      // ── Background gradient mesh ──
      const g1 = ctx.createRadialGradient(w * 0.8, h * 0.25, 0, w * 0.8, h * 0.25, w * 0.4);
      g1.addColorStop(0, "rgba(14,165,165,0.08)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.2, h * 0.7, 0, w * 0.2, h * 0.7, w * 0.45);
      g2.addColorStop(0, "rgba(94,234,212,0.05)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // ── Funnel shape fill ──
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelTop(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      for (let x = w; x >= 0; x -= 2) {
        ctx.lineTo(x, funnelBottom(x));
      }
      ctx.closePath();
      const funnelGrad = ctx.createLinearGradient(0, 0, w, 0);
      funnelGrad.addColorStop(0, "rgba(14,165,165,0.03)");
      funnelGrad.addColorStop(0.5, "rgba(14,165,165,0.04)");
      funnelGrad.addColorStop(0.7, "rgba(94,234,212,0.05)");
      funnelGrad.addColorStop(1, "rgba(94,234,212,0.06)");
      ctx.fillStyle = funnelGrad;
      ctx.fill();

      // ── Funnel boundary lines ──
      const topLineGrad = ctx.createLinearGradient(0, 0, w, 0);
      topLineGrad.addColorStop(0, "rgba(14,165,165,0.08)");
      topLineGrad.addColorStop(0.7, "rgba(94,234,212,0.20)");
      topLineGrad.addColorStop(1, "rgba(94,234,212,0.30)");

      // Top edge glow + core
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelTop(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(14,165,165,0.06)";
      ctx.lineWidth = 8;
      ctx.filter = "blur(6px)";
      ctx.stroke();
      ctx.filter = "none";
      ctx.restore();

      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelTop(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = topLineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bottom edge glow + core
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelBottom(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(14,165,165,0.06)";
      ctx.lineWidth = 8;
      ctx.filter = "blur(6px)";
      ctx.stroke();
      ctx.filter = "none";
      ctx.restore();

      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelBottom(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = topLineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── Checkpoint gates ──
      const cpAbsolute = checkpoints.map(r => w * r);
      cpAbsolute.forEach((cx, i) => {
        const top = funnelTop(cx);
        const bot = funnelBottom(cx);

        // Glow
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, top);
        ctx.lineTo(cx, bot);
        ctx.strokeStyle = `rgba(94,234,212,${0.06 + Math.sin(time * 2 + i) * 0.02})`;
        ctx.lineWidth = 6;
        ctx.filter = "blur(4px)";
        ctx.stroke();
        ctx.filter = "none";
        ctx.restore();

        // Dashed core
        ctx.beginPath();
        ctx.moveTo(cx, top);
        ctx.lineTo(cx, bot);
        ctx.strokeStyle = `rgba(14,165,165,${0.12 + Math.sin(time * 2 + i) * 0.04})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Gate nodes
        [top, bot].forEach(gy => {
          const nodeGlow = ctx.createRadialGradient(cx, gy, 0, cx, gy, 10);
          nodeGlow.addColorStop(0, `rgba(94,234,212,${0.25 + Math.sin(time * 2.5 + i) * 0.1})`);
          nodeGlow.addColorStop(1, "transparent");
          ctx.fillStyle = nodeGlow;
          ctx.beginPath();
          ctx.arc(cx, gy, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(cx, gy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(94,234,212,0.6)";
          ctx.fill();
        });
      });

      // ── Particles ──
      particlesRef.current.forEach(p => {
        if (!p.alive) return;

        const fc = funnelCenter(p.x);
        const ft = funnelTop(p.x);
        const fb = funnelBottom(p.x);
        const fw = funnelWidth(p.x);

        // Guide toward center
        const distFromCenter = p.y - fc;
        p.vy += -distFromCenter * 0.002;
        p.vy *= 0.95;

        // Accelerate through narrow part
        const narrowFactor = 1 + (1 - fw / (h * 0.76)) * 1.5;
        p.x += p.vx * narrowFactor;
        p.y += p.vy;

        // Filter particles near edges
        if (p.x > w * 0.2 && (p.y < ft + 5 || p.y > fb - 5)) {
          if (p.quality < 0.4) p.filtered = true;
        }

        // Checkpoint filtering
        cpAbsolute.forEach((cx, ci) => {
          if (Math.abs(p.x - cx) < 3 && !p.filtered) {
            const threshold = 0.25 + ci * 0.2;
            if (p.quality < threshold) {
              p.filtered = true;
            } else {
              p.brightness = Math.min(1, p.brightness + 0.15);
              p.size = Math.min(4.5, p.size + 0.3);
            }
          }
        });

        // Handle filtered particles
        if (p.filtered) {
          p.filterFade -= 0.015;
          p.vy += (p.y > fc ? 0.3 : -0.3);
          p.vx *= 0.97;
          if (p.filterFade <= 0) { p.alive = false; return; }
        }

        // Past right edge
        if (p.x > w + 20) {
          if (!p.filtered) {
            verifiedRef.current.push({
              x: p.x, y: p.y, opacity: 1,
              size: p.size * 1.3, timer: 60,
            });
          }
          p.alive = false;
          return;
        }

        // Draw particle
        const progress = p.x / w;
        const c = funnelLerpColor(Math.min(1, progress * 1.3));
        const alpha = p.opacity * p.filterFade;
        const brt = p.filtered ? 0.3 : p.brightness;

        // Glow
        const glowSize = p.size * (2.5 + brt * 2);
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        pg.addColorStop(0, funnelCs(c, alpha * brt * 0.4));
        pg.addColorStop(1, "transparent");
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = funnelCs(c, alpha * brt * 0.8);
        ctx.fill();
      });

      // Clean up dead particles
      particlesRef.current = particlesRef.current.filter(p => p.alive);

      // ── Verified exit bursts ──
      verifiedRef.current.forEach(v => {
        v.timer--;
        v.opacity = v.timer / 60;

        const vg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.size * 4);
        vg.addColorStop(0, `rgba(94,234,212,${v.opacity * 0.5})`);
        vg.addColorStop(0.5, `rgba(14,165,165,${v.opacity * 0.15})`);
        vg.addColorStop(1, "transparent");
        ctx.fillStyle = vg;
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(v.x, v.y, v.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,234,212,${v.opacity * 0.8})`;
        ctx.fill();
      });
      verifiedRef.current = verifiedRef.current.filter(v => v.timer > 0);

      // ── Exit zone glow ──
      const exitGlow = ctx.createRadialGradient(w * 0.88, h * 0.5, 0, w * 0.88, h * 0.5, w * 0.15);
      exitGlow.addColorStop(0, "rgba(94,234,212,0.08)");
      exitGlow.addColorStop(0.6, "rgba(14,165,165,0.03)");
      exitGlow.addColorStop(1, "transparent");
      ctx.fillStyle = exitGlow;
      ctx.fillRect(w * 0.7, 0, w * 0.3, h);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}

// ═══ THREE-LAYER HERO BACKGROUND — EXPONENTIAL GROWTH CURVE ═══
function HeroBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
      {/* LAYER 1: Teal/cyan gradient mesh */}
      <GradientMesh />

      {/* LAYER 2: Exponential growth curve canvas */}
      <GrowthCurveCanvas />

      {/* LAYER 3: Text readability zone */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        background: "radial-gradient(ellipse 700px 440px at 50% 45%, rgba(250,251,249,0.50) 0%, rgba(250,251,249,0.25) 45%, transparent 70%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ═══ LAYER 1 — GRADIENT MESH (teal/cyan dominant, minimal sage) ═══
function GradientMesh() {
  const meshBase: React.CSSProperties = {
    position: "absolute", borderRadius: "50%", willChange: "transform", pointerEvents: "none",
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      {/* Warm base tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #FAFBF9 0%, #F2FAFA 50%, #F5FAFA 100%)",
      }} />

      {/* Gradient 1: Teal, upper-right area */}
      <div style={{
        ...meshBase, top: "5%", left: "65%", width: "50%", height: "55%",
        background: "radial-gradient(circle 600px at 50% 50%, rgba(14,165,165,0.10), transparent)",
        animation: "meshDrift1 20s ease-in-out infinite alternate",
      }} />

      {/* Gradient 2: Cyan, lower-center */}
      <div style={{
        ...meshBase, top: "50%", left: "30%", width: "45%", height: "55%",
        background: "radial-gradient(circle 500px at 50% 50%, rgba(94,234,212,0.08), transparent)",
        animation: "meshDrift2 25s ease-in-out infinite alternate",
      }} />

      {/* Gradient 3: Teal, left-center */}
      <div style={{
        ...meshBase, top: "20%", left: "5%", width: "55%", height: "60%",
        background: "radial-gradient(circle 700px at 50% 50%, rgba(14,165,165,0.06), transparent)",
        animation: "meshDrift3 18s ease-in-out infinite alternate",
      }} />

      {/* Gradient 4: Sage (very faint), lower-left */}
      <div style={{
        ...meshBase, top: "50%", left: "15%", width: "35%", height: "45%",
        background: "radial-gradient(circle 400px at 50% 50%, rgba(58,107,76,0.04), transparent)",
        animation: "meshDrift4 30s ease-in-out infinite alternate",
      }} />
    </div>
  );
}

// ═══ LAYER 2 — EXPONENTIAL GROWTH CURVE (Canvas) ═══
// Exponential function: flat for first ~60%, then sharp rise
const EXP_K = 6;
const EXP_DENOM = Math.exp(EXP_K) - 1;
function expCurve(t: number): number {
  return (Math.exp(EXP_K * t) - 1) / EXP_DENOM;
}

// Color interpolation teal → cyan along curve position
function curveColor(t: number): [number, number, number] {
  const teal: [number, number, number] = [14, 165, 165];
  const cyan: [number, number, number] = [94, 234, 212];
  const blend = Math.max(0, Math.min(1, (t - 0.3) / 0.7));
  return [
    Math.round(teal[0] + (cyan[0] - teal[0]) * blend),
    Math.round(teal[1] + (cyan[1] - teal[1]) * blend),
    Math.round(teal[2] + (cyan[2] - teal[2]) * blend),
  ];
}

// Ease-out for draw-on-load
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function GrowthCurveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas || !container || !ctx) return;
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const DRAW_DURATION = 2000; // 2s draw-on-load
    const ECHO_LOWER_DELAY = 500;
    const ECHO_UPPER_DELAY = 800;
    const RAYS_DELAY = 1000;
    const PRIMARY_PULSE_PERIOD = 8000;
    const SECONDARY_PULSE_PERIOD = 12000;
    const SECONDARY_PULSE_DELAY = 2000;

    // Curve geometry helpers
    const bottomY = () => h * 0.82;
    const topY = () => h * 0.12;
    const leftX = () => w * 0.02;
    const rightX = () => w * 0.98;

    function curvePointMain(t: number): { x: number; y: number } {
      return {
        x: leftX() + t * (rightX() - leftX()),
        y: bottomY() - expCurve(t) * (bottomY() - topY()),
      };
    }

    // Flatter echo (lower)
    function curvePointLower(t: number): { x: number; y: number } {
      const flatExp = (Math.exp(EXP_K * 0.7 * t) - 1) / (Math.exp(EXP_K * 0.7) - 1);
      return {
        x: leftX() + t * (rightX() - leftX()),
        y: bottomY() + h * 0.03 - flatExp * (bottomY() - topY()) * 0.6,
      };
    }

    // Steeper echo (upper)
    function curvePointUpper(t: number): { x: number; y: number } {
      const steepExp = (Math.exp(EXP_K * 1.15 * t) - 1) / (Math.exp(EXP_K * 1.15) - 1);
      return {
        x: leftX() + t * (rightX() - leftX()),
        y: bottomY() - h * 0.03 - steepExp * (bottomY() - topY()) * 1.05,
      };
    }

    // Build points array for a curve function up to maxT
    function buildPoints(curveFn: (t: number) => { x: number; y: number }, maxT: number, steps: number) {
      const pts: { x: number; y: number; t: number }[] = [];
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * maxT;
        const p = curveFn(t);
        pts.push({ ...p, t });
      }
      return pts;
    }

    // Draw the main curve with triple-stroke glow, color gradient along path
    function drawMainCurve(points: { x: number; y: number; t: number }[]) {
      if (!ctx || points.length < 2) return;
      const segLen = 4; // draw in small segments for color gradient

      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < points.length - 1; i += segLen) {
          const end = Math.min(i + segLen, points.length - 1);
          const tMid = (points[i].t + points[end].t) / 2;
          const [cr, cg, cb] = curveColor(tMid);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          for (let j = i + 1; j <= end; j++) {
            ctx.lineTo(points[j].x, points[j].y);
          }
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          if (pass === 0) {
            // Outer glow: width 10→28, opacity 5%→12%
            const glowW = 10 + 18 * tMid;
            const glowA = 0.05 + 0.07 * tMid;
            ctx.lineWidth = glowW;
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${glowA})`;
            ctx.shadowColor = `rgba(${cr},${cg},${cb},${glowA * 1.5})`;
            ctx.shadowBlur = 10;
          } else if (pass === 1) {
            // Mid glow: 6px, opacity 8%→18%
            const midA = 0.08 + 0.10 * tMid;
            ctx.lineWidth = 6;
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${midA})`;
            ctx.shadowColor = `rgba(${cr},${cg},${cb},${midA * 1.2})`;
            ctx.shadowBlur = 4;
          } else {
            // Core: 2px, opacity 20%→55%
            const coreA = 0.20 + 0.35 * tMid;
            ctx.lineWidth = 2;
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${coreA})`;
          }
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Area fill under curve
    function drawAreaFill(points: { x: number; y: number; t: number }[]) {
      if (!ctx || points.length < 2) return;
      const bY = bottomY();
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0].x, bY);
      for (const p of points) ctx.lineTo(p.x, p.y);
      ctx.lineTo(points[points.length - 1].x, bY);
      ctx.closePath();

      const grad = ctx.createLinearGradient(leftX(), 0, rightX(), 0);
      grad.addColorStop(0, "rgba(14,165,165,0.005)");
      grad.addColorStop(0.5, "rgba(14,165,165,0.012)");
      grad.addColorStop(1, "rgba(94,234,212,0.03)");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // Echo curves (dashed)
    function drawEchoCurve(
      curveFn: (t: number) => { x: number; y: number },
      opacity: number, lineW: number, dashArr: number[], steps: number
    ) {
      if (!ctx) return;
      const pts = buildPoints(curveFn, 1, steps);
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        if (i === 0) ctx.moveTo(pts[i].x, pts[i].y);
        else ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.setLineDash(dashArr);
      ctx.strokeStyle = `rgba(14,165,165,${opacity})`;
      ctx.lineWidth = lineW;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }

    // Pulse dot with triple-layer glow
    function drawPulse(t: number, brightness: number) {
      if (!ctx) return;
      const p = curvePointMain(t);
      const [cr, cg, cb] = curveColor(t);
      // Glow radius scales with curve position
      const largeR = 30 + 15 * t;
      const tightR = 10;
      const coreR = 3.5;

      // Large glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, largeR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.35 * brightness})`;
      ctx.shadowColor = `rgba(${cr},${cg},${cb},${0.3 * brightness})`;
      ctx.shadowBlur = largeR;
      ctx.fill();
      ctx.restore();

      // Tight glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, tightR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.60 * brightness})`;
      ctx.shadowColor = `rgba(${cr},${cg},${cb},${0.5 * brightness})`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.90 * brightness})`;
      ctx.fill();
    }

    // Particle trail behind pulse
    function drawParticles(pulseT: number, brightness: number) {
      if (!ctx) return;
      const count = w < 900 ? 40 : 85;
      for (let i = 1; i <= count; i++) {
        const pT = pulseT - (i / count) * 0.25; // trail covers 25% of curve behind pulse
        if (pT < 0) continue;
        const p = curvePointMain(pT);
        const [cr, cg, cb] = curveColor(pT);
        // Perpendicular offset for organic feel
        const seed = Math.sin(i * 73.37) * 0.5 + 0.5;
        const offsetDir = Math.cos(i * 41.1) > 0 ? 1 : -1;
        const offset = seed * 15 * offsetDir;
        // Approximate normal direction (perpendicular to curve)
        const tangentAngle = Math.atan2(
          expCurve(Math.min(1, pT + 0.01)) - expCurve(pT), 0.01
        );
        const nx = -Math.sin(tangentAngle) * offset;
        const ny = Math.cos(tangentAngle) * offset;
        const fadeout = 1 - (i / count);
        // Denser/brighter near steep part
        const density = 0.3 + 0.7 * pT;
        const alpha = fadeout * density * 0.30 * brightness;
        if (alpha < 0.005) continue;
        const r = 0.5 + seed * 1;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x + nx, p.y + ny, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.shadowColor = `rgba(${cr},${cg},${cb},${alpha * 0.8})`;
        ctx.shadowBlur = 3;
        ctx.fill();
        ctx.restore();
      }
    }

    // Axes
    function drawAxes() {
      if (!ctx) return;
      const axisColor = "rgba(14,165,165,0.05)";
      const yAxisX = w * 0.06;
      const xAxisY = h * 0.85;

      // Y-axis
      ctx.beginPath();
      ctx.moveTo(yAxisX, h * 0.08);
      ctx.lineTo(yAxisX, xAxisY);
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Y-axis arrow
      ctx.beginPath();
      ctx.moveTo(yAxisX - 3, h * 0.08 + 5);
      ctx.lineTo(yAxisX, h * 0.08);
      ctx.lineTo(yAxisX + 3, h * 0.08 + 5);
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // X-axis
      ctx.beginPath();
      ctx.moveTo(yAxisX, xAxisY);
      ctx.lineTo(w * 0.96, xAxisY);
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Tick marks on Y-axis that light up when pulse passes
    function drawTicks(pulseT: number, elapsed: number) {
      if (!ctx) return;
      const yAxisX = w * 0.06;
      const yTop = h * 0.08;
      const yBot = h * 0.85;
      const tickCount = 8;

      for (let i = 0; i < tickCount; i++) {
        const ratio = (i + 1) / (tickCount + 1);
        const tickY = yBot - ratio * (yBot - yTop);
        // What curve t value reaches this Y?
        const curveYAtPulse = bottomY() - expCurve(pulseT) * (bottomY() - topY());
        const isLit = elapsed > DRAW_DURATION && curveYAtPulse <= tickY;
        const alpha = isLit ? 0.18 : 0.04;

        ctx.beginPath();
        ctx.moveTo(yAxisX - 4, tickY);
        ctx.lineTo(yAxisX + 4, tickY);
        ctx.strokeStyle = `rgba(14,165,165,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (isLit) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(yAxisX, tickY, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(94,234,212,0.25)";
          ctx.shadowColor = "rgba(94,234,212,0.3)";
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Milestone markers at 25%, 50%, 75%
    function drawMilestones(drawProgress: number, elapsed: number) {
      if (!ctx || drawProgress < 1) return;
      const milestones = [0.25, 0.50, 0.75];
      const pulseT = ((elapsed - DRAW_DURATION) % 2500) / 2500;
      const pulseScale = 1 + 0.25 * Math.sin(pulseT * Math.PI * 2) * 0.5 + 0.5;

      for (const m of milestones) {
        const p = curvePointMain(m);
        const [cr, cg, cb] = curveColor(m);
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.45)`;
        ctx.shadowColor = `rgba(${cr},${cg},${cb},0.3)`;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.restore();
      }
    }

    // Light rays at peak
    function drawLightRays(opacity: number) {
      if (!ctx || opacity <= 0) return;
      const peak = curvePointMain(1);
      const rayCount = 7;
      const baseAngle = -Math.PI * 0.25; // upper-right direction
      const spread = Math.PI * 0.5; // 90 degree arc
      const rayLen = w * 0.17;

      // Peak glow node
      ctx.save();
      ctx.beginPath();
      ctx.arc(peak.x, peak.y, 60, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(94,234,212,${0.12 * opacity})`;
      ctx.shadowColor = `rgba(94,234,212,${0.15 * opacity})`;
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.restore();

      for (let i = 0; i < rayCount; i++) {
        const angle = baseAngle - spread / 2 + (spread / (rayCount - 1)) * i;
        const len = rayLen * (0.85 + 0.15 * Math.sin(i * 2.3));
        const endX = peak.x + Math.cos(angle) * len;
        const endY = peak.y + Math.sin(angle) * len;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(peak.x, peak.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(94,234,212,${0.07 * opacity})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      }
    }

    // Static render for reduced motion
    if (prefersReduced) {
      const staticPts = buildPoints(curvePointMain, 1, 200);
      drawAxes();
      drawAreaFill(staticPts);
      drawMainCurve(staticPts);
      drawMilestones(1, DRAW_DURATION + 1000);
      return () => { window.removeEventListener("resize", resize); };
    }

    // Main animation loop
    startTimeRef.current = performance.now();

    function draw(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (w === 0 || h === 0) { animRef.current = requestAnimationFrame(draw); return; }

      const elapsed = now - startTimeRef.current;
      const isDesktop = w >= 900;
      const isTablet = w >= 500 && w < 900;

      // Draw progress (0→1 over 2s with ease-out)
      const drawRaw = Math.min(1, elapsed / DRAW_DURATION);
      const drawProgress = easeOut(drawRaw);
      const drawComplete = drawRaw >= 1;
      const afterDraw = drawComplete ? elapsed - DRAW_DURATION : 0;

      // Steps for curve rendering
      const steps = Math.max(Math.ceil(w / 3), 150);

      // === AXES ===
      drawAxes();

      // === MAIN CURVE ===
      const mainPts = buildPoints(curvePointMain, drawProgress, Math.ceil(steps * drawProgress));
      drawAreaFill(mainPts);
      drawMainCurve(mainPts);

      // === TICK MARKS ===
      if (isDesktop && drawComplete) {
        const primaryT = (afterDraw % PRIMARY_PULSE_PERIOD) / PRIMARY_PULSE_PERIOD;
        drawTicks(primaryT, elapsed);
      }

      // === ECHO CURVES (desktop only, after draw complete) ===
      if (isDesktop && drawComplete) {
        const lowerFade = Math.min(1, Math.max(0, (afterDraw - ECHO_LOWER_DELAY) / 1000));
        if (lowerFade > 0) {
          ctx.globalAlpha = lowerFade;
          drawEchoCurve(curvePointLower, 0.05, 0.7, [3, 8], steps);
          ctx.globalAlpha = 1;
        }

        const upperFade = Math.min(1, Math.max(0, (afterDraw - ECHO_UPPER_DELAY) / 1000));
        if (upperFade > 0) {
          ctx.globalAlpha = upperFade;
          drawEchoCurve(curvePointUpper, 0.04, 0.5, [3, 8], steps);
          ctx.globalAlpha = 1;
        }
      }

      // === MILESTONES ===
      if (drawComplete) {
        drawMilestones(drawProgress, elapsed);
      }

      // === PRIMARY PULSE + PARTICLES ===
      if (drawComplete) {
        const primaryT = (afterDraw % PRIMARY_PULSE_PERIOD) / PRIMARY_PULSE_PERIOD;
        drawParticles(primaryT, 1);
        drawPulse(primaryT, 1);

        // === SECONDARY PULSE (desktop & tablet) ===
        if ((isDesktop || isTablet) && afterDraw > SECONDARY_PULSE_DELAY) {
          const secElapsed = afterDraw - SECONDARY_PULSE_DELAY;
          const secT = (secElapsed % SECONDARY_PULSE_PERIOD) / SECONDARY_PULSE_PERIOD;
          drawPulse(secT, 0.40);
        }
      }

      // === LIGHT RAYS (desktop only) ===
      if (isDesktop && drawComplete) {
        const raysFade = Math.min(1, Math.max(0, (afterDraw - RAYS_DELAY) / 1500));
        if (raysFade > 0) {
          // Gentle pulsing length
          const rayPulse = 1 + 0.05 * Math.sin(afterDraw / 3000 * Math.PI * 2);
          ctx.save();
          // Scale rays slightly for pulse effect
          const peak = curvePointMain(1);
          ctx.translate(peak.x, peak.y);
          ctx.scale(rayPulse, rayPulse);
          ctx.translate(-peak.x, -peak.y);
          drawLightRays(raysFade);
          ctx.restore();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    // Pause RAF when canvas scrolls off-screen or tab is hidden
    const handleVisChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
        animRef.current = 0;
      } else if (!prefersReduced && !animRef.current) {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        cancelAnimationFrame(animRef.current);
        animRef.current = 0;
      } else if (!prefersReduced && !animRef.current) {
        animRef.current = requestAnimationFrame(draw);
      }
    }, { threshold: 0 });
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisChange);
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}