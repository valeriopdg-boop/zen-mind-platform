import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY non configurata' }, { status: 500 });
    }

    const { sessionId, amount, therapistPrice } = await request.json();
    if (!sessionId || amount == null) {
      return NextResponse.json({ error: 'sessionId e amount richiesti' }, { status: 400 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(key);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Sessione di psicoterapia',
              description: `Seduta 50 min - Tariffa terapeuta €${therapistPrice ?? amount / 100}`,
              images: [],
            },
            unit_amount: typeof amount === 'number' ? amount : Math.round(Number(amount)),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/session/${sessionId}?payment=success`,
      cancel_url: `${baseUrl}/payment/${sessionId}?canceled=1`,
      metadata: { sessionId },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url ?? undefined,
    });
  } catch (e: any) {
    console.error('Stripe checkout error:', e);
    return NextResponse.json(
      { error: e?.message ?? 'Errore creazione checkout' },
      { status: 500 }
    );
  }
}
