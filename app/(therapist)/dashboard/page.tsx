// app/(therapist)/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TherapistDashboard() {
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [mySessions, setMySessions] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // Prenotazioni in attesa di conferma
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

    setMySessions(confirmed || []);
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
          <Button onClick={() => {}}>Modifica Profilo</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendario Disponibilità */}
          <div className="lg:col-span-7 bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <Calendar className="text-[#14B8A6]" /> Le mie disponibilità
            </h2>
            <div className="h-96 bg-[#0F172A] rounded-2xl flex items-center justify-center text-gray-400">
              Calendario interattivo (in fase di sviluppo)
            </div>
          </div>

          {/* Prenotazioni in attesa */}
          <div className="lg:col-span-5 bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <Clock className="text-[#14B8A6]" /> Prenotazioni da confermare
            </h2>

            {pendingBookings.length === 0 ? (
              <p className="text-gray-400 text-center py-12">Nessuna prenotazione in attesa</p>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="bg-[#0F172A] p-6 rounded-2xl">
                    <p className="font-medium">{booking.patient?.full_name}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(booking.scheduled_at).toLocaleDateString('it-IT', {
                        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <Button
                      onClick={() => confirmBooking(booking.id)}
                      className="mt-4 w-full bg-[#14B8A6] hover:bg-[#0F766E]"
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
