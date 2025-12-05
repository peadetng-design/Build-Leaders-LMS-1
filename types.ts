export type Role = 'ADMIN' | 'MENTOR' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export type LessonType = 'Bible' | 'Leadership' | 'Mixed';
export type QuestionType = 'Bible Quiz' | 'Note Quiz';

export interface Lesson {
  lesson_id: string;
  title: string;
  description: string;
  book?: string;
  chapter?: number;
  lesson_type: LessonType;
  leadership_note: {
    title: string;
    body: string;
  };
  created_at: string;
  bible_quizzes: Quiz[];
  note_quizzes: Quiz[];
}

export interface Quiz {
  quiz_id: string;
  lesson_id: string;
  question_type: QuestionType;
  reference?: string; // e.g., "Genesis 1:1"
  question_text: string;
  options: QuizOption[];
  sequence_number: number;
}

export interface QuizOption {
  option_id: string; // "A", "B", "C", "D"
  text: string;
  is_correct: boolean;
  explanation: string;
}

export interface StudentAttempt {
  attempt_id: string;
  student_id: string;
  lesson_id: string;
  quiz_id: string;
  selected_option_id: string;
  is_correct: boolean;
  timestamp: string;
}

export interface LessonStats {
  totalAttempts: number;
  avgScore: number;
  completionRate: number;
}