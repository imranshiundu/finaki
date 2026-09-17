"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    const hero = heroRef.current;
    if (!cvs || !hero) return;

    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let W: number, H: number;
    const parts: Array<{
      x: number; y: number; ox: number; oy: number;
      vx: number; vy: number; g: string; f: string;
      k: number; a: number; ph: number; c: string;
    }> = [];
    let running = false;
    let raf: number | null = null;
    let inView = true;
    const mouse = { x: -9999, y: -9999 };
    const GLYPHS = ["&", "&", "&", "&", "+", "*", "·"];

    function build() {
      if (!cvs || !ctx) return;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cvs.clientWidth;
      H = cvs.clientHeight;
      if (!W || !H) return;
      cvs.width = W * DPR;
      cvs.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d")!;
      const fs = Math.min(W * 0.62, H * 0.98);
      o.font = `italic ${fs}px "Instrument Serif", Georgia, serif`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText("&", W * 0.66, H * 0.52);
      const data = o.getImageData(0, 0, W, H).data;

      parts.length = 0;
      const step = Math.max(7, Math.round(Math.sqrt((W * H * 0.22) / 1300)));
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 140) {
            const s = step * (0.72 + Math.random() * 0.5);
            parts.push({
              x, y, ox: x, oy: y, vx: 0, vy: 0,
              g: GLYPHS[(Math.random() * GLYPHS.length) | 0],
              f: `italic ${s}px "Instrument Serif", Georgia, serif`,
              k: 0.014 + Math.random() * 0.02,
              a: 0.3 + Math.random() * 0.6,
              ph: Math.random() * 6.28,
              c: Math.random() < 0.72 ? "#FF4D00" : "rgba(244,239,228,.55)",
            });
          }
        }
      }
    }

    function frame(t: number, loop: boolean) {
      if (loop && !running) return;
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const time = t * 0.001;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const nx = Math.sin(time * 0.7 + p.ph) * 0.35;
        const ny = Math.cos(time * 0.6 + p.ph * 1.3) * 0.35;
        let ax = (p.ox - p.x) * p.k + nx;
        let ay = (p.oy - p.y) * p.k + ny;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const R = 115;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = ((R - d) / R) * 2.4;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }
        p.vx = (p.vx + ax) * 0.86;
        p.vy = (p.vy + ay) * 0.86;
        p.x += p.vx;
        p.y += p.vy;
        ctx.globalAlpha = loop ? p.a * (0.7 + 0.3 * Math.sin(time * 2 + p.ph)) : p.a;
        ctx.fillStyle = p.c;
        ctx.font = p.f;
        ctx.fillText(p.g, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      if (loop) raf = requestAnimationFrame((ts) => frame(ts, true));
    }

    function start() {
      if (!running && inView) {
        running = true;
        raf = requestAnimationFrame((ts) => frame(ts, true));
      }
    }

    function stop() {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const r = cvs.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onPointerDown = (e: PointerEvent) => {
      const r = cvs.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      for (const p of parts) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 200 - d) * 0.045;
        p.vx += (dx / d) * f * 3.2;
        p.vy += (dy / d) * f * 3.2;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        inView ? start() : stop();
      },
      { rootMargin: "80px" }
    );

    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    hero.addEventListener("pointerdown", onPointerDown);
    observer.observe(hero);

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(build, 280);
    };
    window.addEventListener("resize", onResize);

    const ready = document.fonts?.load
      ? Promise.all([
          document.fonts.load('italic 100px "Instrument Serif"'),
          document.fonts.ready,
        ]).catch(() => {})
      : Promise.resolve();

    Promise.race([ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      build();
      start();
    });

    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      hero.removeEventListener("pointerdown", onPointerDown);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, []);

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="hero dots" id="hero" ref={heroRef}>
      <div className="amp-fb" aria-hidden="true">&amp;</div>
      <canvas ref={canvasRef} id="ampCanvas" aria-hidden="true" />

      <div className="hero-in container">
        <div className="hero-eyebrow mono">
          <svg className="ic icf">
            <use href="#i-spark" />
          </svg>
          <span>Digital studio — Nairobi</span>
          <span className="dot" aria-hidden="true" />
        </div>
        <h1 className="hero-h1" id="heroH1">
          <span className="hl">
            <span className="hl-in">Sites, software,</span>
          </span>
          <span className="hl">
            <span className="hl-in">
              agents <span className="amp">&amp;</span>
            </span>
          </span>
          <span className="hl">
            <span className="hl-in">everything else.</span>
          </span>
        </h1>
        <div className="hero-sub">
          <p className="hero-p">
            We design, build and ship <b>websites, software and AI agents</b>{" "}
            — and walk new products into the Kenyan market. One team, start to
            shipped.
          </p>
          <div className="hero-cta">
            <a
              href="#contact"
              className="btn-pill"
              onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
            >
              <span className="mg-in">
                Start a project{" "}
                <svg className="ic">
                  <use href="#i-arrow" />
                </svg>
              </span>
            </a>
            <a
              href="#work"
              className="link-ul"
              onClick={(e) => { e.preventDefault(); scrollTo("#work"); }}
            >
              The work{" "}
              <svg className="ic" style={{ width: 12, height: 12 }}>
                <use href="#i-down" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <button
        className="badge"
        onClick={() => scrollTo("#contact")}
        aria-label="Start a project"
      >
        <svg className="badge-svg" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path
              id="bCir"
              d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"
            />
          </defs>
          <text>
            <textPath href="#bCir">
              START A PROJECT — FINAKI — START A PROJECT —{" "}
            </textPath>
          </text>
        </svg>
        <svg className="ic">
          <use href="#i-arrow" />
        </svg>
      </button>

      <div className="hero-meta container mono">
        <span className="scroll-hint">
          (Scroll){" "}
          <svg className="ic" style={{ width: 13, height: 13 }}>
            <use href="#i-down" />
          </svg>
        </span>
        <span className="mid">The ampersand is clickable</span>
        <span>Est. 2023</span>
      </div>
    </section>
  );
}
