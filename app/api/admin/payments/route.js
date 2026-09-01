export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';
import { adminCookieName, verifyAdminToken } from '../../../../lib/admin-auth';
const redis=new Redis({url:process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN});
const isAdmin=()=>verifyAdminToken(cookies().get(adminCookieName())?.value);
const MONTHS={monthly:1,quarterly:3,'half-yearly':6};
export async function GET(){if(!isAdmin())return NextResponse.json({error:'Admin login required.'},{status:403});const keys=await redis.keys('adsub:*');const payments=keys.length?await redis.mget(...keys):[];return NextResponse.json({payments:payments.filter(Boolean).sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0))});}
export async function PATCH(request){if(!isAdmin())return NextResponse.json({error:'Admin login required.'},{status:403});const b=await request.json();if(!b.userId||!['active','rejected'].includes(b.status))return NextResponse.json({error:'Invalid request.'},{status:400});const key=`adsub:${b.userId}`;const current=await redis.get(key);if(!current)return NextResponse.json({error:'Subscription not found.'},{status:404});let expiresAt=null;if(b.status==='active'){const months=MONTHS[current.plan]||1;const base=new Date();base.setMonth(base.getMonth()+months);expiresAt=base.toISOString();}const updated={...current,status:b.status,reviewedAt:new Date().toISOString(),reviewedBy:'admin-panel',expiresAt};await redis.set(key,updated);return NextResponse.json({subscription:updated});}
