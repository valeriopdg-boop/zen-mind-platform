// app/api/create-payment-intent/route.ts
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.stable',   // ← versione aggiornata corretta
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { sessionId, amount, therapistPrice } = await request.json();

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

    await supabase
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
