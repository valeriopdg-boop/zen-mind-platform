// app/(patient)/results/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { calculateCompatibility, getMatchReasons } from '@/lib/matching';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fakeTherapists = [
  { id: '00000000-0000-0000-0000-000000000001', full_name: "Dott.ssa Elena Rossi", hourly_rate: 65 },
  { id: '00000000-0000-0000-0000-000000000002', full_name: "Dott. Marco Bianchi", hourly_rate: 70 },
  { id: '00000000-0000-0000-0000-000000000003', full_name: "Dott.ssa Giulia Verdi", hourly_rate: 58 },
];

export default function ResultsPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadResults = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: test } = await supabase
        .from('patient_tests')
        .select('answers')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (test) {
        const scored = fakeTherapists.map(t => ({
          ...t,
          score: calculateCompatibility(test.answers, t),
          reasons: getMatchReasons(test.answers, t)
        })).sort((a, b) => b.score - a.score).slice(0, 3);

        setMatches(scored);
      }
      setLoading(false);
    };
    loadResults();
  }, []);

  const goToBooking = (therapistId: string) => {
    router.push(`/book/${therapistId}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center text-white text-2xl">Calcolo i tuoi match migliori...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-medium text-center mb-4">I tuoi match perfetti</h1>
        <p className="text-center text-[#64748B] mb-12">Basati sul tuo test di 10 domande</p>

        <div className="grid md:grid-cols-3 gap-8">
          {matches.map((m, i) => (
            <div key={i} className="bg-[#1E2937] rounded-3xl p-8 border border-[#14B8A6]/20">
              <div className="text-6xl font-bold text-[#14B8A6] mb-3">{m.score}%</div>
              <h3 className="text-2xl font-medium mb-6">{m.full_name}</h3>

              <ul className="space-y-3 mb-10 text-sm text-gray-300">
                {m.reasons.map((r: string, idx: number) => (
                  <li key={idx}>• {r}</li>
                ))}
              </ul>

              <Button
                onClick={() => goToBooking(m.id)}
                className="w-full py-7 text-lg bg-[#14B8A6] hover:bg-[#0F766E]"
              >
                Prenota con {m.full_name.split(' ')[1]} — €{m.hourly_rate}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
