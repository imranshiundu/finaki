"use client";

import { useState, useRef, useEffect } from "react";
import { CHAT_KB, CHAT_FALLBACK } from "@/lib/data";

type Message = { role: "user" | "agent"; text: string; cta?: boolean };

export default function Agents() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [greeted, setGreeted] = useState(false);

  const scrollLog = () => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollLog();
  }, [messages]);

  useEffect(() => {
    if (!greeted) {
      setGreeted(true);
      setTimeout(() => {
        setMessages([{ role: "agent", text: "Sasa! I'm Fini — a demo agent built here at Finaki. Ask about pricing, speed, or what we build." }]);
      }, 1500);
    }
  }, [greeted]);

  const typeReply = (text: string, cta?: boolean) => {
    setBusy(true);
    setTimeout(() => {
      let i = 0;
      const step = 2;
      const interval = setInterval(() => {
        i += step;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === "agent") {
            return [
              ...prev.slice(0, -1),
              { ...last, text: text.slice(0, i) },
            ];
          }
          return prev;
        });
        scrollLog();
        if (i >= text.length) {
          clearInterval(interval);
          if (cta) {
            setMessages((prev) => [
              ...prev,
              { role: "agent", text: "", cta: true },
            ]);
          }
          setBusy(false);
        }
      }, 14);
    }, 520 + Math.random() * 420);
  };

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || busy) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg.trim() }]);
    const hit = CHAT_KB.find((k) => k.re.test(msg));
    typeReply(hit ? hit.reply : CHAT_FALLBACK, hit?.cta);
  };

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="agents"
      style={{ padding: "clamp(40px,6vw,80px) clamp(10px,1.5vw,20px)" }}
    >
      <div className="agents-slab">
        <div className="agents-grid">
          <div>
            <div className="sec-head">
              <span className="mono n">(04)</span>
              <svg className="ic icf">
                <use href="#i-spark" />
              </svg>
              <span className="mono">Agents</span>
              <span className="rule" />
              <span className="mono">Live demo →</span>
            </div>
            <h2 className="h2">
              <span className="rl">
                <span className="rl-in">Software that talks</span>
              </span>
              <span className="rl">
                <span className="rl-in">
                  <em>and never sleeps.</em>
                </span>
              </span>
            </h2>
            <p className="agents-p">
              We design, train and deploy AI agents on your data — wired into
              WhatsApp, your site and your tools. English or Kiswahili. 3 a.m.
              included.
            </p>
            <ul className="cap-list">
              <li>
                <svg className="ic icf">
                  <use href="#i-spark" />
                </svg>
                Lead qualification
              </li>
              <li>
                <svg className="ic icf">
                  <use href="#i-spark" />
                </svg>
                24/7 customer replies
              </li>
              <li>
                <svg className="ic icf">
                  <use href="#i-spark" />
                </svg>
                Bookings &amp; scheduling
              </li>
              <li>
                <svg className="ic icf">
                  <use href="#i-spark" />
                </svg>
                WhatsApp &amp; web
              </li>
              <li>
                <svg className="ic icf">
                  <use href="#i-spark" />
                </svg>
                Internal knowledge bots
              </li>
            </ul>
            <p className="agents-note mono">
              Fini is live — ask it anything.
            </p>
          </div>

          <div className="chat">
            <div className="chat-head">
              <span className="mono" style={{ color: "rgba(244,239,228,.85)" }}>
                Fini — demo agent
              </span>
              <span className="live mono">
                <i /> Online
              </span>
            </div>
            <div className="chat-log" ref={logRef}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`msg ${m.role === "user" ? "msg-user" : "msg-agent"}`}
                >
                  {m.role === "agent" && m.cta ? (
                    <button
                      className="chat-cta"
                      onClick={() => scrollTo("#contact")}
                    >
                      Take me to the form{" "}
                      <svg className="ic" style={{ width: 12, height: 12 }}>
                        <use href="#i-down" />
                      </svg>
                    </button>
                  ) : (
                    m.text
                  )}
                </div>
              ))}
              {busy && messages[messages.length - 1]?.role === "user" && (
                <div className="msg msg-agent">
                  <span className="msg-typing">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              )}
            </div>
            <div className="chips">
              {["What do you build?", "Pricing?", "How fast?", "M-Pesa integrations?"].map(
                (c, i) => (
                  <button
                    key={i}
                    className="chip"
                    disabled={busy}
                    onClick={() => handleSend(c)}
                  >
                    {c}
                  </button>
                )
              )}
            </div>
            <form
              className="chat-input"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Fini anything…"
                autoComplete="off"
                aria-label="Message Fini"
              />
              <button type="submit" className="chat-send" aria-label="Send">
                <svg className="ic">
                  <use href="#i-send" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
