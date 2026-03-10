// app/payment/[sessionId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const [session, setSession] = useState<any>(null);
  const [therapist, setTherapist] = useState<{ hourly_rate: number; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId || typeof sessionId !== 'string') {
        setLoading(false);
        return;
      }
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      setSession(sessionData);
      if (sessionData?.therapist_id) {
        const { data: therapistData } = await supabase
          .from('therapists')
          .select('hourly_rate')
          .eq('profile_id', sessionData.therapist_id)
          .single();
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', sessionData.therapist_id)
          .single();
        setTherapist({
          hourly_rate: therapistData?.hourly_rate ?? 55,
          full_name: profile?.full_name
        });
      } else {
        setTherapist({ hourly_rate: 55 });
      }
      setLoading(false);
    };
    loadSession();
  }, [sessionId]);

  const handlePayment = async () => {
    if (!session || !therapist) return;

    setPaying(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          amount: therapist.hourly_rate * 100, // centesimi
          therapistPrice: therapist.hourly_rate
        })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error ?? 'Errore nella creazione del pagamento');
        setPaying(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }
      const stripe = await stripePromise;
      if (stripe && data.sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (error) alert(error.message);
      }
    } catch (e) {
      alert('Errore di connessione');
    }
    setPaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        Caricamento...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p>Sessione non trovata.</p>
      </div>
    );
  }

  const price = therapist?.hourly_rate ?? 55;
  const platformFee = 10;
  const toTherapist = price - platformFee;
  const therapistName = therapist?.full_name ?? 'Dott.ssa / Dott. [Nome]';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-medium text-center mb-8">Pagamento Sessione</h1>

        <div className="bg-[#F8FAFC] p-6 rounded-2xl mb-8">
          <p className="text-gray-600">Terapeuta scelto</p>
          <p className="text-2xl font-medium">{therapistName}</p>
          <p className="text-4xl font-semibold text-[#0F766E] mt-4">€{price}</p>
          <p className="text-sm text-gray-500 mt-1">Tariffa per una seduta da 50 minuti</p>
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Zen Mind tratterrà €{platformFee}
          <br />
          Il resto (€{toTherapist}) andrà direttamente al terapeuta
        </div>

        <Button
          onClick={handlePayment}
          disabled={paying}
          className="w-full py-8 text-xl bg-[#0F766E] hover:bg-[#0F766E]/90"
        >
          {paying ? 'Reindirizzamento...' : `Paga €${price} e conferma la prenotazione`}
        </Button>

        <p className="text-xs text-center text-gray-400 mt-8">
          Pagamento sicuro con Stripe • GDPR compliant
        </p>
      </div>
    </div>
  );
}
