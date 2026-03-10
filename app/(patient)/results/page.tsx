// app/(patient)/results/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { calculateCompatibility, getMatchReasons } from '@/lib/matching';
import { Button } from '@/components/ui/button';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Profile IDs dal seed therapists (sessions.therapist_id = profile uuid)
const fakeTherapists = [
  { id: '00000000-0000-0000-0000-000000000001', full_name: 'Dott.ssa Elena Rossi', orientations: ['CBT', 'Schema Therapy'], specialties: ['Ansia', 'Autostima'], hourly_rate: 49 },
  { id: '00000000-0000-0000-0000-000000000002', full_name: 'Dott. Marco Bianchi', orientations: ['EMDR'], specialties: ['Traumi'], hourly_rate: 52 },
  { id: '00000000-0000-0000-0000-000000000003', full_name: 'Dott.ssa Giulia Verdi', orientations: ['Psicodinamica'], specialties: ['Relazioni'], hourly_rate: 47 },
];

export default function ResultsPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Se anonimo, prova a recuperare answers da sessionStorage (salvate dal test)
      let answers: Record<number, any> | null = null;
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem('zenmind_test_answers') : null;
      if (stored) answers = JSON.parse(stored);

      if (!answers && user) {
        const { data: test } = await supabase
          .from('patient_tests')
          .select('answers')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (test) answers = test.answers;
      }

      if (answers) {
        const scored = fakeTherapists.map((t) => ({
          ...t,
          score: calculateCompatibility(answers!, t),
          reasons: getMatchReasons(answers!, t),
        }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        setMatches(scored);
      }
      setLoading(false);
    };
    loadResults();
  }, []);

  if (loading) return <div className="text-center py-20 text-2xl">Calcolo il matching scientifico...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-medium text-center mb-4 text-[#0F766E]">I tuoi match perfetti</h1>
        <p className="text-center text-[#64748B] mb-12">Basati sul tuo test di 10 domande</p>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#64748B] mb-4">Nessun risultato trovato. Completa prima il test!</p>
            <Button onClick={() => (window.location.href = '/test')}>Vai al test</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {matches.map((m, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-xl p-8 border border-[#14B8A6]/20">
                <div className="text-6xl font-bold text-[#14B8A6] mb-2">{m.score}%</div>
                <h3 className="text-2xl font-medium mb-6">{m.full_name}</h3>

                <ul className="space-y-3 mb-10 text-sm">
                  {m.reasons.map((r: string, idx: number) => (
                    <li key={idx} className="flex gap-2">• {r}</li>
                  ))}
                </ul>

                <Button
                  onClick={() => (window.location.href = '/session/test-video-123')}
                  className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-white py-6 text-lg rounded-2xl"
                >
                  Prenota sessione con Elena (10€ a Zen Mind)
                </Button>

                <Button
                  onClick={() => (window.location.href = '/session/test-video-123')}
                  className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-white py-6 text-lg rounded-2xl mt-4"
                >
                  Prenota sessione con Marco (10€ a Zen Mind)
                </Button>

                <Button
                  onClick={() => (window.location.href = '/session/test-video-123')}
                  className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-white py-6 text-lg rounded-2xl mt-4"
                >
                  Prenota sessione con Giulia (10€ a Zen Mind)
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
