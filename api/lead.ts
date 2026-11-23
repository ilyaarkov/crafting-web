import type { IncomingMessage, ServerResponse } from 'http';
import { CONSENT_PATH, CONSENT_VERSION } from '../src/data/consentVersion.js';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
  cookies: { [key: string]: string };
}

interface VercelResponse extends ServerResponse {
  send: (body: any) => VercelResponse;
  json: (jsonBody: any) => VercelResponse;
  status: (statusCode: number) => VercelResponse;
}

interface TurnstileVerificationResponse {
  success: boolean;
}

const ALLOWED_ORIGINS = ['https://ilyaarkov.com', 'https://www.ilyaarkov.com'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).send('OK');
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    // Validate consent before contacting either external service. Do not accept
    // truthy strings, missing consent or a stale document version.
    if (data.consent !== true || data.consentVersion !== CONSENT_VERSION) {
      return res.status(400).json({ error: 'Current personal data consent required' });
    }
    if (data.lang !== 'ru' && data.lang !== 'en') {
      return res.status(400).json({ error: 'Invalid consent language' });
    }
    const limits = { name: 120, contact: 254, siteType: 200, projectUrl: 2048, message: 5000 };
    for (const [field, maxLength] of Object.entries(limits)) {
      const value = data[field];
      const required = ['name', 'contact', 'siteType'].includes(field);
      if ((required && (typeof value !== 'string' || !value.trim())) ||
          (value !== undefined && (typeof value !== 'string' || value.length > maxLength))) {
        return res.status(400).json({ error: 'Invalid form fields' });
      }
    }
    const receivedAt = new Date().toISOString();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return res.status(503).json({ error: 'Lead delivery is not configured' });
    }
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const turnstileToken = typeof data.turnstileToken === 'string' ? data.turnstileToken : '';

    if (!turnstileSecret) {
      return res.status(503).json({ error: 'Lead verification is not configured' });
    }
    if (!turnstileToken) {
      return res.status(400).json({ error: 'Verification required' });
    }

    let verificationResponse: Response;
    try {
      verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      return res.status(503).json({ error: 'Verification service unavailable' });
    }

    if (!verificationResponse.ok) {
      return res.status(503).json({ error: 'Verification service unavailable' });
    }

    const verification = await verificationResponse.json() as TurnstileVerificationResponse;
    if (!verification.success) {
      return res.status(400).json({ error: 'Verification failed' });
    }

    const leadId = 'lead_' + crypto.randomUUID();
    // Server-generated receipt, bound to this request. Never use a client clock
    // as evidence, and never interpret user input as Telegram HTML.
    const message = `Новая заявка с сайта\n` +
      `Согласие на обработку ПД: да (отдельный чекбокс)\n` +
      `Редакция согласия: ${CONSENT_VERSION}\n` +
      `Документ: https://ilyaarkov.com${CONSENT_PATH}\n` +
      `Язык согласия: ${data.lang}\n` +
      `Получено сервером (UTC): ${receivedAt}\n\n` +
      `Имя: ${data.name}\n` +
      `Контакт: ${data.contact}\n` +
      `Формат сайта: ${data.siteType}\n` +
      `Ссылка / Проект: ${data.projectUrl || 'Нет'}\n` +
      `Описание:\n${data.message || 'Без описания'}`;

    // The form allows more text than Telegram's 4096-character message limit.
    // Keep all content and correlate chunks without collecting extra personal data.
    const characters = Array.from(message);
    const chunkSize = 1800; // <=3600 UTF-16 units even for non-BMP characters
    const total = Math.ceil(characters.length / chunkSize);
    const deliverySignal = AbortSignal.timeout(12000);
    try {
      for (let offset = 0; offset < characters.length; offset += chunkSize) {
        const text = `${leadId} (${offset / chunkSize + 1}/${total})\n\n` +
          characters.slice(offset, offset + chunkSize).join('');
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
          signal: deliverySignal,
        });
        if (!tgRes.ok || !(await tgRes.json()).ok) {
          return res.status(502).json({ error: 'Lead delivery failed' });
        }
      }
    } catch {
      return res.status(502).json({ error: 'Lead delivery failed' });
    }

    return res.status(200).json({ success: true, sentToTelegram: true, leadId });
  } catch (err: unknown) {
    return res.status(err instanceof SyntaxError ? 400 : 500).json({
      error: err instanceof SyntaxError ? 'Invalid request body' : 'Internal Server Error',
    });
  }
}