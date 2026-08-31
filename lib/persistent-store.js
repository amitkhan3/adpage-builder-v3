import { Redis } from '@upstash/redis';

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;
if (!url || !token) throw new Error('Missing KV_REST_API_URL or KV_REST_API_TOKEN');

const redis = new Redis({ url, token });

export async function savePage(id, data) {
  const page = { ...data, id, updatedAt: new Date().toISOString() };
  await redis.set(`adpage:${id}`, page);
  await redis.zadd('adpage:index', { score: Date.now(), member: id });
  return page;
}

export async function getPage(id) {
  return redis.get(`adpage:${id}`);
}

export async function listPages() {
  const ids = await redis.zrange('adpage:index', 0, 49, { rev: true });
  if (!ids.length) return [];
  const pages = await redis.mget(...ids.map((id) => `adpage:${id}`));
  return pages.filter(Boolean);
}
