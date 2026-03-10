// lib/questions.ts
export type Question = {
  id: number;
  block: string;
  text: string;
  type: 'single' | 'scale';
  options?: string[];
  weight: number;
  dimension: 'problem' | 'orientation' | 'style' | 'personality' | 'practical';
};

export const questions: Question[] = [
  // 1. Problema principale (28%)
  { id: 1, block: "Problema", text: "Qual è il problema principale per cui stai cercando supporto psicologico?", type: "single",
    options: ["Ansia / Attacchi di panico", "Depressione / Umore basso", "Relazioni / Coppia / Famiglia", "Autostima / Insicurezza", "Burnout / Stress lavoro", "Traumi / Eventi passati", "Difficoltà a dormire", "Altro"],
    weight: 28, dimension: "problem" },

  // 2. Intensità (12%)
  { id: 2, block: "Problema", text: "Quanto è intenso questo problema in questo momento? (1 = leggero, 10 = molto grave)", type: "scale", weight: 12, dimension: "problem" },

  // 3. Orientamento (20%)
  { id: 3, block: "Orientamento", text: "Quale approccio terapeutico ti attira di più?", type: "single",
    options: ["Cognitivo-Comportamentale (CBT)", "Schema Therapy", "EMDR", "Psicodinamica", "Mindfulness / Acceptance", "Sistemica / Familiare", "Umanistica / Gestalt", "Non lo so"],
    weight: 20, dimension: "orientation" },

  // 4. Stile (10%)
  { id: 4, block: "Stile", text: "Preferisci un terapeuta che ti dia consigli pratici e compiti o uno più esplorativo?", type: "single",
    options: ["Direttivo con compiti", "Esplorativo e riflessivo", "Un mix dei due"],
    weight: 10, dimension: "style" },

  // 5. Empatia (8%)
  { id: 5, block: "Relazione", text: "Quanto è importante per te che il terapeuta sia empatico e caldo?", type: "scale", weight: 8, dimension: "style" },

  // 6. Genere (7%)
  { id: 6, block: "Preferenze", text: "Hai una preferenza sul genere del terapeuta?", type: "single",
    options: ["Donna", "Uomo", "Non importa"],
    weight: 7, dimension: "personality" },

  // 7. Età terapeuta (6%)
  { id: 7, block: "Preferenze", text: "Preferisci un terapeuta under 40, tra 40-55 anni, o non ti importa?", type: "single",
    options: ["Under 40", "40-55 anni", "Non importa"],
    weight: 6, dimension: "personality" },

  // 8. Budget (5%)
  { id: 8, block: "Pratico", text: "Qual è il tuo budget massimo per singola seduta?", type: "single",
    options: ["Fino a 50€", "Fino a 60€", "Fino a 70€", "Fino a 80€", "Non ho limiti"],
    weight: 5, dimension: "practical" },

  // 9. Focus temporale (2%)
  { id: 9, block: "Approccio", text: "Vuoi lavorare principalmente sul presente o anche sul passato?", type: "single",
    options: ["Principalmente presente", "Anche sul passato"],
    weight: 2, dimension: "orientation" },

  // 10. Esperienza passata (2%)
  { id: 10, block: "Storia", text: "Hai già fatto terapia in passato?", type: "single",
    options: ["Sì, più volte", "Sì, una volta", "No, mai"],
    weight: 2, dimension: "problem" },
];
