/**
 * JS mirror of the design system in src/styles/design-system.css.
 *
 * Values resolve to CSS custom properties so the stylesheet stays the one
 * place a hex is written. Use `V` and `font` in inline styles and SVG
 * presentation attributes — both accept var().
 *
 * `HEX` exists only for <canvas>, where ctx.fillStyle cannot resolve var().
 */

export const V = {
  bg: "var(--sage)",
  surface: "#fff",
  sage: "var(--green)",
  sageHover: "var(--green-2)",
  sagePale: "var(--cream)",
  sageTint: "var(--tint)",
  sageMid: "var(--signal)",
  ink: "var(--ink)",
  body: "var(--ink-2)",
  subtitle: "var(--faint)",
  muted: "var(--faint-2)",
  border: "var(--line)",
  dark: "var(--dark)",
  dark2: "var(--dark-2)",
  leaf: "var(--leaf)",
  amber: "var(--amber)",
  amberLight: "#F2E6D8",
  red: "var(--red)",
} as const;

export const font = {
  body: "var(--sans)",
  heading: "var(--sans)",
  wordmark: "var(--wordmark)",
  mono: "var(--mono)",
} as const;

/** Raw values — canvas only. Keep in sync with design-system.css. */
export const HEX = {
  sage: "#EDF2EE",
  cream: "#F2F5F3",
  ink: "#22332A",
  ink2: "#3A4C41",
  green: "#3C6E4E",
  green2: "#2F5940",
  signal: "#57A874",
  leaf: "#93C4A4",
  tint: "#DFF0E5",
  amber: "#C07A3D",
  red: "#C25E51",
  dark: "#141F18",
} as const;
