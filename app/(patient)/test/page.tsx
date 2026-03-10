// app/(patient)/test/page.tsx
'use client';
import { useState } from 'react';
import TestQuestion from '@/components/TestQuestion';
import { questions } from '@/lib/questions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(false);

  const handleAnswer = (id: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Fine test → salva e vai ai risultati
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Salva sempre in sessionStorage per i risultati (utente anonimo)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('zenmind_test_answers', JSON.stringify(answers));
      }

      if (user?.id) {
        await supabase.from('patient_tests').insert({ user_id: user.id, answers });
      }

      window.location.href = '/results';
      setLoading(false);
    }
  };

  const handlePrev = () => setCurrentIndex(Math.max(0, currentIndex - 1));

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-medium text-[#0F766E]">Il tuo percorso inizia qui</h1>
        <p className="text-[#64748B] mt-2">20 domande • 6 minuti • Matching scientifico</p>
      </div>

      <TestQuestion
        currentIndex={currentIndex}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {loading && <div className="text-center mt-8">Sto calcolando i tuoi match...</div>}
    </div>
  );
}
