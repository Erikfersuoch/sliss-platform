import { Redis } from '@upstash/redis';
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subscription, tester } = req.body;
  if (!subscription || !tester) {
    return res.status(400).json({ error: 'missing subscription or tester' });
  }

  await kv.set(`sub:${tester}`, subscription);
  console.log(`[subscribe] saved sub for ${tester}`);

  return res.status(200).json({ ok: true });
}
