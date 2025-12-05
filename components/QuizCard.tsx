import React, { useState, useEffect } from 'react';
import { Quiz, QuizOption } from '../types';
import { CheckCircle2, XCircle, Info, Circle, AlertCircle, Check } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onAttempt: (quizId: string, optionId: string, isCorrect: boolean) => void;
  previousAttempt?: string | null; // Option ID if already attempted
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onAttempt, previousAttempt }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(previousAttempt || null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!previousAttempt);

  useEffect(() => {
    if (previousAttempt) {
      setSelectedOptionId(previousAttempt);
      setIsSubmitted(true);
    }
  }, [previousAttempt]);

  const handleSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    
    setIsSubmitted(true);
    const selectedOption = quiz.options.find(o => o.option_id === selectedOptionId);
    if (selectedOption) {
      onAttempt(quiz.quiz_id, selectedOption.option_id, selectedOption.is_correct);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 transition-all duration-300">
      {/* Question Header */}
      <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100">
        <div className="flex flex-wrap gap-2 mb-4">
           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm
             ${quiz.question_type === 'Bible Quiz' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
             {quiz.question_type}
           </span>
           {quiz.reference && (
             <span className="text-xs text-gray-600 font-mono bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm flex items-center">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
               {quiz.reference}
             </span>
           )}
        </div>
        <h3 className="text-lg md:text-xl font-serif text-gray-900 leading-relaxed font-medium">
          {quiz.question_text}
        </h3>
      </div>

      {/* Options List */}
      <div className="p-6 md:p-8 space-y-4">
        <div role="radiogroup" aria-label="Quiz Options">
          {quiz.options.map((option) => {
            const isSelected = selectedOptionId === option.option_id;
            const isCorrect = option.is_correct;
            const isWrongSelection = isSelected && !isCorrect;
            
            // --- STYLING LOGIC ---
            let containerClass = "relative flex flex-col p-4 rounded-xl border-2 transition-all duration-200 ";
            let icon = <Circle className="h-6 w-6 text-gray-300 transition-colors" />;
            let textClass = "text-gray-700 text-lg";
            let badge = null;

            if (!isSubmitted) {
              // 1. PRE-SUBMIT (Interactive)
              if (isSelected) {
                 containerClass += "cursor-pointer bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-500/20 transform scale-[1.01]";
                 icon = <div className="h-6 w-6 rounded-full border-[6px] border-indigo-600 bg-white"></div>;
                 textClass = "text-indigo-900 font-medium";
              } else {
                 containerClass += "cursor-pointer bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50";
              }
            } else {
              // 2. POST-SUBMIT (Locked/Feedback)
              containerClass += "cursor-default ";
              
              if (isCorrect) {
                // CORRECT OPTION (Always Green)
                containerClass += "bg-green-50/50 border-soft-olive ring-1 ring-green-500/10";
                icon = <CheckCircle2 className="h-6 w-6 text-soft-olive fill-green-50" aria-label="Correct Answer" />;
                textClass = "text-green-900 font-medium";
                badge = (
                  <span className="ml-auto inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wide">
                    Correct
                  </span>
                );
              } else if (isWrongSelection) {
                // SELECTED WRONG OPTION (Red)
                containerClass += "bg-red-50/50 border-muted-crimson ring-1 ring-red-500/10";
                icon = <XCircle className="h-6 w-6 text-muted-crimson fill-red-50" aria-label="Incorrect Selection" />;
                textClass = "text-red-900 font-medium";
                badge = (
                  <span className="ml-auto inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-800 uppercase tracking-wide">
                    Your Answer
                  </span>
                );
              } else {
                // UNSELECTED WRONG OPTIONS (Dimmed)
                containerClass += "bg-gray-50 border-gray-100 opacity-50 grayscale";
                icon = <Circle className="h-6 w-6 text-gray-200" aria-hidden="true" />;
                textClass = "text-gray-500";
              }
            }

            return (
              <div 
                key={option.option_id}
                onClick={!isSubmitted ? () => handleSelect(option.option_id) : undefined}
                className={containerClass}
                role={isSubmitted ? "article" : "radio"}
                aria-checked={isSelected}
                aria-disabled={isSubmitted}
                tabIndex={isSubmitted ? -1 : 0}
                onKeyDown={(e) => {
                  if (!isSubmitted && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSelect(option.option_id);
                  }
                }}
              >
                {/* Option Header */}
                <div className={`flex items-center ${isSubmitted ? 'pointer-events-none' : ''}`}>
                  <div className="flex-shrink-0 mr-4">
                    {icon}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`block ${textClass} transition-colors duration-200`}>
                      <span className="font-bold mr-2 opacity-50 text-sm align-top">{option.option_id}.</span>
                      {option.text}
                    </span>
                    {badge}
                  </div>
                </div>

                {/* EXPLANATION REVEAL (Only show if submitted) */}
                {isSubmitted && (
                  <div className={`
                     mt-3 pt-3 pl-10 border-t border-dashed text-sm leading-relaxed
                     animate-slideDown origin-top cursor-text pointer-events-auto
                     ${isCorrect ? 'border-green-200 text-green-800' : (isWrongSelection ? 'border-red-200 text-red-800' : 'border-gray-200 text-gray-500')}
                  `}>
                    <div className="flex gap-2">
                       <div className="flex-shrink-0 mt-0.5">
                         {isCorrect ? <Info className="h-4 w-4" /> : <div className="w-4" />}
                       </div>
                       <div>
                         <span className="font-bold text-xs uppercase tracking-wider opacity-70 block mb-1">Explanation</span>
                         <div 
                           className="prose prose-sm max-w-none"
                           dangerouslySetInnerHTML={{ __html: option.explanation }} 
                         />
                       </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Bar */}
      {!isSubmitted && (
        <div className="px-6 pb-6 md:px-8 md:pb-8 flex justify-end animate-fadeIn">
          <button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
            className={`
              flex items-center px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-200 shadow-sm
              ${selectedOptionId 
                ? 'bg-scripture-blue text-white hover:bg-indigo-800 hover:shadow-md transform hover:-translate-y-0.5' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            Submit Answer <Check className="ml-2 h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};