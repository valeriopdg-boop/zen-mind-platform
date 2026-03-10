// app/(therapist)/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TherapistDashboard() {
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [confirmedSessions, setConfirmedSessions] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // Prenotazioni in attesa
    const { data: pending } = await supabase
      .from('sessions')
      .select('*, patient:profiles(full_name)')
      .eq('therapist_id', user?.id)
      .eq('status', 'pending_therapist_confirmation');

    setPendingBookings(pending || []);

    // Sessioni confermate
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

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-medium">Ciao, Dott.ssa Rossi 👋</h1>
            <p className="text-[#64748B]">Dashboard Terapeuta • Zen Mind</p>
          </div>
          <Button>Modifica Profilo e Disponibilità</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendario Disponibilità */}
          <div className="lg:col-span-7 bg-[#1E2937] rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium flex items-center gap-3">
                <CalendarIcon className="text-[#14B8A6]" /> Le mie disponibilità
              </h2>
              <Button variant="outline">Gestisci orario settimanale</Button>
            </div>

            <div className="bg-[#0F172A] rounded-2xl p-8 text-center text-gray-400 h-96 flex items-center justify-center">
              <div>
                <p className="text-2xl mb-4">📅 Calendario Interattivo</p>
                <p className="text-sm">Qui il terapeuta potrà impostare i suoi orari liberi</p>
                <p className="text-xs mt-8 text-gray-500">(Prossimo step: implementazione completa del calendario)</p>
              </div>
            </div>
          </div>

          {/* Prenotazioni in attesa di conferma */}
          <div className="lg:col-span-5 bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <Clock className="text-[#14B8A6]" /> Da confermare
            </h2>

            {pendingBookings.length === 0 ? (
              <p className="text-gray-400 text-center py-12">Nessuna prenotazione in attesa</p>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((b) => (
                  <div key={b.id} className="bg-[#0F172A] p-6 rounded-2xl">
                    <p className="font-medium">{b.patient?.full_name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(b.scheduled_at).toLocaleString('it-IT')}
                    </p>
                    <Button
                      onClick={() => confirmBooking(b.id)}
                      className="mt-4 w-full bg-[#14B8A6]"
                    >
                      Conferma Prenotazione
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
