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
      quoteForm.reset();
      if (phone) phone.removeAttribute('aria-invalid');
    } catch (error) {
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
