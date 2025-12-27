import React from 'react';
import { ScoreResult } from '../types';
import { XCircle, RefreshCw, Award } from 'lucide-react';

interface ResultModalProps {
  score: number;
  result: ScoreResult;
  onClose: () => void;
  onReset: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ score, result, onClose, onReset }) => {
  // Determine gradient based on result color
  const getGradient = (color: string) => {
    switch (color) {
      case 'green': return 'from-green-500 to-emerald-600';
      case 'blue': return 'from-blue-500 to-indigo-600';
      case 'orange': return 'from-orange-400 to-red-500';
      case 'red': return 'from-red-600 to-rose-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-700 bg-green-50 border-green-200';
      case 'blue': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'orange': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'red': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const percentage = Math.round((score / 200) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className={`p-6 text-white bg-gradient-to-r ${getGradient(result.color)}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6" />
                نتیجه ارزیابی
              </h2>
              <p className="text-white/80 mt-1 text-sm">تحلیل وضعیت تاب‌آوری سازمان شما</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <XCircle className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col items-center justify-center mb-8">
             <div className="relative mb-2">
               <span className={`text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br ${getGradient(result.color)}`}>
                 {score}
               </span>
               <span className="text-gray-400 text-xl absolute -top-2 -left-6">/200</span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-3 mb-2 max-w-xs">
               <div 
                  className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getGradient(result.color)}`} 
                  style={{ width: `${percentage}%` }}
               ></div>
             </div>
             <span className="text-gray-500 text-sm font-medium">{percentage}٪ از کل ظرفیت</span>
          </div>

          <div className={`border-r-4 rounded-l-lg p-5 mb-6 ${getTextColor(result.color)}`}>
            <h3 className="font-bold text-lg mb-2">وضعیت: {result.title}</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              بر اساس امتیاز کسب شده، سازمان شما در محدوده {result.title} قرار دارد.
              {result.color === 'red' && " توجه فوری مدیریت ارشد برای بازنگری در فرآیندها ضروری است."}
              {result.color === 'orange' && " برنامه‌ریزی برای رفع نقاط ضعف شناسایی شده توصیه می‌شود."}
              {result.color === 'blue' && " حفظ وضعیت موجود و تلاش برای بهبود نقاط جزئی پیشنهاد می‌شود."}
              {result.color === 'green' && " سازمان شما از آمادگی بسیار بالایی برای مواجهه با بحران‌ها برخوردار است."}
            </p>
          </div>

          <div className="flex gap-3">
             <button 
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              شروع مجدد
            </button>
            <button 
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 bg-gradient-to-r ${getGradient(result.color)}`}
            >
              متوجه شدم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;