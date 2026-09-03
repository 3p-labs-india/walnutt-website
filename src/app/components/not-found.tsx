import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { Brand } from "./home-page";

/**
 * Unmatched routes. GitHub Pages already answers these with a real 404 status
 * via public/404.html before the SPA shim restores the path, so this is the
 * page a person sees — not a soft 404 to crawlers.
 */
export function NotFound() {
  return (
    <>
      <Helmet>
        <title>Walnutt | Page not found</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main style={{
        minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 0", textAlign: "center",
      }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Brand size={30} />

          <span style={{
            marginTop: 44, fontSize: 11, fontWeight: 700, letterSpacing: ".22em",
            textTransform: "uppercase", color: "var(--green)",
          }}>
            404
          </span>

          <h1 style={{
            marginTop: 14, fontSize: "clamp(2rem, 4.4vw, 3rem)", fontWeight: 800,
            letterSpacing: "-.03em", lineHeight: 1.12, color: "var(--ink)", textWrap: "balance",
          }}>
            This page doesn't exist.
          </h1>

          <p style={{
            marginTop: 16, fontSize: 16, color: "var(--faint)", maxWidth: "46ch", lineHeight: 1.6,
          }}>
            The link may be out of date, or the page may have moved. Everything else is still where you left it.
          </p>

          <div style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <Link className="btn" to="/">Go to the homepage <span className="ar">→</span></Link>
            <Link className="btn-ghost" to="/engineers">For engineers</Link>
          </div>
        </div>
      </main>
    </>
  );
}
