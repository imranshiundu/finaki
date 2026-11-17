  (function () {
    'use strict';
    const $  = (s, c) => (c || document).querySelector(s);
    const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body = document.body;

    /* ---------- Smooth scroll (Lenis, graceful fallback) ---------- */
    let lenis = null;
    try {
      if (window.Lenis && !RM) {
        lenis = new Lenis({
          duration: 1.4,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.6
        });
        const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (err) { lenis = null; }
    function smoothTo(target) {
      if (RM) {
        if (typeof target === 'number') window.scrollTo({ top: target });
        else target.scrollIntoView({ block: 'start' });
        return;
      }
      if (lenis) {
        try { lenis.scrollTo(target, { duration: 1.6, offset: 0 }); return; }
        catch (err) { /* fall through to native */ }
      }
      if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---------- Image decoding (smoother raster, less jank) ---------- */
    $$('img').forEach(im => { if (!im.getAttribute('decoding')) im.setAttribute('decoding', 'async'); });

    /* ---------- Preloader ---------- */
    const pre = $('.preloader'), preNum = $('.pre-num');
    function finishLoad() {
      pre.classList.add('done');
      body.classList.remove('loading');
      body.classList.add('is-loaded');
      setTimeout(() => pre.remove(), 1500);
    }
    const firstVisit = !sessionStorage.getItem('finaki-loaded');
    if (RM || !firstVisit) {
      pre.style.display = 'none';
      body.classList.remove('loading');
      body.classList.add('is-loaded');
    }
    else {
      const t0 = performance.now(), DUR = 1150;
      (function count(t) {
        const p = Math.min(1, (t - t0) / DUR);
        const e = 1 - Math.pow(1 - p, 4); // easeOutQuart
        preNum.textContent = String(Math.round(e * 100)).padStart(3, '0');
        if (p < 1) requestAnimationFrame(count); else setTimeout(finishLoad, 180);
      })(t0);
      sessionStorage.setItem('finaki-loaded', '1');
    }

    /* ---------- Generic slider (metrics + testimonials) ---------- */
    function makeSlider(root, opts) {
      if (!root) return null;
      const slides = $$(opts.slideSel, root);
      if (!slides.length) return null;
      const count = $(opts.countSel, root), bar = opts.barSel ? $(opts.barSel, root) : null;
      const prev = $(opts.prevSel, root), next = $(opts.nextSel, root);
      if (bar) bar.style.setProperty('--dur', opts.dur + 'ms');
      let i = 0, timer = null, running = false;
      const restartBar = () => { const el = bar && bar.querySelector('i'); if (el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; } };
      function go(n, user) {
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
        if (count) count.textContent = String(i + 1).padStart(2, '0') + '/' + String(slides.length).padStart(2, '0');
        if (user && running) restartAuto(); else if (running && bar) restartBar();
      }
      function restartAuto() { if (timer) clearInterval(timer); if (bar) restartBar(); timer = setInterval(() => go(i + 1), opts.dur); }
      if (prev) prev.addEventListener('click', () => go(i - 1, true));
      if (next) next.addEventListener('click', () => go(i + 1, true));
      go(0);
      return {
        start() { if (running || RM) return; running = true; restartAuto(); },
        stop()  { running = false; if (timer) clearInterval(timer); }
      };
    }
    const mSlider = makeSlider($('.about-metrics'), { slideSel: '[data-slide]', prevSel: '[data-m-prev]', nextSel: '[data-m-next]', countSel: '[data-m-count]', barSel: '[data-m-bar]', dur: 5200 });
    const tSlider = makeSlider($('.t-col'),          { slideSel: '[data-slide]', prevSel: '[data-t-prev]', nextSel: '[data-t-next]', countSel: '[data-t-count]', barSel: '[data-t-bar]', dur: 6800 });
    // Auto-advance only while their section is on screen
    [['#about', mSlider], ['#services', tSlider]].forEach(([sel, sl]) => {
      const sec = $(sel); if (!sec || !sl) return;
      new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? sl.start() : sl.stop()), { threshold: .2 }).observe(sec);
    });

    /* ---------- Word-split reveals ---------- */
    $$('.split-words').forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach((w, idx) => {
        const outer = document.createElement('span'); outer.className = 'sw';
        const inner = document.createElement('span'); inner.className = 'sw-in';
        inner.style.setProperty('--i', idx);
        inner.textContent = w;
        outer.appendChild(inner);
        el.appendChild(outer);
        el.appendChild(document.createTextNode(' '));
      });
    });

    /* ---------- Scroll reveals ---------- */
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));

    /* ---------- Service list → preview crossfade ---------- */
    const svcItems = $$('.service-list li');
    const spA = $('.sp-img.a'), spB = $('.sp-img.b');
    const sCount = $('[data-s-count]');
    let spCur = spA;
    svcItems.forEach(li => { const im = new Image(); im.src = li.dataset.image; }); // preload
    function setService(li) {
      svcItems.forEach(l => l.classList.toggle('is-active', l === li));
      const src = li.dataset.image;
      if (spCur.getAttribute('src') === src) return;
      const nxt = spCur === spA ? spB : spA;
      nxt.onload = () => { nxt.classList.add('show'); spCur.classList.remove('show'); spCur = nxt; };
      nxt.alt = 'Preview — ' + li.querySelector('.s-name').textContent;
      nxt.src = src;
      if (sCount) sCount.textContent = li.dataset.index + '/06';
    }
    svcItems.forEach(li => {
      li.addEventListener('mouseenter', () => setService(li));
      li.addEventListener('click', () => setService(li));
      li.addEventListener('focus', () => setService(li));
    });

    /* ---------- Stories: drag gallery, arrows, progress ---------- */
    const track = $('.stories-track');
    if (track) {
      const pBar = $('.stories-progress i');
      const prevB = $('[data-stories-prev]'), nextB = $('[data-stories-next]');
      const max = () => track.scrollWidth - track.clientWidth;
      function updateUI() {
        const m = max();
        pBar.style.transform = 'scaleX(' + (m > 0 ? track.scrollLeft / m : 0) + ')';
        prevB.disabled = track.scrollLeft < 10;
        nextB.disabled = track.scrollLeft > m - 10;
      }
      track.addEventListener('scroll', updateUI, { passive: true });
      window.addEventListener('resize', updateUI);
      const step = () => (track.querySelector('.story-card').getBoundingClientRect().width + 40);
      prevB.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      nextB.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      let down = false, sx = 0, sl = 0;
      track.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse') return;
        down = true; sx = e.clientX; sl = track.scrollLeft;
        track.classList.add('dragging'); track.setPointerCapture(e.pointerId);
      });
      track.addEventListener('pointermove', e => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
      ['pointerup', 'pointercancel'].forEach(ev => track.addEventListener(ev, () => { down = false; track.classList.remove('dragging'); }));
      updateUI();
    }

    /* ---------- Process: scroll-linked step activation ---------- */
    const steps = $$('.process-step'), shots = $$('.process-shot');
    function setStep(i) {
      steps.forEach((s, k) => s.classList.toggle('is-live', k === i));
      shots.forEach((s, k) => s.classList.toggle('is-live', k === i));
    }
    if (steps.length && shots.length) {
      const band = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) setStep(+e.target.dataset.step); });
      }, { rootMargin: '-42% 0px -42% 0px' });
      steps.forEach(s => band.observe(s));
    }

    /* ---------- Accordion ---------- */
    $$('.acc-item').forEach(item => {
      const btn = item.querySelector('.acc-btn');
      btn.addEventListener('click', () => {
        const open = item.classList.contains('open');
        $$('.acc-item').forEach(o => { o.classList.remove('open'); o.querySelector('.acc-btn').setAttribute('aria-expanded', 'false'); });
        if (!open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });

    /* ---------- Menu overlay ---------- */
    const menu = $('.menu'), menuBtn = $('[data-menu-toggle]');
    function openMenu() {
      menu.classList.add('open'); menu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      body.classList.add('menu-open');
      if (lenis) lenis.stop();
    }
    function closeMenu() {
      menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
      if (lenis) lenis.start();
    }
    menuBtn.addEventListener('click', () => body.classList.contains('menu-open') ? closeMenu() : openMenu());
    $$('[data-menu-close]').forEach(el => el.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('menu-open')) closeMenu(); });

    /* ---------- Anchor navigation ---------- */
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (body.classList.contains('menu-open')) closeMenu();
      smoothTo(target);
    });
    const scrollDownBtn = $('[data-scroll-down]');
    if (scrollDownBtn) scrollDownBtn.addEventListener('click', () => {
      const about = $('#about');
      if (about) smoothTo(about);
    });
    const topBtn = $('[data-top]');
    if (topBtn) topBtn.addEventListener('click', () => {
      smoothTo(0);
    });

    /* ---------- Toast ---------- */
    const toast = $('.toast'); let toastT;
    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastT);
      toastT = setTimeout(() => toast.classList.remove('show'), 2600);
    }
    $$('[data-toast]').forEach(el => el.addEventListener('click', e => {
      if (el.tagName === 'A') e.preventDefault();
      showToast(el.dataset.toast);
    }));

    /* ---------- Magnetic elements ---------- */
    if (!RM && window.matchMedia('(pointer:fine)').matches) {
      $$('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', e => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * .3;
          const y = (e.clientY - r.top - r.height / 2) * .3;
          el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      });
    }

    /* ---------- Custom cursor (fine pointers) ---------- */
    if (!RM && window.matchMedia('(pointer:fine)').matches) {
      document.documentElement.classList.add('fine');
      const dot = $('.cursor-dot'), ring = $('.cursor-ring'), label = $('.cursor-label');
      let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      }, { passive: true });
      (function loop() {
        rx += (mx - rx) * .16; ry += (my - ry) * .16;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        requestAnimationFrame(loop);
      })();
      const HOVER = 'a,button,.service-list li,.fw-l';
      document.addEventListener('mouseover', e => {
        if (e.target.closest(HOVER)) ring.classList.add('is-hover');
        const d = e.target.closest('[data-cursor]');
        if (d) { ring.classList.add('is-drag'); label.textContent = d.dataset.cursor; }
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(HOVER)) ring.classList.remove('is-hover');
        const d = e.target.closest('[data-cursor]');
        if (d) { ring.classList.remove('is-drag'); label.textContent = ''; }
      });
    }

    /* ---------- Scroll-linked chrome: progress, parallax, mark spin ---------- */
    if (!RM) {
      const progress = $('.progress');
      const word = $('[data-hero-word]');
      const mark = $('.brand-mark svg');
      let y = window.scrollY;
      addEventListener('scroll', () => { y = window.scrollY; }, { passive: true });
      (function raf() {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
        if (word) word.style.transform = 'translateY(' + Math.min(y, innerHeight) * -0.12 + 'px)';
        if (mark) mark.style.transform = 'rotate(' + y * 0.18 + 'deg)';
        requestAnimationFrame(raf);
      })();
    }

    /* ---------- Ambient sound (WebAudio drone, off by default) ---------- */
    const soundBtn = $('.sound-toggle');
    let actx = null, master = null, on = false;
    soundBtn.addEventListener('click', () => {
      if (!actx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
        master = actx.createGain(); master.gain.value = 0; master.connect(actx.destination);
        const filter = actx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 220; filter.connect(master);
        [[55, 'triangle', .2], [110.4, 'sine', .12], [164.8, 'sine', .07]].forEach(([f, t, g]) => {
          const o = actx.createOscillator(); o.type = t; o.frequency.value = f;
          const og = actx.createGain(); og.gain.value = g;
          o.connect(og); og.connect(filter); o.start();
        });
        const lfo = actx.createOscillator(); lfo.frequency.value = .07;
        const lg = actx.createGain(); lg.gain.value = .015;
        lfo.connect(lg); lg.connect(master.gain); lfo.start();
      }
      on = !on;
      actx.resume();
      master.gain.linearRampToValueAtTime(on ? .05 : 0, actx.currentTime + .6);
      soundBtn.classList.toggle('on', on);
      soundBtn.setAttribute('aria-pressed', String(on));
    });

    /* ---------- Live Nairobi clock ---------- */
    const cT = $('[data-clock-time]'), cD = $('[data-clock-date]');
    function tick() {
      const now = new Date();
      const t = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
      const d = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
      if (cT) cT.textContent = 'Nairobi City ' + t;
      if (cD) cD.textContent = d;
    }
    tick(); setInterval(tick, 1000);
  })();
