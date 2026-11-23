import assert from 'node:assert/strict';
import { test } from 'node:test';
import handler from '../api/lead.ts';
import { CONSENT_VERSION } from '../src/data/personalDataConsent.ts';

const valid = {
  name: 'Test <b>name</b>', contact: 'test@example.com', siteType: 'Landing page',
  projectUrl: '', message: 'Test request', lang: 'ru', turnstileToken: 'test-token',
  consent: true, consentVersion: CONSENT_VERSION,
};

async function request(t, body, options = {}) {
  const original = { ...process.env };
  Object.assign(process.env, {
    TELEGRAM_BOT_TOKEN: 'test-token', TELEGRAM_CHAT_ID: '123', TURNSTILE_SECRET_KEY: 'test-secret',
    ...options.env,
  });
  t.after(() => { process.env = original; });
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls.push({ url, init });
    if (url.includes('siteverify')) return Response.json({ success: options.verified ?? true });
    if (options.networkError) throw new Error('private-token must not leak');
    return Response.json({ ok: options.delivered ?? true, description: 'private diagnostic' });
  });
  const response = {
    statusCode: 200, payload: null,
    setHeader() {}, status(code) { this.statusCode = code; return this; },
    json(data) { this.payload = data; return this; }, send(data) { this.payload = data; return this; },
  };
  await handler({ method: 'POST', headers: {}, body }, response);
  return { ...response, calls };
}

for (const consent of [undefined, false, 'true', 1]) {
  test(`rejects non-explicit consent: ${consent}`, async (t) => {
    const r = await request(t, { ...valid, consent });
    assert.equal(r.statusCode, 400);
    assert.equal(r.calls.length, 0);
  });
}

test('rejects an outdated consent before any external request', async (t) => {
  const r = await request(t, { ...valid, consentVersion: 'old' });
  assert.equal(r.statusCode, 400);
  assert.equal(r.calls.length, 0);
});

test('rejects unknown language', async (t) => {
  const r = await request(t, { ...valid, lang: 'xx' });
  assert.equal(r.statusCode, 400);
  assert.equal(r.calls.length, 0);
});

test('rejects missing required fields', async (t) => {
  const r = await request(t, { ...valid, name: ' ' });
  assert.equal(r.statusCode, 400);
  assert.equal(r.calls.length, 0);
});

test('rejects malformed JSON', async (t) => {
  const r = await request(t, '{');
  assert.equal(r.statusCode, 400);
  assert.equal(r.calls.length, 0);
});

test('rejects a JSON null body', async (t) => {
  const r = await request(t, 'null');
  assert.equal(r.statusCode, 400);
  assert.equal(r.calls.length, 0);
});

for (const lang of ['ru', 'en']) {
  test(`records ${lang} consent version and server time with the lead`, async (t) => {
    const before = Date.now();
    const r = await request(t, { ...valid, lang, consentTimestamp: 'fake client time' });
    assert.equal(r.statusCode, 200);
    assert.equal(r.payload.success, true);
    const sent = JSON.parse(r.calls[1].init.body);
    assert.equal(sent.parse_mode, undefined);
    assert.ok(sent.text.includes(valid.name));
    assert.ok(sent.text.includes(`Редакция согласия: ${CONSENT_VERSION}`));
    assert.ok(sent.text.includes(`Язык согласия: ${lang}`));
    assert.ok(sent.text.includes('https://ilyaarkov.com/consent'));
    assert.ok(!sent.text.includes('fake client time'));
    const timestamp = sent.text.match(/Получено сервером \(UTC\): (.+)/)[1];
    assert.ok(Date.parse(timestamp) >= before);
    assert.ok(Date.parse(timestamp) <= Date.now());
    assert.ok(sent.text.includes(r.payload.leadId));
  });
}

test('does not deliver a lead if bot verification fails', async (t) => {
  const r = await request(t, valid, { verified: false });
  assert.equal(r.statusCode, 400);
  assert.equal(r.calls.length, 1);
});

test('does not simulate success when Telegram is not configured', async (t) => {
  const r = await request(t, valid, { env: { TELEGRAM_BOT_TOKEN: '' } });
  assert.equal(r.statusCode, 503);
  assert.equal(r.calls.length, 0);
});

for (const options of [{ delivered: false }, { networkError: true }]) {
  test(`reports failed delivery without leaking diagnostics: ${JSON.stringify(options)}`, async (t) => {
    const r = await request(t, valid, options);
    assert.equal(r.statusCode, 502);
    assert.deepEqual(r.payload, { error: 'Lead delivery failed' });
  });
}

test('preserves long requests in bounded, correlated Telegram messages', async (t) => {
  const message = '😀'.repeat(2400);
  const r = await request(t, { ...valid, message });
  assert.equal(r.statusCode, 200);
  const chunks = r.calls.slice(1).map(call => JSON.parse(call.init.body).text);
  assert.ok(chunks.length > 1);
  for (const text of chunks) {
    assert.ok(text.length < 4096);
    assert.ok(text.includes(r.payload.leadId));
  }
  const joined = chunks.map(text => text.slice(text.indexOf('\n\n') + 2)).join('');
  assert.ok(joined.endsWith(message));
});
