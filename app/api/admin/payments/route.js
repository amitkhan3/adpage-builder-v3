import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Redis } from '@upstash/redis';
const redis=new Redis({url:process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN});
const isAdmin=userId=>!!userId&&userId===process.env.ADMIN_USER_ID;
export async function GET(){const {userId}=await auth();if(!isAdmin(userId))return NextResponse.json({error:'Admin only.'},{status:403});const keys=await redis.keys('adsub:*');const payments=keys.length?await redis.mget(...keys):[];return NextResponse.json({payments:payments.filter(Boolean).sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0))});}
export async function PATCH(request){const {userId}=await auth();if(!isAdmin(userId))return NextResponse.json({error:'Admin only.'},{status:403});const b=await request.json();if(!b.userId||!['active','rejected'].includes(b.status))return NextResponse.json({error:'Invalid request.'},{status:400});const key=`adsub:${b.userId}`;const current=await redis.get(key);if(!current)return NextResponse.json({error:'Subscription not found.'},{status:404});const updated={...current,status:b.status,reviewedAt:new Date().toISOString(),reviewedBy:userId,expiresAt:b.status==='active'?(b.expiresAt||current.expiresAt||null):null};await redis.set(key,updated);return NextResponse.json({subscription:updated});}
