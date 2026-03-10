// app/api/create-payment-intent/route.ts
import { createClient } from '@supabase/supabase-js';

async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY non configurata');
  const Stripe = (await import('stripe')).default;
  return new Stripe(key);
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase non configurato');
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const { sessionId, amount, therapistPrice } = await request.json();

    const stripe = await getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      metadata: {
        sessionId: sessionId,
        therapistPrice: therapistPrice,
        platformFee: '1000'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    await getSupabase()
      .from('sessions')
      .update({
        payment_intent_id: paymentIntent.id,
        amount_paid: amount,
        payment_status: 'pending',
        therapist_price: therapistPrice
      })
      .eq('id', sessionId);

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100
    });

  } catch (error: any) {
    console.error('Payment Intent Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
