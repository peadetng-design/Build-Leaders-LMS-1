import { Lesson, StudentAttempt, Quiz, User, Role, LessonStats } from '../types';

// --- Mock Data ---

const MOCK_LESSON_GENESIS: Lesson = {
  lesson_id: 'GENESIS-CH1',
  title: 'The Beginning of Wisdom: Genesis 1',
  description: 'A study of Genesis chapter 1 with leadership insights regarding creation and order.',
  book: 'Genesis',
  chapter: 1,
  lesson_type: 'Mixed',
  created_at: new Date().toISOString(),
  leadership_note: {
    title: 'The Leadership Mindset in Creation',
    body: `
      <h2>The Foundation of Leadership: Order from Chaos</h2>
      <p>In the beginning, the earth was formless and empty. This state of "tohu wa-bohu" (formless and void) represents the starting point of many leadership challenges. A true leader does not shy away from chaos but rather sees it as an opportunity to establish order, purpose, and beauty.</p>
      <h3>Vision Precedes Action</h3>
      <p>Leadership begins with vision. "And God said, 'Let there be light.'" Before any physical work was done, the vision was articulated. This teaches us that effective leadership is communicative and intentional. It speaks into the darkness and defines the direction before mobilizing resources.</p>
      <h3>The Principle of Separation</h3>
      <p>Notice how creation involved separation: light from darkness, water from land, day from night. Leadership often requires making clear distinctions—setting boundaries, defining roles, and distinguishing between what is helpful and what is harmful to the organizational culture.</p>
      <h3>Delegation and Empowerment</h3>
      <p>Later in the creation narrative, God empowers humanity to "be fruitful and multiply." This is the ultimate act of leadership delegation. True leaders do not hoard authority; they distribute it to empower others to continue the work of cultivation and expansion.</p>
    `
  },
  bible_quizzes: [
    {
      quiz_id: 'GEN1-Q1',
      lesson_id: 'GENESIS-CH1',
      question_type: 'Bible Quiz',
      reference: 'Genesis 1:1',
      question_text: 'According to Genesis 1:1, what did God create in the beginning?',
      sequence_number: 1,
      options: [
        { option_id: 'A', text: 'Heaven and Earth', is_correct: true, explanation: 'Correct — the verse states “God created the heaven and the earth.”' },
        { option_id: 'B', text: 'Light', is_correct: false, explanation: 'Light was created later in verse 3.' },
        { option_id: 'C', text: 'Plants', is_correct: false, explanation: 'Plants were created later in the chapter.' },
        { option_id: 'D', text: 'Animals', is_correct: false, explanation: 'Animals were created later in the chapter.' }
      ]
    },
    {
      quiz_id: 'GEN1-Q2',
      lesson_id: 'GENESIS-CH1',
      question_type: 'Bible Quiz',
      reference: 'Genesis 1:3',
      question_text: 'What was the first thing God spoke into existence?',
      sequence_number: 2,
      options: [
        { option_id: 'A', text: 'Man', is_correct: false, explanation: 'Man was created on the sixth day.' },
        { option_id: 'B', text: 'Light', is_correct: true, explanation: 'Correct - God said "Let there be light".' },
        { option_id: 'C', text: 'Water', is_correct: false, explanation: 'Water existed but was separated later.' },
        { option_id: 'D', text: 'Stars', is_correct: false, explanation: 'Stars were created on the fourth day.' }
      ]
    }
  ],
  note_quizzes: [
    {
      quiz_id: 'NOTE-Q1',
      lesson_id: 'GENESIS-CH1',
      question_type: 'Note Quiz',
      reference: 'Leadership Note',
      question_text: 'What leadership quality is demonstrated by God’s orderly creation process?',
      sequence_number: 1,
      options: [
        { option_id: 'A', text: 'Strategic planning', is_correct: true, explanation: 'Correct — the note emphasizes God’s deliberate sequencing and separation.' },
        { option_id: 'B', text: 'Impulsiveness', is_correct: false, explanation: 'Creation was deliberate, not impulsive.' },
        { option_id: 'C', text: 'Indecision', is_correct: false, explanation: 'God spoke with absolute authority and decision.' },
        { option_id: 'D', text: 'Fearfulness', is_correct: false, explanation: 'Fear is not present in the creation account.' }
      ]
    }
  ]
};

const USERS: User[] = [
  { id: 'admin1', name: 'Sarah Admin', email: 'sarah@lms.com', role: 'ADMIN', avatarUrl: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'student1', name: 'John Student', email: 'john@lms.com', role: 'STUDENT', avatarUrl: 'https://i.pravatar.cc/150?u=john' },
  { id: 'mentor1', name: 'Mike Mentor', email: 'mike@lms.com', role: 'MENTOR', avatarUrl: 'https://i.pravatar.cc/150?u=mike' }
];

// --- Service Logic ---

class LMSService {
  private lessons: Lesson[] = [MOCK_LESSON_GENESIS];
  private attempts: StudentAttempt[] = [];
  private currentUser: User = USERS[0]; // Default to Admin

  // User Management
  getCurrentUser(): User {
    return this.currentUser;
  }

  switchUser(role: Role) {
    const user = USERS.find(u => u.role === role);
    if (user) this.currentUser = user;
    return this.currentUser;
  }

  // Lesson Management
  getAllLessons(): Lesson[] {
    return this.lessons;
  }

  getLessonById(id: string): Lesson | undefined {
    return this.lessons.find(l => l.lesson_id === id);
  }

  saveLesson(lesson: Lesson): void {
    const index = this.lessons.findIndex(l => l.lesson_id === lesson.lesson_id);
    if (index >= 0) {
      this.lessons[index] = lesson;
    } else {
      this.lessons.push(lesson);
    }
  }

  // Quiz Logic
  submitAttempt(attempt: StudentAttempt): void {
    this.attempts.push(attempt);
  }

  getStudentAttemptsForLesson(studentId: string, lessonId: string): StudentAttempt[] {
    return this.attempts.filter(a => a.student_id === studentId && a.lesson_id === lessonId);
  }

  getLessonStats(lessonId: string): LessonStats {
    const lessonAttempts = this.attempts.filter(a => a.lesson_id === lessonId);
    if (lessonAttempts.length === 0) return { totalAttempts: 0, avgScore: 0, completionRate: 0 };

    const correct = lessonAttempts.filter(a => a.is_correct).length;
    return {
      totalAttempts: lessonAttempts.length,
      avgScore: Math.round((correct / lessonAttempts.length) * 100),
      completionRate: 85
    };
  }

  parseImportData(fileContent: any): Lesson {
    // Mock parsing logic
    return { ...MOCK_LESSON_GENESIS, lesson_id: `GENESIS-CH${this.lessons.length + 1}`, title: `Imported Lesson ${this.lessons.length + 1}` };
  }
}

export const lmsService = new LMSService();