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
  const storageKey = 'mn-launch-splash-v2';
  let seen = false;
  try {
    seen = sessionStorage.getItem(storageKey) === '1';
    if (!seen) sessionStorage.setItem(storageKey, '1');
  } catch {
    // Storage may be unavailable in hardened/private browsing. Showing once on
    // this page is preferable to breaking the launch experience.
  }
  if (seen || !document.body) return;

  const style = document.createElement('style');
  style.id = 'mn-launch-splash-styles';
  style.textContent = `
    .mn-launch-overlay{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:#030504;color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;isolation:isolate;overflow:hidden;opacity:1;visibility:visible;transition:opacity .22s ease,visibility .22s ease}
    .mn-launch-overlay::before{content:"";position:absolute;inset:-18%;background:radial-gradient(circle at 50% 48%,rgba(224,32,39,.12) 0,rgba(224,32,39,.055) 16%,transparent 36%),radial-gradient(circle at 50% 50%,rgba(143,189,46,.035),transparent 50%);opacity:0;transform:scale(.82);transition:opacity .48s ease,transform .58s cubic-bezier(.2,.8,.2,1)}
    .mn-launch-overlay::after{content:"";position:absolute;inset:0;opacity:.13;background-image:radial-gradient(rgba(255,255,255,.32) .45px,transparent .55px);background-size:7px 7px;-webkit-mask-image:radial-gradient(circle at center,#000,transparent 60%);mask-image:radial-gradient(circle at center,#000,transparent 60%);pointer-events:none}
    .mn-launch-inner{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;width:min(88vw,380px);padding:24px;text-align:center;transform:translateY(-1vh)}
    .mn-launch-mark-wrap{position:relative;width:min(52vw,218px);aspect-ratio:1;display:grid;place-items:center;isolation:isolate}
    .mn-launch-aura{position:absolute;z-index:-2;inset:15%;border-radius:50%;background:rgba(224,32,39,.1);box-shadow:0 0 34px rgba(224,32,39,.2),0 0 90px rgba(224,32,39,.11);opacity:0;transform:scale(.7);transition:opacity .44s ease,transform .54s cubic-bezier(.2,.78,.25,1)}
    .mn-launch-orbit{position:absolute;z-index:-1;inset:2%;border-radius:50%;border:1px solid rgba(255,255,255,.09);opacity:0;transform:scale(.86) rotate(-18deg);transition:opacity .32s ease .12s,transform .56s cubic-bezier(.18,.8,.25,1) .05s}
    .mn-launch-orbit::before,.mn-launch-orbit::after{content:"";position:absolute;border-radius:50%;background:#e02027;box-shadow:0 0 12px rgba(224,32,39,.8)}
    .mn-launch-orbit::before{width:5px;height:5px;left:12%;top:15%}
    .mn-launch-orbit::after{width:3px;height:3px;right:8%;bottom:24%;background:#8fbd2e;box-shadow:0 0 10px rgba(143,189,46,.75)}
    .mn-launch-mark{display:block;width:100%;height:100%;object-fit:contain;mix-blend-mode:screen;opacity:0;transform:scale(.88) rotate(-3deg);filter:drop-shadow(0 14px 28px rgba(0,0,0,.54));transition:opacity .32s ease,transform .48s cubic-bezier(.16,.84,.32,1.08)}
    .mn-launch-strike{position:absolute;z-index:2;left:48.5%;top:48%;width:56%;height:8px;transform:translate(-50%,-50%) rotate(-40deg);pointer-events:none}
    .mn-launch-strike::before{content:"";display:block;width:100%;height:100%;border-radius:999px;background:linear-gradient(90deg,#d71920 0,#f1262d 84%,#fff 100%);box-shadow:0 0 6px rgba(224,32,39,.78),0 0 18px rgba(224,32,39,.5);opacity:0;transform:scaleX(0);transform-origin:left center}
    .mn-launch-brand{margin-top:18px;font-family:"Barlow Condensed",Impact,sans-serif;font-size:24px;line-height:1;font-weight:900;letter-spacing:.055em;opacity:0;transform:translateY(8px);transition:opacity .3s ease .12s,transform .34s ease .12s}
    .mn-launch-brand span{color:#e02027}
    .mn-launch-detail{margin-top:9px;font-size:8px;line-height:1.45;font-weight:800;letter-spacing:.17em;color:rgba(255,255,255,.58);opacity:0;transform:translateY(6px);transition:opacity .3s ease .17s,transform .34s ease .17s}
    .mn-launch-rule{display:block;width:72px;height:1px;margin-top:17px;background:linear-gradient(90deg,transparent,#e02027 28%,#e02027 72%,transparent);box-shadow:0 0 8px rgba(224,32,39,.5);opacity:0;transform:scaleX(.12);transition:opacity .28s ease .21s,transform .52s cubic-bezier(.18,.76,.25,1) .2s}
    .mn-launch-overlay.is-active::before{opacity:1;transform:scale(1)}
    .mn-launch-overlay.is-active .mn-launch-aura{opacity:1;transform:scale(1)}
    .mn-launch-overlay.is-active .mn-launch-orbit{opacity:1;transform:scale(1) rotate(0)}
    .mn-launch-overlay.is-active .mn-launch-mark{opacity:1;transform:scale(1) rotate(0)}
    .mn-launch-overlay.is-active .mn-launch-strike::before{animation:mn-launch-strike .5s cubic-bezier(.16,.72,.24,1) .18s both}
    .mn-launch-overlay.is-active .mn-launch-brand,.mn-launch-overlay.is-active .mn-launch-detail{opacity:1;transform:translateY(0)}
    .mn-launch-overlay.is-active .mn-launch-rule{opacity:1;transform:scaleX(1)}
    .mn-launch-overlay.is-leaving{opacity:0;visibility:hidden;pointer-events:none}
    @keyframes mn-launch-strike{0%{opacity:0;transform:scaleX(0)}18%{opacity:1}82%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
    @media(max-width:520px){.mn-launch-mark-wrap{width:min(56vw,204px)}.mn-launch-inner{transform:translateY(-2vh)}.mn-launch-brand{font-size:22px}.mn-launch-detail{font-size:7px;letter-spacing:.145em}}
    @media(max-height:520px) and (orientation:landscape){.mn-launch-inner{transform:none}.mn-launch-mark-wrap{width:min(34vh,168px)}.mn-launch-brand{margin-top:10px;font-size:20px}.mn-launch-detail{margin-top:6px}.mn-launch-rule{margin-top:10px}}
    @media(prefers-reduced-motion:reduce){.mn-launch-overlay,.mn-launch-overlay::before,.mn-launch-aura,.mn-launch-orbit,.mn-launch-mark,.mn-launch-strike::before,.mn-launch-brand,.mn-launch-detail,.mn-launch-rule{transition:none!important;animation:none!important}.mn-launch-overlay::before,.mn-launch-aura,.mn-launch-orbit,.mn-launch-mark,.mn-launch-brand,.mn-launch-detail,.mn-launch-rule{opacity:1!important;transform:none!important}.mn-launch-strike{display:none}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'mn-launch-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="mn-launch-inner">
      <div class="mn-launch-mark-wrap">
        <span class="mn-launch-aura"></span>
        <span class="mn-launch-orbit"></span>
        <img class="mn-launch-mark" src="/assets/mark-v20.webp" alt="" width="218" height="218" decoding="async">
        <span class="mn-launch-strike"></span>
      </div>
      <div class="mn-launch-brand"><span>MOSQUITO</span> NINJA</div>
      <div class="mn-launch-detail">MOSQUITOES. TICKS. CONSIDER THEM WARNED.</div>
      <span class="mn-launch-rule"></span>
    </div>`;

  const previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  document.body.prepend(overlay);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('is-active')));

  const visibleFor = reducedMotion ? 350 : 1180;
  window.setTimeout(() => {
    overlay.classList.add('is-leaving');
    document.documentElement.style.overflow = previousOverflow;
    window.setTimeout(() => {
      overlay.remove();
      style.remove();
    }, reducedMotion ? 20 : 240);
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
