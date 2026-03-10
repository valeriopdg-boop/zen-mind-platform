// components/TestQuestion.tsx
'use client';
import { questions, type Question } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';

export default function TestQuestion({
  currentIndex,
  answers,
  onAnswer,
  onNext,
  onPrev,
}: {
  currentIndex: number;
  answers: Record<number, any>;
  onAnswer: (id: number, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={onPrev}
            className="flex items-center gap-2 text-[#14B8A6] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Indietro
          </button>
          <div className="text-sm text-[#64748B]">
            {currentIndex + 1} / 10 • {q.block}
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-1.5 bg-[#1E2937] mb-10" />

        {/* Domanda */}
        <h2 className="text-3xl font-medium leading-tight mb-12 text-center">
          {q.text}
        </h2>

        {/* Risposte */}
        <div className="space-y-4">
          {q.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(q.id, q.type === 'scale' ? Number(opt) : opt)}
              className={`w-full p-6 rounded-3xl border text-left transition-all text-lg
                ${answers[q.id] === (q.type === 'scale' ? Number(opt) : opt)
                  ? 'border-[#14B8A6] bg-[#14B8A6]/10 text-white'
                  : 'border-[#1E2937] hover:border-[#14B8A6]/50 bg-[#0F172A]'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Pulsante Continua */}
        <Button
          onClick={onNext}
          disabled={!answers[q.id]}
          className="w-full mt-12 py-8 text-xl bg-[#14B8A6] hover:bg-[#0F766E] disabled:bg-[#1E2937] disabled:text-gray-500"
        >
          {currentIndex === questions.length - 1 ? "Vedi i tuoi match →" : "Continua →"}
        </Button>
      </div>
    </div>
  );
}
