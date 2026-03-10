// components/TestQuestion.tsx
'use client';
import { questions } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-[#14B8A6]/20">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-[#0F766E] mb-2">
          <span>Blocco: {q.block}</span>
          <span>{currentIndex + 1} / 20</span>
        </div>
        <Progress value={progress} className="h-2 bg-[#E2E8F0]" />
      </div>

      <h2 className="text-2xl font-medium text-[#1E2937] mb-8 leading-tight">
        {q.text}
      </h2>

      <div className="space-y-3">
        {q.type === 'single' && q.options?.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(q.id, opt)}
            className={`w-full text-left p-5 rounded-2xl border transition-all ${
              answers[q.id] === opt
                ? 'border-[#14B8A6] bg-[#14B8A6]/10 text-[#0F766E]'
                : 'border-gray-200 hover:border-[#14B8A6]'
            }`}
          >
            {opt}
          </button>
        ))}

        {q.type === 'scale' && (
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => onAnswer(q.id, n)}
                className={`w-12 h-12 rounded-2xl text-xl font-medium transition-all ${
                  answers[q.id] === n
                    ? 'bg-[#14B8A6] text-white scale-110'
                    : 'bg-gray-100 hover:bg-[#14B8A6]/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {q.type === 'multi' && q.options?.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              const current = answers[q.id] || [];
              const newVal = current.includes(opt)
                ? current.filter((v: string) => v !== opt)
                : [...current, opt];
              onAnswer(q.id, newVal);
            }}
            className={`w-full p-5 rounded-2xl border text-left ${
              (answers[q.id] || []).includes(opt)
                ? 'border-[#14B8A6] bg-[#14B8A6]/10'
                : 'border-gray-200 hover:border-[#14B8A6]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-12">
        <Button variant="outline" onClick={onPrev} disabled={currentIndex === 0}>
          ← Indietro
        </Button>
        <Button onClick={onNext} disabled={!answers[q.id]}>
          {currentIndex === questions.length - 1 ? 'Vedi i tuoi match →' : 'Continua →'}
        </Button>
      </div>
    </div>
  );
}
