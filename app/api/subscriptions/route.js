export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Redis } from '@upstash/redis';
import { PAYMENT_METHODS,PAYMENT_NUMBER } from '../../../lib/subscription';
const redis=new Redis({url:process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN});
export async function POST(request){const {userId}=await auth();if(!userId)return NextResponse.json({error:'Sign in required.'},{status:401});const b=await request.json();if(!PAYMENT_METHODS.includes(b.method)||!b.transactionId)return NextResponse.json({error:'Payment method and transaction ID are required.'},{status:400});const item={id:Math.random().toString(36).slice(2,10),userId,method:b.method,amount:b.amount||'',transactionId:b.transactionId,screenshot:b.screenshot||'',status:'pending',createdAt:new Date().toISOString()};await redis.set(`adpayment:${item.id}`,item);await redis.sadd(`adpayment:user:${userId}`,item.id);return NextResponse.json({payment:item,paymentNumber:PAYMENT_NUMBER});}
