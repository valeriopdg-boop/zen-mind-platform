// lib/questions.ts
export type Question = {
  id: number;
  block: string;
  text: string;
  type: 'single' | 'multi' | 'scale';
  options?: string[];
  weight: number;           // peso nell'algoritmo (totale 100%)
  dimension: 'problem' | 'orientation' | 'style' | 'personality' | 'practical';
};

export const questions: Question[] = [
  // BLOCCO 1 – Il Problema Principale (peso 40%)
  { id: 1, block: "Problema Principale", text: "Qual è il motivo principale per cui stai cercando supporto psicologico?", type: "single", options: ["Ansia / Attacchi di panico", "Depressione / Umore basso", "Relazioni / Coppia / Famiglia", "Autostima / Insicurezza", "Burnout / Stress lavoro", "Traumi / Eventi passati", "Difficoltà a dormire", "Altro"], weight: 25, dimension: "problem" },
  { id: 2, block: "Problema Principale", text: "Quanto è intenso questo problema in questo momento? (1 = leggero, 10 = insopportabile)", type: "scale", weight: 10, dimension: "problem" },
  { id: 3, block: "Problema Principale", text: "Da quanto tempo lo stai vivendo?", type: "single", options: ["Meno di 1 mese", "1-3 mesi", "3-6 mesi", "Più di 6 mesi"], weight: 3, dimension: "problem" },
  { id: 4, block: "Problema Principale", text: "Hai già fatto terapia prima?", type: "single", options: ["Sì, più volte", "Sì, una volta", "No, mai"], weight: 2, dimension: "problem" },

  // BLOCCO 2 – Scuola di Pensiero (peso 25%)
  { id: 5, block: "Scuola di Pensiero", text: "Quale approccio terapeutico ti attira di più?", type: "single", options: ["Cognitivo-Comportamentale (CBT)", "Schema Therapy", "EMDR (traumi)", "Psicodinamica / Psicoanalisi", "Sistemica / Familiare", "Umanistica / Gestalt", "Mindfulness / Acceptance", "Non lo so, voglio il più efficace"], weight: 15, dimension: "orientation" },
  { id: 6, block: "Scuola di Pensiero", text: "Preferisci lavorare soprattutto sul presente o anche sul passato?", type: "single", options: ["Soprattutto presente", "Passato e presente", "Principalmente passato"], weight: 5, dimension: "orientation" },
  { id: 7, block: "Scuola di Pensiero", text: "Vuoi esercizi pratici e compiti a casa?", type: "single", options: ["Sì, tanti", "Qualche volta", "No, preferisco parlare"], weight: 5, dimension: "orientation" },

  // BLOCCO 3 – Stile Terapeutico (peso 20%)
  { id: 8, block: "Stile Terapeutico", text: "Preferisci un terapeuta che ti dia indicazioni dirette o che ti accompagni a scoprire da solo?", type: "single", options: ["Diretto e strutturato", "Equilibrato", "Gentile e esplorativo"], weight: 8, dimension: "style" },
  { id: 9, block: "Stile Terapeutico", text: "Quanto è importante per te che il terapeuta sia empatico e caloroso?", type: "scale", weight: 6, dimension: "style" },
  { id: 10, block: "Stile Terapeutico", text: "Vuoi sessioni molto strutturate o più libere?", type: "single", options: ["Molto strutturate", "Miste", "Libere"], weight: 6, dimension: "style" },

  // BLOCCO 4 – Personalità & Valori (peso 10%)
  { id: 11, block: "Personalità", text: "Età preferita del terapeuta", type: "single", options: ["Under 35", "35-45", "Over 45", "Non importa"], weight: 3, dimension: "personality" },
  { id: 12, block: "Personalità", text: "Genere preferito", type: "single", options: ["Donna", "Uomo", "Non importa"], weight: 2, dimension: "personality" },
  { id: 13, block: "Personalità", text: "Hai preferenze su orientamento sessuale o identità del terapeuta?", type: "single", options: ["Sì, specifico", "No, non importa"], weight: 2, dimension: "personality" },
  { id: 14, block: "Personalità", text: "Quanto è importante per te che il terapeuta condivida i tuoi valori (spirituali, politici, ecc.)?", type: "scale", weight: 3, dimension: "personality" },

  // BLOCCO 5 – Aspetti Pratici (peso 5%)
  { id: 15, block: "Pratico", text: "Modalità preferita", type: "single", options: ["Solo online", "Ibrido (online + studio)", "Solo in studio"], weight: 2, dimension: "practical" },
  { id: 16, block: "Pratico", text: "Budget massimo per seduta", type: "single", options: ["Fino a 45€", "Fino a 55€", "Fino a 65€", "Non ho limiti"], weight: 1, dimension: "practical" },
  { id: 17, block: "Pratico", text: "Quando vorresti iniziare?", type: "single", options: ["Entro 1 settimana", "Entro 2-3 settimane", "Quando trovo la persona giusta"], weight: 1, dimension: "practical" },
  { id: 18, block: "Pratico", text: "Disponibilità oraria preferita", type: "multi", options: ["Mattina", "Pomeriggio", "Sera", "Weekend"], weight: 1, dimension: "practical" },

  // Domande finali (per raffinare)
  { id: 19, block: "Finale", text: "C'è qualcosa di specifico che vorresti dire al tuo futuro terapeuta?", type: "single", options: ["Sì, scriverò un messaggio", "No, va bene così"], weight: 0, dimension: "problem" },
  { id: 20, block: "Finale", text: "Accetti che Zen Mind trattiene solo 10€ a seduta e il resto va interamente al terapeuta?", type: "single", options: ["Sì, chiaro", "Vorrei capire meglio"], weight: 0, dimension: "practical" },
];
