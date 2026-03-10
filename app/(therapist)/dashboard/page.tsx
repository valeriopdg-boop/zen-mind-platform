// app/(therapist)/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TherapistDashboard() {
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [confirmedSessions, setConfirmedSessions] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // Marzo 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: pending } = await supabase
      .from('sessions')
      .select('*, patient:profiles(full_name)')
      .eq('therapist_id', user?.id)
      .eq('status', 'pending_therapist_confirmation');

    setPendingBookings(pending || []);

    const { data: confirmed } = await supabase
      .from('sessions')
      .select('*, patient:profiles(full_name)')
      .eq('therapist_id', user?.id)
      .eq('status', 'confirmed');

    setConfirmedSessions(confirmed || []);
  };

  const confirmBooking = async (sessionId: string) => {
    await supabase
      .from('sessions')
      .update({ status: 'confirmed' })
      .eq('id', sessionId);
    loadDashboardData();
  };

  const toggleDay = (day: number) => {
    const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
    if (selectedDate === dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateStr);
      setShowTimeModal(true);
    }
  };

  const saveTimeSlot = () => {
    if (selectedDate && selectedTimeSlot) {
      alert(`✅ Disponibilità impostata per ${selectedDate} alle ${selectedTimeSlot}`);
      setShowTimeModal(false);
      setSelectedTimeSlot('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-medium">Ciao, Dott.ssa Rossi 👋</h1>
            <p className="text-[#64748B]">Dashboard Terapeuta • Zen Mind</p>
          </div>
          <Button className="bg-[#14B8A6]" onClick={() => router.push('/profile')}>Modifica Profilo</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendario Interattivo */}
          <div className="lg:col-span-7 bg-[#1E2937] rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-medium flex items-center gap-3">
                <CalendarIcon className="text-[#14B8A6]" /> Marzo 2026
              </h2>
              <Button variant="outline">Gestisci orario settimanale</Button>
            </div>

            <div className="grid grid-cols-7 gap-3 text-center">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((d) => (
                <div key={d} className="text-xs text-[#64748B] py-3 font-medium">{d}</div>
              ))}

              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`aspect-square flex items-center justify-center rounded-2xl text-lg font-medium cursor-pointer transition-all border border-transparent
                    ${selectedDate === `2026-03-${day.toString().padStart(2, '0')}`
                      ? 'bg-[#14B8A6] text-black border-[#14B8A6] scale-110'
                      : 'bg-[#0F172A] hover:bg-[#1E2937] hover:border-[#14B8A6]/50'}`}
                >
                  {day}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
              Clicca sui giorni per impostare le tue fasce orarie disponibili
            </p>
          </div>

          {/* Prenotazioni da confermare */}
          <div className="lg:col-span-5 bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <Clock className="text-[#14B8A6]" /> Da confermare
            </h2>

            {pendingBookings.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                Nessuna prenotazione in attesa
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

      {/* Modal per inserire orario */}
      {showTimeModal && selectedDate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#1E2937] rounded-3xl p-10 w-full max-w-md">
            <h3 className="text-2xl font-medium mb-6">Imposta orari per {selectedDate}</h3>

            <Input
              type="time"
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="bg-[#0F172A] text-2xl mb-6 border-gray-700 text-white"
            />

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowTimeModal(false)}
                className="flex-1 py-6"
              >
                Annulla
              </Button>
              <Button
                onClick={saveTimeSlot}
                className="flex-1 py-6 bg-[#14B8A6]"
              >
                Salva Orario
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
