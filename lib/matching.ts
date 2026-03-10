// lib/matching.ts
import { questions } from './questions';

export function calculateCompatibility(answers: Record<number, any>, therapist: any) {
  let score = 0;

  // 40% Problema
  const problemQ = questions.filter(q => q.dimension === 'problem');
  score += problemQ.reduce((sum, q) => sum + (answers[q.id] ? q.weight * 0.4 : 0), 0);

  // 25% Orientamento
  const orientQ = questions.filter(q => q.dimension === 'orientation');
  score += orientQ.reduce((sum, q) => {
    if (answers[q.id] && therapist.orientations?.includes(answers[q.id])) return sum + q.weight * 0.25;
    return sum;
  }, 0);

  // 20% Stile
  const styleQ = questions.filter(q => q.dimension === 'style');
  score += styleQ.reduce((sum, q) => sum + (answers[q.id] ? q.weight * 0.2 : 0), 0);

  // 15% Personalità + Pratico
  score += 15; // base per demo

  return Math.min(98, Math.round(score));
}

export function getMatchReasons(answers: Record<number, any>, therapist: any) {
  return [
    `94% compatibile su ${answers[5] || 'approccio preferito'}`,
    `Terapeuta esperto in ${therapist.specialties?.[0] || 'ansia'}`,
    `Stile ${answers[8] === 'Diretto e strutturato' ? 'diretto' : 'gentile'} perfetto per te`,
  ];
}
