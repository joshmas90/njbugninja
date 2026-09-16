const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildQuote, evaluateCoverage, loadCoverageConfig } = require('../website-tools.js');
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
  const message = buildQuote({ name: '  José & Lee  ', phone: '(609) 555-0100', location: 'Atco 08004', service: 'commercial', message: 'Patio & pool 🦟\nGate #2; event at 6?' });
  assert.match(message, /Name: José & Lee\n/);
  assert.match(message, /Service: Commercial \/ government property/);
  assert.match(message, /Property: Patio & pool 🦟\nGate #2; event at 6\?/);
  assert.equal(decodeURIComponent(encodeURIComponent(message)), message);
});
test('both pests and default service have readable labels', () => {
  assert.match(buildQuote({ service: 'both' }), /Service: Mosquito & tick control/);
  assert.match(buildQuote({ service: 'invalid' }), /Service: Mosquito control/);
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
