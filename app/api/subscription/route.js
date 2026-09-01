export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSubscription, saveSubscription } from '../../../lib/subscription-store';

const PLANS={monthly:{name:'1 Month',months:1,amount:1000},quarterly:{name:'3 Months',months:3,amount:2500},'half-yearly':{name:'6 Months',months:6,amount:4500}};
const METHODS=['bkash','nagad'];

export async function GET(){
  const {userId}=await auth();
  if(!userId)return NextResponse.json({error:'Sign in required.'},{status:401});
  return NextResponse.json({subscription:await getSubscription(userId)});
}

export async function POST(request){
  const {userId}=await auth();
  if(!userId)return NextResponse.json({error:'Sign in required.'},{status:401});
  const b=await request.json();
  const plan=PLANS[b.plan];
  const method=String(b.method||'').toLowerCase();
  const transactionId=String(b.transactionId||'').trim();
  if(!plan)return NextResponse.json({error:'Please select a valid subscription plan.'},{status:400});
  if(!METHODS.includes(method))return NextResponse.json({error:'Please select bKash or Nagad.'},{status:400});
  if(Number(b.amount)!==plan.amount)return NextResponse.json({error:'Payment amount does not match the selected plan.'},{status:400});
  if(transactionId.length<4||transactionId.length>80)return NextResponse.json({error:'Enter a valid Transaction ID.'},{status:400});

  const current=await getSubscription(userId);
  if(current?.status==='pending')return NextResponse.json({error:'A payment is already waiting for admin approval.'},{status:409});
  if(current?.status==='active'&&(!current.expiresAt||new Date(current.expiresAt)>new Date()))return NextResponse.json({error:'Your subscription is already active.'},{status:409});

  const sub=await saveSubscription(userId,{status:'pending',plan:b.plan,planName:plan.name,months:plan.months,amount:plan.amount,method,transactionId,paymentNumber:'01311358241'});
  return NextResponse.json({subscription:sub});
}
