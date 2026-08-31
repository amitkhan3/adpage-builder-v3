import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
export async function getSubscription(userId){ return userId ? await redis.get(`adsub:${userId}`) : null; }
export async function saveSubscription(userId,data){ const item={userId,...data,updatedAt:new Date().toISOString()}; await redis.set(`adsub:${userId}`,item); return item; }
export async function isActiveSubscription(userId){ const s=await getSubscription(userId); return !!s && s.status==='active' && (!s.expiresAt || new Date(s.expiresAt)>new Date()); }
export async function listPendingSubscriptions(){ const keys=await redis.keys('adsub:*'); if(!keys.length)return []; const items=await redis.mget(...keys); return items.filter(Boolean).filter(x=>x.status==='pending'); }
