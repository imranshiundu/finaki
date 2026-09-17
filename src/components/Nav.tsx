"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("--:--:--");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-GB", {
            timeZone: "Africa/Nairobi",
            hour12: false,
          })
        );
      } catch {
        setTime("--:--:--");
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let navHidden = false;

    const onScroll = () => {
      const y = window.scrollY;
      const vel = y - lastY;
      lastY = y;
      if (y > 180 && vel > 2 && !navHidden) {
        navHidden = true;
        setHidden(true);
      } else if ((vel < -2 || y < 180) && navHidden) {
        navHidden = false;
        setHidden(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (sel: string) => {
    setMenuOpen(false);
    document.body.classList.remove("lock");
    if (sel === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    if (next) {
      document.body.classList.add("lock");
    } else {
      document.body.classList.remove("lock");
    }
  };

  return (
    <>
      <header className={`nav ${hidden ? "hidden" : ""}`}>
        <div className="nav-in">
          <a
            href="#top"
            className="logo"
            onClick={(e) => { e.preventDefault(); scrollTo("#top"); }}
            aria-label="Finaki — back to top"
          >
            <svg className="ic icf">
              <use href="#i-spark" />
            </svg>
            FINAKI<sup>®</sup>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("#services"); }}>Services</a>
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollTo("#work"); }}>Work</a>
            <a href="#agents" onClick={(e) => { e.preventDefault(); scrollTo("#agents"); }}>Agents</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}>Contact</a>
          </nav>
          <div className="nav-right">
            <span className="nav-time">NBO <span>{time}</span></span>
            <a
              href="#contact"
              className="btn-pill"
              onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
            >
              <span className="mg-in">Start a project <svg className="ic"><use href="#i-arrow" /></svg></span>
            </a>
            <button
              className={`burger ${menuOpen ? "open" : ""}`}
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mmenu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <nav>
          <a className="mlink" href="#services" onClick={(e) => { e.preventDefault(); scrollTo("#services"); }}>
            <small>01</small>Services
          </a>
          <a className="mlink" href="#work" onClick={(e) => { e.preventDefault(); scrollTo("#work"); }}>
            <small>02</small>Work
          </a>
          <a className="mlink" href="#agents" onClick={(e) => { e.preventDefault(); scrollTo("#agents"); }}>
            <small>03</small>Agents
          </a>
          <a className="mlink" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}>
            <small>04</small>Contact
          </a>
        </nav>
        <div className="mmenu-foot mono">
          <span>hello@finaki.studio</span>
          <span>Nairobi, Kenya — {time} EAT</span>
        </div>
      </div>
    </>
  );
}
