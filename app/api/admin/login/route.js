import { NextResponse } from 'next/server';
import { adminCookieName, adminCookieOptions, createAdminToken, adminPasswordValid } from '../../../../lib/admin-auth';

export const dynamic='force-dynamic';

export async function POST(request){
  try{
    const {password}=await request.json();
    if(!adminPasswordValid(password)) return NextResponse.json({error:'Invalid admin password.'},{status:401});
    const response=NextResponse.json({ok:true});
    response.cookies.set(adminCookieName(),createAdminToken(),adminCookieOptions());
    return response;
  }catch(error){
    return NextResponse.json({error:error?.message||'Admin login is not configured.'},{status:500});
  }
}

export async function DELETE(){
  const response=NextResponse.json({ok:true});
  response.cookies.set(adminCookieName(),'',{...adminCookieOptions(),maxAge:0});
  return response;
}
