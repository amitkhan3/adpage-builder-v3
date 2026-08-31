export const PAYMENT_NUMBER='01311358241';
export const PAYMENT_METHODS=['bKash','Nagad'];
export function hasActiveSubscription(sub){return !!sub&&sub.status==='approved'&&(!sub.expiresAt||new Date(sub.expiresAt)>new Date());}
