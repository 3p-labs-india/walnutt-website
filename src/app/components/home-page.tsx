import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { C, ContactModal, globalKeyframes } from "./shared";
import { EngineersPage } from "./engineers-page";
import { CompaniesPage } from "./companies-page";
import { RecruitersPage } from "./recruiters-page";
import { buildAppUrl, trackEvent } from "../../lib/analytics";

type Mode = "engineers" | "companies" | "recruiters";

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

const TABS: { id: Mode; label: string }[] = [
  { id: "companies", label: "For Companies" },
  { id: "recruiters", label: "For Recruiters" },
  { id: "engineers", label: "For Engineers" },
];

const MODE_TO_PATH: Record<Mode, string> = {
  companies: "/",
  recruiters: "/recruiters",
  engineers: "/engineers",
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

// ═══ 3-TAB SEGMENTED CONTROL ═══
function TabSwitch({
  mode, onChange, compact = false,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
  compact?: boolean;
}) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      background: "rgba(26,36,32,0.05)", borderRadius: 999,
      padding: 4, position: "relative",
    }}>
      {TABS.map(t => {
        const active = t.id === mode;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              fontFamily: font.body,
              fontSize: compact ? 13 : 13,
              fontWeight: 600,
              color: active ? "#fff" : V.subtitle,
              background: active ? V.sage : "transparent",
              border: "none",
              padding: compact ? "7px 14px" : "8px 16px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "background 250ms, color 250ms",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = V.ink; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = V.subtitle; }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function HomePageInner({ initialMode = "engineers" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isE = mode === "engineers";
  const isC = mode === "companies";
  const isR = mode === "recruiters";

  const handleToggle = (newMode: Mode) => {
    setMode(newMode);
    setMenuOpen(false);
    const targetPath = MODE_TO_PATH[newMode];
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Per-mode SEO
  const seo = isE
    ? {
        title: "Walnutt | Outgrow the hiring audition.",
        desc: "No applications. No wasted hours. One real conversation, and the right companies start finding you.",
        canonical: "https://walnutt.co/engineers",
      }
    : isR
    ? {
        title: "Walnutt | More engineering placements. Less of your time.",
        desc: "AI-powered sourcing, a proprietary assessment platform, and a network of engineer interviewers. For recruitment agencies and individual recruiters.",
        canonical: "https://walnutt.co/recruiters",
      }
    : {
        title: "Walnutt | Outgrow the hiring cycle.",
        desc: "The hiring process that also onboards. Built around your actual context. Turning months into days. Hiring infrastructure for engineering teams.",
        canonical: "https://walnutt.co/",
      };

  // Nav CTA per mode
  const renderNavCTA = (onClickClose?: () => void, mobile = false) => {
    const baseStyle: React.CSSProperties = {
      fontFamily: font.body,
      fontSize: mobile ? 15 : 14,
      fontWeight: 600,
      color: V.sage,
      background: "none",
      padding: mobile ? "12px 0" : 0,
      border: "none",
      cursor: "pointer",
      textDecoration: "none",
      display: mobile ? "block" : "inline-block",
      textAlign: mobile ? "center" : undefined,
      width: mobile ? "100%" : undefined,
      flexShrink: 0,
      transition: "all 200ms",
    };

    if (isE) {
      return (
        <a
          href={buildAppUrl("/")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { onClickClose?.(); }}
          style={baseStyle}
        >
          Start your conversation →
        </a>
      );
    }
    const eventLocation = isR
      ? (mobile ? "recruiters_nav_mobile" : "recruiters_nav")
      : (mobile ? "companies_nav_mobile" : "companies_nav");
    return (
      <a
        onClick={() => {
          trackEvent("cta_clicked_nav_connect", { location: eventLocation });
          onClickClose?.();
          setShowModal(true);
        }}
        style={baseStyle}
      >
        Connect with us →
      </a>
    );
  };

  return (
    <div style={{
      background: isE ? V.bg : C.bg, minHeight: "100vh",
      fontFamily: isE ? font.body : "'Inter', sans-serif",
    }}>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.desc} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.desc} />
        <link rel="canonical" href={seo.canonical} />
      </Helmet>
      <style>{globalKeyframes}</style>

      {/* ═══ STICKY NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(244,248,245,0.85)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }} className="md:px-12">
          {/* Logo */}
          <div style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => handleToggle(mode)}>
            <WalnuttWordmark color={V.sage} size={0.9} />
          </div>

          {/* Center - Tabs (desktop) */}
          <div className="hidden md:block">
            <TabSwitch mode={mode} onChange={handleToggle} />
          </div>

          {/* CTA - Desktop */}
          <div className="hidden md:block">
            {renderNavCTA()}
          </div>

          {/* Hamburger - Mobile */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: V.ink, flexShrink: 0 }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden" style={{ padding: "16px 24px 20px", background: "rgba(244,248,245,0.95)", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <TabSwitch mode={mode} onChange={handleToggle} compact />
            </div>
            {renderNavCTA(() => setMenuOpen(false), true)}
          </div>
        )}
      </nav>

      {/* ═══ PAGE CONTENT ═══ */}
      <main>
        {isE && <EngineersPage />}
        {isC && <CompaniesPage onOpenForm={() => setShowModal(true)} />}
        {isR && <RecruitersPage onOpenForm={() => setShowModal(true)} />}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: V.dark, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }} className="md:px-12">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
            <WalnuttWordmark color="white" size={0.75} />
            <div className="grid grid-cols-2 md:flex gap-10 md:gap-16">
              <div>
                <div style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 12 }}>Product</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <FooterLink label="For Companies" onClick={() => handleToggle("companies")} />
                  <FooterLink label="For Recruiters" onClick={() => handleToggle("recruiters")} />
                  <FooterLink label="For Engineers" onClick={() => handleToggle("engineers")} />
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
              {isE && "One conversation. Every signal that matters."}
              {isC && "Hire now. Pay later."}
              {isR && "You own the client. We own the pipeline."}
            </span>
          </div>
        </div>
      </footer>

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

// Route exports
export function HomePage() { return <HomePageInner initialMode="engineers" />; }
export function CompaniesHomePage() { return <HomePageInner initialMode="companies" />; }
export function RecruitersHomePage() { return <HomePageInner initialMode="recruiters" />; }
