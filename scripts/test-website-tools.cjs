const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildQuote, evaluateCoverage } = require('../website-tools.js');
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
