// app/payment/[sessionId]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PaymentPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase
        .from('sessions')
        .select(`
          *,
          therapist:therapists(hourly_rate, full_name)
        `)
        .eq('id', sessionId)
        .single();

      setSession(data);
      setLoading(false);
    };
    loadSession();
  }, [sessionId]);

  const handlePayment = async () => {
    if (!session) return;

    const stripe = await stripePromise;
    if (!stripe) return alert("Errore Stripe");

    const totalAmount = session.therapist.hourly_rate * 100; // in centesimi

    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        amount: totalAmount,
        therapistPrice: session.therapist.hourly_rate
      })
    });

    const { clientSecret } = await response.json();

    const { error } = await stripe.redirectToCheckout({
      sessionId: clientSecret
    });

    if (error) alert(error.message);
  };

  if (loading || !session) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Caricamento pagamento...</div>;
  }

  const price = session.therapist.hourly_rate;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex items-center justify-center p-6">
      <div className="bg-[#1E2937] rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-medium text-center mb-6">Pagamento Sessione</h1>

        <div className="bg-[#0F172A] p-8 rounded-2xl mb-8 text-center">
          <p className="text-gray-400">Terapeuta</p>
          <p className="text-2xl font-medium mt-2">{session.therapist.full_name}</p>
          <p className="text-5xl font-semibold text-[#14B8A6] mt-6">€{price}</p>
          <p className="text-sm text-gray-500 mt-2">per una seduta di 50 minuti</p>
        </div>

        <div className="text-center text-sm text-gray-400 mb-8">
          Zen Mind tratterrà 10€<br />
          Il terapeuta riceverà €{price - 10}
        </div>

        <Button
          onClick={handlePayment}
          className="w-full py-8 text-xl bg-[#14B8A6] hover:bg-[#0F766E]"
        >
          Paga €{price} e conferma la prenotazione
        </Button>

        <p className="text-xs text-center text-gray-500 mt-8">
          Pagamento sicuro • Stripe • GDPR compliant
        </p>
      </div>
    </div>
  );
}
