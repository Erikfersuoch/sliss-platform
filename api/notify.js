import webpush from 'web-push';
import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

webpush.setVapidDetails(
  'mailto:erik.fersuoch@yahoo.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Orari UTC — Italy è CEST (UTC+2) in estate
// moira: inserimento 19:30 CEST = 17:30 UTC | followup 12:30 CEST = 10:30 UTC
// luca:  inserimento 20:30 CEST = 18:30 UTC | followup 12:00 CEST = 10:00 UTC
const SCHEDULE = {
  '17:30': { target: 'moira', type: 'inserimento' },
  '10:30': { target: 'moira', type: 'followup'    },
  '18:30': { target: 'luca',  type: 'inserimento' },
  '10:00': { target: 'luca',  type: 'followup'    },
};

const MESSAGES = {
  inserimento: {
    title: "Sliss — com'è andata oggi?",
    body: 'Aggiungi i clienti di oggi mentre è fresco.',
  },
  followup: {
    title: 'Sliss — follow-up in scadenza',
    body: 'Hai messaggi da inviare. 2 minuti bastano.',
  },
};

export default async function handler(req, res) {
  // Vercel inietta automaticamente il CRON_SECRET come header Authorization
  const auth = req.headers['authorization'];
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const now = new Date();
  const hhmm = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;

  const job = SCHEDULE[hhmm];
  if (!job) {
    return res.status(200).json({ ok: true, skipped: true, time: hhmm });
  }

  const subscription = await kv.get(`sub:${job.target}`);
  if (!subscription) {
    console.log(`[notify] no subscription for ${job.target}`);
    return res.status(200).json({ ok: true, skipped: true, reason: 'no subscription' });
  }

  const { title, body } = MESSAGES[job.type];
  await webpush.sendNotification(
    subscription,
    JSON.stringify({ title, body, tag: `sliss-${job.type}`, url: '/' })
  );

  console.log(`[notify] sent ${job.type} to ${job.target}`);
  return res.status(200).json({ ok: true, sent: job });
}
