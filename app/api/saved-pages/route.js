import { NextResponse } from 'next/server';
import { listPages } from '../../../lib/persistent-store';

export async function GET() {
  try {
    return NextResponse.json({ pages: await listPages() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to load saved pages' }, { status: 500 });
  }
}
