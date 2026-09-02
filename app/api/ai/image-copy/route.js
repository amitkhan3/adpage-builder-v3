import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ error: 'AI is not configured. Add OPENAI_API_KEY in Vercel.' }, { status: 503 });
    const { image } = await req.json();
    if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) return NextResponse.json({ error: 'A product image is required.' }, { status: 400 });
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || 'gpt-5.6-luna',
        input: [{ role: 'user', content: [
          { type: 'input_text', text: 'Analyze this product image and write concise Bangla/Banglish e-commerce landing-page copy based only on what is reasonably visible. Do not invent brand names, prices, specifications, guarantees, medical claims, or facts that are not visible. Return ONLY valid JSON with these keys: title (short headline), description (2 short sentences), benefits (array of 3 short bullets), cta (short button text).' },
          { type: 'input_image', image_url: image, detail: 'high' }
        ] }],
      })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || 'AI request failed.' }, { status: response.status });
    const raw = data.output_text || '';
    let parsed;
    try { parsed = JSON.parse(raw); } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI returned an invalid response.');
      parsed = JSON.parse(match[0]);
    }
    return NextResponse.json({
      title: String(parsed.title || '').trim(),
      description: String(parsed.description || '').trim(),
      benefits: Array.isArray(parsed.benefits) ? parsed.benefits.map(x => String(x).trim()).filter(Boolean).slice(0, 3) : [],
      cta: String(parsed.cta || 'Order Now').trim(),
    });
  } catch (error) {
    return NextResponse.json({ error: error?.message || 'AI copy generation failed.' }, { status: 500 });
  }
}
