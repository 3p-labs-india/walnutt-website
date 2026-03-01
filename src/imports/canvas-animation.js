import { useEffect, useRef } from "react";

const TEAL = "#0EA5A5";
const CYAN = "#5EEAD4";
const SAGE = "#3A6B4C";

function lerpColor(t) {
  const r = Math.round(14 + (94 - 14) * t);
  const g = Math.round(165 + (234 - 165) * t);
  const b = Math.round(165 + (212 - 165) * t);
  return { r, g, b };
}

function cs(c, a) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

export default function App() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const verifiedRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w, h;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Funnel shape defined by top and bottom boundaries
    // Wide on left, narrow on right, then opens slightly for "verified output"
    function funnelTop(x) {
      const t = x / w;
      if (t < 0.15) return h * 0.12;
      if (t < 0.7) {
        const lt = (t - 0.15) / 0.55;
        return h * (0.12 + lt * 0.30); // narrows
      }
      // Exit zone — slight opening
      const lt = (t - 0.7) / 0.3;
      return h * (0.42 - lt * 0.04);
    }

    function funnelBottom(x) {
      const t = x / w;
      if (t < 0.15) return h * 0.88;
      if (t < 0.7) {
        const lt = (t - 0.15) / 0.55;
        return h * (0.88 - lt * 0.30); // narrows
      }
      const lt = (t - 0.7) / 0.3;
      return h * (0.58 + lt * 0.04);
    }

    function funnelCenter(x) {
      return (funnelTop(x) + funnelBottom(x)) / 2;
    }

    function funnelWidth(x) {
      return funnelBottom(x) - funnelTop(x);
    }

    // Spawn particles
    function spawnParticle() {
      const yCenter = h * 0.5;
      const spread = h * 0.32;
      return {
        x: -10 + Math.random() * w * 0.05,
        y: yCenter + (Math.random() - 0.5) * spread * 2,
        vx: 0.6 + Math.random() * 1.2,
        vy: 0,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.15 + Math.random() * 0.3,
        alive: true,
        filtered: false,
        filterFade: 1,
        brightness: 0.3 + Math.random() * 0.3,
        // Some particles are "strong" — they make it through
        quality: Math.random(),
      };
    }

    // Initialize
    for (let i = 0; i < 60; i++) {
      const p = spawnParticle();
      p.x = Math.random() * w * 0.7;
      particlesRef.current.push(p);
    }

    // Checkpoint x positions (3 stages)
    const checkpoints = [w * 0.28, w * 0.48, w * 0.65];
    const checkpointLabels = ["Assessed", "Interviewed", "Matched"];

    let time = 0;
    let spawnTimer = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      time += 0.01;
      spawnTimer++;

      // Spawn new particles
      if (spawnTimer % 8 === 0) {
        particlesRef.current.push(spawnParticle());
      }

      // ── Background gradient mesh ──
      const g1 = ctx.createRadialGradient(w * 0.8, h * 0.25, 0, w * 0.8, h * 0.25, w * 0.4);
      g1.addColorStop(0, "rgba(14,165,165,0.08)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.2, h * 0.7, 0, w * 0.2, h * 0.7, w * 0.45);
      g2.addColorStop(0, "rgba(94,234,212,0.05)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // ── Funnel shape (subtle fill) ──
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelTop(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      for (let x = w; x >= 0; x -= 2) {
        ctx.lineTo(x, funnelBottom(x));
      }
      ctx.closePath();
      const funnelGrad = ctx.createLinearGradient(0, 0, w, 0);
      funnelGrad.addColorStop(0, "rgba(14,165,165,0.03)");
      funnelGrad.addColorStop(0.5, "rgba(14,165,165,0.04)");
      funnelGrad.addColorStop(0.7, "rgba(94,234,212,0.05)");
      funnelGrad.addColorStop(1, "rgba(94,234,212,0.06)");
      ctx.fillStyle = funnelGrad;
      ctx.fill();

      // ── Funnel boundary lines ──
      // Top edge
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelTop(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      // Glow
      ctx.strokeStyle = "rgba(14,165,165,0.06)";
      ctx.lineWidth = 8;
      ctx.filter = "blur(6px)";
      ctx.stroke();
      ctx.filter = "none";
      // Core
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelTop(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const topLineGrad = ctx.createLinearGradient(0, 0, w, 0);
      topLineGrad.addColorStop(0, "rgba(14,165,165,0.08)");
      topLineGrad.addColorStop(0.7, "rgba(94,234,212,0.20)");
      topLineGrad.addColorStop(1, "rgba(94,234,212,0.30)");
      ctx.strokeStyle = topLineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bottom edge
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelBottom(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(14,165,165,0.06)";
      ctx.lineWidth = 8;
      ctx.filter = "blur(6px)";
      ctx.stroke();
      ctx.filter = "none";

      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = funnelBottom(x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = topLineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── Checkpoint gates ──
      checkpoints.forEach((cx, i) => {
        const top = funnelTop(cx);
        const bot = funnelBottom(cx);
        const gateWidth = funnelWidth(cx);

        // Gate line (vertical)
        ctx.beginPath();
        ctx.moveTo(cx, top);
        ctx.lineTo(cx, bot);

        // Glow
        ctx.strokeStyle = `rgba(94,234,212,${0.06 + Math.sin(time * 2 + i) * 0.02})`;
        ctx.lineWidth = 6;
        ctx.filter = "blur(4px)";
        ctx.stroke();
        ctx.filter = "none";

        // Core dashed line
        ctx.beginPath();
        ctx.moveTo(cx, top);
        ctx.lineTo(cx, bot);
        ctx.strokeStyle = `rgba(14,165,165,${0.12 + Math.sin(time * 2 + i) * 0.04})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Gate nodes (top and bottom)
        [top, bot].forEach((gy) => {
          const nodeGlow = ctx.createRadialGradient(cx, gy, 0, cx, gy, 10);
          nodeGlow.addColorStop(0, `rgba(94,234,212,${0.25 + Math.sin(time * 2.5 + i) * 0.1})`);
          nodeGlow.addColorStop(1, "transparent");
          ctx.fillStyle = nodeGlow;
          ctx.beginPath();
          ctx.arc(cx, gy, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(cx, gy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(94,234,212,0.6)";
          ctx.fill();
        });
      });

      // ── Particles ──
      const toRemove = [];

      particlesRef.current.forEach((p, idx) => {
        if (!p.alive) {
          toRemove.push(idx);
          return;
        }

        // Move
        const fw = funnelWidth(p.x);
        const fc = funnelCenter(p.x);
        const ft = funnelTop(p.x);
        const fb = funnelBottom(p.x);

        // Guide toward center
        const distFromCenter = p.y - fc;
        p.vy += -distFromCenter * 0.002;
        p.vy *= 0.95; // damping

        // Speed increases as funnel narrows (acceleration)
        const narrowFactor = 1 + (1 - fw / (h * 0.76)) * 1.5;
        p.x += p.vx * narrowFactor;
        p.y += p.vy;

        // Check if outside funnel bounds → filter out
        if (p.x > w * 0.2 && (p.y < ft + 5 || p.y > fb - 5)) {
          if (p.quality < 0.4) {
            p.filtered = true;
          }
        }

        // At each checkpoint, lower quality particles get filtered
        checkpoints.forEach((cx, ci) => {
          if (Math.abs(p.x - cx) < 3 && !p.filtered) {
            const threshold = 0.25 + ci * 0.2; // increasingly strict
            if (p.quality < threshold) {
              p.filtered = true;
            } else {
              // Boost surviving particles
              p.brightness = Math.min(1, p.brightness + 0.15);
              p.size = Math.min(4.5, p.size + 0.3);
            }
          }
        });

        // Handle filtered particles — fade and drift away
        if (p.filtered) {
          p.filterFade -= 0.015;
          p.vy += (p.y > fc ? 0.3 : -0.3); // drift away from center
          p.vx *= 0.97;
          if (p.filterFade <= 0) {
            p.alive = false;
            return;
          }
        }

        // Past right edge
        if (p.x > w + 20) {
          if (!p.filtered) {
            // Spawn verified particle
            verifiedRef.current.push({
              x: p.x,
              y: p.y,
              opacity: 1,
              size: p.size * 1.3,
              timer: 60,
            });
          }
          p.alive = false;
          return;
        }

        // ── Draw particle ──
        const progress = p.x / w;
        const c = lerpColor(Math.min(1, progress * 1.3));
        const alpha = p.opacity * p.filterFade;
        const brt = p.filtered ? 0.3 : p.brightness;

        // Glow
        const glowSize = p.size * (2.5 + brt * 2);
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        pg.addColorStop(0, cs(c, alpha * brt * 0.4));
        pg.addColorStop(1, "transparent");
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = cs(c, alpha * brt * 0.8);
        ctx.fill();
      });

      // Clean up dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.alive);

      // ── Verified exit particles (bright burst on right) ──
      verifiedRef.current.forEach((v) => {
        v.timer--;
        v.opacity = v.timer / 60;

        const vg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.size * 4);
        vg.addColorStop(0, `rgba(94,234,212,${v.opacity * 0.5})`);
        vg.addColorStop(0.5, `rgba(14,165,165,${v.opacity * 0.15})`);
        vg.addColorStop(1, "transparent");
        ctx.fillStyle = vg;
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(v.x, v.y, v.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,234,212,${v.opacity * 0.8})`;
        ctx.fill();
      });
      verifiedRef.current = verifiedRef.current.filter((v) => v.timer > 0);

      // ── Exit zone glow (right side) ──
      const exitGlow = ctx.createRadialGradient(w * 0.88, h * 0.5, 0, w * 0.88, h * 0.5, w * 0.15);
      exitGlow.addColorStop(0, "rgba(94,234,212,0.08)");
      exitGlow.addColorStop(0.6, "rgba(14,165,165,0.03)");
      exitGlow.addColorStop(1, "transparent");
      ctx.fillStyle = exitGlow;
      ctx.fillRect(w * 0.7, 0, w * 0.3, h);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#FAFBF9", minHeight: "100vh" }}>
      <div style={{
        position: "relative", width: "100%", height: "100vh", maxHeight: "720px",
        overflow: "hidden",
      }}>
        <canvas ref={canvasRef} style={{
          width: "100%", height: "100%", position: "absolute", top: 0, left: 0,
        }} />

        {/* Readability zone */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "720px", height: "420px",
          background: "radial-gradient(ellipse at center, rgba(250,251,249,0.55) 0%, rgba(250,251,249,0.3) 40%, transparent 70%)",
          pointerEvents: "none", zIndex: 5,
        }} />

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 20px",
        }}>
          <h1 style={{
            fontSize: "clamp(28px, 4.8vw, 54px)", fontWeight: 800, color: "#1A1A1A",
            textAlign: "center", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0,
          }}>
            YOUR NEXT ENGINEER IS<br />ALREADY <span style={{ color: SAGE }}>VERIFIED</span>
          </h1>
          <p style={{
            fontSize: "16px", color: "#374151", textAlign: "center",
            marginTop: "18px", maxWidth: "540px", lineHeight: 1.55,
          }}>
            AI-assessed across 10+ dimensions. GitHub verified. Portfolio reviewed. Matched to your JD.
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "28px", flexWrap: "wrap", justifyContent: "center" }}>
            <button style={{
              padding: "14px 28px", backgroundColor: SAGE, color: "white",
              border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(58,107,76,0.2)",
            }}>
              Post a Role →
            </button>
            <button style={{
              padding: "14px 28px", backgroundColor: "white", color: "#1A1A1A",
              border: "1.5px solid #D1D5DB", borderRadius: "10px", fontSize: "15px",
              fontWeight: 600, cursor: "pointer",
            }}>
              Talk to Our Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}