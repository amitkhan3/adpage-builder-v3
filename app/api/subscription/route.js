export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSubscription, saveSubscription } from '../../../lib/subscription-store';
const METHODS=['bkash','nagad'];
export async function GET(){const {userId}=await auth();if(!userId)return NextResponse.json({error:'Sign in required.'},{status:401});return NextResponse.json({subscription:await getSubscription(userId)});}
export async function POST(request){const {userId}=await auth();if(!userId)return NextResponse.json({error:'Sign in required.'},{status:401});const b=await request.json();if(!METHODS.includes(b.method))return NextResponse.json({error:'Unsupported payment method.'},{status:400});if(!b.transactionId||!b.amount)return NextResponse.json({error:'Payment amount and transaction ID are required.'},{status:400});const sub=await saveSubscription(userId,{status:'pending',plan:b.plan||'Pro',amount:Number(b.amount),method:b.method,transactionId:String(b.transactionId).trim(),paymentNumber:'01311358241'});return NextResponse.json({subscription:sub});}
