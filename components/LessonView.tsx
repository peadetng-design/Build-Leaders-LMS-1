import React, { useState, useEffect } from 'react';
import { Lesson, Quiz } from '../types';
import { QuizCard } from './QuizCard';
import { lmsService } from '../services/lmsService';
import { Book, FileText, CheckCircle, ChevronRight, HelpCircle } from 'lucide-react';

interface Props {
  lesson: Lesson;
  userId: string;
  onExit: () => void;
}

type Tab = 'NOTE' | 'BIBLE_QUIZ' | 'NOTE_QUIZ' | 'RESULTS';

export const LessonView: React.FC<Props> = ({ lesson, userId, onExit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('NOTE');
  // Store local attempt state before syncing
  const [attempts, setAttempts] = useState<Record<string, { optionId: string; isCorrect: boolean }>>({});

  // Load existing attempts from service when lesson loads
  useEffect(() => {
    const existingAttempts = lmsService.getStudentAttemptsForLesson(userId, lesson.lesson_id);
    const attemptMap: Record<string, { optionId: string; isCorrect: boolean }> = {};
    existingAttempts.forEach(a => {
      attemptMap[a.quiz_id] = { optionId: a.selected_option_id, isCorrect: a.is_correct };
    });
    setAttempts(attemptMap);
  }, [userId, lesson.lesson_id]);

  const handleAttempt = (quizId: string, optionId: string, isCorrect: boolean) => {
    // 1. Update local UI state
    setAttempts(prev => ({
      ...prev,
      [quizId]: { optionId, isCorrect }
    }));

    // 2. Persist to service
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

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-900 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold opacity-90">{lesson.book} {lesson.chapter}</h2>
            <h1 className="text-3xl font-bold mt-1">{lesson.title}</h1>
          </div>
          <button 
            onClick={onExit}
            className="text-white opacity-70 hover:opacity-100 hover:bg-white/10 px-4 py-2 rounded-lg transition"
          >
            Exit Lesson
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mt-8">
          <button 
            onClick={() => setActiveTab('NOTE')}
            className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'NOTE' ? 'bg-white text-indigo-900 font-bold' : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'}`}
          >
            <Book className="h-4 w-4 mr-2" /> Leadership Note
          </button>
          <button 
             onClick={() => setActiveTab('BIBLE_QUIZ')}
             className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'BIBLE_QUIZ' ? 'bg-white text-indigo-900 font-bold' : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'}`}
          >
            <HelpCircle className="h-4 w-4 mr-2" /> Bible Quiz 
            <span className="ml-2 bg-indigo-600 px-2 py-0.5 rounded-full text-xs">{bibleStats.attempted}/{bibleStats.total}</span>
          </button>
          <button 
             onClick={() => setActiveTab('NOTE_QUIZ')}
             className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'NOTE_QUIZ' ? 'bg-white text-indigo-900 font-bold' : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'}`}
          >
            <FileText className="h-4 w-4 mr-2" /> Note Quiz
             <span className="ml-2 bg-indigo-600 px-2 py-0.5 rounded-full text-xs">{noteStats.attempted}/{noteStats.total}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          
          {/* Note Tab */}
          {activeTab === 'NOTE' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{lesson.leadership_note.title}</h2>
              <div 
                className="prose prose-indigo prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lesson.leadership_note.body }}
              />
              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setActiveTab('BIBLE_QUIZ')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Start Bible Quiz <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Quiz Tabs */}
          {(activeTab === 'BIBLE_QUIZ' || activeTab === 'NOTE_QUIZ') && (
            <div className="animate-fadeIn">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {activeTab === 'BIBLE_QUIZ' ? 'Bible Knowledge Check' : 'Leadership Concept Check'}
                </h3>
                <span className="text-sm text-gray-500">
                  Select an option to see the explanation.
                </span>
              </div>
              
              <div className="space-y-8">
                {(activeTab === 'BIBLE_QUIZ' ? lesson.bible_quizzes : lesson.note_quizzes).map(quiz => (
                  <QuizCard 
                    key={quiz.quiz_id} 
                    quiz={quiz} 
                    onAttempt={handleAttempt}
                    previousAttempt={attempts[quiz.quiz_id]?.optionId}
                  />
                ))}
              </div>

              {activeTab === 'BIBLE_QUIZ' ? (
                <div className="mt-8 flex justify-end">
                   <button 
                    onClick={() => setActiveTab('NOTE_QUIZ')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center"
                  >
                    Next Section: Note Quiz <ChevronRight className="ml-2" />
                  </button>
                </div>
              ) : (
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={() => onExit()}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center shadow-lg"
                  >
                    Complete Lesson <CheckCircle className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
