export default function Footer() {
  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="f-top">
          <div className="f-brand">
            <span className="logo">
              <svg className="ic icf">
                <use href="#i-spark" />
              </svg>
              FINAKI<sup>®</sup>
            </span>
            <p>Websites, software, agents &amp; everything after — from Nairobi.</p>
          </div>
          <div className="f-col">
            <span className="fl">Menu</span>
            <a className="f-link" href="#services" onClick={(e) => { e.preventDefault(); scrollTo("#services"); }}>Services</a>
            <a className="f-link" href="#work" onClick={(e) => { e.preventDefault(); scrollTo("#work"); }}>Work</a>
            <a className="f-link" href="#agents" onClick={(e) => { e.preventDefault(); scrollTo("#agents"); }}>Agents</a>
            <a className="f-link" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}>Contact</a>
          </div>
          <div className="f-col">
            <span className="fl">Reach us</span>
            <a className="f-link" href="mailto:hello@finaki.co.ke">hello@finaki.co.ke</a>
            <a className="f-link" href="tel:+254700123456">+254 700 123 456</a>
            <a className="f-link" href="https://wa.me/254700123456" target="_blank" rel="noopener">WhatsApp</a>
          </div>
          <div className="f-col">
            <span className="fl">Hours</span>
            <span className="f-link">Mon – Fri, 9:00 – 18:00 EAT</span>
            <span className="f-link">Agents: 24/7, obviously</span>
          </div>
        </div>
        <div className="f-mark" id="fMark" aria-label="Finaki">
          <span>F</span>
          <span>I</span>
          <span>N</span>
          <span>A</span>
          <span>K</span>
          <span>I</span>
          <span className="amp">&amp;</span>
        </div>
        <div className="f-bot">
          <span>© 2025 Finaki Studio Ltd</span>
          <span>1.2921° S, 36.8219° E</span>
          <button
            className="totop"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="mg-in">
              Back to top{" "}
              <svg className="ic" style={{ width: 12, height: 12 }}>
                <use href="#i-down" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
