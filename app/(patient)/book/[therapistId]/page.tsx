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
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: th } = await supabase
        .from('therapists')
        .select('*, profile:profiles(full_name)')
        .eq('id', therapistId)
        .single();

      setTherapist(th);

      const { data: availability } = await supabase
        .from('therapist_availability')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('is_booked', false)
        .order('date', { ascending: true });

      setSlots(availability || []);
      setLoading(false);
    };

    loadData();
  }, [therapistId]);

  const confirmSlot = async () => {
    if (!selectedSlot || !therapist) return;

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

  if (loading) {
    return <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center text-white text-2xl">Caricamento calendario...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-medium mb-2">Prenota con {therapist?.profile?.full_name}</h1>
        <p className="text-[#14B8A6] text-xl mb-10">Tariffa: €{therapist?.hourly_rate} a seduta</p>

        <div className="bg-[#1E2937] rounded-3xl p-10">
          <h2 className="text-2xl font-medium mb-8 flex items-center gap-3">
            <Calendar className="text-[#14B8A6]" /> Disponibilità
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(`${slot.date}T${slot.start_time}`)}
                className={`p-6 rounded-2xl border transition-all text-left ${
                  selectedSlot === `${slot.date}T${slot.start_time}`
                    ? 'border-[#14B8A6] bg-[#14B8A6]/10'
                    : 'border-[#334155] hover:border-[#14B8A6]'
                }`}
              >
                <p className="font-medium">
                  {new Date(slot.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
                <p className="text-2xl text-[#14B8A6] mt-2 font-medium">
                  {slot.start_time} - {slot.end_time}
                </p>
              </button>
            ))}
          </div>

          {selectedSlot && (
            <Button
              onClick={confirmSlot}
              className="w-full mt-12 py-8 text-xl bg-[#14B8A6] hover:bg-[#0F766E]"
            >
              Procedi al pagamento di €{therapist?.hourly_rate}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
