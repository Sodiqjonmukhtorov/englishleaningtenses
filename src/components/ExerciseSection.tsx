import React, { useState, useEffect } from "react";
import { Exercise } from "../types";
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Sparkles,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExerciseSectionProps {
  exercises: Exercise[];
  tenseTitle: string;
}

export default function ExerciseSection({ exercises, tenseTitle }: ExerciseSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fillValue, setFillValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const currentExercise = exercises[currentIndex];

  useEffect(() => {
    // Reset state when tense or question changes
    setSelectedOption(null);
    setFillValue("");
    setIsSubmitted(false);
    setIsCorrect(null);
  }, [currentIndex, tenseTitle]);

  const handleSubmit = () => {
    if (isSubmitted) return;

    let correct = false;
    if (currentExercise.type === "multiple-choice") {
      correct = selectedOption === currentExercise.correctAnswer;
    } else {
      const userAns = fillValue.trim().toLowerCase().replace(/[.?!]/g, "");
      const correctAns = currentExercise.correctAnswer.toLowerCase().replace(/[.?!]/g, "");
      correct = userAns === correctAns;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    if (correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const resetExercises = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowSummary(false);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  if (showSummary) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-xl"
      >
        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Mashq yakunlandi!</h3>
        <p className="text-gray-500 mb-8">Siz {exercises.length} tadan {score} ta to'g'ri javob berdingiz.</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={resetExercises}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Qayta urinish
          </button>
        </div>
      </motion.div>
    );
  }

  if (!currentExercise) return null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold">Interaktiv Mashq</h3>
        </div>
        <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
          {currentIndex + 1} / {exercises.length}
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            {currentExercise.type.replace(/-/g, " ")}
          </div>
          <p className="text-xl font-bold text-gray-900 leading-tight">
            {currentExercise.question}
          </p>
        </div>

        <div className="space-y-3">
          {currentExercise.type === "multiple-choice" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentExercise.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => !isSubmitted && setSelectedOption(option)}
                  disabled={isSubmitted}
                  className={`
                    w-full px-6 py-4 rounded-2xl border-2 text-left font-bold transition-all
                    ${selectedOption === option 
                      ? isSubmitted 
                        ? option === currentExercise.correctAnswer 
                          ? "border-green-500 bg-green-50 text-green-700" 
                          : "border-red-500 bg-red-50 text-red-700"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isSubmitted && option === currentExercise.correctAnswer
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-gray-100 text-gray-600 hover:border-gray-300"
                    }
                  `}
                >
                  <span className="flex items-center justify-between">
                    {option}
                    {isSubmitted && option === currentExercise.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {isSubmitted && selectedOption === option && option !== currentExercise.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Bu yerga yozing..."
                value={fillValue}
                onChange={(e) => setFillValue(e.target.value)}
                disabled={isSubmitted}
                className={`
                  w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl text-lg font-bold transition-all focus:outline-none focus:ring-4
                  ${isSubmitted 
                    ? isCorrect 
                      ? "border-green-200 bg-green-50 focus:ring-green-500/10" 
                      : "border-red-200 bg-red-50 focus:ring-red-500/10"
                    : "border-gray-100 focus:ring-blue-500/10 focus:border-blue-500"
                  }
                `}
              />
            </div>
          )}
        </div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className={`p-5 rounded-2xl border-l-4 space-y-2 ${isCorrect ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}
            >
              <div className="flex items-center gap-2 py-1">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                <span className={`font-bold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "Juda yaxshi!" : "Noto'g'ri javob"}
                </span>
              </div>
              {!isCorrect && (
                <div className="text-gray-700 text-sm">
                  To'g'ri javob: <span className="font-bold text-green-700">{currentExercise.correctAnswer}</span>
                </div>
              )}
              {currentExercise.explanation && (
                <p className="text-gray-600 text-sm leading-relaxed italic border-t border-gray-200/50 pt-2">
                  "{currentExercise.explanation}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          {!isSubmitted ? (
            <button 
              onClick={handleSubmit}
              disabled={!selectedOption && !fillValue}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              Tekshirish
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              Keyingisi
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
