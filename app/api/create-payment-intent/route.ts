import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return Response.json({ error: 'STRIPE_SECRET_KEY non configurata' }, { status: 500 });
    }

    const { sessionId, amount, therapistPrice } = await request.json();

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(key);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      metadata: {
        sessionId: sessionId,
        therapistPrice: therapistPrice,
        platformFee: '1000',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase
        .from('sessions')
        .update({
          payment_intent_id: paymentIntent.id,
          amount_paid: amount,
          payment_status: 'pending',
          therapist_price: therapistPrice,
        })
        .eq('id', sessionId);
    }

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100,
    });
  } catch (error: any) {
    console.error('Payment Intent Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
