import { Redis } from '@upstash/redis';

// Apre la cassetta delle Richieste del professionista e restituisce le lettere.
// L'app di Luca (Slice 3) chiamerà questo endpoint e importerà le nuove (dedup per id).
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { owner } = req.query;
  if (!owner) return res.status(400).json({ error: 'missing owner' });

  const items = await kv.lrange(`richieste:${owner}`, 0, 199);
  return res.status(200).json({ items: items || [] });
}
