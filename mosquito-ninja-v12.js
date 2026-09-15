// Website navigation runtime. Quote, coverage and preparation interactions
// are implemented independently in website-tools.js.

const ensureHeadLink = (rel, href, attrs = {}) => {
  if (!document.head || document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
  document.head.appendChild(link);
};

ensureHeadLink('manifest', '/site.webmanifest');

// Website-optimized counterpart to the native app launch overlay. It preserves
// the same mark / brand / red slash language, but runs only once per browser tab
// session and clears much faster than the app splash so navigation and CWV are
// not repeatedly penalized.
(() => {
  const storageKey = 'mn-launch-splash-v4';
  let seen = false;
  try {
    seen = sessionStorage.getItem(storageKey) === '1';
    if (!seen) sessionStorage.setItem(storageKey, '1');
  } catch {
    // Storage may be unavailable in hardened/private browsing. Showing once on
    // this page is preferable to breaking the launch experience.
  }
  if (seen || !document.body) return;

  ensureHeadLink('preload', '/assets/splash-wordmark-v30.webp', {
    as: 'image',
    type: 'image/webp'
  });

  const style = document.createElement('style');
  style.id = 'mn-launch-splash-styles';
  style.textContent = `
    .mn-launch-overlay{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:#020403;color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;isolation:isolate;overflow:hidden;opacity:1;visibility:visible;transition:opacity .36s cubic-bezier(.4,0,1,1),visibility .36s ease}
    .mn-launch-overlay::before{content:"";position:absolute;inset:-24%;background:radial-gradient(circle at 50% 47%,rgba(224,32,39,.19) 0,rgba(224,32,39,.075) 19%,transparent 42%),radial-gradient(circle at 50% 50%,rgba(143,189,46,.055),transparent 54%);opacity:0;transform:scale(.52);transition:opacity .82s ease,transform 1.3s cubic-bezier(.16,.82,.2,1)}
    .mn-launch-overlay::after{content:"";position:absolute;inset:0;opacity:.15;background-image:radial-gradient(rgba(255,255,255,.32) .45px,transparent .55px),linear-gradient(90deg,transparent 49.94%,rgba(255,255,255,.032) 50%,transparent 50.06%);background-size:7px 7px,100% 100%;-webkit-mask-image:radial-gradient(circle at center,#000,transparent 67%);mask-image:radial-gradient(circle at center,#000,transparent 67%);pointer-events:none}
    .mn-launch-inner{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;width:min(98vw,640px);padding:22px 10px;text-align:center;transform:translateY(-1vh)}
    .mn-launch-mark-wrap{position:relative;width:min(78vw,370px);aspect-ratio:1;display:grid;place-items:center;isolation:isolate}
    .mn-launch-aura{position:absolute;z-index:-3;inset:13%;border-radius:50%;background:rgba(224,32,39,.12);box-shadow:0 0 46px rgba(224,32,39,.28),0 0 128px rgba(224,32,39,.16),0 0 210px rgba(224,32,39,.07);opacity:0;transform:scale(.28);filter:blur(2px)}
    .mn-launch-burst{position:absolute;z-index:-2;inset:8%;border:1px solid rgba(224,32,39,.65);border-radius:50%;opacity:0;transform:scale(.2);box-shadow:0 0 26px rgba(224,32,39,.22)}
    .mn-launch-orbit{position:absolute;z-index:-1;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,.13);opacity:0;transform:scale(.48) rotate(-130deg)}
    .mn-launch-orbit::before,.mn-launch-orbit::after{content:"";position:absolute;border-radius:50%;background:#e02027;box-shadow:0 0 12px rgba(224,32,39,.8)}
    .mn-launch-orbit::before{width:7px;height:7px;left:11%;top:15%}
    .mn-launch-orbit::after{width:5px;height:5px;right:7%;bottom:24%;background:#8fbd2e;box-shadow:0 0 12px rgba(143,189,46,.8)}
    .mn-launch-mark{display:block;width:100%;height:100%;object-fit:contain;mix-blend-mode:screen;opacity:0;transform:scale(.32) rotate(-72deg);filter:blur(9px) drop-shadow(0 22px 46px rgba(0,0,0,.64));will-change:opacity,transform,filter}
    .mn-launch-strike{position:absolute;z-index:3;left:48.5%;top:48%;width:56%;height:clamp(8px,2.6%,11px);transform:translate(-50%,-50%) rotate(-40deg);pointer-events:none}
    .mn-launch-strike::before{content:"";display:block;width:100%;height:100%;border-radius:999px;background:linear-gradient(90deg,#bb0d14 0,#e02027 32%,#ff3037 84%,#fff 100%);box-shadow:0 0 7px rgba(224,32,39,.95),0 0 24px rgba(224,32,39,.68),0 0 54px rgba(224,32,39,.32);opacity:0;transform:scaleX(0);transform-origin:left center}
    .mn-launch-strike::after{content:"";position:absolute;right:-1px;top:50%;width:16%;height:260%;border-radius:50%;background:radial-gradient(circle,#fff 0,rgba(255,70,76,.76) 24%,transparent 70%);opacity:0;transform:translateY(-50%) scale(.25)}
    .mn-launch-lockup{position:relative;width:min(96vw,610px);aspect-ratio:1000/247;margin-top:-28px;overflow:hidden;opacity:0;transform:translateY(18px) scale(.92);filter:blur(7px);clip-path:inset(0 50% 0 50%);will-change:opacity,transform,filter,clip-path}
    .mn-launch-lockup::before{content:"";position:absolute;inset:26% 14% 5%;background:radial-gradient(ellipse,rgba(224,32,39,.18),transparent 69%);filter:blur(18px);pointer-events:none}
    .mn-launch-lockup img{position:relative;z-index:1;display:block;width:100%;height:100%;object-fit:contain;mix-blend-mode:screen;filter:drop-shadow(0 8px 22px rgba(224,32,39,.16))}
    .mn-launch-overlay.is-active::before{opacity:1;transform:scale(1)}
    .mn-launch-overlay.is-active .mn-launch-aura{animation:mn-launch-aura 1.5s cubic-bezier(.16,.84,.2,1) .04s both}
    .mn-launch-overlay.is-active .mn-launch-burst{animation:mn-launch-burst .84s cubic-bezier(.15,.72,.15,1) .65s both}
    .mn-launch-overlay.is-active .mn-launch-orbit{animation:mn-launch-orbit 1.45s cubic-bezier(.16,.78,.18,1) .06s both}
    .mn-launch-overlay.is-active .mn-launch-mark{animation:mn-launch-mark 1.02s cubic-bezier(.14,.76,.18,1) .08s both}
    .mn-launch-overlay.is-active .mn-launch-strike::before{animation:mn-launch-strike .62s cubic-bezier(.14,.72,.18,1) .72s both}
    .mn-launch-overlay.is-active .mn-launch-strike::after{animation:mn-launch-tip .52s ease-out .78s both}
    .mn-launch-overlay.is-active .mn-launch-lockup{animation:mn-launch-lockup .86s cubic-bezier(.16,.82,.2,1) .98s both}
    .mn-launch-overlay.is-leaving{opacity:0;visibility:hidden;pointer-events:none}
    @keyframes mn-launch-mark{0%{opacity:0;transform:scale(.32) rotate(-72deg);filter:blur(9px) drop-shadow(0 22px 46px rgba(0,0,0,.64))}46%{opacity:1;transform:scale(1.1) rotate(4deg);filter:blur(0) drop-shadow(0 22px 46px rgba(0,0,0,.64))}72%{transform:scale(.97) rotate(-1.2deg)}100%{opacity:1;transform:scale(1) rotate(0);filter:blur(0) drop-shadow(0 22px 46px rgba(0,0,0,.64))}}
    @keyframes mn-launch-aura{0%{opacity:0;transform:scale(.28)}55%{opacity:1;transform:scale(1.18)}100%{opacity:.82;transform:scale(1)}}
    @keyframes mn-launch-burst{0%{opacity:0;transform:scale(.25)}24%{opacity:.72}100%{opacity:0;transform:scale(1.72)}}
    @keyframes mn-launch-orbit{0%{opacity:0;transform:scale(.48) rotate(-130deg)}42%{opacity:.8}100%{opacity:.38;transform:scale(1) rotate(36deg)}}
    @keyframes mn-launch-strike{0%{opacity:0;transform:scaleX(0)}12%{opacity:1}72%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
    @keyframes mn-launch-tip{0%{opacity:0;transform:translateY(-50%) scale(.2)}35%{opacity:1;transform:translateY(-50%) scale(1)}100%{opacity:0;transform:translateY(-50%) scale(1.7)}}
    @keyframes mn-launch-lockup{0%{opacity:0;transform:translateY(18px) scale(.92);filter:blur(7px);clip-path:inset(0 50% 0 50%)}48%{opacity:1;filter:blur(0);clip-path:inset(0 0 0 0)}72%{transform:translateY(0) scale(1.025)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0);clip-path:inset(0 0 0 0)}}
    @media(max-width:520px){.mn-launch-mark-wrap{width:min(88vw,348px)}.mn-launch-inner{transform:translateY(-2vh);padding-inline:5px}.mn-launch-lockup{width:min(98vw,500px);margin-top:-22px}}
    @media(max-height:560px) and (orientation:landscape){.mn-launch-inner{transform:none}.mn-launch-mark-wrap{width:min(60vh,260px)}.mn-launch-lockup{width:min(82vw,460px);margin-top:-26px}}
    @media(prefers-reduced-motion:reduce){.mn-launch-overlay,.mn-launch-overlay::before,.mn-launch-aura,.mn-launch-burst,.mn-launch-orbit,.mn-launch-mark,.mn-launch-strike::before,.mn-launch-strike::after,.mn-launch-lockup{transition:none!important;animation:none!important}.mn-launch-overlay::before,.mn-launch-aura,.mn-launch-orbit,.mn-launch-mark,.mn-launch-lockup{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}.mn-launch-burst,.mn-launch-strike{display:none}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'mn-launch-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="mn-launch-inner">
      <div class="mn-launch-mark-wrap">
        <span class="mn-launch-aura"></span>
        <span class="mn-launch-burst"></span>
        <span class="mn-launch-orbit"></span>
        <img class="mn-launch-mark" src="/assets/mark-v20.webp" alt="" width="370" height="370" decoding="async">
        <span class="mn-launch-strike"></span>
      </div>
      <div class="mn-launch-lockup">
        <img src="/assets/splash-wordmark-v30.webp" alt="" width="1000" height="247" decoding="async" fetchpriority="high">
      </div>
    </div>`;

  const previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  document.body.prepend(overlay);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('is-active')));

  const visibleFor = reducedMotion ? 500 : 2350;
  window.setTimeout(() => {
    overlay.classList.add('is-leaving');
    document.documentElement.style.overflow = previousOverflow;
    window.setTimeout(() => {
      overlay.remove();
      style.remove();
    }, reducedMotion ? 20 : 380);
  }, visibleFor);
})();

const addJsonLd = (id, data) => {
  if (!document.head || document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// The homepage already declares LocalBusiness in its server-rendered graph. Other
// pages extend the shared #business entity with accurate service-area detail.
if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  addJsonLd('mn-local-business-schema', {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': 'https://njbugninja.com/#business',
    name: 'Mosquito Ninja',
    alternateName: 'NJ Bug Ninja',
    url: 'https://njbugninja.com/',
    telephone: '+1-609-313-6317',
    email: 'service@njbugninja.com',
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Burlington County, New Jersey' },
      { '@type': 'AdministrativeArea', name: 'Camden County, New Jersey' },
      { '@type': 'AdministrativeArea', name: 'Gloucester County, New Jersey' }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-609-313-6317',
      email: 'service@njbugninja.com',
      contactType: 'customer service',
      areaServed: 'US-NJ',
      availableLanguage: ['English']
    }
  });
}

const y = document.querySelector('#year');
if (y) y.textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
if (header) {
  const syncHeader = () => header.classList.toggle('is-stuck', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
}

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
if (toggle && nav) {
  const setMenuOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  };

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}

// Analytics-ready, privacy-conscious event hooks. These do not transmit data by
// themselves. If a first-party analytics layer is added later, it can listen to
// the custom event or an existing dataLayer without changing the customer flow.
const emitSiteEvent = (eventName, detail = {}) => {
  const payload = {
    event: eventName,
    page_path: window.location.pathname,
    ...detail
  };
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
  document.dispatchEvent(new CustomEvent('mosquitoNinja:site-event', { detail: payload }));
};

let quoteStarted = false;
document.addEventListener('input', event => {
  if (!quoteStarted && event.target && event.target.closest && event.target.closest('#quote-form')) {
    quoteStarted = true;
    emitSiteEvent('quote_form_start');
  }
}, { passive: true });

document.addEventListener('click', event => {
  const link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
  if (!link) return;
  const href = link.getAttribute('href') || '';
  if (href.startsWith('tel:')) emitSiteEvent('click_to_call');
  else if (href.startsWith('sms:')) emitSiteEvent('click_to_text');
  else if (href.startsWith('mailto:')) emitSiteEvent('click_to_email');
  else if (href.includes('#quote')) emitSiteEvent('quote_cta_click');
});

const coverageFormForTracking = document.querySelector('#coverage-form');
if (coverageFormForTracking) {
  coverageFormForTracking.addEventListener('submit', () => emitSiteEvent('service_area_check'));
}

// The quote form now emails Mosquito Ninja directly. This capture-phase handler
// intentionally runs before the older SMS fallback listener in website-tools.js.
const quoteForm = document.querySelector('#quote-form');
if (quoteForm) {
  const submitButton = quoteForm.querySelector('button[type="submit"]');
  const status = quoteForm.querySelector('#quote-status');
  const note = quoteForm.querySelector('.form-note');
  const phone = quoteForm.elements.namedItem('phone');

  if (submitButton) submitButton.textContent = 'SEND QUOTE REQUEST →';
  if (note) note.textContent = 'Submitting sends these details to Mosquito Ninja’s company inbox. Prefer text? You can still copy the prepared request or call/text 609-313-6317.';

  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.autocomplete = 'off';
  honeypot.tabIndex = -1;
  honeypot.setAttribute('aria-hidden', 'true');
  honeypot.style.position = 'absolute';
  honeypot.style.left = '-10000px';
  honeypot.style.width = '1px';
  honeypot.style.height = '1px';
  quoteForm.appendChild(honeypot);

  quoteForm.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (phone) {
      const enoughDigits = phone.value.replace(/\D/g, '').length >= 10;
      phone.setCustomValidity(enoughDigits ? '' : 'Please enter a complete phone number, including area code.');
      phone.setAttribute('aria-invalid', String(!enoughDigits));
    }

    if (!quoteForm.reportValidity() || !submitButton) {
      if (status) status.textContent = 'Please check the highlighted contact details.';
      emitSiteEvent('quote_form_validation_error');
      return;
    }

    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'SENDING…';
    quoteForm.setAttribute('aria-busy', 'true');
    if (status) status.textContent = 'Sending your quote request to Mosquito Ninja…';

    const payload = Object.fromEntries(new FormData(quoteForm).entries());
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/quote-submit.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        credentials: 'same-origin'
      });
      let result = {};
      try { result = await response.json(); } catch { result = {}; }
      if (!response.ok || !result.ok) throw new Error(result.message || 'Quote delivery failed');

      if (status) status.textContent = result.message || 'Request sent. Mosquito Ninja will follow up using the phone number you provided.';
      emitSiteEvent('quote_form_success', { service: payload.service || 'unknown' });
      quoteForm.reset();
      if (phone) phone.removeAttribute('aria-invalid');
    } catch (error) {
      emitSiteEvent('quote_form_error');
      if (status) {
        status.textContent = error && error.name === 'AbortError'
          ? 'The request took too long to send. Please use Copy request or call/text 609-313-6317.'
          : 'We could not email the request right now. Please use Copy request or call/text 609-313-6317.';
      }
    } finally {
      window.clearTimeout(timeout);
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
      quoteForm.removeAttribute('aria-busy');
    }
  }, true);
}

// Keep the customer-facing privacy copy accurate after the email workflow change.
if (window.location.pathname === '/privacy.html') {
  const privacyItem = [...document.querySelectorAll('.prose li')].find(item =>
    item.textContent.trim().startsWith('The website quote form prepares a text')
  );
  if (privacyItem) {
    privacyItem.textContent = 'The website quote form submits the contact and property details you enter to Mosquito Ninja’s company email inbox. The website does not create a separate lead database from those submissions.';
  }
}

// Show the primary company email consistently in the website footer.
const footerContact = [...document.querySelectorAll('.footer h4')].find(heading =>
  heading.textContent.trim() === 'CONTACT MOSQUITO NINJA'
)?.parentElement;
if (footerContact && !footerContact.querySelector('a[href="mailto:service@njbugninja.com"]')) {
  const emailLink = document.createElement('a');
  emailLink.href = 'mailto:service@njbugninja.com';
  emailLink.textContent = 'service@njbugninja.com';
  footerContact.appendChild(emailLink);
}

// Reveal major content groups as they enter the viewport. The motion-ready
// class is only added when IntersectionObserver is available, so content is
// never hidden when JavaScript or the observer API is unavailable.
if (
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const revealTargets = [...document.querySelectorAll([
    '.section-copy',
    '.cards .card',
    '.process-photo',
    '.process-copy',
    '.why-grid > *',
    '.area-grid > *',
    '.faq-grid > *',
    '.quote-grid > *',
    '.content-grid > *',
    '.cta .shell',
    '.footer-grid > *'
  ].join(','))];

  if (revealTargets.length) {
    document.documentElement.classList.add('mn-motion-ready');
    revealTargets.forEach((target, index) => {
      target.classList.add('mn-reveal');
      target.style.setProperty('--mn-reveal-delay', `${Math.min(index % 3, 2) * 70}ms`);
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach(target => revealObserver.observe(target));
  }
}
