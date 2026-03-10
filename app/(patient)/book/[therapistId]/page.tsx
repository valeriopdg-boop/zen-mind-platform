// app/(patient)/book/[therapistId]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingPage() {
  const { therapistId } = useParams<{ therapistId: string }>();
  const router = useRouter();
  const [therapist, setTherapist] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Carica terapeuta
      const { data: th } = await supabase
        .from('therapists')
        .select('*, profile:profiles(full_name)')
        .eq('id', therapistId)
        .single();

      setTherapist(th);

      // Carica disponibilità (per semplicità prendiamo i prossimi 7 giorni)
      const { data: slots } = await supabase
        .from('therapist_availability')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('is_booked', false)
        .order('date');

      setAvailability(slots || []);
      setLoading(false);
    };

    loadData();
  }, [therapistId]);

  const confirmBooking = async () => {
    if (!selectedSlot) return;

    const { data: session } = await supabase
      .from('sessions')
      .insert({
        patient_id: (await supabase.auth.getUser()).data.user?.id,
        therapist_id: therapistId,
        scheduled_at: selectedSlot,
        therapist_price: therapist.hourly_rate,
        payment_status: 'pending'
      })
      .select()
      .single();

    if (session) {
      router.push(`/payment/${session.id}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Caricamento calendario...</div>;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">Prenota con {therapist?.profile?.full_name}</h1>

        <div className="bg-[#1E2937] rounded-3xl p-8">
          <h2 className="text-xl mb-6 flex items-center gap-3">
            <Calendar className="text-[#14B8A6]" />
            Seleziona data e ora disponibile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availability.map(slot => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.date + 'T' + slot.start_time)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  selectedSlot === slot.date + 'T' + slot.start_time
                    ? 'border-[#14B8A6] bg-[#14B8A6]/10'
                    : 'border-[#334155] hover:border-[#14B8A6]'
                }`}
              >
                <p className="font-medium">{new Date(slot.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p className="text-[#14B8A6] text-xl mt-1">{slot.start_time} - {slot.end_time}</p>
              </button>
            ))}
          </div>

          {selectedSlot && (
            <Button
              onClick={confirmBooking}
              className="w-full mt-10 py-8 text-xl bg-[#14B8A6] hover:bg-[#0F766E]"
            >
              Procedi al pagamento di €{therapist?.hourly_rate}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
