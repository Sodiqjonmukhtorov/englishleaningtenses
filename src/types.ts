export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'translation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

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
  interactiveExercises?: Exercise[];
}
