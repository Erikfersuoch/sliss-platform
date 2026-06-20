import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

// Backup additivo: copia best-effort dei dati locali del tester, legata al suo codice.
// localStorage resta la fonte primaria; questo è solo una rete di sicurezza per ripristino manuale.
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tester, data } = req.body || {};
    if (!tester || !data) return res.status(400).json({ error: 'missing tester or data' });

    // Guard anti-cancellazione: una copia VUOTA non sostituisce mai una copia PIENA.
    // Scenario reale (20/06): aperto per sbaglio un contesto vuoto col codice di un
    // tester → senza questo guard il backup buono veniva sovrascritto con dati vuoti.
    // La rete di sicurezza deve proteggere i dati, non poterli cancellare.
    const isEmpty = (d) => !((d?.clients?.length) || (d?.followUps?.length) || (d?.orders?.length));
    if (isEmpty(data)) {
      const existing = await kv.get(`backup:${tester}`);
      if (existing && !isEmpty(existing.data)) {
        console.log(`[backup] SKIP overwrite-with-empty per ${tester} (copia piena protetta)`);
        return res.status(200).json({ ok: true, skipped: 'empty-would-overwrite-nonempty', savedAt: existing.savedAt });
      }
    }

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
