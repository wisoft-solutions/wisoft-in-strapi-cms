'use strict';
const svgCaptcha = require('svg-captcha');

function getStore() {
  // simple in-memory store; use Redis if you run multiple instances
  strapi.captchas = strapi.captchas || new Map();
  return strapi.captchas;
}

function putWithTTL(id, value, ms) {
  const store = getStore();
  store.set(id, value);
  setTimeout(() => store.delete(id), ms).unref?.();
}

module.exports = {
  async generate(ctx) {
    const { data, text } = svgCaptcha.create({
      size: 4,
      noise: 3,
      color: true,
      background: '#ffffff',
    });



    const id = Math.random().toString(36).slice(2, 12);
    const answer = text.toLowerCase();

    // store for 2 minutes
    putWithTTL(id, { answer, createdAt: Date.now(), attempts: 0 }, 2 * 60 * 1000);

    ctx.set('Cache-Control', 'no-store');
    ctx.body = { id, image: data, ttl: 120 };
  },

  async verify(ctx) {
    const { captchaId, captchaAnswer } = ctx.request.body || {};

    if (!captchaId || typeof captchaAnswer !== 'string' || !captchaAnswer.trim()) {
      ctx.status = 400;
      ctx.body = { ok: false, reason: 'missing_fields' };
      return;
    }

    const store = getStore();
    const rec = store.get(captchaId);

    if (!rec) {
      ctx.status = 200;
      ctx.body = { ok: false, reason: 'expired_or_not_found' };
      return;
    }

    // Optional: basic brute-force control for the test endpoint
    rec.attempts += 1;
    if (rec.attempts > 5) {
      store.delete(captchaId);
      ctx.status = 429;
      ctx.body = { ok: false, reason: 'too_many_attempts' };
      return;
    }

    const ok = rec.answer === captchaAnswer.trim().toLowerCase();

    // One-time use on success
    if (ok) store.delete(captchaId);

    ctx.status = 200;
    ctx.body = ok ? { ok: true } : { ok: false, reason: 'mismatch' };
  },
};
