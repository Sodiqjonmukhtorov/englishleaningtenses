import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Menu, 
  X,
  Search,
  ArrowRight,
  Info,
  Check,
  Send,
  Loader2,
  Sparkles
} from "lucide-react";
import { TENSES } from "./constants";
import { TenseData } from "./types";
import { checkTranslation, CheckResult } from "./services/aiService";
import AIChat from "./components/AIChat";

export default function App() {
  const [selectedTenseId, setSelectedTenseId] = useState<string>(TENSES[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [checkResults, setCheckResults] = useState<Record<string, CheckResult | null>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const selectedTense = useMemo(() => 
    TENSES.find(t => t.id === selectedTenseId) || TENSES[0],
  [selectedTenseId]);

  const filteredTenses = useMemo(() => 
    TENSES.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
  [searchQuery]);

  const toggleAnswer = (index: number) => {
    setShowAnswers(prev => ({
      ...prev,
      [`${selectedTenseId}-${index}`]: !prev[`${selectedTenseId}-${index}`]
    }));
  };

  const handleInputChange = (index: number, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [`${selectedTenseId}-${index}`]: value
    }));
  };

  const handleCheck = async (index: number, uzbekSentence: string) => {
    const answerKey = `${selectedTenseId}-${index}`;
    const userTranslation = userAnswers[answerKey];

    if (!userTranslation || userTranslation.trim() === "") return;

    setLoadingStates(prev => ({ ...prev, [answerKey]: true }));

    try {
      const result = await checkTranslation(uzbekSentence, userTranslation, selectedTense.title);
      setCheckResults(prev => ({ ...prev, [answerKey]: result }));
    } catch (error) {
      console.error("Error checking translation:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [answerKey]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100 pt-8">
      {/* Creator Banner */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-blue-700 text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] z-[60] shadow-sm">
        Sodiqjon Mukhtorov tomonidan yaratilgan
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-8 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">English Tenses</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <div className="flex relative">
        {/* Sidebar */}
        <aside className={`
          fixed top-8 bottom-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-32px)]
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 hidden lg:block">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl leading-tight">English Tenses</h1>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Master Guide</p>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Zamonni qidirish..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-1 custom-scrollbar">
              {filteredTenses.map((tense) => (
                <button
                  key={tense.id}
                  onClick={() => {
                    setSelectedTenseId(tense.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group
                    ${selectedTenseId === tense.id 
                      ? "bg-blue-50 text-blue-700 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                  `}
                >
                  <span className="truncate">{tense.title}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${selectedTenseId === tense.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <div className="bg-blue-600 rounded-2xl p-4 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-xs font-semibold opacity-80 mb-1">Pro Tip</p>
                  <p className="text-sm font-medium leading-relaxed">
                    Har bir zamonni misollar bilan o'rganing!
                  </p>
                </div>
                <Zap className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 h-[calc(100vh-32px)] overflow-y-auto bg-white lg:bg-[#F8F9FA] custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 py-8 lg:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTenseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-10"
              >
                {/* Hero Section */}
                <section>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    <Info className="w-3.5 h-3.5" />
                    English Grammar
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
                    {selectedTense.title}
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                    {selectedTense.description}
                  </p>
                </section>

                {/* Usage Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedTense.usage.map((use, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{use}</p>
                    </div>
                  ))}
                </section>

                {/* Formula Section */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 lg:p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      Eng oson formulasi
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-0">✅ Oddiy gap</span>
                        <code className="text-lg font-mono font-bold text-blue-600">{selectedTense.formula.positive}</code>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-0">❌ Inkor gap</span>
                        <code className="text-lg font-mono font-bold text-red-500">{selectedTense.formula.negative}</code>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-0">❓ Savol gap</span>
                        <code className="text-lg font-mono font-bold text-green-600">{selectedTense.formula.question}</code>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Examples & Rules */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                      Misollar
                    </h3>
                    <div className="space-y-3">
                      {selectedTense.examples.map((ex, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group hover:border-blue-200 transition-colors">
                          <p className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{ex.en}</p>
                          <p className="text-sm text-gray-500 font-medium italic">→ {ex.uz}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      Muhim qoidalar
                    </h3>
                    <div className="bg-orange-50/50 rounded-3xl p-6 border border-orange-100">
                      <ul className="space-y-4">
                        {selectedTense.rules?.map((rule, idx) => (
                          <li key={idx} className="flex gap-3 text-sm font-medium text-gray-700 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </div>

                {/* Signal Words */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    Signal so'zlar
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTense.signalWords.map((word, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all cursor-default">
                        {word}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Common Mistakes */}
                <section className="bg-red-50/30 rounded-3xl border border-red-100 p-6 lg:p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    Eng ko'p uchraydigan xatolar 🚫
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTense.commonMistakes.map((mistake, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
                        <div className="flex items-center gap-2 text-red-500 mb-2">
                          <X className="w-4 h-4" />
                          <span className="text-sm font-bold line-through opacity-60">{mistake.wrong}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-bold">{mistake.correct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Mini Exercise */}
                <section className="bg-blue-600 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-blue-200">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Mini mashq (o'zing sinab ko'r) 🧠
                  </h3>
                  <div className="space-y-4">
                    {selectedTense.miniExercise.map((item, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-medium">{item.question}</p>
                          <button 
                            onClick={() => toggleAnswer(idx)}
                            className="shrink-0 px-4 py-1.5 bg-white text-blue-600 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors"
                          >
                            {showAnswers[`${selectedTenseId}-${idx}`] ? "Yashirish" : "Javobni ko'rish"}
                          </button>
                        </div>
                        <AnimatePresence>
                          {showAnswers[`${selectedTenseId}-${idx}`] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 mt-3 border-t border-white/10 flex items-center gap-2 text-blue-100 font-bold italic">
                                <ArrowRight className="w-4 h-4" />
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Practice Section */}
                <section className="space-y-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                      Amaliyot: Tarjima qiling
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">AI Teacher</span>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    Quyidagi o'zbekcha gaplarni ingliz tiliga tarjima qiling. Bizning AI o'qituvchimiz 
                    sizning javoblaringizni tekshirib, xatolaringizni tushuntirib beradi.
                  </p>

                  <div className="space-y-6">
                    {selectedTense.practiceSentences?.map((sentence, idx) => {
                      const answerKey = `${selectedTenseId}-${idx}`;
                      const result = checkResults[answerKey];
                      const isLoading = loadingStates[answerKey];

                      return (
                        <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                          <div className="p-6 lg:p-8 space-y-6">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-1">
                                <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                              </div>
                              <p className="text-lg font-bold text-gray-800 leading-tight">{sentence}</p>
                            </div>

                            <div className="relative">
                              <input 
                                type="text"
                                placeholder="Inglizcha tarjimangizni yozing..."
                                value={userAnswers[answerKey] || ""}
                                onChange={(e) => handleInputChange(idx, e.target.value)}
                                disabled={isLoading}
                                className={`
                                  w-full pl-6 pr-16 py-4 bg-gray-50 border-2 rounded-2xl text-lg transition-all focus:outline-none focus:ring-4
                                  ${result 
                                    ? result.isCorrect 
                                      ? "border-green-200 focus:ring-green-500/10 focus:border-green-500" 
                                      : "border-red-200 focus:ring-red-500/10 focus:border-red-500"
                                    : "border-gray-100 focus:ring-blue-500/10 focus:border-blue-500"
                                  }
                                `}
                              />
                              <button 
                                onClick={() => handleCheck(idx, sentence)}
                                disabled={isLoading || !userAnswers[answerKey]}
                                className={`
                                  absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all
                                  ${isLoading || !userAnswers[answerKey]
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                                  }
                                `}
                              >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                              </button>
                            </div>

                            <AnimatePresence>
                              {result && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  className="overflow-hidden"
                                >
                                  <div className={`mt-4 p-5 rounded-2xl border-l-4 space-y-3 ${result.isCorrect ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
                                    <div className="flex items-center gap-3">
                                      {result.isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
                                      <span className={`font-bold ${result.isCorrect ? "text-green-700" : "text-red-700"}`}>
                                        {result.isCorrect ? "Barakalla!" : "Xato bor"}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 text-base leading-relaxed font-medium">{result.feedback}</p>
                                    {!result.isCorrect && (
                                      <div className="pt-3 border-t border-gray-200/50">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">To'g'ri variant:</span>
                                        <p className="text-green-700 font-bold font-mono">{result.correctAnswer}</p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Lifehack */}
                <section className="bg-yellow-50 rounded-3xl border border-yellow-200 p-6 lg:p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-yellow-800">
                      <Zap className="w-5 h-5 fill-yellow-500" />
                      🔥 LIFEHACK
                    </h3>
                    <p className="text-xl font-black text-yellow-900 uppercase tracking-tight">
                      {selectedTense.lifehack}
                    </p>
                  </div>
                  <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-yellow-200 opacity-50 rotate-12" />
                </section>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AIChat />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
}

