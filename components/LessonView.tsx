import React, { useState, useEffect } from 'react';
import { Lesson, Quiz } from '../types';
import { QuizCard } from './QuizCard';
import { lmsService } from '../services/lmsService';
import { Book, FileText, CheckCircle, ChevronRight, HelpCircle, X, ChevronLeft, Award } from 'lucide-react';

interface Props {
  lesson: Lesson;
  userId: string;
  onExit: () => void;
}

type Tab = 'NOTE' | 'BIBLE_QUIZ' | 'NOTE_QUIZ';

export const LessonView: React.FC<Props> = ({ lesson, userId, onExit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('NOTE');
  const [attempts, setAttempts] = useState<Record<string, { optionId: string; isCorrect: boolean }>>({});

  useEffect(() => {
    const existingAttempts = lmsService.getStudentAttemptsForLesson(userId, lesson.lesson_id);
    const attemptMap: Record<string, { optionId: string; isCorrect: boolean }> = {};
    existingAttempts.forEach(a => {
      attemptMap[a.quiz_id] = { optionId: a.selected_option_id, isCorrect: a.is_correct };
    });
    setAttempts(attemptMap);
  }, [userId, lesson.lesson_id]);

  const handleAttempt = (quizId: string, optionId: string, isCorrect: boolean) => {
    setAttempts(prev => ({ ...prev, [quizId]: { optionId, isCorrect } }));
    lmsService.submitAttempt({
      attempt_id: crypto.randomUUID(),
      student_id: userId,
      lesson_id: lesson.lesson_id,
      quiz_id: quizId,
      selected_option_id: optionId,
      is_correct: isCorrect,
      timestamp: new Date().toISOString()
    });
  };

  const calculateScore = (quizzes: Quiz[]) => {
    if (quizzes.length === 0) return { correct: 0, total: 0, attempted: 0 };
    let correct = 0;
    let attempted = 0;
    quizzes.forEach(q => {
      const att = attempts[q.quiz_id];
      if (att) {
        attempted++;
        if (att.isCorrect) correct++;
      }
    });
    return { correct, total: quizzes.length, attempted };
  };

  const bibleStats = calculateScore(lesson.bible_quizzes);
  const noteStats = calculateScore(lesson.note_quizzes);
  const totalProgress = Math.round(((bibleStats.attempted + noteStats.attempted) / (lesson.bible_quizzes.length + lesson.note_quizzes.length)) * 100) || 0;

  return (
    <div className="flex flex-col h-screen bg-neutral-bg overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 md:px-8 shadow-sm z-20">
         <div className="flex items-center">
            <button 
              onClick={onExit}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
              aria-label="Exit Lesson"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
               <h2 className="text-xs font-bold text-gray-500 tracking-wider uppercase">{lesson.book} {lesson.chapter}</h2>
               <h1 className="text-lg font-serif font-bold text-gray-900 truncate max-w-md">{lesson.title}</h1>
            </div>
         </div>

         {/* Center Tabs */}
         <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
            <button 
               onClick={() => setActiveTab('NOTE')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'NOTE' ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
               Study Note
            </button>
            <button 
               onClick={() => setActiveTab('BIBLE_QUIZ')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'BIBLE_QUIZ' ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
               Bible Quiz <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 rounded-full">{bibleStats.attempted}/{bibleStats.total}</span>
            </button>
            <button 
               onClick={() => setActiveTab('NOTE_QUIZ')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'NOTE_QUIZ' ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
               Note Quiz <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 rounded-full">{noteStats.attempted}/{noteStats.total}</span>
            </button>
         </div>

         {/* Right Progress */}
         <div className="flex items-center">
            <div className="text-right mr-3 hidden sm:block">
               <div className="text-xs text-gray-500 font-medium">Progress</div>
               <div className="text-sm font-bold text-indigo-600">{totalProgress}%</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center bg-white shadow-sm">
               <div 
                 className="w-full h-full rounded-full border-2 border-indigo-600"
                 style={{ clipPath: `polygon(0 0, 100% 0, 100% ${totalProgress}%, 0 ${totalProgress}%)` }} 
               />
               <Award className={`h-5 w-5 ${totalProgress === 100 ? 'text-yellow-500' : 'text-gray-300'}`} />
            </div>
         </div>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-neutral-bg">
         <div className="max-w-4xl mx-auto px-6 py-10 md:py-12">
            
            {/* NOTE VIEW */}
            {activeTab === 'NOTE' && (
              <div className="animate-fadeIn">
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-scripture-blue to-indigo-500"></div>
                    <div className="mb-10 text-center">
                       <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-widest uppercase mb-4">Leadership Study</span>
                       <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">{lesson.leadership_note.title}</h1>
                       <div className="w-16 h-1 bg-warm-gold mx-auto rounded-full"></div>
                    </div>
                    
                    <div 
                      className="prose prose-lg prose-indigo max-w-none text-gray-700 font-serif leading-loose"
                      dangerouslySetInnerHTML={{ __html: lesson.leadership_note.body }}
                    />
                 </div>

                 <div className="flex justify-center pb-12">
                    <button 
                       onClick={() => setActiveTab('BIBLE_QUIZ')}
                       className="bg-scripture-blue text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-900 hover:scale-105 transition-all flex items-center text-lg"
                    >
                       Start Bible Quiz <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                 </div>
              </div>
            )}

            {/* QUIZ VIEWS */}
            {(activeTab === 'BIBLE_QUIZ' || activeTab === 'NOTE_QUIZ') && (
              <div className="animate-fadeIn">
                 <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                       <h2 className="text-2xl font-display font-bold text-gray-900">
                          {activeTab === 'BIBLE_QUIZ' ? 'Scripture Knowledge' : 'Leadership Application'}
                       </h2>
                       <p className="text-gray-500 mt-1">Select an option and submit to verify your understanding.</p>
                    </div>
                    
                    {/* Mobile Only Tab Switcher */}
                    <div className="flex md:hidden bg-white p-1 rounded border border-gray-200">
                       <button onClick={() => setActiveTab('BIBLE_QUIZ')} className={`flex-1 px-3 py-1 text-xs font-bold rounded ${activeTab === 'BIBLE_QUIZ' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500'}`}>Bible</button>
                       <button onClick={() => setActiveTab('NOTE_QUIZ')} className={`flex-1 px-3 py-1 text-xs font-bold rounded ${activeTab === 'NOTE_QUIZ' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500'}`}>Note</button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {(activeTab === 'BIBLE_QUIZ' ? lesson.bible_quizzes : lesson.note_quizzes).map((quiz, idx) => (
                       <QuizCard 
                          key={quiz.quiz_id} 
                          quiz={quiz}
                          onAttempt={handleAttempt}
                          previousAttempt={attempts[quiz.quiz_id]?.optionId}
                       />
                    ))}
                 </div>

                 <div className="mt-12 flex justify-end pb-12">
                    {activeTab === 'BIBLE_QUIZ' ? (
                       <button 
                          onClick={() => setActiveTab('NOTE_QUIZ')}
                          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-bold shadow-md transition-all flex items-center"
                       >
                          Proceed to Note Quiz <ChevronRight className="ml-2" />
                       </button>
                    ) : (
                       <button 
                          onClick={onExit}
                          className="bg-soft-olive text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold shadow-md transition-all flex items-center"
                       >
                          Complete Lesson <CheckCircle className="ml-2" />
                       </button>
                    )}
                 </div>
              </div>
            )}

         </div>
      </div>
    </div>
  );
};