import React, { useState, useEffect } from 'react';
import { Quiz, QuizOption } from '../types';
import { CheckCircle2, XCircle, Info, Circle, AlertCircle } from 'lucide-react';

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

  const isAttempted = !!selectedOptionId;

  const handleSelect = (option: QuizOption) => {
    // LOCK: Prevent changing answer after selection (Double check)
    if (isAttempted) return; 
    
    setSelectedOptionId(option.option_id);
    onAttempt(quiz.quiz_id, option.option_id, option.is_correct);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
      {/* Question Header */}
      <div className="p-6 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase
             ${quiz.question_type === 'Bible Quiz' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
             {quiz.question_type}
           </span>
           {quiz.reference && (
             <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200">
               {quiz.reference}
             </span>
           )}
        </div>
        <h3 className="text-lg md:text-xl font-medium text-gray-900 leading-snug">
          {quiz.question_text}
        </h3>
      </div>

      {/* Options List */}
      <div className="p-6 space-y-4">
        {quiz.options.map((option) => {
          const isSelected = selectedOptionId === option.option_id;
          const isCorrect = option.is_correct;
          const isWrongSelection = isSelected && !isCorrect;
          
          // --- STYLING LOGIC ---
          let containerClass = "relative flex flex-col p-4 rounded-xl border-2 transition-all duration-200 ";
          let icon = <Circle className="h-6 w-6 text-gray-300 group-hover:text-indigo-400 transition-colors" />;
          let textClass = "text-gray-700 font-medium text-lg";
          let badge = null;

          if (!isAttempted) {
             // 1. PRE-ATTEMPT STATE (Interactive)
             containerClass += "cursor-pointer bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-sm group";
          } else {
             // 2. POST-ATTEMPT STATE (Locked)
             containerClass += "cursor-default ";
             
             if (isCorrect) {
               // CORRECT OPTION (Always Green)
               containerClass += "bg-green-50 border-green-500 ring-1 ring-green-500/20";
               icon = <CheckCircle2 className="h-6 w-6 text-green-600 fill-green-100" aria-label="Correct Answer" />;
               textClass = "text-green-900 font-bold";
               badge = (
                 <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-200 text-green-800 uppercase tracking-wide">
                   Correct Answer
                 </span>
               );
             } else if (isWrongSelection) {
               // SELECTED WRONG OPTION (Red)
               containerClass += "bg-red-50 border-red-500 ring-1 ring-red-500/20";
               icon = <XCircle className="h-6 w-6 text-red-600 fill-red-100" aria-label="Incorrect Selection" />;
               textClass = "text-red-900 font-bold";
               badge = (
                 <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-200 text-red-800 uppercase tracking-wide">
                   Your Selection
                 </span>
               );
             } else {
               // UNSELECTED WRONG OPTIONS (Dimmed but explicit)
               containerClass += "bg-gray-50 border-gray-100 opacity-60 grayscale";
               icon = <XCircle className="h-6 w-6 text-gray-300" aria-label="Incorrect Option" />;
             }
          }

          return (
            <div 
              key={option.option_id}
              // STRICT LOCK: Remove onClick handler if attempted
              onClick={isAttempted ? undefined : () => handleSelect(option)}
              className={containerClass}
              role={isAttempted ? "article" : "button"}
              aria-disabled={isAttempted}
              tabIndex={isAttempted ? -1 : 0}
              onKeyDown={(e) => {
                if (!isAttempted && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
            >
              {/* Option Header (Icon + Text) */}
              {/* pointer-events-none ensures no hover/click interaction on the visual parts when locked */}
              <div className={`flex items-start ${isAttempted ? 'pointer-events-none' : ''}`}>
                <div className="flex-shrink-0 mt-0.5 mr-4 transition-transform duration-300">
                  {/* Icon or Label */}
                  {isAttempted ? icon : (
                     <div className="h-7 w-7 rounded-full border-2 border-gray-300 text-sm font-bold text-gray-500 flex items-center justify-center group-hover:border-indigo-400 group-hover:text-indigo-600 transition-colors">
                       {option.option_id}
                     </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center">
                    <span className={`block ${textClass} transition-colors duration-200 mr-2`}>
                      {option.text}
                    </span>
                    {badge}
                  </div>
                </div>
              </div>

              {/* EXPLANATION REVEAL (Only show if attempted) */}
              {isAttempted && (
                <div className={`
                   mt-4 pt-3 border-t text-sm leading-relaxed
                   flex items-start gap-3
                   animate-slideDown origin-top cursor-text pointer-events-auto
                   ${isCorrect ? 'border-green-200 text-green-800' : (isSelected ? 'border-red-200 text-red-800' : 'border-gray-200 text-gray-600')}
                `}
                onClick={(e) => e.stopPropagation()} 
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isCorrect ? <Info className="h-5 w-5 text-green-600" /> : (isSelected ? <AlertCircle className="h-5 w-5 text-red-500" /> : <Info className="h-5 w-5 text-gray-400" />)}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold block mb-1 text-xs uppercase tracking-wider opacity-80">
                      {isCorrect ? 'Correct Answer Explanation' : (isSelected ? 'Why this is incorrect' : 'Alternative Option Analysis')}
                    </span>
                    {/* Explanation HTML Block */}
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: option.explanation }} 
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};