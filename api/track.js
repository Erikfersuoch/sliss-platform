import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

// Tracking minimo d'uso per il gate M1: registra i GIORNI in cui il tester apre l'app
// + uno snapshot di conteggi aggregati. Nessun dato personale (solo numeri).
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tester, stats } = req.body || {};
    if (!tester) return res.status(400).json({ error: 'missing tester' });
    const date = new Date().toISOString().slice(0, 10);
    await kv.sadd(`usedays:${tester}`, date);
    await kv.set(`usage:${tester}`, { lastSeen: date, ...(stats || {}) });
    return res.status(200).json({ ok: true, date });
  }

  if (req.method === 'GET') {
    const tester = req.query.tester;
    if (!tester) return res.status(400).json({ error: 'missing tester' });
    const days = (await kv.smembers(`usedays:${tester}`)) || [];
    const usage = await kv.get(`usage:${tester}`);
    return res.status(200).json({ ok: true, tester, activeDays: days.length, days: days.sort(), usage: usage || null });
  }

  return res.status(405).end();
}
