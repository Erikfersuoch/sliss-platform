import webpush from 'web-push';
import { Redis } from '@upstash/redis';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

webpush.setVapidDetails(
  'mailto:erik.fersuoch@yahoo.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { slotId, name, phone, email, notes, owner } = req.body;
  if (!slotId || !name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'missing fields' });
  }

  await kv.set(`onboarding:${slotId}`, {
    slotId,
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || '',
    notes: notes?.trim() || '',
    submitted: new Date().toISOString(),
  }, { ex: 60 * 60 * 24 * 30 });

  if (owner) {
    const sub = await kv.get(`sub:${owner}`);
    if (sub) {
      try {
        await webpush.sendNotification(sub, JSON.stringify({
          title: 'Sliss — nuovo cliente 🎉',
          body: `${name.trim()} ha compilato la scheda. Lo trovi tra i clienti.`,
          tag: 'sliss-onboarding',
          url: '/',
        }));
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) await kv.del(`sub:${owner}`);
        console.error('[onboarding-submit] push failed:', err.statusCode);
      }
    }
  }

  return res.status(200).json({ ok: true });
}
