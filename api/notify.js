import webpush from 'web-push';
import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

webpush.setVapidDetails(
  'mailto:erik.fersuoch@yahoo.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ─────────────────────────────────────────────────────────────────────────
// Vincolo Vercel Hobby: MAX 2 cron job per account. Avevamo 5 cron (2 per
// tester + report) → Vercel ne registrava solo 2 e ignorava gli altri in
// silenzio (per questo il report e le notifiche di Luca non partivano).
// Soluzione: 2 soli cron che fanno broadcast a TUTTI i tester, e il cron
// serale porta anche il report a Erik. Orari condivisi tra i tester (il
// per-utente fine richiederebbe più cron → arriverà con la schermata orari
// in Fase 3). Gli invii manuali singoli (?target=&type=) restano invariati.
// ─────────────────────────────────────────────────────────────────────────

// Tester attivi che ricevono i reminder ricorrenti. Hardcoded di proposito.
const TESTERS = ['moira', 'luca'];
const REPORT_RECIPIENT = 'ceoerik';
const GATE = new Date('2026-06-21T00:00:00Z');

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
    title: 'Sliss — ci sono novità 🎉',
    body: 'Tocca per vedere cosa è cambiato grazie al tuo feedback.',
    url: '/?goto=novita',
  },
  feedback: {
    title: 'Sliss — è ora dei feedback 🗣️',
    body: 'Com\'è andata? Due minuti per dirmi, mi serve la tua.',
    url: '/?goto=feedback',
  },
  conferma: {
    title: 'Sliss — è tutto a posto ✅',
    body: 'Notifiche attive e funzionanti. Sistema pronto!',
  },
};

// Invio a un singolo destinatario, con pulizia delle subscription scadute (404/410).
async function sendTo(target, payload) {
  const subscription = await kv.get(`sub:${target}`);
  if (!subscription) {
    console.log(`[notify] no subscription for ${target}`);
    return { target, skipped: 'no-subscription' };
  }
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log(`[notify] sent ${payload.tag} to ${target}`);
    return { target, sent: true };
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      await kv.del(`sub:${target}`);
      console.log(`[notify] subscription scaduta per ${target}, rimossa`);
      return { target, skipped: 'expired-removed' };
    }
    console.error(`[notify] errore invio a ${target}:`, err.statusCode);
    return { target, error: err.statusCode || 'unknown' };
  }
}

// Report giornaliero dell'andamento tester verso Erik (ex api/gate-report.js,
// ora innescato dal cron serale via ?report=1). Auto-silenzio oltre il gate.
async function sendGateReport() {
  const daysLeft = Math.ceil((GATE - new Date()) / 86400000);
  if (daysLeft < -1) return { skipped: 'oltre-il-gate' };
  const read = async (t) => {
    const days = (await kv.smembers(`usedays:${t}`)) || [];
    const usage = await kv.get(`usage:${t}`);
    return { days: days.length, sent: usage?.followUpsSent ?? 0 };
  };
  const m = await read('moira');
  const l = await read('luca');
  const head = daysLeft <= 0 ? '🗳️ Oggi è il gate M1!' : `${daysLeft}gg al gate M1`;
  return sendTo(REPORT_RECIPIENT, {
    title: 'Sliss — andamento tester',
    body: `${head} · Moira: ${m.days}gg attivi (${m.sent} inviati) · Luca: ${l.days}gg (${l.sent})`,
    tag: 'sliss-gate',
    url: '/',
  });
}

export default async function handler(req, res) {
  const auth = req.headers['authorization'];
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const { target, type, report } = req.query;
  if (!type || !MESSAGES[type]) {
    return res.status(400).json({ error: 'missing or invalid type' });
  }

  const { title, body, url } = MESSAGES[type];
  const payload = { title, body, tag: `sliss-${type}`, url: url || '/' };

  const results = [];
  if (target) {
    // Invio singolo: push manuali (aggiornamento/feedback/conferma) o test puntuali.
    results.push(await sendTo(target, payload));
  } else {
    // Broadcast dai cron: tutti i tester attivi ricevono il reminder.
    for (const t of TESTERS) results.push(await sendTo(t, payload));
  }

  // Il cron serale porta anche il report a Erik.
  let reportResult = null;
  if (report) reportResult = await sendGateReport();

  console.log(`[notify] ${type} · ${target || 'broadcast'} · report=${!!report}`);
  return res.status(200).json({ ok: true, type, results, report: reportResult });
}
