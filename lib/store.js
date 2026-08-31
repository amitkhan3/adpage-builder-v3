import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

export async function savePage(id, data) {
  await redis.set(`adpage:${id}`, data);
}

export async function getPage(id) {
  return await redis.get(`adpage:${id}`);
}
