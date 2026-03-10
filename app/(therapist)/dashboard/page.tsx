// app/(therapist)/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TherapistDashboard() {
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // Marzo 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPendingBookings();
  }, []);

  const loadPendingBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('sessions')
      .select('*, patient:profiles(full_name)')
      .eq('therapist_id', user?.id)
      .eq('status', 'pending_therapist_confirmation');

    setPendingBookings(data || []);
  };

  const confirmBooking = async (sessionId: string) => {
    await supabase
      .from('sessions')
      .update({ status: 'confirmed' })
      .eq('id', sessionId);

    loadPendingBookings();
  };

  const toggleAvailability = (day: number) => {
    const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
    alert(`Disponibilità impostata per il ${day} marzo 2026\n(Prossimo step: form per inserire orari)`);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-medium">Ciao, Dott.ssa Rossi 👋</h1>
            <p className="text-[#64748B]">Dashboard Terapeuta • Zen Mind</p>
          </div>
          <Button className="bg-[#14B8A6]" onClick={() => router.push('/profile')}>Modifica Profilo e Disponibilità</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendario Interattivo */}
          <div className="lg:col-span-7 bg-[#1E2937] rounded-3xl p-8">
            <div className="flex justify-between mb-8">
              <h2 className="text-2xl font-medium flex items-center gap-3">
                <CalendarIcon className="text-[#14B8A6]" /> Marzo 2026
              </h2>
              <Button variant="outline">Gestisci orario settimanale</Button>
            </div>

            <div className="grid grid-cols-7 gap-3 text-center">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((d) => (
                <div key={d} className="text-xs text-[#64748B] py-2 font-medium">{d}</div>
              ))}

              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  onClick={() => toggleAvailability(day)}
                  className={`aspect-square flex items-center justify-center rounded-2xl text-lg font-medium cursor-pointer transition-all hover:bg-[#14B8A6]/20
                    ${selectedDate === `2026-03-${day.toString().padStart(2, '0')}`
                      ? 'bg-[#14B8A6] text-black scale-110'
                      : 'bg-[#0F172A] hover:bg-[#1E2937]'}`}
                >
                  {day}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
              Clicca sui giorni per impostare le tue disponibilità orarie
            </p>
          </div>

          {/* Prenotazioni da confermare */}
          <div className="lg:col-span-5 bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <Clock className="text-[#14B8A6]" /> Da confermare
            </h2>

            {pendingBookings.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                Nessuna prenotazione in attesa di conferma
              </div>
            ) : (
              <div className="space-y-5">
                {pendingBookings.map((b) => (
                  <div key={b.id} className="bg-[#0F172A] p-6 rounded-2xl">
                    <p className="font-medium text-lg">{b.patient?.full_name}</p>
                    <p className="text-[#14B8A6] text-sm mt-1">
                      {new Date(b.scheduled_at).toLocaleString('it-IT')}
                    </p>
                    <Button
                      onClick={() => confirmBooking(b.id)}
                      className="mt-6 w-full bg-[#14B8A6] hover:bg-[#0F766E]"
                    >
                      ✅ Conferma Prenotazione
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
