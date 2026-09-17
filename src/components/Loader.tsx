"use client";

import { useState, useEffect } from "react";

export default function Loader() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = 2200;
    const interval = 16;
    const steps = duration / interval;
    let step = 0;

    const iv = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setCount(Math.round(eased * 100));

      if (step >= steps) {
        clearInterval(iv);
        setTimeout(() => setVisible(false), 600);
      }
    }, interval);

    return () => clearInterval(iv);
  }, []);

  if (!visible) return null;

  return (
    <div className="ldr" aria-hidden="true">
      <div className="ldr-in">
        <svg className="ic icf ldr-spark">
          <use href="#i-spark" />
        </svg>
        <div className="ldr-word">
          <span>F</span>
          <span>I</span>
          <span>N</span>
          <span>A</span>
          <span>K</span>
          <span>I</span>
          <span className="amp-l">&amp;</span>
        </div>
        <p className="ldr-tag mono">Digital studio — Nairobi</p>
      </div>
      <div className="ldr-count mono">
        <b>{String(count).padStart(2, "0")}</b> / 100
      </div>
      <div className="ldr-bar">
        <i style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </div>
  );
}
