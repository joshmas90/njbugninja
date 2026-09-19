const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildQuote, copyInstructions, evaluateCoverage, loadCoverageConfig } = require('../website-tools.js');
const liveRules = require('../service-area-config.json');

test('current configured counties retain their actual coverage', () => {
  assert.equal(evaluateCoverage(liveRules, 'Camden', '08004'), 'covered');
  assert.equal(evaluateCoverage(liveRules, 'Burlington County', ''), 'covered');
  assert.equal(evaluateCoverage(liveRules, 'Gloucester', ''), 'covered');
  assert.equal(evaluateCoverage(liveRules, 'Atlantic', ''), 'confirm');
  assert.equal(evaluateCoverage(liveRules, 'Cumberland', ''), 'confirm');
  assert.equal(evaluateCoverage(liveRules, 'Salem', ''), 'confirm');
  assert.equal(evaluateCoverage(liveRules, 'Cape May', ''), 'outside');
  assert.equal(evaluateCoverage(liveRules, 'Ocean', ''), 'outside');
  assert.equal(evaluateCoverage(liveRules, 'Mercer', ''), 'outside');
});
test('ZIP exceptions override county status, with exclusions taking priority', () => {
  const config = { state: 'NJ', defaultStatus: 'outside', counties: {
    camden: { status: 'confirm', includedZIPs: ['08004', '08009'], excludedZIPs: ['08009'] }
  } };
  assert.equal(evaluateCoverage(config, 'Camden', ''), 'confirm');
  assert.equal(evaluateCoverage(config, 'Camden', '08004'), 'covered');
  assert.equal(evaluateCoverage(config, 'Camden', '08009'), 'outside');
});
test('malformed rules never produce a coverage promise', () => {
  for (const config of [null, {}, { state: 'PA', defaultStatus: 'covered', counties: {} },
    { state: 'NJ', defaultStatus: 'covered', counties: { camden: { status: 'yes' } } },
    { state: 'NJ', defaultStatus: 'outside', counties: { camden: { status: 'covered', excludedZIPs: '08004' } } }
  ]) assert.throws(() => evaluateCoverage(config, 'camden', '08004'));
});
test('quote text preserves customer punctuation, Unicode and multiline property notes', () => {
  const message = buildQuote({ name: '  José & Lee  ', phone: '(609) 555-0100', location: 'Atco 08004', services: ['fly'], propertyType: 'commercial', message: 'Patio & pool 🦟\nGate #2; event at 6?' });
  assert.match(message, /Name: José & Lee\n/);
  assert.match(message, /Services: Outdoor fly control/);
  assert.match(message, /Property type: Commercial \/ business/);
  assert.match(message, /Property details: Patio & pool 🦟\nGate #2; event at 6\?/);
  assert.equal(decodeURIComponent(encodeURIComponent(message)), message);
});
test('multi-service and property type choices have readable labels', () => {
  const combined = buildQuote({ services: ['mosquito', 'tick', 'fly'], propertyType: 'government' });
  assert.match(combined, /Services: Mosquito control, Tick control, Outdoor fly control/);
  assert.match(combined, /Property type: Government \/ municipal/);
  assert.match(buildQuote({ services: ['unsure'], propertyType: 'residential' }), /Services: Not sure \/ discuss my property/);
  assert.match(buildQuote({ services: [], propertyType: 'invalid' }), /Services: Not specified/);
  assert.match(buildQuote({ services: [], propertyType: 'invalid' }), /Property type: Residential/);
});

test('copy instructions respect every reply preference and state that copying sends nothing', () => {
  const expectations = {
    email: /email to service@njbugninja\.com/,
    text: /text to 609-313-6317/,
    call: /call 609-313-6317/,
    'no-preference': /text to 609-313-6317 or an email/
  };

  for (const [preference, expectedDestination] of Object.entries(expectations)) {
    const copied = copyInstructions(preference);
    const selected = copyInstructions(preference, true);
    assert.match(copied, expectedDestination);
    assert.match(selected, expectedDestination);
    assert.match(copied, /Copying does not send the request\./);
    assert.match(selected, /Copying does not send the request\./);
  }
});

test('FAQ and service-area reference copy cover outdoor fly service', () => {
  const root = path.resolve(__dirname, '..');
  const faq = fs.readFileSync(path.join(root, 'faq.html'), 'utf8');
  const serviceArea = fs.readFileSync(path.join(root, 'service-area.html'), 'utf8');

  assert.match(faq, /How does outdoor fly control work\?/);
  assert.match(faq, /source, sanitation, resting and activity areas/);
  assert.match(faq, /zero mosquitoes, ticks or outdoor flies/);
  assert.match(serviceArea, /Outdoor fly control<\/a> starts with source, sanitation/);
  assert.match(serviceArea, /mosquito, tick and targeted outdoor fly concerns/);
});


test('service navigation and quote submission stay multi-service end to end', () => {
  const root = path.resolve(__dirname, '..');
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const runtime = fs.readFileSync(path.join(root, 'mosquito-ninja-v12.js'), 'utf8');
  const backend = fs.readFileSync(path.join(root, 'quote-submit.php'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'mosquito-ninja-v33-elite.css'), 'utf8');

  assert.match(index, /class="services-menu"/);
  assert.equal((index.match(/name="service"/g) || []).length, 4);
  assert.match(index, /SERVICES YOU’RE INTERESTED IN/);
  assert.match(runtime, /payload\.services = selectedServices/);
  assert.match(backend, /\$serviceInput = \$data\['services'\]/);
  assert.match(backend, /Services: \{\$service\}/);
  assert.match(css, /content:"  ▾"/);
  assert.doesNotMatch(css, /String\.fromCharCode/);
});

test('a temporary rules download failure retries and returns Camden coverage', async () => {
  let requests = 0;
  const config = await loadCoverageConfig(undefined, async () => {
    if (++requests === 1) throw new TypeError('Failed to fetch');
    return { ok: true, json: async () => liveRules };
  });
  assert.equal(requests, 2);
  assert.equal(evaluateCoverage(config, 'Camden', '08004'), 'covered');
});

test('temporary HTTP and invalid JSON responses can recover on the retry', async () => {
  for (const firstResponse of [
    { ok: false },
    { ok: true, json: async () => { throw new SyntaxError('Unexpected HTML'); } }
  ]) {
    let requests = 0;
    const config = await loadCoverageConfig(undefined, async () => ++requests === 1
      ? firstResponse : { ok: true, json: async () => liveRules });
    assert.equal(requests, 2);
    assert.equal(evaluateCoverage(config, 'Camden', '08004'), 'covered');
  }
});

test('persistent download failures stop after two attempts without inventing coverage', async () => {
  let requests = 0;
  await assert.rejects(loadCoverageConfig(undefined, async () => {
    requests += 1;
    throw new TypeError('Offline');
  }), /Offline/);
  assert.equal(requests, 2);
});

test('a timed-out download gets a fresh signal for its retry', async () => {
  const signals = [];
  const config = await loadCoverageConfig(undefined, async (_url, options) => {
    signals.push(options.signal);
    if (signals.length === 1) return new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')), { once: true });
    });
    assert.equal(options.signal.aborted, false);
    return { ok: true, json: async () => liveRules };
  }, 5);
  assert.equal(signals.length, 2);
  assert.notEqual(signals[0], signals[1]);
  assert.equal(signals[0].aborted, true);
  assert.equal(evaluateCoverage(config, 'Camden', '08004'), 'covered');
});

test('editing the form aborts the active download without starting a retry', async () => {
  const request = new AbortController();
  let requests = 0;
  const pending = loadCoverageConfig(request.signal, async (_url, options) => {
    requests += 1;
    return new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), { once: true });
    });
  });
  request.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(requests, 1);
});

test('an already-cancelled check makes no download', async () => {
  const request = new AbortController();
  request.abort();
  await assert.rejects(loadCoverageConfig(request.signal, async () => {
    assert.fail('A cancelled request must not fetch');
  }), { name: 'AbortError' });
});
