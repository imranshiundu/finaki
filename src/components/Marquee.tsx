"use client";

export default function Marquee() {
  const wordsA = ["E-commerce", "Brand", "Automation", "Growth"];
  const wordsB = ["Websites", "Software", "AI agents", "Market entry"];

  const chunk = (words: string[]) => (
    <div className="mq-chunk">
      {words.map((w, i) => (
        <span key={i}>
          <b>{w}</b>
          <svg className="ic icf">
            <use href="#i-spark" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className="cross" aria-hidden="true">
      <div className="mqb b">
        <div className="mq-track">
          {chunk(wordsB)}
          {chunk(wordsB)}
          {chunk(wordsB)}
        </div>
      </div>
      <div className="mqb a">
        <div className="mq-track">
          {chunk(wordsA)}
          {chunk(wordsA)}
          {chunk(wordsA)}
        </div>
      </div>
    </div>
  );
}
