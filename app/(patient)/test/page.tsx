// app/(patient)/test/page.tsx
'use client';
import { useState, useEffect } from 'react';
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

  const handleAnswer = (id: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // salva e vai ai risultati
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from('patient_tests').insert({ user_id: user?.id, answers });
      window.location.href = '/results';
    }
  };

  const handlePrev = () => setCurrentIndex(Math.max(0, currentIndex - 1));

  return (
    <TestQuestion
      currentIndex={currentIndex}
      answers={answers}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrev={handlePrev}
    />
  );
}
