// app/(therapist)/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Euro, Users } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Terapeuta di test (cambialo con il tuo ID quando avrai login reale)
const THERAPIST_ID = '00000000-0000-0000-0000-000000000001';

export default function TherapistDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<any[]>([]);

  useEffect(() => {
    loadTherapistData();
  }, []);

  const loadTherapistData = async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*, patient:profiles(full_name)')
      .eq('therapist_id', THERAPIST_ID)
      .order('scheduled_at');

    setSessions(data || []);

    // Calcolo guadagni (39€ netti per sessione con 10€ trattenuti)
    const total = (data || []).length * 39;
    setEarnings(total);

    generateCalendar();
  };

  const generateCalendar = () => {
    const days = [];
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    for (let i = 1; i <= end.getDate(); i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      const hasSession = sessions.some(
        (s) => new Date(s.scheduled_at).toDateString() === date.toDateString()
      );
      days.push({ day: i, hasSession });
    }
    setCalendarDays(days);
  };

  const openVideo = (sessionId: string) => {
    window.open(`/session/${sessionId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-medium text-[#0F766E]">Ciao Dott.ssa Rossi 👋</h1>
            <p className="text-[#64748B]">Dashboard Terapeuta • Zen Mind</p>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/';
              }}
            >
              Esci
            </Button>
            <div className="bg-white px-6 py-3 rounded-2xl shadow flex items-center gap-3">
              <Euro className="text-[#14B8A6]" />
              <div>
                <p className="text-sm text-gray-500">Guadagni questo mese</p>
                <p className="text-3xl font-semibold text-[#0F766E]">€{earnings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendario */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-medium">Calendario disponibilità</h2>
              <Button
                onClick={() => {
                  /* logica per cambiare mese */
                }}
              >
                {selectedDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((d) => (
                <div key={d} className="font-medium text-[#64748B]">
                  {d}
                </div>
              ))}
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setSelectedDate(
                      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day.day)
                    )
                  }
                  className={`aspect-square flex items-center justify-center rounded-2xl cursor-pointer transition-all hover:bg-[#14B8A6]/10 ${
                    day.hasSession ? 'bg-[#14B8A6] text-white font-medium' : 'bg-gray-50'
                  }`}
                >
                  {day.day}
                </div>
              ))}
            </div>
            <p className="text-xs text-center mt-6 text-[#64748B]">
              • I giorni verdi hanno sessioni prenotate
            </p>
          </div>

          {/* Prossime sessioni */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <Clock className="text-[#14B8A6]" /> Prossime sessioni
            </h2>

            {sessions.length === 0 ? (
              <p className="text-center py-12 text-gray-400">Nessuna sessione in arrivo</p>
            ) : (
              <div className="space-y-4">
                {sessions.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center p-5 bg-[#F8FAFC] rounded-2xl"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(s.scheduled_at).toLocaleDateString('it-IT', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        con {s.patient?.full_name || 'Paziente'}
                      </p>
                    </div>
                    <Button onClick={() => openVideo(s.id)} className="bg-[#0F766E]">
                      Entra in video
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

