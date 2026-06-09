import webpush from 'web-push';
import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

webpush.setVapidDetails(
  'mailto:erik.fersuoch@yahoo.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Report giornaliero dell'andamento tester verso il gate M1 (21/06).
// Legge il tracking d'uso e invia una push SOLO a Erik (ceoerik). Eseguito da un cron Vercel alle 21 CEST.
const GATE = new Date('2026-06-21T00:00:00Z');
const RECIPIENT = 'ceoerik';

export default async function handler(req, res) {
  const auth = req.headers['authorization'];
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const daysLeft = Math.ceil((GATE - new Date()) / 86400000);
  // Auto-silenzio: smette di notificare oltre un giorno dopo il gate (poi il cron va rimosso a mano)
  if (daysLeft < -1) return res.status(200).json({ ok: true, skipped: 'oltre il gate' });

  const read = async (t) => {
    const days = (await kv.smembers(`usedays:${t}`)) || [];
    const usage = await kv.get(`usage:${t}`);
    return { days: days.length, sent: usage?.followUpsSent ?? 0 };
  };
  const m = await read('moira');
  const l = await read('luca');

  const head = daysLeft <= 0 ? '\u{1F5F3}\u{FE0F} Oggi \u{e8} il gate M1!' : `${daysLeft}gg al gate M1`;
  const title = 'Sliss \u{2014} andamento tester';
  const body = `${head} \u{b7} Moira: ${m.days}gg attivi (${m.sent} inviati) \u{b7} Luca: ${l.days}gg (${l.sent})`;

  const sub = await kv.get(`sub:${RECIPIENT}`);
  let pushed = false;
  if (sub) {
    try {
      await webpush.sendNotification(sub, JSON.stringify({ title, body, tag: 'sliss-gate', url: '/' }));
      pushed = true;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) await kv.del(`sub:${RECIPIENT}`);
      else console.error('[gate-report] errore push:', e.statusCode);
    }
  }

  console.log(`[gate-report] ${daysLeft}gg · moira ${m.days}/${m.sent} · luca ${l.days}/${l.sent} · pushed=${pushed}`);
  return res.status(200).json({ ok: true, daysLeft, moira: m, luca: l, pushed });
}
