import { useState } from "react";
import { C, WalnuttLogo, ContactModal, PrimaryBtn, ModeSwitch, globalKeyframes } from "./shared";
import { EngineersPage } from "./engineers-page";
import { CompaniesPage } from "./companies-page";

export function HomePage() {
  const [mode, setMode] = useState<"engineers" | "companies">("engineers");
  const [showModal, setShowModal] = useState(false);
  const isE = mode === "engineers";

  return (
    <div style={{
      background: C.bg, minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{globalKeyframes}</style>

      {/* ═══ STICKY NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "12px 24px",
        background: "rgba(250,251,249,0.92)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <WalnuttLogo size={24} />
            <span style={{ fontWeight: 800, fontSize: 17, color: C.black, letterSpacing: "-0.02em" }}>
              Walnutt
            </span>
          </a>

          {/* Mode Switch */}
          <ModeSwitch mode={mode} onChange={m => { setMode(m); window.scrollTo({ top: 0, behavior: "smooth" }); }} />

          {/* CTA — hidden on mobile */}
          <div className="hidden md:block">
            <PrimaryBtn
              href={isE ? "https://app.walnutt.co" : undefined}
              onClick={isE ? undefined : () => setShowModal(true)}
              style={{ padding: "8px 20px", fontSize: 13 }}
            >
              {isE ? "Take the Assessment" : "Post a Role"}
            </PrimaryBtn>
          </div>
        </div>
      </nav>

      {/* ═══ PAGE CONTENT ═══ */}
      <main>
        {isE ? <EngineersPage /> : <CompaniesPage onOpenForm={() => setShowModal(true)} />}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "28px 24px", borderTop: `1px solid ${C.gray300}` }}>
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WalnuttLogo size={18} />
            <span style={{ fontWeight: 800, fontSize: 14, color: C.black }}>Walnutt</span>
            <span style={{ fontSize: 12, color: C.gray400, marginLeft: 4 }}>© 2026 Walnutt</span>
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
            <span style={{ fontSize: 12, color: C.gray400 }}>hello@walnutt.co</span>
          </div>
        </div>
      </footer>

      {/* ═══ UNIFIED CONTACT MODAL ═══ */}
      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
