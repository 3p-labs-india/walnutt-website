# Walnutt — Figma Make Prompt (Exponential Growth Hero)
### Final version · Both pages · Copy-paste ready

---

## PROMPT — HERO BACKGROUND

Replace the current hero background on both the Engineers and Companies pages with an animated exponential growth curve visualization. This is the signature visual for "Career Accelerator" — the curve represents a career trajectory that starts flat (before Walnutt) and accelerates sharply upward (after Walnutt). The overall color palette is teal (#0EA5A5) and cyan (#5EEAD4) as primary, with minimal sage green (#3A6B4C) — sage should only appear as a faint tone in the flat/early part of the curve and in the subtle axes. Teal and cyan dominate the visual energy.

### Layer 1 — Background Gradient Mesh (base)

Full-viewport animated gradient mesh sitting behind everything. Built from 4 overlapping radial gradients:

- Gradient 1: radial, teal (#0EA5A5) at 10% opacity, ~600px diameter, positioned at 80% from left and 20% from top. Drifts slowly toward center-left over 20s, ease-in-out, infinite, alternating.
- Gradient 2: radial, cyan (#5EEAD4) at 8% opacity, ~500px diameter, positioned at 50% from left and 75% from top. Drifts upward over 25s.
- Gradient 3: radial, teal (#0EA5A5) at 6% opacity, ~700px diameter, positioned at 20% from left and 40% from top. Drifts right over 18s.
- Gradient 4: radial, sage green (#3A6B4C) at 4% opacity (very faint), ~400px diameter, positioned at 30% from left and 70% from top. Drifts slowly, 30s.

Base underneath all gradients: subtle warm tint — linear-gradient at 135 degrees from #FAFBF9 to #F2FAFA to #F5FAFA. This keeps "white" areas from being dead flat.

All gradients have heavy Gaussian blur (100px+), soft organic edges, no visible boundaries. Each animates on a different cycle so they never sync.

### Layer 2 — Exponential Growth Curve (main visual)

A smooth exponential curve spanning the viewport from left edge to right edge. The curve starts nearly flat at the bottom-left (~82% from top) and accelerates sharply upward toward the top-right (~12% from top). This is an exponential function, NOT a sine wave — it must be flat for the first ~60% of the horizontal span, then bend sharply upward in the last 40%.

**Draw-on-load animation:** When the page first loads, the curve draws itself from left to right over 2 seconds. It starts as nothing — the line progressively appears, tracing the path in real time. Easing: ease-out (starts fast, slows at the end for dramatic effect on the steep rise).

**Curve rendering — triple stroke for glow effect:**
The curve is rendered three times, stacked:
1. Wide glow (bottom layer): same path, stroke width that starts at 10px on the left and grows to 28px on the right, teal (#0EA5A5) at 5% opacity on the left graduating to cyan (#5EEAD4) at 12% opacity on the right. Gaussian blur 10px. This creates a glow that intensifies as the curve rises.
2. Mid glow (middle layer): same path, stroke width 6px, gradient from teal at 8% opacity to cyan at 18% opacity left-to-right. Gaussian blur 4px.
3. Core line (top layer): same path, 2px stroke, gradient from teal (#0EA5A5) at 20% opacity on the left to cyan (#5EEAD4) at 55% opacity on the right. No blur. Sharp and clean.

The overall effect: the curve is dim and thin where it's flat (the "before" phase), and bright, thick, and glowing where it rises sharply (the "after/accelerated" phase).

**Color gradient along the curve:** The curve shifts color from left to right:
- 0-30%: teal (#0EA5A5) at low opacity — the quiet start
- 30-65%: teal (#0EA5A5) brightening — building momentum
- 65-100%: transitioning to bright cyan (#5EEAD4) — full acceleration

(Sage green is NOT used on the curve itself — keep it teal/cyan only.)

**Echo curves:** Two additional thinner exponential curves flanking the main one:
- Lower echo: same shape but flatter (less steep rise), rendered as a 0.7px dashed line (dash 3px, gap 8px), teal at 5% opacity. Appears 0.5s after the main curve finishes drawing.
- Upper echo: same shape but steeper, 0.5px dashed line, cyan at 4% opacity. Appears 0.8s after main curve.

These represent "different growth trajectories" — the main curve is the accelerated one.

**Subtle area fill:** A very light gradient fill under the main curve down to the x-axis line. The fill is nearly invisible at the left (teal at 0.5% opacity) and slightly visible at the right (cyan at 3% opacity). This subtly reinforces the "growth" reading.

### Layer 2b — Animated Elements on the Curve

**Primary pulse:** A bright dot that travels along the curve continuously, looping every 8 seconds. The dot has three layers:
- Large glow: 30px radius at the flat start, growing to 45px at the steep part. Color matches curve position (teal → cyan). Opacity 30-40%.
- Tight glow: 10px radius. Same color. Opacity 60%.
- Core: 3.5px solid dot. Same color. Opacity 90%.

The pulse leaves a trail of particles behind it (see below). On each loop, the pulse deposits a faint glow onto the path that persists — over time (after 3-4 loops) the curve develops a subtle "worn in" brightness, like a well-traveled road.

**Second pulse:** A slower, dimmer dot following the same path, roughly 30-40% behind the primary pulse. Travels the loop in 12 seconds. Same color-shifting behavior but at 40% the brightness of the primary. This represents "others are on this journey too."

**Particle trail:** 80-90 small particles that follow behind the primary pulse. Each particle:
- Shifts color based on its position on the curve (teal at start → cyan at peak)
- Has a small glow (3-4px blur at 25-35% opacity) and a tiny core (0.5-1.5px)
- Drifts slightly off the curve path (±15px perpendicular offset) for organic feel
- Fades out proportionally to distance from the lead pulse
- Particles near the flat part are sparser and dimmer; particles near the steep rise are denser and brighter

**Milestone markers:** Three small pulsing dots at 25%, 50%, and 75% along the curve. Each is a 2px core with a 5px gentle pulse (scale 1→1.25→1, 2.5s ease-in-out infinite loop). Color matches their curve position. These represent Walnutt's three phases (Assess → Build → Stand Out) without labeling them explicitly.

### Layer 2c — Axes and Tick Marks

**Subtle axes:** Very faint reference lines suggesting a growth chart:
- Y-axis: 0.5px vertical line at ~6% from left edge, running from 8% to 85% from top. Color: #0EA5A5 at 5% opacity. Small upward arrow at top (two 3px angled lines).
- X-axis: 0.5px horizontal line at ~85% from top, running from 6% to 96% from left. Same color and opacity.

**Tick marks on Y-axis:** 8 tiny horizontal lines (8px wide, 0.5px) evenly spaced along the y-axis. Default state: teal at 4% opacity, barely visible.

When the primary pulse passes each tick's height, that tick "lights up" — it brightens to 18% opacity and a small cyan (#5EEAD4) glow dot (3px, 25% opacity) appears at its position. The tick stays lit for 2-3 seconds after the pulse passes, then slowly dims back. This creates a "levels being unlocked" effect as the pulse climbs.

### Layer 3 — Text Readability Zone

A soft radial gradient centered on the hero text content area (50% from left, ~45% from top):

radial-gradient(ellipse 700px 440px at 50% 45%, rgba(250,251,249,0.50) 0%, rgba(250,251,249,0.25) 45%, transparent 70%)

This sits ABOVE the curve layers but BELOW the text. It creates a soft bright clearing so the dark headline text stays crisp against the animated background. No hard edges — completely feathered. The curve and particles should appear to pass behind this clearing, becoming dimmer as they enter the text zone and brightening as they exit.

### Layer 2d — Light Rays at Peak

Once the curve finishes drawing (after the 2s draw-on-load), 6-8 subtle light rays fade in from the peak point (top-right area where the curve exits). The rays:
- Emanate outward from the curve's exit point in a ~90-degree arc (pointing upper-right)
- Length: 15-20% of viewport width, pulsing gently (±5% over 3s)
- Color: cyan (#5EEAD4) at 6-8% opacity, fading to transparent
- Stroke: 1-1.5px
- A soft glow node (60px radius, cyan at 12% opacity) sits at the peak point itself

These rays suggest "the trajectory continues beyond the visible" — the growth doesn't stop at the edge.

### Hero Text Content (unchanged, sitting on top of everything)

All existing hero text stays exactly as-is on both pages:
- Engineers: cycling overline, "CAREER ACCELERATOR FOR TECH TALENT", subheadline, CTA, micro-copy
- Companies: "YOUR NEXT ENGINEER IS ALREADY VERIFIED", subheadline, CTAs

Text colors unchanged: #1A1A1A for headlines, #3A6B4C for "TECH TALENT" and "VERIFIED" accent words, #374151 for subheadline, #9CA3AF for micro-copy.

### Animation Timing Summary

| Element | Trigger | Duration | Easing |
|---------|---------|----------|--------|
| Curve draw-on-load | Page load | 2s | ease-out |
| Lower echo appears | Draw complete + 0.5s | 1s fade-in | ease-out |
| Upper echo appears | Draw complete + 0.8s | 1s fade-in | ease-out |
| Light rays fade in | Draw complete + 1s | 1.5s fade-in | ease-out |
| Primary pulse loop | Draw complete | 8s per loop | linear |
| Second pulse loop | Draw complete + 2s | 12s per loop | linear |
| Gradient mesh drift 1 | Immediate | 20s | ease-in-out, infinite alternate |
| Gradient mesh drift 2 | Immediate | 25s | ease-in-out, infinite alternate |
| Gradient mesh drift 3 | Immediate | 18s | ease-in-out, infinite alternate |
| Gradient mesh drift 4 | Immediate | 30s | ease-in-out, infinite alternate |
| Tick mark light-up | When pulse passes height | 0.3s brighten, 2s dim | ease-out |
| Milestone markers pulse | Continuous after draw | 2.5s per pulse | ease-in-out, infinite |
| Light ray length pulse | Continuous | 3s | ease-in-out, infinite |
| Permanent glow accumulation | Each pulse loop | Additive, subtle | — |

### Responsive Behavior

- Desktop (1440px): Full effect — all elements, all animations
- Tablet (768px): Reduce to main curve + primary pulse + gradient mesh. Remove echo curves, light rays, second pulse, tick marks.
- Mobile (375px): Static curve (no animation), gradient mesh at fixed positions, no pulses. The curve should still be visible as a static exponential line with glow.
- prefers-reduced-motion: Show static curve with glow, static gradient mesh, no animation. No draw-on-load, no pulses, no rays.

### What NOT to do

- Don't make the curve a sine wave or S-curve. It must be exponential — flat then sharply up.
- Don't use sage green (#3A6B4C) on the curve, pulses, particles, tick marks, or light rays. Sage only appears in: the faintest background gradient blob, the subtle axes at 5% opacity, and the headline accent words. Everything else is teal/cyan.
- Don't make any animation faster than 2s per cycle (except the draw-on-load which is 2s total). Everything should feel smooth and ambient.
- Don't let the curve compete with the headline text. The readability zone must be strong enough that text is always crisp.
- Don't add any labels, numbers, or text to the visualization. The curve speaks for itself.

### Both Pages — Identical Background

Apply the exact same background to both the Engineers hero and Companies hero. Only the text content on top changes per page.