import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Check, AlertTriangle, FileText, ArrowRight, Info, Plus, Edit3, Trash2, Save, X, Grid, List } from 'lucide-react';
import { lmsService } from '../services/lmsService';
import { Lesson, Quiz, QuizOption, QuestionType } from '../types';

interface Props {
  onImportComplete: () => void;
}

type ImportMode = 'SELECT' | 'UPLOAD' | 'MANUAL_META' | 'MANUAL_QUIZ' | 'PREVIEW' | 'SUCCESS';

// Default empty quiz template for the manual editor
const EMPTY_QUIZ_TEMPLATE = {
  question_text: '',
  reference: '',
  question_type: 'Bible Quiz' as QuestionType,
  options: [
    { option_id: 'A', text: '', is_correct: false, explanation: '' },
    { option_id: 'B', text: '', is_correct: false, explanation: '' },
    { option_id: 'C', text: '', is_correct: false, explanation: '' },
    { option_id: 'D', text: '', is_correct: false, explanation: '' },
  ]
};

export const LessonImporter: React.FC<Props> = ({ onImportComplete }) => {
  const [mode, setMode] = useState<ImportMode>('SELECT');
  const [dragActive, setDragActive] = useState(false);
  const [parsedLesson, setParsedLesson] = useState<Lesson | null>(null);

  // --- MANUAL ENTRY STATE ---
  const [manualMeta, setManualMeta] = useState({
    title: '',
    description: '',
    book: '',
    chapter: '',
    noteTitle: '',
    noteBody: ''
  });
  
  const [manualQuizzes, setManualQuizzes] = useState<Quiz[]>([]);
  
  // State for the specific question currently being added/edited
  const [currentQuiz, setCurrentQuiz] = useState(EMPTY_QUIZ_TEMPLATE);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false); // If true, we are just filling the form, not yet added to list

  // --- HANDLERS ---

  // 1. FILE UPLOAD HANDLERS
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleMockUpload = () => {
    const mockData = lmsService.parseImportData(null);
    setParsedLesson(mockData);
    setMode('PREVIEW');
  };

  const processFile = (file: File) => {
    console.log("Processing file:", file.name);
    handleMockUpload();
  };

  // 2. MANUAL ENTRY HANDLERS
  const handleMetaSubmit = () => {
    if (!manualMeta.title || !manualMeta.noteTitle) {
      alert("Please fill in at least the Lesson Title and Note Title.");
      return;
    }
    setMode('MANUAL_QUIZ');
  };

  const handleAddQuiz = () => {
    // Validation
    if (!currentQuiz.question_text) return alert("Question text is required");
    if (!currentQuiz.options.some(o => o.is_correct)) return alert("Please select a correct answer");
    if (currentQuiz.options.some(o => !o.text || !o.explanation)) return alert("All options must have text and an explanation");

    const newQuiz: Quiz = {
      quiz_id: crypto.randomUUID(),
      lesson_id: 'TEMP', // assigned later
      question_type: currentQuiz.question_type,
      reference: currentQuiz.reference,
      question_text: currentQuiz.question_text,
      sequence_number: manualQuizzes.length + 1,
      options: currentQuiz.options.map(o => ({ ...o }))
    };

    setManualQuizzes([...manualQuizzes, newQuiz]);
    setCurrentQuiz(EMPTY_QUIZ_TEMPLATE); // Reset form
    setIsEditingQuiz(false);
  };

  const handleDeleteQuiz = (id: string) => {
    setManualQuizzes(manualQuizzes.filter(q => q.quiz_id !== id));
  };

  const handleManualFinish = () => {
    if (manualQuizzes.length === 0) {
      if (!confirm("No questions added. Are you sure you want to proceed with just the Note?")) return;
    }

    // Construct the full Lesson object
    const lessonId = `LESSON-${Date.now()}`;
    const lesson: Lesson = {
      lesson_id: lessonId,
      title: manualMeta.title,
      description: manualMeta.description || 'Manually created lesson',
      book: manualMeta.book,
      chapter: manualMeta.chapter ? parseInt(manualMeta.chapter) : undefined,
      lesson_type: 'Mixed',
      created_at: new Date().toISOString(),
      leadership_note: {
        title: manualMeta.noteTitle,
        body: manualMeta.noteBody
      },
      bible_quizzes: manualQuizzes.filter(q => q.question_type === 'Bible Quiz').map(q => ({...q, lesson_id: lessonId})),
      note_quizzes: manualQuizzes.filter(q => q.question_type === 'Note Quiz').map(q => ({...q, lesson_id: lessonId}))
    };

    setParsedLesson(lesson);
    setMode('PREVIEW');
  };

  // 3. COMMON HANDLERS
  const handleCommit = () => {
    if (parsedLesson) {
      lmsService.saveLesson(parsedLesson);
      setMode('SUCCESS');
      setTimeout(() => {
        onImportComplete();
      }, 2000);
    }
  };

  // --- RENDER HELPERS ---
  
  const renderProgressBar = (currentStep: number) => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300
            ${currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`h-1 w-16 transition-colors duration-300 ${currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* MODE SELECTION SCREEN */}
      {mode === 'SELECT' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Create New Lesson</h1>
            <p className="text-gray-500 mt-2">Choose how you would like to add content to the curriculum.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Option 1: File Upload */}
            <button 
              onClick={() => setMode('UPLOAD')}
              className="group relative p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <FileSpreadsheet className="h-8 w-8 text-indigo-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Package</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Import a complete lesson using the standard Excel/CSV template. Best for bulk uploading notes and 100+ questions at once.
              </p>
              <span className="text-indigo-600 font-semibold text-sm flex items-center">
                Select File <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Option 2: Manual Entry */}
            <button 
              onClick={() => setMode('MANUAL_META')}
              className="group relative p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-pink-500 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="h-14 w-14 bg-pink-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-500 transition-colors">
                <Edit3 className="h-8 w-8 text-pink-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Entry</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Build a lesson from scratch. Enter the leadership note and create questions one by one using the interactive builder.
              </p>
              <span className="text-pink-600 font-semibold text-sm flex items-center">
                Start Building <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD MODE */}
      {mode === 'UPLOAD' && (
        <div className="animate-fadeIn">
           <button onClick={() => setMode('SELECT')} className="mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center">
             &larr; Back to Selection
           </button>
           {renderProgressBar(1)}
           
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-3xl mx-auto">
             <div className="mb-6">
               <h2 className="text-2xl font-bold text-gray-900">Upload Lesson Package</h2>
               <p className="text-gray-500 mt-2">Upload the standard Excel/CSV template (.xlsx, .csv)</p>
             </div>

             <div 
               className={`border-2 border-dashed rounded-xl p-12 transition-colors ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
               onDragEnter={() => setDragActive(true)}
               onDragLeave={() => setDragActive(false)}
               onDragOver={(e) => e.preventDefault()}
               onDrop={handleFileDrop}
             >
               <div className="flex flex-col items-center">
                 <FileSpreadsheet className="h-16 w-16 text-indigo-400 mb-4" />
                 <p className="text-lg font-medium text-gray-700">Drag & Drop your Excel file here</p>
                 <span className="text-gray-400 my-2">- OR -</span>
                 <button 
                   onClick={handleMockUpload} 
                   className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                 >
                   Browse Files
                 </button>
               </div>
             </div>
             
             <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm text-left flex items-start">
               <Info className="h-5 w-5 mr-2 flex-shrink-0" />
               <div>
                 <p className="font-bold">Template Structure:</p>
                 <ul className="list-disc ml-4 mt-1 space-y-1">
                   <li>Sheet 1: Metadata & Note Body</li>
                   <li>Sheet 2: Bible Quizzes</li>
                   <li>Sheet 3: Note Quizzes</li>
                 </ul>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* MANUAL MODE STEP 1: METADATA */}
      {mode === 'MANUAL_META' && (
        <div className="animate-fadeIn max-w-3xl mx-auto">
           <button onClick={() => setMode('SELECT')} className="mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center">
             &larr; Back to Selection
           </button>
           {renderProgressBar(1)}

           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
               <h2 className="text-xl font-bold text-gray-900">Step 1: Lesson Details</h2>
               <p className="text-sm text-gray-500">Define the core content and leadership note.</p>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Bible Study – Genesis 1"
                      value={manualMeta.title}
                      onChange={(e) => setManualMeta({...manualMeta, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bible Book</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Genesis"
                      value={manualMeta.book}
                      onChange={(e) => setManualMeta({...manualMeta, book: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1"
                      value={manualMeta.chapter}
                      onChange={(e) => setManualMeta({...manualMeta, chapter: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Short summary of the lesson..."
                      value={manualMeta.description}
                      onChange={(e) => setManualMeta({...manualMeta, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-500" /> Leadership Note
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Note Title *</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g. The Leadership Mindset in Creation"
                        value={manualMeta.noteTitle}
                        onChange={(e) => setManualMeta({...manualMeta, noteTitle: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content Body (HTML/Text) *</label>
                      <textarea 
                        className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                        placeholder="Paste or write your leadership article here (HTML tags allowed)..."
                        value={manualMeta.noteBody}
                        onChange={(e) => setManualMeta({...manualMeta, noteBody: e.target.value})}
                      />
                      <p className="text-xs text-gray-500 mt-1">Approx. 1,500 - 5,000 words recommended.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleMetaSubmit}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center shadow-md"
                  >
                    Next: Add Questions <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* MANUAL MODE STEP 2: QUESTIONS */}
      {mode === 'MANUAL_QUIZ' && (
        <div className="animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setMode('MANUAL_META')} className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
              &larr; Back to Details
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">
                {manualQuizzes.length} Questions Added
              </span>
              <button 
                onClick={handleManualFinish}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold shadow-md"
              >
                Finish & Preview
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: QUESTION BUILDER FORM */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-indigo-900 text-white flex justify-between items-center">
                   <h3 className="font-bold flex items-center">
                     <Plus className="h-5 w-5 mr-2" /> Add New Question
                   </h3>
                </div>
                
                <div className="p-6 space-y-6">
                   {/* Type & Reference */}
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Question Type</label>
                       <div className="flex space-x-4">
                         <label className="flex items-center cursor-pointer">
                           <input 
                             type="radio" 
                             className="form-radio text-indigo-600" 
                             checked={currentQuiz.question_type === 'Bible Quiz'}
                             onChange={() => setCurrentQuiz({...currentQuiz, question_type: 'Bible Quiz'})}
                           />
                           <span className="ml-2 text-sm text-gray-700">Bible Quiz</span>
                         </label>
                         <label className="flex items-center cursor-pointer">
                           <input 
                             type="radio" 
                             className="form-radio text-purple-600" 
                             checked={currentQuiz.question_type === 'Note Quiz'}
                             onChange={() => setCurrentQuiz({...currentQuiz, question_type: 'Note Quiz'})}
                           />
                           <span className="ml-2 text-sm text-gray-700">Note Quiz</span>
                         </label>
                       </div>
                     </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                         {currentQuiz.question_type === 'Bible Quiz' ? 'Bible Reference' : 'Source Section'}
                       </label>
                       <input 
                         type="text" 
                         className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                         placeholder={currentQuiz.question_type === 'Bible Quiz' ? "e.g. Genesis 1:3" : "e.g. Introduction"}
                         value={currentQuiz.reference || ''}
                         onChange={(e) => setCurrentQuiz({...currentQuiz, reference: e.target.value})}
                       />
                     </div>
                   </div>

                   {/* Question Text */}
                   <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Question Text</label>
                     <textarea 
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                       rows={2}
                       placeholder="Enter the question here..."
                       value={currentQuiz.question_text}
                       onChange={(e) => setCurrentQuiz({...currentQuiz, question_text: e.target.value})}
                     />
                   </div>

                   {/* Options Grid */}
                   <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                     <label className="block text-xs font-bold text-gray-500 uppercase">Answer Options</label>
                     
                     {currentQuiz.options.map((opt, idx) => (
                       <div key={opt.option_id} className="bg-white p-3 rounded shadow-sm border border-gray-200">
                         <div className="flex items-start space-x-3">
                           <div className="mt-2">
                             <input 
                               type="radio" 
                               name="correct_option"
                               className="h-5 w-5 text-green-600 focus:ring-green-500 cursor-pointer"
                               checked={opt.is_correct}
                               onChange={() => {
                                 const newOpts = currentQuiz.options.map(o => ({...o, is_correct: o.option_id === opt.option_id}));
                                 setCurrentQuiz({...currentQuiz, options: newOpts});
                               }}
                             />
                           </div>
                           <div className="flex-1 space-y-2">
                             <div className="flex items-center">
                               <span className="w-6 font-bold text-gray-400">{opt.option_id}</span>
                               <input 
                                 type="text" 
                                 className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:border-indigo-500"
                                 placeholder={`Option ${opt.option_id} text`}
                                 value={opt.text}
                                 onChange={(e) => {
                                   const newOpts = [...currentQuiz.options];
                                   newOpts[idx].text = e.target.value;
                                   setCurrentQuiz({...currentQuiz, options: newOpts});
                                 }}
                               />
                             </div>
                             <div className="flex items-center">
                               <span className="w-6"></span>
                               <input 
                                 type="text" 
                                 className="flex-1 px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 bg-gray-50 focus:bg-white transition"
                                 placeholder={`Explanation (shown after selection)...`}
                                 value={opt.explanation}
                                 onChange={(e) => {
                                   const newOpts = [...currentQuiz.options];
                                   newOpts[idx].explanation = e.target.value;
                                   setCurrentQuiz({...currentQuiz, options: newOpts});
                                 }}
                               />
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>

                   <div className="flex justify-end pt-2">
                     <button 
                       onClick={handleAddQuiz}
                       className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center"
                     >
                       <Plus className="h-4 w-4 mr-2" /> Add to Lesson
                     </button>
                   </div>
                </div>
              </div>
            </div>

            {/* RIGHT: QUESTION LIST SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-700 flex items-center">
                    <List className="h-4 w-4 mr-2" /> Questions List
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {manualQuizzes.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                      <p className="text-sm">No questions added yet.</p>
                      <p className="text-xs mt-1">Fill the form to add one.</p>
                    </div>
                  ) : (
                    manualQuizzes.map((q, i) => (
                      <div key={q.quiz_id || i} className="group p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition bg-white text-left relative">
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${q.question_type === 'Bible Quiz' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {q.question_type === 'Bible Quiz' ? 'BIBLE' : 'NOTE'}
                          </span>
                          <button 
                            onClick={() => handleDeleteQuiz(q.quiz_id)}
                            className="text-gray-300 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs font-medium text-gray-800 line-clamp-2">{q.question_text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODE (Shared by both Upload and Manual) */}
      {mode === 'PREVIEW' && parsedLesson && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Preview Lesson</h2>
              <p className="text-sm text-gray-500">Review content before publishing</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center">
              <Check className="h-3 w-3 mr-1" /> Ready to Import
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Metadata Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Lesson Title</label>
                <div className="text-gray-900 font-medium text-lg">{parsedLesson.title}</div>
                <div className="text-sm text-gray-500 mt-1">{parsedLesson.book} {parsedLesson.chapter}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">ID</label>
                <div className="text-gray-900 font-mono text-sm">{parsedLesson.lesson_id}</div>
              </div>
            </div>

            {/* Note Preview */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                <h3 className="font-semibold text-gray-700">Note: {parsedLesson.leadership_note.title}</h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 font-mono text-xs">
                {parsedLesson.leadership_note.body.replace(/<[^>]*>?/gm, '').substring(0, 300)}...
              </p>
            </div>

            {/* Quiz Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-indigo-700">{parsedLesson.bible_quizzes.length}</div>
                  <div className="text-sm text-indigo-600">Bible Questions</div>
                </div>
                <Grid className="h-8 w-8 text-indigo-200" />
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-between">
                 <div>
                   <div className="text-2xl font-bold text-purple-700">{parsedLesson.note_quizzes.length}</div>
                   <div className="text-sm text-purple-600">Note Questions</div>
                 </div>
                 <Grid className="h-8 w-8 text-purple-200" />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={() => setMode('SELECT')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 mr-3"
              >
                Discard & Start Over
              </button>
              <button 
                onClick={handleCommit}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center font-bold"
              >
                <Save className="mr-2 h-4 w-4" /> Publish Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODE */}
      {mode === 'SUCCESS' && (
        <div className="text-center py-12 animate-fadeIn">
          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-500 text-lg">The lesson has been successfully added to the curriculum.</p>
          <div className="mt-8">
             <button onClick={onImportComplete} className="text-indigo-600 hover:text-indigo-800 font-medium">
               Return to Dashboard
             </button>
          </div>
        </div>
      )}
    </div>
  );
};