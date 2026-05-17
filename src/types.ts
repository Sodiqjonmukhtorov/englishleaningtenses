export interface TenseData {
  id: string;
  title: string;
  description: string;
  usage: string[];
  formula: {
    positive: string;
    negative: string;
    question: string;
  };
  examples: { en: string; uz: string }[];
  rules?: string[];
  signalWords: string[];
  commonMistakes: { wrong: string; correct: string }[];
  miniExercise: { question: string; answer: string }[];
  practiceSentences: string[];
  lifehack: string;
}
