// lib/matching.ts
import { questions } from './questions';

export function calculateCompatibility(answers: Record<number, any>, therapist: any): number {
  let score = 0;

  // 1. Problema principale (28%)
  const problemAnswer = answers[1];
  if (problemAnswer && therapist.specialties?.some((s: string) =>
    problemAnswer.toLowerCase().includes(s.toLowerCase()) ||
    s.toLowerCase().includes(problemAnswer.toLowerCase())
  )) {
    score += 28;
  }

  // 2. Intensità (12%) - bonus se il terapeuta ha esperienza con problemi gravi
  if (answers[2] && answers[2] >= 7) {
    score += 12 * 0.8; // bonus per terapeuti con esperienza su casi intensi
  } else {
    score += 12 * 0.4;
  }

  // 3. Orientamento (20%)
  const orientationAnswer = answers[3];
  if (orientationAnswer && therapist.orientations?.includes(orientationAnswer)) {
    score += 20;
  } else if (orientationAnswer === "Non lo so") {
    score += 12; // bonus parziale
  }

  // 4. Stile (10%)
  const styleAnswer = answers[4];
  if (styleAnswer === "Direttivo con compiti" && therapist.style_scores?.directive >= 7) {
    score += 10;
  } else if (styleAnswer === "Esplorativo e riflessivo" && therapist.style_scores?.exploratory >= 7) {
    score += 10;
  } else {
    score += 6;
  }

  // 5. Empatia (8%)
  if (answers[5] && answers[5] >= 8) {
    score += 8;
  } else if (answers[5] && answers[5] >= 5) {
    score += 5;
  }

  // 6. Genere (7%)
  if (answers[6] === "Non importa" || answers[6] === therapist.gender) {
    score += 7;
  }

  // 7. Età terapeuta (6%)
  if (answers[7] === "Non importa" || answers[7] === therapist.age_range) {
    score += 6;
  }

  // 8. Budget (5%)
  const budgetAnswer = answers[8];
  if (budgetAnswer) {
    const maxBudget = parseInt(budgetAnswer.split(" ")[1]) || 80;
    if (therapist.hourly_rate <= maxBudget) {
      score += 5;
    }
  }

  // 9-10. Bonus minori
  score += (answers[9] ? 2 : 0);
  score += (answers[10] ? 2 : 0);

  // Normalizzazione finale
  return Math.min(98, Math.round(score));
}

export function getMatchReasons(answers: Record<number, any>, therapist: any): string[] {
  const reasons: string[] = [];

  if (answers[1] && therapist.specialties?.some((s: string) =>
    answers[1].toLowerCase().includes(s.toLowerCase()))) {
    reasons.push(`Specializzato in ${answers[1]}`);
  }

  if (answers[3] && therapist.orientations?.includes(answers[3])) {
    reasons.push(`Approccio ${answers[3]} molto allineato con le tue preferenze`);
  }

  if (answers[4] && therapist.style_scores) {
    reasons.push(`Stile terapeutico compatibile con la tua richiesta`);
  }

  if (answers[5] && answers[5] >= 8) {
    reasons.push(`Alto livello di empatia percepito`);
  }

  if (therapist.hourly_rate) {
    reasons.push(`Tariffa di ${therapist.hourly_rate}€ allineata al tuo budget`);
  }

  return reasons.length > 0 ? reasons : ["Alta compatibilità generale"];
}
