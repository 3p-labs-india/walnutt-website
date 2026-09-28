import { useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router";

/**
 * Wraps every route. Client-side navigation keeps the old scroll position,
 * so a footer link landed you at the bottom of the next page; this puts each
 * new page at the top (or at its #hash). Back/forward are left alone so the
 * browser restores where you were.
 *
 * Not React Router's <ScrollRestoration>: it scrolls with a plain scrollTo,
 * which `html { scroll-behavior: smooth }` turns into a long glide up from
 * the footer. "instant" jumps, and in-page anchors stay smooth.
 */
export function RootLayout() {
  const { key, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === "POP") return;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) target.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [key]); // once per navigation; hash and type are read for that same one

  return <Outlet />;
}
