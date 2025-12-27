import React, { useState, useMemo, useCallback } from 'react';
import { CATEGORIES, QUESTIONS, SCORING_RESULTS } from './constants';
import QuestionCard from './components/QuestionCard';
import ResultModal from './components/ResultModal';
import { ScoreResult } from './types';
import { ShieldCheck, Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);

  // Calculate total score
  const totalScore = useMemo(() => {
    return (Object.values(answers) as number[]).reduce((sum, current) => sum + current, 0);
  }, [answers]);

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredCount / QUESTIONS.length) * 100);

  // Handle answering a question
  const handleAnswer = useCallback((questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Dismiss alert if user starts answering again
    if (showIncompleteAlert) setShowIncompleteAlert(false);
  }, [showIncompleteAlert]);

  // Handle Calculation
  const handleCalculate = () => {
    if (answeredCount < QUESTIONS.length) {
      setShowIncompleteAlert(true);
      // Optional: scroll to first unanswered question?
      // For now, just show alert.
      return;
    }
    setShowResult(true);
  };

  // Determine Result
  const resultData: ScoreResult = useMemo(() => {
    const found = SCORING_RESULTS.find(r => totalScore >= r.min && totalScore <= r.max);
    return found || SCORING_RESULTS[SCORING_RESULTS.length - 1]; // Fallback to lowest
  }, [totalScore]);

  // Reset Assessment
  const handleReset = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید تمام پاسخ‌ها را پاک کنید؟")) {
      setAnswers({});
      setShowResult(false);
      setShowIncompleteAlert(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-gradient-to-l from-indigo-900 via-blue-900 to-indigo-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-white/10 p-2 md:p-3 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">چک‌لیست ارزیابی تاب‌آوری سازمان</h1>
              <p className="text-indigo-200 text-xs md:text-sm mt-1 font-light tracking-wide">رهیاران مسیر اعتماد - نسخه دیجیتال</p>
            </div>
          </div>
          
          {/* Progress Bar in Header */}
          <div className="mt-4 md:mt-6 bg-indigo-950/50 rounded-full h-2 overflow-hidden w-full backdrop-blur-sm">
            <div 
              className="bg-emerald-400 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] md:text-xs text-indigo-200">
            <span>پیشرفت تکمیل</span>
            <span>{answeredCount} از {QUESTIONS.length} سوال</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {CATEGORIES.map((category) => {
          const categoryQuestions = QUESTIONS.filter(q => q.categoryId === category.id);
          const answeredInCategory = categoryQuestions.filter(q => answers[q.id]).length;
          const isComplete = answeredInCategory === categoryQuestions.length;

          return (
            <section key={category.id} className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-3">
                <div>
                   <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-md">{category.id}</span>
                    {category.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 mr-10">{category.description}</p>
                </div>
                {isComplete && (
                  <CheckCircle2 className="text-emerald-500 w-6 h-6 animate-pulse" />
                )}
              </div>
              
              <div className="space-y-4">
                {categoryQuestions.map((q, idx) => (
                  <QuestionCard
                    key={q.id}
                    index={idx + 1}
                    question={q}
                    selectedValue={answers[q.id]}
                    onAnswer={handleAnswer}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-4 z-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-center md:text-right w-full md:w-auto">
             {showIncompleteAlert && (
               <div className="flex items-center justify-center md:justify-start gap-2 text-red-600 text-sm font-bold animate-bounce mb-2 md:mb-0">
                 <AlertTriangle className="w-4 h-4" />
                 لطفا به تمام ۴۰ سوال پاسخ دهید.
               </div>
             )}
             {!showIncompleteAlert && (
               <div className="text-gray-500 text-sm hidden md:block">
                 برای مشاهده نتیجه دکمه محاسبه را بزنید
               </div>
             )}
          </div>

          <button
            onClick={handleCalculate}
            className={`
              w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95
              ${answeredCount === QUESTIONS.length 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-indigo-200 hover:-translate-y-1' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Calculator className="w-6 h-6" />
            محاسبه تاب‌آوری
            {answeredCount < QUESTIONS.length && (
              <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                {answeredCount}/{QUESTIONS.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && (
        <ResultModal 
          score={totalScore} 
          result={resultData} 
          onClose={() => setShowResult(false)}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;