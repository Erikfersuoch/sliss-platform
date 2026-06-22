import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

// Tracking minimo d'uso per il gate M1: registra i GIORNI in cui il tester apre l'app
// + uno snapshot di conteggi aggregati. Nessun dato personale (solo numeri).
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tester, stats } = req.body || {};
    if (!tester) return res.status(400).json({ error: 'missing tester' });
    const date = new Date().toISOString().slice(0, 10);

    // Guard anti-cancellazione (stesso principio di api/backup.js): uno snapshot
    // VUOTO non sovrascrive mai uno PIENO, e non aggiunge un giorno d'uso falso.
    // Scenario reale (20/06): aperto per sbaglio il link di un tester da un altro
    // device → contesto vuoto che azzerava giorni + conteggi (e falsava il report
    // del gate). Il guard era solo in backup.js; qui mancava. Il dato si ripara
    // da solo alla prossima apertura del tester vero (dati pieni → passano).
    const isEmpty = (s) => !((s?.clients) || (s?.followUpsSent) || (s?.followUpsPending));
    if (isEmpty(stats)) {
      const existing = await kv.get(`usage:${tester}`);
      if (existing && !isEmpty(existing)) {
        console.log(`[track] SKIP overwrite-with-empty per ${tester} (snapshot pieno protetto)`);
        return res.status(200).json({ ok: true, skipped: 'empty-would-overwrite-nonempty' });
      }
    }

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
