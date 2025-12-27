import React from 'react';
import { Question, LikertOption } from '../types';
import { LIKERT_OPTIONS } from '../constants';

interface QuestionCardProps {
  question: Question;
  selectedValue: number | undefined;
  onAnswer: (questionId: number, value: number) => void;
  index: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedValue, onAnswer, index }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
      <div className="flex items-start mb-4">
        <span className="flex-shrink-0 bg-indigo-50 text-indigo-700 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ml-3">
          {index}
        </span>
        <h3 className="text-gray-800 text-lg font-medium leading-relaxed">
          {question.text}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
        {LIKERT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className={`
              relative px-2 py-3 rounded-lg text-sm font-medium transition-all duration-200 border
              flex flex-col items-center justify-center gap-1
              ${selectedValue === option.value 
                ? `${option.colorClass} border-transparent ring-2 ring-offset-1 ring-indigo-300 shadow-sm` 
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-lg font-bold block">{option.value}</span>
            <span className="text-xs">{option.label}</span>
            
            {selectedValue === option.value && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-sm">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(QuestionCard);