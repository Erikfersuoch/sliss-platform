import webpush from 'web-push';
import { Redis } from '@upstash/redis';

// Cassetta postale delle Richieste (M3). Stesso backend dell'onboarding:
// il cliente "lascia" la richiesta qui; l'app del professionista la raccoglie
// (api/richiesta-list). A differenza dell'onboarding (uno slot pre-creato),
// le richieste arrivano da un link generale → si accumulano in una LISTA per owner.
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

  const { owner, nome, cognome, desc, product, kind } = req.body || {};
  if (!owner || !nome?.trim() || !cognome?.trim()) {
    return res.status(400).json({ error: 'missing fields' });
  }

  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const record = {
    id,
    nome: nome.trim(),
    cognome: cognome.trim(),
    desc: (desc || '').trim(),
    product: (product || '').trim(),
    kind: kind || 'richiesta',        // sumisura | perso | diretto | ebay
    status: 'nuova',
    created: new Date().toISOString(),
  };

  // Lascia la lettera nella cassetta del professionista (ultime 200, scadenza 90gg)
  await kv.lpush(`richieste:${owner}`, record);
  await kv.ltrim(`richieste:${owner}`, 0, 199);
  await kv.expire(`richieste:${owner}`, 60 * 60 * 24 * 90);

  // Notifica immediata al professionista (se iscritto alle push) — non bloccante per il cliente
  try {
    const sub = await kv.get(`sub:${owner}`);
    if (sub) {
      const what = record.product || record.desc || 'una richiesta';
      await webpush.sendNotification(sub, JSON.stringify({
        title: 'Sliss — nuova richiesta 🏁',
        body: `${record.nome} ${record.cognome}: ${what}`.slice(0, 120),
        tag: 'sliss-richiesta',
        url: '/?goto=richieste',
      }));
    }
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) await kv.del(`sub:${owner}`);
    console.error('[richiesta-submit] push failed:', err.statusCode);
  }

  return res.status(200).json({ ok: true, id });
}
