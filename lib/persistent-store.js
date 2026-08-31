import { Redis } from '@upstash/redis';

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;
if (!url || !token) throw new Error('Missing KV_REST_API_URL or KV_REST_API_TOKEN');

const redis = new Redis({ url, token });

export async function savePage(id, data) {
  const page = { ...data, id, updatedAt: new Date().toISOString() };
  await redis.set(`adpage:${id}`, page);
  await redis.zadd('adpage:index', { score: Date.now(), member: id });
  if (page.ownerId) await redis.sadd(`adpage:user:${page.ownerId}`, id);
  return page;
}
export async function getPage(id) { return redis.get(`adpage:${id}`); }
export async function listPages(ownerId) {
  if (!ownerId) return [];
  const ids = await redis.smembers(`adpage:user:${ownerId}`);
  if (!ids.length) return [];
  const pages = await redis.mget(...ids.map((id) => `adpage:${id}`));
  return pages.filter(Boolean).sort((a,b) => new Date(b.updatedAt||0)-new Date(a.updatedAt||0));
}
export async function saveOrder(order) {
  const id = order.id || Math.random().toString(36).slice(2, 10);
  const item = { ...order, id, createdAt: new Date().toISOString(), status: order.status || 'New' };
  await redis.set(`adorder:${id}`, item);
  await redis.zadd('adorder:index', { score: Date.now(), member: id });
  if (item.ownerId) await redis.sadd(`adorder:user:${item.ownerId}`, id);
  return item;
}
export async function listOrders(ownerId, limit = 100) {
  if (!ownerId) return [];
  const ids = await redis.smembers(`adorder:user:${ownerId}`);
  if (!ids.length) return [];
  const orders = await redis.mget(...ids.map((id) => `adorder:${id}`));
  return orders.filter(Boolean).sort((a,b) => new Date(b.createdAt||0)-new Date(a.createdAt||0)).slice(0,limit);
}
export async function deleteOrder(id) {
  if (!id) throw new Error('Order ID is required');
  const order = await redis.get(`adorder:${id}`);
  await redis.del(`adorder:${id}`);
  await redis.zrem('adorder:index', id);
  if (order?.ownerId) await redis.srem(`adorder:user:${order.ownerId}`, id);
  return { id };
}
