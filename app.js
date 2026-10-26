(() => {
  'use strict';
  const waNumber = '923194445006';
  const $ = (s) => document.querySelector(s);
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));

  const toggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  const closeNav = () => {
    if (!mobileNav || !toggle) return;
    mobileNav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  };
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const opening = mobileNav.hidden;
      mobileNav.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 800) closeNav(); });
  }

  const nudge = $('#chatNudge');
  $('#dismissNudge')?.addEventListener('click', () => { if (nudge) nudge.hidden = true; });
  const serviceField = $('#service');
  if (serviceField) {
    const requestedService = new URLSearchParams(location.search).get('service');
    if (requestedService && [...serviceField.options].some(opt => opt.value === requestedService)) {
      serviceField.value = requestedService;
    }
  }
  $('#contactForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const service = $('#service').value;
    const details = $('#details').value.trim();
    if (!name || !service || !details) return;
    const message = [
      'Hello Ceenum Technologies!',
      '',
      `Name: ${name}`,
      ...(email ? [`Email: ${email}`] : []),
      `Service: ${service}`,
      `Project details: ${details}`,
      '',
      "I'd like to discuss this project."
    ].join('\n');
    // A same-tab redirect avoids popup blockers; WhatsApp handles delivery only after the visitor presses Send.
    window.location.assign(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`);
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, {threshold: 0.06, rootMargin: '0px 0px -15px 0px'});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  const stage = $('#heroStage');
  const orb = $('#stageOrb');
  if (stage && orb && window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -16;
      orb.style.animation = 'none';
      orb.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
    stage.addEventListener('pointerleave', () => { orb.style.animation = ''; orb.style.transform = ''; });
  }
})();
