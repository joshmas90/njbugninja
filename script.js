(() => {
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('#nav-links');
  const year = document.querySelector('#year');
  const zipForm = document.querySelector('#zip-check');
  const quoteForm = document.querySelector('#quote-form');

  if (year) year.textContent = new Date().getFullYear();

  // Header becomes solid once the hero is scrolled.
  const setHeader = () => header && header.classList.toggle('is-solid', window.scrollY > 40);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  // Mobile menu
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = !navLinks.classList.contains('is-open');
      navLinks.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (open) header.classList.add('is-solid');
      else setHeader();
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // ZIP check pre-fills the quote form and scrolls to it. Nothing is sent.
  if (zipForm) {
    zipForm.addEventListener('submit', e => {
      e.preventDefault();
      const zip = zipForm.zip.value.trim();
      const loc = document.querySelector('#location');
      if (loc && zip) loc.value = zip;
      document.querySelector('#quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => document.querySelector('#quote-form [name="name"]')?.focus({ preventScroll: true }), 600);
    });
  }

  // Quote form composes an SMS on the visitor's device.
  if (quoteForm) {
    quoteForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!quoteForm.reportValidity()) return;
      const d = new FormData(quoteForm);
      const lines = [
        'Hi Josh, requesting a Mosquito Ninja quote.',
        '',
        `Name: ${d.get('name') || ''}`,
        `Phone: ${d.get('phone') || ''}`,
        `Town/ZIP: ${d.get('location') || 'Not provided'}`,
        `Dealing with: ${d.get('service') || 'Not sure'}`,
        `Property: ${d.get('message') || 'No notes'}`
      ];
      const body = encodeURIComponent(lines.join('\n'));
      const sep = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
      window.location.href = `sms:+16093136317${sep}body=${body}`;
    });
  }
})();
