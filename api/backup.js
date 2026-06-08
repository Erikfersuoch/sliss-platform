import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

// Backup additivo: copia best-effort dei dati locali del tester, legata al suo codice.
// localStorage resta la fonte primaria; questo è solo una rete di sicurezza per ripristino manuale.
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tester, data } = req.body || {};
    if (!tester || !data) return res.status(400).json({ error: 'missing tester or data' });
    const savedAt = new Date().toISOString();
    await kv.set(`backup:${tester}`, { data, savedAt });
    console.log(`[backup] saved for ${tester} @ ${savedAt}`);
    return res.status(200).json({ ok: true, savedAt });
  }

  if (req.method === 'GET') {
    const tester = req.query.tester;
    if (!tester) return res.status(400).json({ error: 'missing tester' });
    const backup = await kv.get(`backup:${tester}`);
    return res.status(200).json({ ok: true, backup: backup || null });
  }

  return res.status(405).end();
}
