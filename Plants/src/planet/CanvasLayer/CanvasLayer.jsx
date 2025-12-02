// src/planet/CanvasLayer/CanvasLayer.jsx
import React, { useEffect, useRef } from "react";


export default function CanvasLayer({ system }) {
  const starsRef = useRef(null);
  const planetRef = useRef(null);
  const bgCanvasRef = useRef(null);

  const {
    containerRef,
    planetsRef,
    labelRefs,
    hoveredListPlanet,
    popupOpen,
    mediaPopup,
    isPausedRef,
  } = system;

  useEffect(() => {
    const starsCanvas = starsRef.current;
    const planetCanvas = planetRef.current;
    const container = containerRef.current;

    if (!starsCanvas || !planetCanvas || !container) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);

    const bgCanvas = document.createElement("canvas");
    bgCanvasRef.current = bgCanvas;
    const bgCtx = bgCanvas.getContext("2d");

    let stars = [];

    function resize() {
      const { width, height } = container.getBoundingClientRect();

      [starsCanvas, planetCanvas, bgCanvas].forEach((c) => {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      });

      drawBackground();
      initStars();
    }

    function initStars() {
      const w = starsCanvas.width;
      const h = starsCanvas.height;
      const count = Math.round((w * h) / 1600);

      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.2 + 0.2) * dpr,
        twinkleSpeed: 0.003 + Math.random() * 0.007,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function drawStars() {
      const ctx = starsCanvas.getContext("2d");
      ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

      for (let s of stars) {
        const t = performance.now() * s.twinkleSpeed + s.phase;
        const a = 0.5 + Math.abs(Math.sin(t)) * 0.5;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawBackground() {
      const w = bgCanvas.width;
      const h = bgCanvas.height;

      bgCtx.clearRect(0, 0, w, h);

      const blobs = [
        { x: 0.2 * w, y: 0.3 * h, r: 0.6 * Math.min(w, h), color: [95, 58, 255] },
        { x: 0.8 * w, y: 0.5 * h, r: 0.5 * Math.min(w, h), color: [255, 80, 175] },
        { x: 0.5 * w, y: 0.8 * Math.min(w, h), r: 0.7 * Math.min(w, h), color: [20, 200, 255] },
      ];

      blobs.forEach((b, i) => {
        const grad = bgCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const [r, g, bl] = b.color;

        grad.addColorStop(0, `rgba(${r},${g},${bl},0.45)`);
        grad.addColorStop(0.45, `rgba(${r},${g},${bl},0.18)`);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        bgCtx.globalCompositeOperation = i === 0 ? "lighter" : "screen";
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      });

      const cx = w / 2;
      const cy = h / 2;

      const sunGrad = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, 300 * dpr);
      sunGrad.addColorStop(0, "rgba(255,255,200,0.9)");
      sunGrad.addColorStop(0.2, "rgba(255,220,100,0.6)");
      sunGrad.addColorStop(0.6, "rgba(255,160,0,0.3)");
      sunGrad.addColorStop(1, "rgba(0,0,0,0)");

      bgCtx.globalCompositeOperation = "screen";
      bgCtx.fillStyle = sunGrad;
      bgCtx.fillRect(0, 0, w, h);

      bgCtx.globalCompositeOperation = "source-over";
    }

    function drawPlanets() {
      const ctx = planetCanvas.getContext("2d");
      const w = planetCanvas.width;
      const h = planetCanvas.height;

      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(bgCanvas, 0, 0);

      const lightX = cx;
      const lightY = cy;

      const tiltX = 0.1;
      const tiltY = 0.7;
      const rotation = -Math.PI / 15;

      const containerRect = containerRef.current.getBoundingClientRect();

      planetsRef.current.forEach((p, i) => {
        if (!p || isNaN(p.r) || p.r <= 0 || isNaN(p.screenX) || isNaN(p.screenY)) {
          return;
        }

        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          p.orbit * (1 - tiltX),
          p.orbit * (1 - tiltY),
          rotation,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        if (!isPausedRef.current) p.angle += p.speed * 16;

        const x =
          cx +
          Math.cos(p.angle) * p.orbit * (1 - tiltX) * Math.cos(rotation) -
          Math.sin(p.angle) * p.orbit * (1 - tiltY) * Math.sin(rotation);

        const y =
          cy +
          Math.cos(p.angle) * p.orbit * (1 - tiltX) * Math.sin(rotation) +
          Math.sin(p.angle) * p.orbit * (1 - tiltY) * Math.cos(rotation);

        p.canvasX = x;
        p.canvasY = y;
        p.screenX = containerRect.left + x / dpr;
        p.screenY = containerRect.top + y / dpr;

        const fillColor =
          (mediaPopup && mediaPopup.planet.id !== p.id) ||
          popupOpen ||
          (hoveredListPlanet !== null && hoveredListPlanet !== p.id)
            ? "#777"
            : p.color;

        const dx = x - lightX;
        const dy = y - lightY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const highlightX = x - (dx / dist) * p.r * 0.6;
        const highlightY = y - (dy / dist) * p.r * 0.6;

        if (isNaN(highlightX) || isNaN(highlightY) || isNaN(x) || isNaN(y) || isNaN(p.r)) {
          return;
        }

        const grad = ctx.createRadialGradient(highlightX, highlightY, 0, x, y, p.r);
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(0.25, fillColor);
        grad.addColorStop(1, "rgba(0,0,0,0.75)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (labelRefs.current[i]) {
          const label = labelRefs.current[i];
          label.style.transform = `translate(${x / dpr - 20}px, ${y / dpr + p.r / dpr + 8}px)`;
        }
      });
    }

    let raf;
    function loop() {
      drawStars();
      drawPlanets();
      raf = requestAnimationFrame(loop);
    }

    resize();
    initStars();
    loop();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [hoveredListPlanet, popupOpen, mediaPopup]);

  return (
    <>
      <canvas ref={starsRef} className="stars-canvas" />
      <canvas ref={planetRef} className="planet-canvas" />
    </>
  );
}