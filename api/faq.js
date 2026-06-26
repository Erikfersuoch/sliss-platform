import { Redis } from '@upstash/redis';

// FAQ personalizzate del professionista (M3 v2 — "Le tue FAQ").
// L'app del professionista SALVA qui le sue FAQ (POST); la pagina pubblica
// (prenota.html / domani richieste.html) le LEGGE all'apertura (GET).
// Chiave per-owner: faq:<owner>. Se non c'è nulla, la pagina usa i suoi default.
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const MAX_ITEMS = 30;
const clip = (s, n) => String(s == null ? '' : s).trim().slice(0, n);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // --- LEGGI: la pagina pubblica chiede le FAQ dell'owner ---
  if (req.method === 'GET') {
    const { owner } = req.query;
    if (!owner) return res.status(400).json({ error: 'missing owner' });
    const stored = await kv.get(`faq:${owner}`);
    // null = mai personalizzate → la pagina usa i suoi default
    return res.status(200).json({ faq: stored?.faq || null });
  }

  // --- SALVA: l'app del professionista deposita le sue FAQ ---
  if (req.method === 'POST') {
    const { owner, faq } = req.body || {};
    if (!owner) return res.status(400).json({ error: 'missing owner' });
    if (!Array.isArray(faq)) return res.status(400).json({ error: 'faq must be an array' });

    // Normalizza: tieni solo q non vuote, taglia le lunghezze, max 30 voci.
    const clean = faq
      .filter(it => it && clip(it.q, 200))
      .slice(0, MAX_ITEMS)
      .map(it => ({ q: clip(it.q, 200), a: clip(it.a, 1200), on: it.on !== false }));

    await kv.set(`faq:${owner}`, { faq: clean, updated: new Date().toISOString() });
    return res.status(200).json({ ok: true, count: clean.length });
  }

  return res.status(405).end();
}
