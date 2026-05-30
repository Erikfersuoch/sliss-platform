import webpush from 'web-push';
import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

webpush.setVapidDetails(
  'mailto:erik.fersuoch@yahoo.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Orari UTC — Italy CEST = UTC+2 (estate)
// moira: inserimento 19:30 CEST = 17:30 UTC | followup 12:30 CEST = 10:30 UTC
// luca:  inserimento 20:30 CEST = 18:30 UTC | followup 12:00 CEST = 10:00 UTC
// Hobby plan: ogni cron gira 1x/giorno con precisione ±59min

const MESSAGES = {
  inserimento: {
    title: "Sliss — com'è andata oggi?",
    body: 'Aggiungi i clienti di oggi mentre è fresco.',
  },
  followup: {
    title: 'Sliss — follow-up in scadenza',
    body: 'Hai messaggi da inviare. 2 minuti bastano.',
  },
  aggiornamento: {
    title: 'Sliss — aggiornamento disponibile',
    body: 'Nuove funzionalità pronte. Riapri l\'app per vederle.',
  },
};

export default async function handler(req, res) {
  const auth = req.headers['authorization'];
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const { target, type } = req.query;
  if (!target || !type || !MESSAGES[type]) {
    return res.status(400).json({ error: 'missing or invalid target/type' });
  }

  const subscription = await kv.get(`sub:${target}`);
  if (!subscription) {
    console.log(`[notify] no subscription for ${target}`);
    return res.status(200).json({ ok: true, skipped: true, reason: 'no subscription' });
  }

  const { title, body } = MESSAGES[type];
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body, tag: `sliss-${type}`, url: '/' })
    );
  } catch (err) {
    // 404/410 = subscription scaduta o revocata → rimuovila dal database
    if (err.statusCode === 404 || err.statusCode === 410) {
      await kv.del(`sub:${target}`);
      console.log(`[notify] subscription scaduta per ${target}, rimossa`);
      return res.status(200).json({ ok: true, skipped: true, reason: 'subscription expired, removed' });
    }
    console.error(`[notify] errore invio a ${target}:`, err.statusCode, err.body);
    return res.status(500).json({ ok: false, error: 'send failed', statusCode: err.statusCode });
  }

  console.log(`[notify] sent ${type} to ${target}`);
  return res.status(200).json({ ok: true, sent: { target, type } });
}
