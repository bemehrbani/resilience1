import React, { useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, QUESTIONS, SCORING_RESULTS } from '../constants';
import QuestionCard from '../components/QuestionCard';
import ResultModal from '../components/ResultModal';
import { ScoreResult } from '../types';
import { Calculator, AlertTriangle, CheckCircle2, Save, Building } from 'lucide-react';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [orgName, setOrgName] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // For category navigation

  // Calculate total score
  const totalScore = useMemo(() => {
    return (Object.values(answers) as number[]).reduce((sum, current) => sum + current, 0);
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredCount / QUESTIONS.length) * 100);

  const handleAnswer = useCallback((questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (showIncompleteAlert) setShowIncompleteAlert(false);
  }, [showIncompleteAlert]);

  const resultData: ScoreResult = useMemo(() => {
    const found = SCORING_RESULTS.find(r => totalScore >= r.min && totalScore <= r.max);
    return found || SCORING_RESULTS[SCORING_RESULTS.length - 1];
  }, [totalScore]);

  const saveToDatabase = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Calculate category breakdown
      const categoryScores: Record<string, number> = {};
      CATEGORIES.forEach(cat => {
        const catQuestions = QUESTIONS.filter(q => q.categoryId === cat.id);
        const catTotal = catQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
        categoryScores[cat.title] = catTotal;
      });

      const { error } = await supabase.from('assessments').insert({
        user_id: user.id,
        organization_name: orgName || "سازمان من",
        score: totalScore,
        answers: answers,
        category_scores: categoryScores
      });

      if (error) throw error;
      
    } catch (err) {
      console.error("Error saving assessment", err);
      alert("خطا در ذخیره سازی اطلاعات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculate = async () => {
    if (answeredCount < QUESTIONS.length) {
      setShowIncompleteAlert(true);
      return;
    }
    await saveToDatabase();
    setShowResult(true);
  };

  const handleCloseResult = () => {
    navigate('/'); // Go back to dashboard
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Organization Name Input */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">نام سازمان / پروژه</label>
        <div className="relative">
            <Building className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            <input 
                type="text" 
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="مثلاً: شرکت فناوری اطلاعات نوین..."
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-12">
        {CATEGORIES.map((category) => {
          const categoryQuestions = QUESTIONS.filter(q => q.categoryId === category.id);
          const answeredInCategory = categoryQuestions.filter(q => answers[q.id]).length;
          const isComplete = answeredInCategory === categoryQuestions.length;

          return (
            <section key={category.id} className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-3 sticky top-16 bg-gray-50 z-10 py-2">
                <div>
                   <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-md">{category.id}</span>
                    {category.title}
                  </h2>
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
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-4 z-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>پیشرفت تکمیل</span>
                <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isSaving}
            className={`
              w-full md:w-auto min-w-[200px] flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95
              ${answeredCount === QUESTIONS.length 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-indigo-200 hover:-translate-y-1' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isSaving ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                <Calculator className="w-6 h-6" />
                ثبت و محاسبه
                </>
            )}
          </button>
        </div>
        {showIncompleteAlert && (
           <div className="text-center mt-2 text-red-600 text-sm font-bold animate-bounce">
             لطفا به تمام سوالات پاسخ دهید.
           </div>
        )}
      </div>

      {/* Result Modal */}
      {showResult && (
        <ResultModal 
          score={totalScore} 
          result={resultData} 
          onClose={handleCloseResult}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default Assessment;