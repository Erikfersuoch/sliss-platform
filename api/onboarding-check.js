import { Redis } from '@upstash/redis';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { slot } = req.query;
  if (!slot) return res.status(400).json({ error: 'missing slot' });

  const data = await kv.get(`onboarding:${slot}`);
  if (!data) return res.status(200).json({ found: false });

  return res.status(200).json({ found: true, ...data });
}
