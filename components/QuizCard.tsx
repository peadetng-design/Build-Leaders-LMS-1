import React, { useState, useEffect } from 'react';
import { Quiz, QuizOption } from '../types';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onAttempt: (quizId: string, optionId: string, isCorrect: boolean) => void;
  previousAttempt?: string | null; // Option ID if already attempted
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onAttempt, previousAttempt }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(previousAttempt || null);

  useEffect(() => {
    setSelectedOptionId(previousAttempt || null);
  }, [previousAttempt]);

  const handleSelect = (option: QuizOption) => {
    if (selectedOptionId) return; // Prevent changing answer after selection
    setSelectedOptionId(option.option_id);
    onAttempt(quiz.quiz_id, option.option_id, option.is_correct);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Question Header */}
      <div className="p-6 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
             {quiz.question_type}
           </span>
           {quiz.reference && (
             <span className="text-xs text-gray-500 font-mono">{quiz.reference}</span>
           )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 leading-snug">
          {quiz.question_text}
        </h3>
      </div>

      {/* Options List */}
      <div className="p-6 space-y-3">
        {quiz.options.map((option) => {
          const isSelected = selectedOptionId === option.option_id;
          const isCorrect = option.is_correct;
          const showResults = !!selectedOptionId;

          let containerClass = "relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ";
          
          if (!showResults) {
            containerClass += "hover:bg-indigo-50 border-gray-200 hover:border-indigo-300";
          } else {
            // Results Mode
            if (isCorrect) {
              containerClass += "bg-green-50 border-green-500 ring-1 ring-green-500";
            } else if (isSelected && !isCorrect) {
              containerClass += "bg-red-50 border-red-500";
            } else {
              containerClass += "opacity-60 border-gray-100 bg-gray-50";
            }
          }

          return (
            <div 
              key={option.option_id}
              onClick={() => handleSelect(option)}
              className={containerClass}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`
                    flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border text-xs font-bold mr-3
                    ${!showResults ? 'border-gray-400 text-gray-500' : 
                      isCorrect ? 'bg-green-500 border-green-500 text-white' : 
                      (isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 text-gray-400')}
                  `}>
                    {option.option_id}
                  </div>
                  <span className={`font-medium ${showResults && isCorrect ? 'text-green-900' : 'text-gray-900'}`}>
                    {option.text}
                  </span>
                </div>
                
                {/* Status Icon */}
                {showResults && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {showResults && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
              </div>

              {/* Explanation Reveal */}
              {showResults && (
                <div className={`mt-3 pt-3 border-t text-sm flex items-start animate-fadeIn
                  ${isCorrect ? 'border-green-200 text-green-800' : 'border-gray-200 text-gray-600'}
                `}>
                  <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 opacity-70" />
                  <span>{option.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};