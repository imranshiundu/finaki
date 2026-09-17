"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const cur = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (
      window.matchMedia("(hover:hover) and (pointer:fine)").matches
    ) {
      cursor.style.display = "block";

      const onPointerMove = (e: PointerEvent) => {
        cur.current.tx = e.clientX;
        cur.current.ty = e.clientY;
        document.documentElement.style.setProperty("--mx", e.clientX + "px");
        document.documentElement.style.setProperty("--my", e.clientY + "px");
      };

      const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const lab = target.closest("[data-cursor]");
        const inter = target.closest(
          "a,button,.sp,.wp,input,textarea,select,label,.chip"
        );
        if (lab) {
          if (labelRef.current)
            labelRef.current.textContent = (lab as HTMLElement).dataset.cursor ?? "";
          cursor.classList.add("is-label");
          cursor.classList.remove("is-link");
        } else {
          cursor.classList.remove("is-label");
          cursor.classList.toggle("is-link", !!inter);
        }
      };

      const onMouseLeave = () => cursor.classList.add("hide");
      const onMouseEnter = () => cursor.classList.remove("hide");
      const onPointerDown = () => cursor.classList.add("is-down");
      const onPointerUp = () => cursor.classList.remove("is-down");

      let raf: number;
      const tick = () => {
        cur.current.x += (cur.current.tx - cur.current.x) * 0.2;
        cur.current.y += (cur.current.ty - cur.current.y) * 0.2;
        cursor.style.transform = `translate(${cur.current.x}px,${cur.current.y}px)`;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("mouseover", onMouseOver);
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseenter", onMouseEnter);
      window.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("mouseover", onMouseOver);
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("mouseenter", onMouseEnter);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
      };
    }

    return () => {};
  }, []);

  return (
    <div className="cursor" ref={cursorRef} aria-hidden="true">
      <div className="c-ring">
        <span className="c-label" ref={labelRef}>VIEW</span>
      </div>
      <div className="c-dot" />
    </div>
  );
}
