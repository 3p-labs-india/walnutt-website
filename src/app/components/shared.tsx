import { useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { X, CheckCircle } from "lucide-react";
import { V, font, HEX } from "./tokens";

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

  const sage = V.sage;
  const fBody = font.body;
  const fSerif = font.heading;
  const fMono = font.mono;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: "1px solid rgba(60,110,78,0.14)", fontSize: 14, fontFamily: fBody,
    color: V.ink, outline: "none", boxSizing: "border-box",
    background: "rgba(255,255,255,0.6)", transition: "border-color 200ms, box-shadow 200ms",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 500, marginBottom: 6,
    color: "var(--faint)", fontFamily: fBody,
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = sage;
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(60,110,78,0.12)";
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(60,110,78,0.14)";
    e.currentTarget.style.boxShadow = "none";
  };

  function handleSubmit() {
    if (loading) return;
    setLoading(true);
    trackEvent("form_submitted_connect", { company, designation });
    // Fire and forget — show success immediately
    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ name, email, mobile, company, designation, message }),
    }).catch(() => {});
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
        <div style={{
          width: "100%", maxWidth: 420, borderRadius: 24, padding: 48,
          background: "rgba(242,245,243,0.78)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.6) inset",
          textAlign: "center",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", background: "rgba(60,110,78,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          }}>
            <CheckCircle size={26} color={sage} />
          </div>
          <h3 style={{ fontFamily: fSerif, fontSize: 24, fontWeight: 600, color: V.ink, margin: "0 0 8px" }}>We've got it.</h3>
          <p style={{ fontFamily: fBody, fontSize: 15, color: "var(--faint)", lineHeight: 1.6, margin: "0 0 28px" }}>
            Our team will review your details and get back to you within 24 hours.
          </p>
          <button onClick={onClose} style={{
            fontFamily: fBody, fontSize: 14, fontWeight: 600, color: "#fff",
            background: V.dark, padding: "12px 32px", borderRadius: 30, border: "none",
            cursor: "pointer", transition: "all 200ms", width: "100%",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = sage; }}
            onMouseLeave={e => { e.currentTarget.style.background = HEX.dark; }}
          >Close</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", overflowY: "auto" }}>
      <div style={{
        width: "100%", maxWidth: 480, borderRadius: 24, padding: "36px 32px",
        background: "rgba(242,245,243,0.78)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.6) inset",
        margin: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
          <div>
            <p style={{ fontFamily: fMono, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: sage, marginBottom: 8, opacity: 0.6 }}>CONNECT WITH US</p>
            <h3 style={{ fontFamily: fSerif, fontSize: 24, fontWeight: 600, color: V.ink, margin: 0 }}>Let's talk.</h3>
            <p style={{ fontFamily: fBody, fontSize: 14, color: "var(--faint)", margin: "8px 0 0", lineHeight: 1.5 }}>
              Tell us who you need. We'll get back within 24 hours.
            </p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(0,0,0,0.05)", cursor: "pointer", color: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.1)"; e.currentTarget.style.color = "rgba(0,0,0,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; e.currentTarget.style.color = "rgba(0,0,0,0.3)"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle} placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} onFocus={focusInput} onBlur={blurInput} />
            </div>
            <div>
              <label style={labelStyle}>Work Email *</label>
              <input type="email" style={inputStyle} placeholder="rahul@company.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={focusInput} onBlur={blurInput} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Mobile Number</label>
              <input type="tel" style={inputStyle} placeholder="+91 98765 43210" value={mobile} onChange={e => setMobile(e.target.value)} onFocus={focusInput} onBlur={blurInput} />
            </div>
            <div>
              <label style={labelStyle}>Company *</label>
              <input style={inputStyle} placeholder="Your company name" value={company} onChange={e => setCompany(e.target.value)} onFocus={focusInput} onBlur={blurInput} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Your Role *</label>
            <div style={{ position: "relative" }}>
              <select
                style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none", paddingRight: 40 }}
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                onFocus={focusInput as any}
                onBlur={blurInput as any}
              >
                <option value="" disabled>Select your role</option>
                <option>Founder / Co-Founder</option>
                <option>CTO / VP Engineering</option>
                <option>Engineering Manager</option>
                <option>HR / Talent Acquisition</option>
                <option>Technical Recruiter</option>
                <option>Recruitment Agency</option>
                <option>Hiring Manager</option>
                <option>Other</option>
              </select>
              <svg style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5L7 9L11 5" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div>
            <label style={labelStyle}>What are you looking for? *</label>
            <textarea rows={3} style={{ ...inputStyle, resize: "none" }}
              placeholder="Tell us about the role, your team, or just say hello..."
              value={message} onChange={e => setMessage(e.target.value)}
              onFocus={focusInput as any} onBlur={blurInput as any} />
          </div>

          <button onClick={handleSubmit} style={{
            width: "100%", fontFamily: fBody, fontSize: 15, fontWeight: 600, color: "#fff",
            background: V.dark, padding: "14px 24px", borderRadius: 30, border: "none",
            cursor: "pointer", transition: "all 200ms", marginTop: 4,
            opacity: loading ? 0.7 : 1,
          }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = sage; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={e => { e.currentTarget.style.background = HEX.dark; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading ? "Sending..." : "Connect with us →"}
          </button>

          <p style={{ fontFamily: fBody, fontSize: 12, color: "var(--faint-2)", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
            No pitch deck. Just a real conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
