"use client";

import { SERVICES } from "@/lib/data";

export default function Services() {
  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prefills = (serviceId: string) => {
    const select = document.querySelector<HTMLSelectElement>("#fService");
    if (select) select.value = serviceId;
    scrollTo("#contact");
  };

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="sec-head">
          <span className="mono n">(01)</span>
          <svg className="ic icf">
            <use href="#i-spark" />
          </svg>
          <span className="mono">What we do</span>
          <span className="rule" />
          <span className="mono">5 disciplines / 0 subcontractors</span>
        </div>
        <h2 className="h2">
          <span className="rl">
            <span className="rl-in">Everything digital.</span>
          </span>
          <span className="rl">
            <span className="rl-in">
              Then some <em>&amp;</em> then more.
            </span>
          </span>
        </h2>
        <p className="svc-count mono">
          Click a discipline to pre-fill your brief.
        </p>
      </div>

      <div className="stack" id="stack">
        {SERVICES.map((s) => (
          <article
            key={s.id}
            className="sp"
            tabIndex={0}
            style={s.style}
            data-cursor="START"
            onClick={() => prefills(s.id)}
            onKeyDown={(e) => { if (e.key === "Enter") prefills(s.id); }}
          >
            <div className="sp-in">
              <div>
                <div className="sp-top mono">
                  <b>{s.num}</b>
                  <span>{s.label}</span>
                </div>
                <h3
                  className="sp-title"
                  dangerouslySetInnerHTML={{ __html: s.title }}
                />
                <p className="sp-desc">{s.desc}</p>
                <ul className="sp-chips">
                  {s.chips.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <button className="sp-cta" type="button">
                  Brief us on this{" "}
                  <svg className="ic">
                    <use href="#i-arrow" />
                  </svg>
                </button>
              </div>
              <div className="sp-media">
                <div className="tilt-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
