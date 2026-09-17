"use client";

import { useState } from "react";

export default function Contact() {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.querySelector<HTMLInputElement>("#fName")!;
    const email = form.querySelector<HTMLInputElement>("#fEmail")!;
    const msg = form.querySelector<HTMLTextAreaElement>("#fMsg")!;
    const service = form.querySelector<HTMLSelectElement>("#fService")!;
    const budget = form.querySelector<HTMLSelectElement>("#fBudget")!;

    const newErrors: Record<string, boolean> = {};
    if (!name.value.trim()) newErrors.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) newErrors.email = true;
    if (msg.value.trim().length < 8) newErrors.msg = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("A couple of fields need attention.");
      return;
    }

    const svcText = service.selectedOptions[0].textContent;
    const body = encodeURIComponent(
      `Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\nService: ${svcText}\nBudget: ${budget.value}\n\n${msg.value.trim()}`
    );
    showToast("Message ready — opening your mail app.");
    setTimeout(() => {
      window.location.href = `mailto:hello@finaki.co.ke?subject=${encodeURIComponent("New project inquiry — " + name.value.trim())}&body=${body}`;
    }, 600);
    form.reset();
    setErrors({});
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="sec-head">
          <span className="mono n">(05)</span>
          <svg className="ic icf">
            <use href="#i-spark" />
          </svg>
          <span className="mono">Start a project</span>
          <span className="rule" />
          <span className="mono">Reply within 1 working day</span>
        </div>
        <h2 className="h2">
          <span className="rl">
            <span className="rl-in">Let&apos;s make it</span>
          </span>
          <span className="rl">
            <span className="rl-in">
              <em>official</em> <span className="amp">&amp;</span>
            </span>
          </span>
        </h2>

        <div className="contact-grid">
          <div>
            <p className="contact-p">
              Tell us what you&apos;re building — or what&apos;s blocking it.
              We reply with thoughts, not a sales deck.
            </p>
            <a className="big-mail" href="mailto:hello@finaki.co.ke">
              hello@finaki.co.ke{" "}
              <svg className="ic">
                <use href="#i-arrow" />
              </svg>
            </a>
            <div className="c-info">
              <div className="fact">
                <span className="mono" style={{ color: "rgba(244,239,228,.38)" }}>Call</span>
                <a href="tel:+254700123456">+254 700 123 456</a>
              </div>
              <div className="fact">
                <span className="mono" style={{ color: "rgba(244,239,228,.38)" }}>WhatsApp</span>
                <a href="https://wa.me/254700123456" target="_blank" rel="noopener">
                  Message us instantly
                </a>
              </div>
              <div className="fact">
                <span className="mono" style={{ color: "rgba(244,239,228,.38)" }}>Base</span>
                <span className="fv">Nairobi — working everywhere</span>
              </div>
              <div className="fact">
                <span className="mono" style={{ color: "rgba(244,239,228,.38)" }}>Local time</span>
                <span className="fv">EAT</span>
              </div>
            </div>
          </div>

          <form noValidate onSubmit={handleSubmit}>
            <div className="f-row">
              <div className={`field ${errors.name ? "err" : ""}`}>
                <label htmlFor="fName">Name *</label>
                <input id="fName" name="name" type="text" autoComplete="name" />
                <span className="f-err">Required</span>
              </div>
              <div className={`field ${errors.email ? "err" : ""}`}>
                <label htmlFor="fEmail">Email *</label>
                <input id="fEmail" name="email" type="email" autoComplete="email" />
                <span className="f-err">Valid email, please</span>
              </div>
            </div>
            <div className="f-row">
              <div className="field">
                <label htmlFor="fService">Service</label>
                <select id="fService" name="service">
                  <option value="unsure">Not sure yet — let&apos;s talk</option>
                  <option value="web">Web &amp; Product</option>
                  <option value="software">Software &amp; Platforms</option>
                  <option value="agents">AI Agents &amp; Automation</option>
                  <option value="market">Market Entry (Kenya)</option>
                  <option value="brand">Brand &amp; Growth</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="fBudget">Budget</label>
                <select id="fBudget" name="budget">
                  <option value="Not sure yet">Not sure yet</option>
                  <option value="Under KES 150k">Under KES 150k</option>
                  <option value="KES 150k – 500k">KES 150k – 500k</option>
                  <option value="KES 500k – 1.5M">KES 500k – 1.5M</option>
                  <option value="KES 1.5M+">KES 1.5M+</option>
                </select>
              </div>
            </div>
            <div className={`field ${errors.msg ? "err" : ""}`}>
              <label htmlFor="fMsg">The problem *</label>
              <textarea
                id="fMsg"
                name="message"
                rows={4}
                placeholder="What are you building? What's in the way?"
              />
              <span className="f-err">Tell us a little more</span>
            </div>
            <button type="submit" className="btn-big">
              <span className="mg-in">
                Send it over{" "}
                <svg className="ic">
                  <use href="#i-arrow" />
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>

      {toast && (
        <div className="toasts" aria-live="polite">
          <div className="toast">
            <span className="t-dot" />
            <span>{toast}</span>
          </div>
        </div>
      )}
    </section>
  );
}
