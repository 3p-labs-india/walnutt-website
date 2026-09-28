import { useEffect } from "react";

export const prefersReducedMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

/** Fades `.rv` descendants of `root` in as they scroll into view. */
export function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>(".rv"));
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      targets.forEach(t => t.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [root]);
}
