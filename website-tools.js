/* Website-owned interactions. This file is not imported by the native app. */
(function () {
  'use strict';
  const serviceNames = {
    mosquito: 'Mosquito control',
    tick: 'Tick control',
    both: 'Mosquito & tick control',
    commercial: 'Commercial / government property'
  };
  const clean = value => String(value || '').trim();

  function buildQuote(values) {
    return `Hi Mosquito Ninja, I'd like a property quote.\n\n` +
      `Name: ${clean(values.name)}\nPhone: ${clean(values.phone)}\n` +
      `Town/ZIP: ${clean(values.location)}\n` +
      `Service: ${serviceNames[values.service] || serviceNames.mosquito}\n` +
      `Property: ${clean(values.message)}`;
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
    // Exclusions win if a ZIP accidentally appears in both lists, as in the app.
    if (zip && (rule.excludedZIPs || []).includes(zip)) return 'outside';
    if (zip && (rule.includedZIPs || []).includes(zip)) return 'covered';
    return rule.status;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { buildQuote, evaluateCoverage };
  if (typeof document === 'undefined') return;

  const form = document.querySelector('#quote-form');
  if (form) {
    const status = document.querySelector('#quote-status');
    const fields = Object.fromEntries(['name', 'phone', 'location', 'service', 'message'].map(name => [name, form.elements.namedItem(name)]));
    const params = new URLSearchParams(window.location.search);
    if (Object.prototype.hasOwnProperty.call(serviceNames, params.get('service'))) fields.service.value = params.get('service');
    const county = clean(params.get('county'));
    const zip = clean(params.get('zip'));
    if (!fields.location.value && /^\d{5}$/.test(zip)) fields.location.value = zip;
    if (county && !fields.location.value) status.textContent = `For your property in ${county.slice(0, 70)}, add the town or ZIP below.`;
    ['name', 'phone', 'location'].forEach(name => {
      fields[name].addEventListener('input', () => {
        fields[name].setCustomValidity('');
        fields[name].removeAttribute('aria-invalid');
        status.textContent = '';
      });
    });
    function preparedRequest() {
      fields.name.setCustomValidity(clean(fields.name.value) ? '' : 'Please enter your name.');
      fields.location.setCustomValidity(clean(fields.location.value) ? '' : 'Please enter the property town or ZIP code.');
      fields.phone.setCustomValidity(fields.phone.value.replace(/\D/g, '').length >= 10 ? '' : 'Please enter a complete phone number, including area code.');
      for (const name of ['name', 'phone', 'location']) fields[name].setAttribute('aria-invalid', String(!fields[name].validity.valid));
      if (!form.reportValidity()) {
        status.textContent = 'Please check the highlighted contact details.';
        return null;
      }
      return buildQuote(Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, field.value])));
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const message = preparedRequest();
      if (!message) return;
      // Browsers cannot observe SMS send/delivery results. Never show a sent confirmation.
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
      status.textContent = 'Checking the current service-area rules…';
      const controller = new AbortController();
      activeController = controller;
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch('/service-area-config.json', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Coverage unavailable');
        const result = evaluateCoverage(await response.json(), county, zip);
        if (requestGeneration !== generation) return;
        status.dataset.coverage = result;
        status.textContent = {
          covered: 'Within our normal service area. Contact Mosquito Ninja to confirm this property and an available appointment.',
          confirm: 'Route confirmation needed. Share the property town or ZIP so Mosquito Ninja can check current availability.',
          outside: 'Outside our normal service area. You can still ask Mosquito Ninja to review this property before planning a visit.'
        }[result];
        const query = new URLSearchParams();
        if (county !== 'other') query.set('county', countyLabel + ' County');
        if (zip) query.set('zip', zip);
        quote.href = '/?' + query.toString() + '#quote';
        quote.hidden = false;
      } catch {
        if (requestGeneration !== generation) return;
        status.textContent = 'The coverage check is unavailable right now. Please try again or call/text 609-313-6317 to confirm your route.';
        quote.href = '/#quote';
        quote.hidden = false;
      } finally {
        clearTimeout(timeout);
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
