import {NextResponse} from 'next/server';
import {auth} from '@clerk/nextjs/server';
import {deleteOrder,getOrder,updateOrder} from '../../../../lib/persistent-store';
export const dynamic='force-dynamic';
async function own(id){const{userId}=await auth();if(!userId)return{res:NextResponse.json({error:'Sign in required.'},{status:401})};const order=await getOrder(id);if(!order)return{res:NextResponse.json({error:'Order not found.'},{status:404})};if(order.ownerId!==userId)return{res:NextResponse.json({error:'Not allowed.'},{status:403})};return{order}}
export async function PATCH(req,{params}){try{const x=await own(params.id);if(x.res)return x.res;const{status}=await req.json();if(!['New','Hold','Confirmed','Delivered','Cancelled'].includes(status))return NextResponse.json({error:'Invalid status.'},{status:400});return NextResponse.json({order:await updateOrder(params.id,{status,statusUpdatedAt:new Date().toISOString()})})}catch(e){return NextResponse.json({error:e.message||'Update failed'},{status:500})}}
export async function DELETE(req,{params}){try{const x=await own(params.id);if(x.res)return x.res;await deleteOrder(params.id);return NextResponse.json({ok:true})}catch(e){return NextResponse.json({error:e.message||'Delete failed'},{status:500})}}
