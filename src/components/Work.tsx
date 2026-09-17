"use client";

import { useState, useRef, useEffect } from "react";
import { PROJECTS } from "@/lib/data";

export default function Work() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const hTrackRef = useRef<HTMLDivElement>(null);
  const [workIdx, setWorkIdx] = useState("01");
  const total = PROJECTS.length + 1;

  useEffect(() => {
    const track = hTrackRef.current;
    if (!track) return;
    const wrap = track.parentElement;
    if (!wrap) return;

    const onScroll = () => {
      const scrollLeft = wrap.scrollLeft;
      const maxScroll = track.scrollWidth - wrap.clientWidth;
      if (maxScroll <= 0) return;
      const progress = scrollLeft / maxScroll;
      const idx = Math.round(progress * (total - 1));
      setWorkIdx(String(Math.min(idx + 1, total)).padStart(2, "0"));
    };

    wrap.addEventListener("scroll", onScroll, { passive: true });
    return () => wrap.removeEventListener("scroll", onScroll);
  }, [total]);

  const openProject = (i: number) => {
    setActiveProject(i);
    setModalOpen(true);
    document.body.classList.add("lock");
  };

  const closeProject = () => {
    setModalOpen(false);
    setActiveProject(null);
    document.body.classList.remove("lock");
  };

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prefills = (serviceId: string) => {
    const select = document.querySelector<HTMLSelectElement>("#fService");
    if (select) select.value = serviceId;
    scrollTo("#contact");
  };

  const p = activeProject !== null ? PROJECTS[activeProject] : null;

  return (
    <>
      <section id="work">
        <div className="container work-head">
          <div>
            <div className="sec-head" style={{ marginBottom: 18 }}>
              <span className="mono n">(03)</span>
              <svg className="ic icf">
                <use href="#i-spark" />
              </svg>
              <span className="mono">Selected work</span>
              <span className="rule" />
              <span className="mono">Scrolls sideways →</span>
            </div>
            <h2 className="h2">
              <span className="rl">
                <span className="rl-in">Shipped &amp; still running.</span>
              </span>
            </h2>
          </div>
          <span className="work-idx mono">
            <b>{workIdx}</b> / <span>{String(total).padStart(2, "0")}</span>
          </span>
        </div>
        <div className="hwrap">
          <div className="htrack" ref={hTrackRef}>
            {PROJECTS.map((proj, i) => (
              <article
                key={i}
                className="wp"
                data-cursor="VIEW"
                role="button"
                tabIndex={0}
                aria-label={`Open ${proj.title}`}
                onClick={() => openProject(i)}
                onKeyDown={(e) => { if (e.key === "Enter") openProject(i); }}
              >
                <div className="wp-media">
                  <div className="tilt-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proj.src}
                      alt={`${proj.title} — ${proj.cat}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="wp-cap">
                  <div>
                    <h3>{proj.title}</h3>
                    <span className="mono">{proj.cat}</span>
                  </div>
                  <span className="mono">
                    ({String(i + 1).padStart(2, "0")}) — {proj.year}
                  </span>
                </div>
              </article>
            ))}
            <article className="wp wp-cta">
              <span className="mono">(Next) — open slot</span>
              <h3>
                Your project<br />could sit <span className="amp">&amp;</span><br />shine here.
              </h3>
              <button
                className="btn-pill"
                type="button"
                onClick={() => prefills("unsure")}
              >
                <span className="mg-in">
                  Claim the slot{" "}
                  <svg className="ic">
                    <use href="#i-arrow" />
                  </svg>
                </span>
              </button>
            </article>
          </div>
        </div>
      </section>

      <div
        className={`wm ${modalOpen ? "open" : ""}`}
        role="dialog"
        aria-modal={modalOpen}
        aria-label="Project details"
      >
        <div className="wm-bg" onClick={closeProject} />
        <div className="wm-panel">
          <div className="wm-head">
            <div>
              <span className="wm-cat mono">{p?.cat}</span>
              <h3 className="wm-title">{p?.title}</h3>
            </div>
            <button
              className="wm-close"
              onClick={closeProject}
              aria-label="Close"
            >
              <svg className="ic" style={{ width: 20, height: 20 }}>
                <use href="#i-x" />
              </svg>
            </button>
          </div>
          <div className="wm-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p?.src || ""}
              alt={p?.title || ""}
            />
          </div>
          <div className="wm-body">
            <div>
              <p className="wm-desc">{p?.desc}</p>
              <button
                className="btn-pill"
                style={{ marginTop: 26 }}
                onClick={() => {
                  if (p) prefills(p.service);
                  closeProject();
                }}
              >
                <span className="mg-in">
                  Start something similar{" "}
                  <svg className="ic">
                    <use href="#i-arrow" />
                  </svg>
                </span>
              </button>
            </div>
            <div className="wm-facts">
              <div className="fact">
                <span className="mono" style={{ color: "rgba(18,16,12,.5)" }}>Client</span>
                <span className="fv">{p?.title}</span>
              </div>
              <div className="fact">
                <span className="mono" style={{ color: "rgba(18,16,12,.5)" }}>Year</span>
                <span className="fv">{p?.year}</span>
              </div>
              <div className="fact">
                <span className="mono" style={{ color: "rgba(18,16,12,.5)" }}>Timeline</span>
                <span className="fv">{p?.time}</span>
              </div>
              <ul className="wm-del">
                {p?.del.map((d, i) => (
                  <li key={i}>
                    <svg className="ic icf">
                      <use href="#i-spark" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
