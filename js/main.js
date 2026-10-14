(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ---- tema terang / gelap (berlaku selama halaman terbuka) ---- */
  const themeBtn = $('#themeToggle');
  const saved = (() => { try { return sessionStorage.getItem('theme'); } catch (e) { return null; } })();
  const setTheme = (t) => {
    root.dataset.theme = t;
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '☼ Terang' : '◐ Tema';
    try { sessionStorage.setItem('theme', t); } catch (e) {}
  };
  setTheme(saved === 'dark' ? 'dark' : 'light');
  themeBtn && themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ---- navigasi mobile ---- */
  const nav = $('#siteNav'), burger = $('#navBurger');
  if (nav && burger) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-links a', nav).forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---- progress bar + tombol kembali ke atas ---- */
  const bar = $('#progress'), top = $('#backTop');
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    if (bar) bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    if (top) top.classList.toggle('show', scrollY > 420);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top && top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---- reveal saat section terlihat ---- */
  const rv = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }), { threshold: .1 });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('visible'));

  /* ---- typing ---- */
  const typed = $('[data-typing]');
  if (typed && !reduce) {
    const words = (typed.dataset.words || '').split('|').filter(Boolean);
    let wi = 0, ci = 0, del = false;
    const tick = () => {
      const w = words[wi];
      typed.textContent = w.slice(0, ci);
      if (!del && ci < w.length) { ci++; setTimeout(tick, 85); }
      else if (!del) { del = true; setTimeout(tick, 1400); }
      else if (ci > 0) { ci--; setTimeout(tick, 38); }
      else { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 250); }
    };
    tick();
  }

  /* ---- lightbox foto + modal proyek ---- */
  let lastFocus = null;
  const openOverlay = (el) => { lastFocus = document.activeElement; el.classList.add('open'); const c = $('.x-btn', el); c && c.focus(); document.body.style.overflow = 'hidden'; };
  const closeOverlay = (el) => { el.classList.remove('open'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };

  const lb = $('#lightbox');
  if (lb) {
    const img = $('img', lb), cap = $('p', lb);
    $$('[data-lightbox]').forEach(b => b.addEventListener('click', () => {
      img.src = b.dataset.lightbox; img.alt = b.dataset.alt || '';
      cap.textContent = b.dataset.caption || 'Assrofa Hamalna';
      openOverlay(lb);
    }));
  }
  const pm = $('#projectModal');
  if (pm) {
    $$('[data-project]').forEach(b => b.addEventListener('click', () => {
      const t = $('#' + b.dataset.project);
      $('.modal-body', pm).innerHTML = t.innerHTML;
      openOverlay(pm);
    }));
  }
  $$('.overlay').forEach(o => {
    o.addEventListener('click', (e) => { if (e.target === o || e.target.closest('.x-btn')) closeOverlay(o); });
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.overlay.open').forEach(closeOverlay); });

  /* ---- filter keahlian ---- */
  const fbtns = $$('.filter'), skills = $$('.skill');
  const applyFilter = (f) => {
    fbtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
    skills.forEach(s => { s.hidden = !(f === 'all' || s.dataset.category === f); });
    const n = skills.filter(s => !s.hidden).length;
    const out = $('#filterCount'); if (out) out.textContent = n + ' dari ' + skills.length + ' keahlian ditampilkan';
  };
  if (fbtns.length) {
    fbtns.forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
    const h = location.hash.replace('#', '');
    applyFilter(fbtns.some(b => b.dataset.filter === h) ? h : 'all');
  }

  /* ---- form kontak -> aplikasi email ---- */
  const form = $('#contactForm');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = $('#senderName').value.trim(), em = $('#senderEmail').value.trim(), m = $('#message').value.trim();
    const subject = encodeURIComponent('Pesan dari website CV - ' + n);
    const body = encodeURIComponent('Nama: ' + n + '\nEmail: ' + (em || 'Tidak dicantumkan') + '\n\nPesan:\n' + m);
    location.href = 'mailto:Assrofahmalna25@gmail.com?subject=' + subject + '&body=' + body;
  });
})();

document.addEventListener("DOMContentLoaded", function () {
    const intro = document.getElementById("portfolio-intro");

    if (!intro) return;

    window.setTimeout(function () {
        intro.classList.add("intro-hidden");
    }, 2200);
});
