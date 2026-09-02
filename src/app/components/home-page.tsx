import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ContactModal } from "./shared";
import { EngineersPage } from "./engineers-page";
import { CompaniesPage } from "./companies-page";
import { buildAppUrl, buildRoleBriefUrl, trackEvent } from "../../lib/analytics";

type Mode = "engineers" | "companies";

const SEO: Record<Mode, { title: string; desc: string; canonical: string }> = {
  companies: {
    title: "Walnutt | Great companies are built on great hires.",
    desc: "Capability, fit and joining intent — scored for this person, in this role. Hiring infrastructure for engineering teams, from the first conversation to day one.",
    canonical: "https://walnutt.co/",
  },
  engineers: {
    title: "Walnutt | Outgrow the hiring audition.",
    desc: "No applications. No wasted hours. One real conversation, and the right companies start finding you.",
    canonical: "https://walnutt.co/engineers",
  },
};

/**
 * The nav is a fixed translucent bar, and both pages run full-bleed dark
 * sections underneath it. Sections that need the inverted treatment carry
 * `data-nav-dark`; this watches which one is under the bar.
 */
const NAV_BAND = 68;

function useNavOverDark() {
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const check = () => {
      const hit = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-dark]")).some(el => {
        const r = el.getBoundingClientRect();
        return r.top <= NAV_BAND * 0.5 && r.bottom >= NAV_BAND * 0.5;
      });
      setOverDark(hit);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  });

  return overDark;
}

// ═══ BRAND MARK (hexagon + chevrons) ═══
function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M40 4 L71 22 L71 58 L40 76 L9 58 L9 22 Z" stroke="var(--brand-stroke, var(--green))" strokeWidth="4.5" fill="none" strokeLinejoin="round" />
      <path d="M34 24 L20 40 L34 56" stroke="var(--brand-stroke, var(--green))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M46 24 L60 40 L46 56" stroke="var(--brand-stroke, var(--green))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Brand({ size = 26 }: { size?: number }) {
  return (
    <Link className="brand" to="/" aria-label="Walnutt home">
      <BrandMark size={size} />
      <span className="wordmark">Walnutt</span>
    </Link>
  );
}

function HomePageInner({ mode }: { mode: Mode }) {
  const [showModal, setShowModal] = useState(false);
  const isE = mode === "engineers";
  const overDark = useNavOverDark();
  const seo = SEO[mode];

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.desc} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.desc} />
        <meta property="og:url" content={seo.canonical} />
        <link rel="canonical" href={seo.canonical} />
      </Helmet>

      {/* ═══ NAV ═══ */}
      <nav className="site-nav" data-over={overDark ? "dark" : undefined}>
        <div className="nav-in">
          <Brand />
          <div className="navlinks">
            {isE ? (
              <>
                <Link className="eng" to="/">For companies</Link>
                <a
                  className="btn"
                  href={buildAppUrl("/")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("cta_clicked_nav_app", { location: "engineers_nav" })}
                >
                  Start your conversation <span className="ar">→</span>
                </a>
              </>
            ) : (
              <>
                <Link className="eng" to="/engineers">For engineers</Link>
                <a
                  className="btn"
                  href={buildRoleBriefUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("cta_clicked_role_brief", { location: "companies_nav" })}
                >
                  Start a role <span className="ar">→</span>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ═══ PAGE ═══ */}
      <main>
        {isE ? <EngineersPage /> : <CompaniesPage onOpenForm={() => setShowModal(true)} />}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="site-footer">
        <div className="wrap">
          <div className="fgrid">
            <div className="fbrand">
              <Brand size={28} />
              <p className="fdict">
                <b>Wal·nutt</b> /ˈwɔːl-nʌt/ (n.) · walnut + talent<br />
                1. A nut shaped like a brain.<br />
                2. A company fluent in understanding talent.
              </p>
            </div>
            <div className="fcol">
              <div className="fh">Company</div>
              <ul>
                {isE ? (
                  <>
                    <li><Link to="/">For companies</Link></li>
                    <li>
                      <a href={buildAppUrl("/")} target="_blank" rel="noopener noreferrer">
                        Start your conversation
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <a
                        href={buildRoleBriefUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent("cta_clicked_role_brief", { location: "companies_footer" })}
                      >
                        Start a role
                      </a>
                    </li>
                    <li><Link to="/engineers">For engineers</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div className="fcol">
              <div className="fh">Contact</div>
              <ul>
                <li><a href="mailto:hello@walnutt.co">hello@walnutt.co</a></li>
                <li><a href="tel:+919620333620">+91 96203 33620</a></li>
              </ul>
            </div>
            <div className="fcol">
              <div className="fh">Legal</div>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms</a></li>
              </ul>
            </div>
            <div className="fcol">
              <div className="fh">Visit</div>
              <address className="addr">
                Indiqube Orion, 1st Floor<br />
                HSR Layout, Bengaluru<br />
                Karnataka, India
              </address>
            </div>
          </div>
          <div className="fbase">
            <span>© 2026 Walnutt</span>
            <span>Bengaluru, IN</span>
          </div>
        </div>
      </footer>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </>
  );
}

// Route exports
export function HomePage() { return <HomePageInner mode="engineers" />; }
export function CompaniesHomePage() { return <HomePageInner mode="companies" />; }
