export default function Why() {
  const stats = [
    { n: "30", i: "+", p: "Projects shipped since 2023" },
    { n: "6", i: "wks", p: "Kickoff to launch, median" },
    { n: "24", i: "/7", p: "Our agents stay online" },
    { n: "0", i: "&", p: "Templates — every build starts at zero" },
  ];

  const principles = [
    { pn: "/01", h: "One senior team", p: "Strategy, design, code and launch from the same people. No handovers." },
    { pn: "/02", h: "Fixed scope, fixed price &", p: "The number is agreed before we start. No hourly meters." },
    { pn: "/03", h: "We stay after launch", p: "30 days of support on every build — then a retainer if you want us." },
  ];

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="why dots">
      <div className="container">
        <div className="sec-head">
          <span className="mono n">(02)</span>
          <svg className="ic icf">
            <use href="#i-spark" />
          </svg>
          <span className="mono">Why Finaki</span>
          <span className="rule" />
          <span className="mono">The difference &amp;</span>
        </div>
        <h2 className="h2">
          <span className="rl">
            <span className="rl-in">Built different,</span>
          </span>
          <span className="rl">
            <span className="rl-in">
              <em>on purpose.</em>
            </span>
          </span>
        </h2>
        <p className="why-note">
          Anyone can promise a website. We promise outcomes.
        </p>

        <div className="stats">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-n">
                <b>{s.n}</b>
                <i>{s.i}</i>
              </div>
              <p>{s.p}</p>
            </div>
          ))}
        </div>

        <div className="principles">
          {principles.map((p, i) => (
            <div
              key={i}
              className="princ"
              role="button"
              tabIndex={0}
              onClick={() => scrollTo("#contact")}
              onKeyDown={(e) => { if (e.key === "Enter") scrollTo("#contact"); }}
            >
              <span className="pn">{p.pn}</span>
              <div>
                <h3>{p.h}</h3>
                <p>{p.p}</p>
              </div>
              <svg className="ic">
                <use href="#i-arrow" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
