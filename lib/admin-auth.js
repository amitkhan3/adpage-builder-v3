import crypto from 'crypto';
const COOKIE='adpage_admin_session';
const maxAge=60*60*24*7;
function secret(){return process.env.ADMIN_PANEL_SECRET||'';}
export function adminCookieName(){return COOKIE;}
export function createAdminToken(){const s=secret();if(!s)throw new Error('ADMIN_PANEL_SECRET is not configured.');const payload=`${Date.now()}`;const sig=crypto.createHmac('sha256',s).update(payload).digest('hex');return `${payload}.${sig}`;}
export function verifyAdminToken(token){const s=secret();if(!s||!token)return false;const [payload,sig]=String(token).split('.');if(!payload||!sig||!/^[0-9]+$/.test(payload)||Date.now()-Number(payload)>maxAge*1000)return false;const expected=crypto.createHmac('sha256',s).update(payload).digest('hex');if(sig.length!==expected.length)return false;try{return crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected));}catch{return false;}}
export function adminCookieOptions(){return{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge};}
export function adminPasswordValid(password){const configured=process.env.ADMIN_PANEL_PASSWORD||'';if(!configured||typeof password!=='string'||password.length!==configured.length)return false;try{return crypto.timingSafeEqual(Buffer.from(password),Buffer.from(configured));}catch{return false;}}
