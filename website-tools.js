/* Website-owned interactions. This file is not imported by the native app. */
(function () {
  'use strict';
  const serviceNames = {
    mosquito: 'Mosquito control',
    tick: 'Tick control',
    fly: 'Outdoor fly control',
    unsure: 'Not sure / discuss my property'
  };
  const propertyTypeNames = {
    residential: 'Residential',
    commercial: 'Commercial / business',
    government: 'Government / municipal'
  };
  const contactPreferenceNames = {
    text: 'Text',
    call: 'Call',
    email: 'Email',
    'no-preference': 'No preference'
  };
  const clean = value => String(value || '').trim();

  function addStructuredData(id, data) {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function enhanceStructuredData() {
    const path = window.location.pathname;

    if (path === '/' || path === '/index.html') {
      addStructuredData('mn-service-catalog-schema', {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'OfferCatalog',
            '@id': 'https://njbugninja.com/#service-catalog',
            name: 'Mosquito Ninja services',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  '@id': 'https://njbugninja.com/mosquito-control.html#service',
                  name: 'Mosquito control',
                  serviceType: 'Targeted outdoor mosquito control',
                  url: 'https://njbugninja.com/mosquito-control.html',
                  provider: { '@id': 'https://njbugninja.com/#business' },
                  areaServed: { '@type': 'Place', name: 'South Jersey' }
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  '@id': 'https://njbugninja.com/tick-control.html#service',
                  name: 'Tick control',
                  serviceType: 'Targeted outdoor tick control',
                  url: 'https://njbugninja.com/tick-control.html',
                  provider: { '@id': 'https://njbugninja.com/#business' },
                  areaServed: { '@type': 'Place', name: 'South Jersey' }
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  '@id': 'https://njbugninja.com/fly-control.html#service',
                  name: 'Outdoor fly control',
                  serviceType: 'Targeted outdoor house-fly and nuisance-fly control',
                  url: 'https://njbugninja.com/fly-control.html',
                  provider: { '@id': 'https://njbugninja.com/#business' },
                  areaServed: { '@type': 'Place', name: 'South Jersey' }
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  '@id': 'https://njbugninja.com/commercial.html#service',
                  name: 'Commercial and government outdoor pest control',
                  serviceType: 'Outdoor pest control for commercial, municipal and government-managed properties',
                  url: 'https://njbugninja.com/commercial.html',
                  provider: { '@id': 'https://njbugninja.com/#business' },
                  areaServed: { '@type': 'Place', name: 'South Jersey' }
                }
              }
            ]
          },
          {
            '@type': 'ContactPoint',
            '@id': 'https://njbugninja.com/#contact',
            telephone: '+1-609-313-6317',
            contactType: 'customer service',
            areaServed: 'US-NJ',
            availableLanguage: ['English']
          }
        ]
      });
    }

    if (path === '/faq.html') {
      addStructuredData('mn-faq-schema', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': 'https://njbugninja.com/faq.html#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Do you treat mosquitoes and ticks?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Mosquito control and tick control are the core outdoor services. Tell us about both concerns when requesting a quote so the property can be discussed as a whole.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do you offer outdoor fly control?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Targeted outdoor fly control is available for house-fly and nuisance-fly pressure around source, resting and activity areas. Source reduction is part of the property discussion.'
            }
          },
          {
            '@type': 'Question',
            name: 'Which parts of New Jersey do you serve?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The current focus is South Jersey. Send your town or ZIP code to confirm route coverage and scheduling for your property.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do I request a quote?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Call or text Mosquito Ninja at 609-313-6317, or use the homepage quote form. Include your town or ZIP code, the service you need and a short description of the property.'
            }
          },
          {
            '@type': 'Question',
            name: 'Who handles the quote and the treatment?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mosquito Ninja is owner-operated, so one point of contact handles both the property discussion and the work.'
            }
          },
          {
            '@type': 'Question',
            name: 'When can people and pets use the yard again?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Re-entry depends on the product and application used. Follow the product-specific instructions provided in writing for your visit.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do you guarantee zero outdoor pests?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Outdoor pest pressure changes with weather, habitat, sanitation conditions and neighboring properties. Service is focused on reducing the pest problem without promising complete elimination.'
            }
          },
          {
            '@type': 'Question',
            name: 'How often will my property need service?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Timing depends on your property, pest activity and the treatment used. The recommended schedule is discussed when you request a quote.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do you treat commercial outdoor spaces?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Commercial service covers outdoor business spaces such as dining patios, event lawns, pool surroundings, waste areas and courtyards.'
            }
          }
        ]
      });
    }
  }

  function buildQuote(values) {
    return `Hi Mosquito Ninja, I'd like a property quote.\n\n` +
      `Name: ${clean(values.name)}\n` +
      `Preferred contact: ${contactPreferenceNames[values.contactPreference] || 'Not specified'}\n` +
      `Phone: ${clean(values.phone) || 'Not provided'}\n` +
      `Email: ${clean(values.email) || 'Not provided'}\n` +
      `Town/ZIP: ${clean(values.location)}\n` +
      `Services: ${(Array.isArray(values.services) ? values.services : [values.service]).filter(Boolean).map(value => serviceNames[value] || value).join(', ') || 'Not specified'}\n` +
      `Property type: ${propertyTypeNames[values.propertyType] || propertyTypeNames.residential}\n` +
      `Property details: ${clean(values.message)}`;
  }

  function evaluateCoverage(config, county, zip) {
    const statuses = ['covered', 'confirm', 'outside'];
    if (!config || config.state !== 'NJ' || !statuses.includes(config.defaultStatus) ||
        !config.counties || typeof config.counties !== 'object') {
      throw new Error('Invalid coverage configuration');
    }
    const key = clean(county).toLowerCase().replace(/ county$/, '');
    const rule = Object.prototype.hasOwnProperty.call(config.counties, key) ? config.counties[key] : null;
    if (!rule) return config.defaultStatus;
    if (!statuses.includes(rule.status)) throw new Error('Invalid county rule');
    for (const name of ['includedZIPs', 'excludedZIPs']) {
      if (rule[name] !== undefined && (!Array.isArray(rule[name]) || rule[name].some(value => !/^\d{5}$/.test(value)))) {
        throw new Error('Invalid ZIP rules');
      }
    }
    if (zip && (rule.excludedZIPs || []).includes(zip)) return 'outside';
    if (zip && (rule.includedZIPs || []).includes(zip)) return 'covered';
    return rule.status;
  }

  // Retry a failed rules download once. Each attempt has its own timeout so a
  // timed-out attempt cannot also abort the retry. Editing the form cancels both.
  async function loadCoverageConfig(signal, fetcher = fetch, timeoutMs = 8000) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (signal?.aborted) throw new DOMException('Coverage check cancelled', 'AbortError');
      const controller = new AbortController();
      const cancel = () => controller.abort();
      signal?.addEventListener('abort', cancel, { once: true });
      const timeout = setTimeout(cancel, timeoutMs);
      try {
        const response = await fetcher('/service-area-config.json', {
          cache: 'no-store', signal: controller.signal
        });
        if (!response.ok) throw new Error('Coverage rules unavailable');
        return await response.json();
      } catch (error) {
        if (signal?.aborted || attempt === 1) throw error;
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener('abort', cancel);
      }
    }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { buildQuote, evaluateCoverage, loadCoverageConfig };
  if (typeof document === 'undefined') return;

  enhanceStructuredData();

  // Keep the primary navigation concise: individual pest pages live under one
  // Services control. Static markup is preferred; this also upgrades any older
  // cached page that still contains the three individual pest links.
  document.querySelectorAll('nav.nav').forEach(nav => {
    let wrap = nav.querySelector('.services-menu');
    if (!wrap) {
      const mosquito = nav.querySelector('a[href="/mosquito-control.html"]');
      const tick = nav.querySelector('a[href="/tick-control.html"]');
      const fly = nav.querySelector('a[href="/fly-control.html"]');
      if (!mosquito || !tick || !fly) return;
      wrap = document.createElement('div');
      wrap.className = 'services-menu';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'services-menu__toggle';
      button.textContent = 'Services';
      const panel = document.createElement('div');
      panel.className = 'services-menu__panel';
      [mosquito, tick, fly].forEach(link => panel.appendChild(link));
      wrap.append(button, panel);
      nav.insertBefore(wrap, nav.querySelector('a[href="/commercial.html"]'));
    }

    const button = wrap.querySelector('.services-menu__toggle');
    const panel = wrap.querySelector('.services-menu__panel');
    if (!button || !panel) return;

    if (!panel.id) panel.id = 'services-menu-panel';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-controls', panel.id);
    button.setAttribute('aria-expanded', 'false');
    if (panel.querySelector('a[aria-current="page"], a.active')) button.classList.add('active');

    const closeMenu = () => {
      wrap.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      wrap.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    };

    button.addEventListener('click', event => {
      event.stopPropagation();
      wrap.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    wrap.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
        button.focus();
      }
    });
    wrap.addEventListener('focusout', event => {
      if (!wrap.contains(event.relatedTarget)) closeMenu();
    });
    panel.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', event => {
      if (!wrap.contains(event.target)) closeMenu();
    });
  });

  // The main runtime emits privacy-conscious interaction events without sending
  // customer-entered form values. Forward those event names to Plausible so
  // conversions can be measured alongside pageviews. The Plausible bootstrap
  // function queues calls safely while its async script is loading.
  document.addEventListener('mosquitoNinja:site-event', event => {
    const detail = event && event.detail && typeof event.detail === 'object' ? event.detail : {};
    const eventName = clean(detail.event);
    if (!eventName || typeof window.plausible !== 'function') return;

    const props = {};
    if (detail.page_path) props.page_path = clean(detail.page_path).slice(0, 180);
    if (detail.service) props.service = clean(detail.service).slice(0, 60);

    window.plausible(eventName, Object.keys(props).length ? { props } : undefined);
  });

  const form = document.querySelector('#quote-form');
  if (form) {
    const status = document.querySelector('#quote-status');
    const fields = Object.fromEntries(['name', 'phone', 'email', 'location', 'propertyType', 'message'].map(name => [name, form.elements.namedItem(name)]));
    const contactFields = [...form.querySelectorAll('input[name="contactPreference"]')];
    const contactPicker = form.querySelector('.contact-picker');
    const serviceFields = [...form.querySelectorAll('input[name="service"]')];
    const servicePicker = form.querySelector('.service-picker');
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get('service');
    const requestedPropertyType = params.get('propertyType');
    if (Object.prototype.hasOwnProperty.call(serviceNames, requestedService)) {
      const requested = serviceFields.find(field => field.value === requestedService);
      if (requested) requested.checked = true;
    } else if (requestedService === 'both') {
      serviceFields.filter(field => ['mosquito', 'tick'].includes(field.value)).forEach(field => { field.checked = true; });
    } else if (requestedService === 'commercial') {
      fields.propertyType.value = 'commercial';
    }
    if (Object.prototype.hasOwnProperty.call(propertyTypeNames, requestedPropertyType)) {
      fields.propertyType.value = requestedPropertyType;
    }
    const county = clean(params.get('county'));
    const zip = clean(params.get('zip'));
    if (!fields.location.value && /^\d{5}$/.test(zip)) fields.location.value = zip;
    if (county && !fields.location.value) status.textContent = `For your property in ${county.slice(0, 70)}, add the town or ZIP below.`;
    ['name', 'phone', 'email', 'location'].forEach(name => {
      fields[name].addEventListener('input', () => {
        fields[name].setCustomValidity('');
        fields[name].removeAttribute('aria-invalid');
        status.textContent = '';
      });
    });
    contactFields.forEach(field => field.addEventListener('change', () => {
      contactPicker?.removeAttribute('aria-invalid');
      fields.phone.setCustomValidity('');
      fields.email.setCustomValidity('');
      fields.phone.removeAttribute('aria-invalid');
      fields.email.removeAttribute('aria-invalid');
      status.textContent = '';
    }));
    serviceFields.forEach(field => field.addEventListener('change', () => {
      servicePicker?.removeAttribute('aria-invalid');
      status.textContent = '';
    }));
    function preparedRequest() {
      const phoneDigits = fields.phone.value.replace(/\D/g, '');
      const validPhone = phoneDigits.length === 10 || (phoneDigits.length === 11 && phoneDigits.startsWith('1'));
      fields.email.setCustomValidity('');
      const validEmail = clean(fields.email.value) && !fields.email.validity.typeMismatch;
      const selectedContact = contactFields.find(field => field.checked)?.value || '';

      fields.name.setCustomValidity(clean(fields.name.value) ? '' : 'Please enter your name.');
      fields.location.setCustomValidity(clean(fields.location.value) ? '' : 'Please enter the property town or ZIP code.');

      if (!selectedContact) {
        contactPicker?.setAttribute('aria-invalid', 'true');
        status.textContent = 'Choose how you would prefer Mosquito Ninja to reply.';
        contactFields[0]?.focus();
        return null;
      }
      contactPicker?.removeAttribute('aria-invalid');

      let phoneMessage = '';
      if (clean(fields.phone.value) && !validPhone) {
        phoneMessage = 'Please enter a valid 10-digit U.S. phone number.';
      } else if ((selectedContact === 'text' || selectedContact === 'call') && !validPhone) {
        phoneMessage = 'A valid phone number is required for your preferred contact method.';
      } else if (selectedContact === 'no-preference' && !validPhone && !validEmail) {
        phoneMessage = 'Enter a valid phone number or email address so we can respond.';
      }
      fields.phone.setCustomValidity(phoneMessage);

      let emailMessage = '';
      if (clean(fields.email.value) && !validEmail) {
        emailMessage = 'Please enter a valid email address.';
      } else if (selectedContact === 'email' && !validEmail) {
        emailMessage = 'A valid email address is required when Email is your preferred contact method.';
      }
      fields.email.setCustomValidity(emailMessage);

      for (const name of ['name', 'phone', 'email', 'location']) {
        fields[name].setAttribute('aria-invalid', String(!fields[name].validity.valid));
      }
      if (!form.reportValidity()) {
        status.textContent = 'Please check the highlighted details so we can reply the way you prefer.';
        return null;
      }

      const selectedServices = serviceFields.filter(field => field.checked).map(field => field.value);
      if (!selectedServices.length) {
        servicePicker?.setAttribute('aria-invalid', 'true');
        status.textContent = 'Select at least one service, or choose “Not sure / discuss my property.”';
        serviceFields[0]?.focus();
        return null;
      }
      if (selectedServices.includes('unsure') && selectedServices.length > 1) {
        servicePicker?.setAttribute('aria-invalid', 'true');
        status.textContent = 'Choose specific services, or choose “Not sure / discuss my property” by itself.';
        return null;
      }

      const values = Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, field.value]));
      values.contactPreference = selectedContact;
      values.services = selectedServices;
      return buildQuote(values);
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const message = preparedRequest();
      if (!message) return;
      status.textContent = 'Your request is prepared. Tap Send in your messaging app to finish. If it does not open, use Copy request below.';
      window.location.href = `sms:+16093136317?&body=${encodeURIComponent(message)}`;
    });
    document.querySelector('#copy-request').addEventListener('click', async () => {
      const message = preparedRequest();
      if (!message) return;
      try {
        if (!navigator.clipboard) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(message);
        status.textContent = 'Request copied. Paste it into a text to 609-313-6317 when you are ready. Nothing has been sent.';
      } catch {
        const panel = document.querySelector('#quote-copy-panel');
        const text = document.querySelector('#quote-copy-text');
        panel.hidden = false;
        text.value = message;
        text.focus();
        text.select();
        status.textContent = 'Your request is selected below. Copy it and paste it into a text to 609-313-6317. Nothing has been sent.';
      }
    });
  }

  const coverageForm = document.querySelector('#coverage-form');
  if (coverageForm) {
    const status = document.querySelector('#coverage-status');
    const quote = document.querySelector('#coverage-quote');
    const button = coverageForm.querySelector('button[type="submit"]');
    let generation = 0;
    let activeController;
    function clearResult() {
      generation += 1;
      if (activeController) activeController.abort();
      button.disabled = false;
      button.textContent = 'CHECK COVERAGE';
      coverageForm.removeAttribute('aria-busy');
      status.textContent = '';
      status.removeAttribute('data-coverage');
      quote.hidden = true;
    }
    coverageForm.addEventListener('input', clearResult);
    coverageForm.addEventListener('change', clearResult);
    coverageForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!coverageForm.reportValidity() || button.disabled) return;
      const requestGeneration = ++generation;
      const county = coverageForm.elements.namedItem('county').value;
      const zip = clean(coverageForm.elements.namedItem('zip').value);
      const countyLabel = coverageForm.elements.namedItem('county').selectedOptions[0].textContent;
      button.disabled = true;
      button.textContent = 'CHECKING…';
      coverageForm.setAttribute('aria-busy', 'true');
      quote.hidden = true;
      const query = new URLSearchParams();
      if (county !== 'other') query.set('county', countyLabel + ' County');
      if (zip) query.set('zip', zip);
      quote.href = '/?' + query.toString() + '#quote';
      status.removeAttribute('data-coverage');
      status.textContent = 'Checking the current service-area rules…';
      const controller = new AbortController();
      activeController = controller;
      try {
        const config = await loadCoverageConfig(controller.signal);
        const result = evaluateCoverage(config, county, zip);
        if (requestGeneration !== generation) return;
        status.dataset.coverage = result;
        status.textContent = {
          covered: 'Within our normal service area. Contact Mosquito Ninja to confirm this property and an available appointment.',
          confirm: 'Route confirmation needed. Share the property town or ZIP so Mosquito Ninja can check current availability.',
          outside: 'Outside our normal service area. You can still ask Mosquito Ninja to review this property before planning a visit.'
        }[result];
        quote.hidden = false;
      } catch {
        if (requestGeneration !== generation) return;
        status.textContent = 'We couldn’t load the coverage rules. Please try again, or use Discuss this property to confirm your route. You can also call/text 609-313-6317.';
        quote.hidden = false;
      } finally {
        if (requestGeneration === generation) {
          button.disabled = false;
          button.textContent = 'CHECK COVERAGE';
          coverageForm.removeAttribute('aria-busy');
          activeController = null;
        }
      }
    });
  }

  const checks = [...document.querySelectorAll('.prep-checklist input[type="checkbox"]')];
  const progress = document.querySelector('#prep-progress');
  if (checks.length && progress) {
    checks.forEach(check => check.addEventListener('change', () => {
      progress.textContent = `${checks.filter(item => item.checked).length} of ${checks.length} checked`;
    }));
  }
  const print = document.querySelector('#print-guide');
  if (print) print.addEventListener('click', () => window.print());
}());
