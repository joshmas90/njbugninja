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

// On tall desktop viewports, keep the entire dark opening composition (hero +
// service-highlight strip) filling at least the first screen. Without this, the
// light services section can peek up as an empty band beneath the launch view.
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  const launchViewportStyle = document.createElement('style');
  launchViewportStyle.id = 'mn-home-launch-viewport';
  launchViewportStyle.textContent = `
    @media (min-width: 981px) {
      .hero {
        min-height: max(760px, calc(100svh - 96px));
        min-height: max(760px, calc(100dvh - 96px));
      }
      .hero-inner {
        min-height: max(650px, calc(100svh - 96px));
        min-height: max(650px, calc(100dvh - 96px));
      }
    }
  `;
  document.head.appendChild(launchViewportStyle);
}

// A cinematic brand reveal runs once per browser tab. The matching critical
// head style keeps the first paint black until this overlay is in place.
(() => {
  const storageKey = 'mn-launch-splash-v7';
  const releasePrepaint = () => {
    window.clearTimeout(window.__mnLaunchFallback);
    document.documentElement.classList.remove('mn-launch-pending');
  };
  let seen = false;
  try {
    seen = sessionStorage.getItem(storageKey) === '1';
    if (!seen) sessionStorage.setItem(storageKey, '1');
  } catch {
    // Storage may be unavailable in hardened/private browsing. Showing once on
    // this page is preferable to breaking the launch experience.
  }
  if (
    seen ||
    !document.body ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    releasePrepaint();
    return;
  }

  ensureHeadLink('preload', '/assets/mark-transparent-v31.webp', {
    as: 'image',
    type: 'image/webp'
  });
  ensureHeadLink('preload', '/assets/splash-wordmark-transparent-v31.webp', {
    as: 'image',
    type: 'image/webp'
  });

  const style = document.createElement('style');
  style.id = 'mn-launch-splash-styles';
  style.textContent = `
    .mn-launch-overlay{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:radial-gradient(circle at 50% 44%,#0b110d 0,#040706 38%,#010201 76%);color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;isolation:isolate;overflow:hidden;opacity:1;visibility:visible;transition:opacity .42s cubic-bezier(.4,0,1,1),visibility .42s ease}
    .mn-launch-overlay::before{content:"";position:absolute;inset:-28%;background:radial-gradient(circle at 50% 44%,rgba(224,32,39,.26) 0,rgba(224,32,39,.10) 20%,transparent 45%),radial-gradient(circle at 50% 54%,rgba(143,189,46,.07),transparent 58%);opacity:0;transform:scale(.58);transition:opacity 1s ease,transform 1.7s cubic-bezier(.16,.82,.2,1)}
    .mn-launch-overlay::after{content:"";position:absolute;inset:0;opacity:.18;background-image:radial-gradient(rgba(255,255,255,.34) .5px,transparent .65px),linear-gradient(90deg,transparent 49.94%,rgba(255,255,255,.038) 50%,transparent 50.06%),linear-gradient(180deg,rgba(0,0,0,.72),transparent 18%,transparent 82%,rgba(0,0,0,.78));background-size:7px 7px,100% 100%,100% 100%;-webkit-mask-image:radial-gradient(circle at center,#000,transparent 76%);mask-image:radial-gradient(circle at center,#000,transparent 76%);pointer-events:none}
    .mn-launch-inner{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;width:min(98vw,1120px);padding:24px 12px;text-align:center;transform:translateY(-1.5vh)}
    .mn-launch-mark-wrap{position:relative;width:min(60vw,50vh,650px);aspect-ratio:1;display:grid;place-items:center;isolation:isolate}
    .mn-launch-aura{position:absolute;z-index:-3;inset:8%;border-radius:50%;background:rgba(224,32,39,.15);box-shadow:0 0 64px rgba(224,32,39,.34),0 0 170px rgba(224,32,39,.20),0 0 290px rgba(224,32,39,.10);opacity:0;transform:scale(.22);filter:blur(2px)}
    .mn-launch-burst{position:absolute;z-index:-2;inset:4%;border:1px solid rgba(224,32,39,.72);border-radius:50%;opacity:0;transform:scale(.22);box-shadow:0 0 34px rgba(224,32,39,.28)}
    .mn-launch-orbit{position:absolute;z-index:-1;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,.13);opacity:0;transform:scale(.48) rotate(-130deg)}
    .mn-launch-orbit::before,.mn-launch-orbit::after{content:"";position:absolute;border-radius:50%;background:#e02027;box-shadow:0 0 12px rgba(224,32,39,.8)}
    .mn-launch-orbit::before{width:7px;height:7px;left:11%;top:15%}
    .mn-launch-orbit::after{width:5px;height:5px;right:7%;bottom:24%;background:#8fbd2e;box-shadow:0 0 12px rgba(143,189,46,.8)}
    .mn-launch-mark{display:block;width:100%;height:100%;object-fit:contain;opacity:0;transform:scale(.46) rotate(-42deg);filter:blur(7px) drop-shadow(0 28px 58px rgba(0,0,0,.68));will-change:opacity,transform,filter}
    .mn-launch-strike{position:absolute;z-index:3;left:50%;top:46.6%;width:62%;height:clamp(10px,2.8%,16px);transform:translate(-50%,-50%) rotate(-38deg);pointer-events:none}
    .mn-launch-strike::before{content:"";display:block;width:100%;height:100%;border-radius:999px;background:linear-gradient(90deg,#bb0d14 0,#e02027 32%,#ff3037 84%,#fff 100%);box-shadow:0 0 7px rgba(224,32,39,.95),0 0 24px rgba(224,32,39,.68),0 0 54px rgba(224,32,39,.32);opacity:0;transform:scaleX(0);transform-origin:left center}
    .mn-launch-strike::after{content:"";position:absolute;right:-1px;top:50%;width:16%;height:260%;border-radius:50%;background:radial-gradient(circle,#fff 0,rgba(255,70,76,.76) 24%,transparent 70%);opacity:0;transform:translateY(-50%) scale(.25)}
    .mn-launch-lockup{position:relative;width:min(90vw,860px);aspect-ratio:1080/361;margin-top:clamp(-72px,-5vw,-42px);overflow:hidden;opacity:0;transform:translateY(24px) scale(.9);filter:blur(8px);clip-path:inset(0 50% 0 50%);will-change:opacity,transform,filter,clip-path}
    .mn-launch-lockup::before{content:"";position:absolute;inset:26% 14% 5%;background:radial-gradient(ellipse,rgba(224,32,39,.18),transparent 69%);filter:blur(18px);pointer-events:none}
    .mn-launch-lockup img{position:relative;z-index:1;display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 8px 22px rgba(224,32,39,.16))}
    .mn-launch-overlay.is-active::before{opacity:1;transform:scale(1)}
    .mn-launch-overlay.is-active .mn-launch-aura{animation:mn-launch-aura 1.8s cubic-bezier(.16,.84,.2,1) .04s both}
    .mn-launch-overlay.is-active .mn-launch-burst{animation:mn-launch-burst .92s cubic-bezier(.15,.72,.15,1) .82s both}
    .mn-launch-overlay.is-active .mn-launch-orbit{animation:mn-launch-orbit 1.85s cubic-bezier(.16,.78,.18,1) .06s both}
    .mn-launch-overlay.is-active .mn-launch-mark{animation:mn-launch-mark 1.32s cubic-bezier(.14,.76,.18,1) .12s both}
    .mn-launch-overlay.is-active .mn-launch-strike::before{animation:mn-launch-strike .72s cubic-bezier(.14,.72,.18,1) 1.02s both}
    .mn-launch-overlay.is-active .mn-launch-strike::after{animation:mn-launch-tip .6s ease-out 1.08s both}
    .mn-launch-overlay.is-active .mn-launch-lockup{animation:mn-launch-lockup 1.02s cubic-bezier(.16,.82,.2,1) 1.26s both}
    .mn-launch-overlay.is-leaving{opacity:0;visibility:hidden;pointer-events:none}
    @keyframes mn-launch-mark{0%{opacity:0;transform:scale(.46) rotate(-42deg);filter:blur(7px) drop-shadow(0 28px 58px rgba(0,0,0,.68))}48%{opacity:1;transform:scale(1.07) rotate(3deg);filter:blur(0) drop-shadow(0 30px 62px rgba(0,0,0,.7))}74%{transform:scale(.985) rotate(-1deg)}100%{opacity:1;transform:scale(1) rotate(0);filter:blur(0) drop-shadow(0 28px 58px rgba(0,0,0,.68))}}
    @keyframes mn-launch-aura{0%{opacity:0;transform:scale(.22)}58%{opacity:1;transform:scale(1.14)}100%{opacity:.88;transform:scale(1)}}
    @keyframes mn-launch-burst{0%{opacity:0;transform:scale(.22)}24%{opacity:.82}100%{opacity:0;transform:scale(1.68)}}
    @keyframes mn-launch-orbit{0%{opacity:0;transform:scale(.5) rotate(-110deg)}42%{opacity:.86}100%{opacity:.42;transform:scale(1) rotate(50deg)}}
    @keyframes mn-launch-strike{0%{opacity:0;transform:scaleX(0)}12%{opacity:1}72%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
    @keyframes mn-launch-tip{0%{opacity:0;transform:translateY(-50%) scale(.2)}35%{opacity:1;transform:translateY(-50%) scale(1)}100%{opacity:0;transform:translateY(-50%) scale(1.7)}}
    @keyframes mn-launch-lockup{0%{opacity:0;transform:translateY(24px) scale(.9);filter:blur(8px);clip-path:inset(0 50% 0 50%)}48%{opacity:1;filter:blur(0);clip-path:inset(0 0 0 0)}74%{transform:translateY(0) scale(1.025)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0);clip-path:inset(0 0 0 0)}}
    @media(max-width:520px){.mn-launch-mark-wrap{width:min(82vw,42vh,420px)}.mn-launch-inner{transform:translateY(-1vh);padding-inline:5px}.mn-launch-lockup{width:min(96vw,560px);margin-top:-34px}}
    @media(max-height:560px) and (orientation:landscape){.mn-launch-inner{transform:none}.mn-launch-mark-wrap{width:min(54vh,340px)}.mn-launch-lockup{width:min(74vw,570px);margin-top:-34px}}
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
        <img class="mn-launch-mark" src="/assets/mark-transparent-v31.webp" alt="" width="768" height="768" decoding="async" fetchpriority="high">
        <span class="mn-launch-strike"></span>
      </div>
      <div class="mn-launch-lockup">
        <img src="/assets/splash-wordmark-transparent-v31.webp" alt="" width="1080" height="361" decoding="async" fetchpriority="high">
      </div>
    </div>`;

  const previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  document.body.prepend(overlay);
  releasePrepaint();

  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('is-active')));

  const visibleFor = 3000;
  window.setTimeout(() => {
    overlay.classList.add('is-leaving');
    document.documentElement.style.overflow = previousOverflow;
    window.setTimeout(() => {
      overlay.remove();
      style.remove();
    }, 440);
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

  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenuOpen(false);
  });

  window.matchMedia('(max-width: 980px)').addEventListener('change', () => setMenuOpen(false));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}

// Premium contact sheet for the header phone control. The original tel: href
// remains intact as a no-JavaScript fallback, while the enhanced experience lets
// visitors choose call, text or quote without losing their place.
const headerPhoneLinks = [...document.querySelectorAll('.nav .phone')];
if (headerPhoneLinks.length) {
  const backdrop = document.createElement('div');
  backdrop.className = 'contact-sheet-backdrop';
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <section class="contact-sheet" role="dialog" aria-modal="true" aria-labelledby="contact-sheet-title" aria-describedby="contact-sheet-copy">
      <button class="contact-sheet__close" type="button" aria-label="Close contact options">×</button>
      <p class="contact-sheet__eyebrow">DIRECT CONTACT</p>
      <h2 id="contact-sheet-title">CALL, TEXT OR REQUEST A QUOTE.</h2>
      <p id="contact-sheet-copy">Reach Mosquito Ninja directly at <strong>609-313-6317</strong>. For a property quote, send your town or ZIP code and the outdoor pest concerns you want reviewed.</p>
      <div class="contact-sheet__actions">
        <a class="contact-sheet__action contact-sheet__action--primary" href="tel:+16093136317">CALL 609-313-6317</a>
        <a class="contact-sheet__action" href="sms:+16093136317">SEND A TEXT</a>
        <a class="contact-sheet__action" href="/#quote">REQUEST A QUOTE</a>
      </div>
      <p class="contact-sheet__season">Planning ahead for Spring 2027? Mention spring scheduling in your quote request so route availability can be discussed early.</p>
    </section>
  `;
  document.body.appendChild(backdrop);

  const sheet = backdrop.querySelector('.contact-sheet');
  const closeButton = backdrop.querySelector('.contact-sheet__close');
  let contactTrigger = null;

  const focusable = () => [...sheet.querySelectorAll('a[href], button:not([disabled])')];

  const closeContactSheet = () => {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    document.documentElement.classList.remove('mn-contact-open');
    const trigger = contactTrigger;
    contactTrigger = null;
    if (trigger && document.contains(trigger)) trigger.focus();
  };

  const openContactSheet = trigger => {
    contactTrigger = trigger;
    backdrop.hidden = false;
    document.documentElement.classList.add('mn-contact-open');
    requestAnimationFrame(() => {
      const primary = sheet.querySelector('.contact-sheet__action--primary');
      (primary || closeButton).focus();
    });
  };

  headerPhoneLinks.forEach(link => {
    link.setAttribute('aria-label', 'Contact Mosquito Ninja at 609-313-6317');
    link.addEventListener('click', event => {
      event.preventDefault();
      openContactSheet(link);
    });
  });

  closeButton.addEventListener('click', closeContactSheet);
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) closeContactSheet();
  });
  sheet.addEventListener('click', event => {
    if (event.target.closest('a[href="/#quote"]')) closeContactSheet();
  });

  document.addEventListener('keydown', event => {
    if (backdrop.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeContactSheet();
      return;
    }
    if (event.key !== 'Tab') return;

    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
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

    const serviceInputs = [...quoteForm.querySelectorAll('input[name="service"]')];
    const selectedServices = serviceInputs.filter(input => input.checked).map(input => input.value);
    const servicePicker = quoteForm.querySelector('.service-picker');
    if (!selectedServices.length) {
      servicePicker?.setAttribute('aria-invalid', 'true');
      if (status) status.textContent = 'Select at least one service, or choose “Not sure / discuss my property.”';
      serviceInputs[0]?.focus();
      emitSiteEvent('quote_form_validation_error');
      return;
    }
    servicePicker?.removeAttribute('aria-invalid');

    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'SENDING…';
    quoteForm.setAttribute('aria-busy', 'true');
    if (status) status.textContent = 'Sending your quote request to Mosquito Ninja…';

    const formData = new FormData(quoteForm);
    const payload = Object.fromEntries([...formData.entries()].filter(([key]) => key !== 'service'));
    payload.services = selectedServices;
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

      if (status) status.textContent = result.message || 'Request sent. Mosquito Ninja will review the property details and follow up using the phone number you provided to discuss availability and next steps.';
      emitSiteEvent('quote_form_success', { service: payload.services.join('+') || 'unknown' });
      quoteForm.reset();
      servicePicker?.removeAttribute('aria-invalid');
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

// Open linked FAQ answers, including links followed from another page.
const openLinkedAnswer = () => {
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
  const answer = document.getElementById(id);
  if (answer?.matches('details.reference-answer')) answer.open = true;
};
openLinkedAnswer();
window.addEventListener('hashchange', openLinkedAnswer);

let answersClosedBeforePrint = [];
window.addEventListener('beforeprint', () => {
  answersClosedBeforePrint = [...document.querySelectorAll('details.reference-answer:not([open])')];
  answersClosedBeforePrint.forEach(answer => { answer.open = true; });
});
window.addEventListener('afterprint', () => {
  answersClosedBeforePrint.forEach(answer => { answer.open = false; });
  answersClosedBeforePrint = [];
});

// Page content remains visually stable while scrolling. Brand motion is kept to
// brief hover feedback instead of viewport-triggered reveals.