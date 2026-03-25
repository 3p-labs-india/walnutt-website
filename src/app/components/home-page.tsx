import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { C, WalnuttLogo, ContactModal, globalKeyframes } from "./shared";
import { EngineersPage } from "./engineers-page";
import { CompaniesPage } from "./companies-page";
import { buildAppUrl, trackEvent } from "../../lib/analytics";

// V2 tokens
const V = {
  bg: "#F4F8F5",
  sage: "#3A6B4C",
  sageHover: "#2E5540",
  sageTint: "#DFF0E5",
  sageMid: "#5A8F6E",
  ink: "#1A2420",
  subtitle: "#6B7D74",
  muted: "#A8B8B0",
  border: "#D8E6DC",
  dark: "#1A2420",
};
const font = {
  body: "'DM Sans', sans-serif",
  heading: "'Bricolage Grotesque', sans-serif",
  serif: "'Fraunces', serif",
};

// ═══ V1-STYLE WALNUTT LOGO (hexagon + chevrons + text) ═══
function WalnuttWordmark({ color = "#3A6B4C", size = 0.75 }: { color?: string; size?: number }) {
  const w = Math.round(140 * size);
  const h = Math.round(36 * size);
  return (
    <svg width={w} height={h} viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 4 L71 22 L71 58 L40 76 L9 58 L9 22 Z" stroke={color} strokeWidth="4" fill="none" strokeLinejoin="round" />
      <path d="M34 24 L20 40 L34 56" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M46 24 L60 40 L46 56" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="88" y="53" fontFamily="'DM Sans',sans-serif" fontWeight="800" fontSize="36" fill={color} letterSpacing="-0.8">Walnutt</text>
    </svg>
  );
}

export function HomePage() {
  const [mode, setMode] = useState<"engineers" | "companies">(() => {
    try { return (localStorage.getItem("walnutt_mode") as "engineers" | "companies") || "engineers"; } catch { return "engineers"; }
  });
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isE = mode === "engineers";

  const handleToggle = (newMode: "engineers" | "companies") => {
    setMode(newMode);
    setMenuOpen(false);
    try { localStorage.setItem("walnutt_mode", newMode); } catch {}
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const scrollToCTA = () => {
    const id = isE ? "engineer-cta" : "company-cta";
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{
      background: isE ? V.bg : C.bg, minHeight: "100vh",
      fontFamily: isE ? font.body : "'Inter', sans-serif",
    }}>
      <Helmet>
        <title>{isE ? "Walnutt — One conversation. The right companies find you." : "Walnutt — Hire now. Pay later."}</title>
        <meta name="description" content={isE
          ? "You've applied everywhere. Now let companies apply to you. One conversation, a verified skill profile, and companies that hire for depth find you."
          : "No upfront fees. We earn our place on your team the same way your engineer does. One month at a time."
        } />
        <meta property="og:title" content={isE ? "Walnutt — One conversation. The right companies find you." : "Walnutt — Hire now. Pay later."} />
        <meta property="og:description" content={isE
          ? "You've applied everywhere. Now let companies apply to you."
          : "No upfront fees. We earn our place on your team the same way your engineer does. One month at a time."
        } />
        <link rel="canonical" href="https://walnutt.co/" />
      </Helmet>
      <style>{globalKeyframes}</style>

      {/* ═══ STICKY NAV ═══ */}
      {isE ? (
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(244,248,245,0.85)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }} className="md:px-12">
            {/* Logo */}
            <div style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => handleToggle("engineers")}>
              <WalnuttWordmark color={V.sage} size={0.9} />
            </div>

            {/* Center - Toggle (always visible) */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span onClick={() => handleToggle("engineers")} style={{
                fontFamily: font.body, fontSize: 13, fontWeight: 600,
                color: isE ? V.ink : V.subtitle, transition: "color 250ms", cursor: "pointer", userSelect: "none",
              }}>Engineers</span>
              <div onClick={() => handleToggle(isE ? "companies" : "engineers")} style={{
                width: 44, height: 24, borderRadius: 12,
                background: !isE ? V.sage : "rgba(26,36,32,0.15)",
                position: "relative", cursor: "pointer", transition: "background 300ms", flexShrink: 0,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "white",
                  position: "absolute", top: 3, left: !isE ? 23 : 3,
                  transition: "left 300ms cubic-bezier(.4,0,.2,1)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }} />
              </div>
              <span onClick={() => handleToggle("companies")} style={{
                fontFamily: font.body, fontSize: 13, fontWeight: 600,
                color: !isE ? V.ink : V.subtitle, transition: "color 250ms", cursor: "pointer", userSelect: "none",
              }}>Companies</span>
            </div>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: V.ink, flexShrink: 0 }}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Dropdown menu */}
          {menuOpen && (
            <div style={{ padding: "16px 24px 20px", background: "rgba(244,248,245,0.95)", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
              {isE ? (
                <a href={buildAppUrl("/")} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} style={{
                  width: "100%", fontFamily: font.body, fontSize: 15, fontWeight: 600, color: V.sage,
                  background: "none", padding: "12px 0", border: "none", cursor: "pointer",
                  textDecoration: "none", display: "block", textAlign: "center",
                }}>Start your conversation →</a>
              ) : (
                <a onClick={() => { trackEvent("cta_clicked_nav_connect", { location: "companies_nav" }); setMenuOpen(false); setShowModal(true); }} style={{
                  width: "100%", fontFamily: font.body, fontSize: 15, fontWeight: 600, color: V.sage,
                  background: "none", padding: "12px 0", border: "none", cursor: "pointer",
                  textDecoration: "none", display: "block", textAlign: "center",
                }}>Connect with us →</a>
              )}
            </div>
          )}
        </nav>
      ) : (
        /* Companies mode — identical nav structure */
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(244,248,245,0.85)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }} className="md:px-12">
            <div style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => handleToggle("companies")}>
              <WalnuttWordmark color={V.sage} size={0.9} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span onClick={() => handleToggle("engineers")} style={{
                fontFamily: font.body, fontSize: 13, fontWeight: 600,
                color: isE ? V.ink : V.subtitle, transition: "color 250ms", cursor: "pointer", userSelect: "none",
              }}>Engineers</span>
              <div onClick={() => handleToggle(isE ? "companies" : "engineers")} style={{
                width: 44, height: 24, borderRadius: 12,
                background: !isE ? V.sage : "rgba(26,36,32,0.15)",
                position: "relative", cursor: "pointer", transition: "background 300ms", flexShrink: 0,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "white",
                  position: "absolute", top: 3, left: !isE ? 23 : 3,
                  transition: "left 300ms cubic-bezier(.4,0,.2,1)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }} />
              </div>
              <span onClick={() => handleToggle("companies")} style={{
                fontFamily: font.body, fontSize: 13, fontWeight: 600,
                color: !isE ? V.ink : V.subtitle, transition: "color 250ms", cursor: "pointer", userSelect: "none",
              }}>Companies</span>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: V.ink, flexShrink: 0 }}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {menuOpen && (
            <div style={{ padding: "16px 24px 20px", background: "rgba(244,248,245,0.95)", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
              <a onClick={() => { trackEvent("cta_clicked_nav_connect", { location: "companies_nav" }); setMenuOpen(false); setShowModal(true); }} style={{
                width: "100%", fontFamily: font.body, fontSize: 15, fontWeight: 600, color: V.sage,
                background: "none", padding: "12px 0", border: "none", cursor: "pointer",
                textDecoration: "none", display: "block", textAlign: "center",
              }}>Connect with us →</a>
            </div>
          )}
        </nav>
      )}

      {/* ═══ PAGE CONTENT ═══ */}
      <main>
        {isE ? <EngineersPage /> : <CompaniesPage onOpenForm={() => setShowModal(true)} />}
      </main>

      {/* ═══ FOOTER ═══ */}
      {isE ? (
        <footer style={{ background: V.dark, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }} className="md:px-12">
            {/* Top row */}
            <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
              <WalnuttWordmark color="white" size={0.75} />
              <div className="grid grid-cols-2 md:flex gap-10 md:gap-16">
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 12 }}>Product</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <FooterLink label="For Engineers" onClick={() => handleToggle("engineers")} />
                    <FooterLink label="For Companies" onClick={() => handleToggle("companies")} />
                    <FooterLink label="The Conversation" href="#" />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 12 }}>Legal</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <FooterLink label="Privacy Policy" href="/privacy" />
                    <FooterLink label="Terms" href="/terms" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: font.body, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Contact us:</span>
              <a href="mailto:hello@walnutt.co" style={{ fontFamily: font.body, fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 200ms" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
                hello@walnutt.co
              </a>
            </div>

            {/* Bottom */}
            <div className="flex flex-col md:flex-row justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
              <span style={{ fontFamily: font.body, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 3P Labs Private Limited</span>
              <span style={{ fontFamily: font.body, fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>
                One conversation. Every signal that matters.
              </span>
            </div>
          </div>
        </footer>
      ) : (
        <footer style={{ background: V.dark, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }} className="md:px-12">
            <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
              <WalnuttWordmark color="white" size={0.75} />
              <div className="grid grid-cols-2 md:flex gap-10 md:gap-16">
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 12 }}>Product</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <FooterLink label="For Engineers" onClick={() => handleToggle("engineers")} />
                    <FooterLink label="For Companies" onClick={() => handleToggle("companies")} />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 12 }}>Legal</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <FooterLink label="Privacy Policy" href="/privacy" />
                    <FooterLink label="Terms" href="/terms" />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: font.body, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Contact us:</span>
              <a href="mailto:hello@walnutt.co" style={{ fontFamily: font.body, fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 200ms" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
                hello@walnutt.co
              </a>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
              <span style={{ fontFamily: font.body, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 3P Labs Private Limited</span>
              <span style={{ fontFamily: font.body, fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>
                Hire now. Pay later.
              </span>
            </div>
          </div>
        </footer>
      )}

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function FooterLink({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) {
  const s: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)",
    textDecoration: "none", transition: "color 200ms", cursor: "pointer", background: "none", border: "none", padding: 0, textAlign: "left",
  };
  const onEnter = (e: React.MouseEvent) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)");
  const onLeave = (e: React.MouseEvent) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)");

  if (onClick) return <button style={s} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>{label}</button>;
  return <a href={href} style={s} onMouseEnter={onEnter} onMouseLeave={onLeave}>{label}</a>;
}
