export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Redis } from '@upstash/redis';
const redis=new Redis({url:process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN});
const ADMIN_ID='user_3IkJ9yqORLSrkT6QDtrL7e53p5h';
const isAdmin=userId=>!!userId&&(userId===ADMIN_ID||userId===process.env.ADMIN_USER_ID);
const MONTHS={monthly:1,quarterly:3,'half-yearly':6};
export async function GET(){const {userId}=await auth();if(!isAdmin(userId))return NextResponse.json({error:'Admin only.'},{status:403});const keys=await redis.keys('adsub:*');const payments=keys.length?await redis.mget(...keys):[];return NextResponse.json({payments:payments.filter(Boolean).sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0))});}
export async function PATCH(request){const {userId}=await auth();if(!isAdmin(userId))return NextResponse.json({error:'Admin only.'},{status:403});const b=await request.json();if(!b.userId||!['active','rejected'].includes(b.status))return NextResponse.json({error:'Invalid request.'},{status:400});const key=`adsub:${b.userId}`;const current=await redis.get(key);if(!current)return NextResponse.json({error:'Subscription not found.'},{status:404});let expiresAt=null;if(b.status==='active'){const months=MONTHS[current.plan]||1;const base=new Date();base.setMonth(base.getMonth()+months);expiresAt=base.toISOString();}const updated={...current,status:b.status,reviewedAt:new Date().toISOString(),reviewedBy:userId,expiresAt};await redis.set(key,updated);return NextResponse.json({subscription:updated});}
