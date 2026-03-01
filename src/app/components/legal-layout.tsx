import React, { useEffect, useState, type ReactNode } from "react";
import { C, WalnuttLogo, globalKeyframes } from "./shared";

export function LegalLayout({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div style={{
      background: C.bg, minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      opacity: loaded ? 1 : 0, transition: "opacity 0.3s",
    }}>
      <style>{globalKeyframes}</style>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        padding: "12px 24px",
        background: "rgba(250,251,249,0.92)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <WalnuttLogo size={24} />
            <span style={{ fontWeight: 800, fontSize: 17, color: C.black, letterSpacing: "-0.02em" }}>
              Walnutt
            </span>
          </a>
          <a href="/" style={{
            fontSize: 13, fontWeight: 600, color: C.sage, textDecoration: "none",
            padding: "6px 16px", borderRadius: 8, border: `1.5px solid ${C.sage}`,
            transition: "all 180ms",
          }}>
            ← Back to Home
          </a>
        </div>
      </nav>

      {/* Content */}
      <main style={{ padding: "64px 24px 96px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: "28px 24px", borderTop: `1px solid ${C.gray300}` }}>
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WalnuttLogo size={18} />
            <span style={{ fontWeight: 800, fontSize: 14, color: C.black }}>Walnutt</span>
            <span style={{ fontSize: 12, color: C.gray400, marginLeft: 4 }}>by 3P Labs Private Limited</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/privacy" style={{ fontSize: 12, color: C.gray400, textDecoration: "none", transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.sage)}
              onMouseLeave={e => (e.currentTarget.style.color = C.gray400)}>
              Privacy Policy
            </a>
            <a href="/terms" style={{ fontSize: 12, color: C.gray400, textDecoration: "none", transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.sage)}
              onMouseLeave={e => (e.currentTarget.style.color = C.gray400)}>
              Terms & Conditions
            </a>
            <span style={{ fontSize: 12, color: C.gray400 }}>© 2026 3P Labs Private Limited</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══ SHARED LEGAL STYLES ═══
export const legalStyles = {
  meta: {
    fontSize: 14, color: C.gray500, lineHeight: 1.8, marginBottom: 32,
  } as React.CSSProperties,
  intro: {
    fontSize: 15, color: C.gray800, lineHeight: 1.7, marginBottom: 40,
  } as React.CSSProperties,
  h2: {
    fontSize: 20, fontWeight: 700, color: C.black, margin: "48px 0 16px", lineHeight: 1.3,
  } as React.CSSProperties,
  h3: {
    fontSize: 16, fontWeight: 600, color: C.black, margin: "24px 0 10px", lineHeight: 1.4,
  } as React.CSSProperties,
  p: {
    fontSize: 15, color: C.gray800, lineHeight: 1.7, margin: "0 0 14px",
  } as React.CSSProperties,
  ul: {
    margin: "0 0 14px", paddingLeft: 24, listStyle: "disc",
  } as React.CSSProperties,
  li: {
    fontSize: 15, color: C.gray800, lineHeight: 1.7, marginBottom: 6,
  } as React.CSSProperties,
  divider: {
    height: 1, background: C.gray300, border: "none", margin: "40px 0",
  } as React.CSSProperties,
  badge: {
    display: "inline-block", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const,
    letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 6,
    background: C.sageLight, color: C.sageDark, marginBottom: 16,
  } as React.CSSProperties,
  pageTitle: {
    fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: C.black,
    letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 8px",
  } as React.CSSProperties,
  strong: {
    fontWeight: 600, color: C.black,
  } as React.CSSProperties,
  email: {
    color: C.sage, fontWeight: 600, textDecoration: "none",
  } as React.CSSProperties,
};