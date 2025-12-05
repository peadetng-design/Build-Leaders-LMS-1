import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Check, AlertTriangle, FileText, ArrowRight, Info } from 'lucide-react';
import { lmsService } from '../services/lmsService';
import { Lesson } from '../types';

interface Props {
  onImportComplete: () => void;
}

export const LessonImporter: React.FC<Props> = ({ onImportComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Preview, 3: Success
  const [parsedLesson, setParsedLesson] = useState<Lesson | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleMockUpload = () => {
    // Simulating the parsing of the Excel Template provided in prompt
    const mockData = lmsService.parseImportData(null);
    setParsedLesson(mockData);
    setStep(2);
  };

  const processFile = (file: File) => {
    // In a real app, use xlsx to parse file
    console.log("Processing file:", file.name);
    handleMockUpload();
  };

  const handleCommit = () => {
    if (parsedLesson) {
      lmsService.saveLesson(parsedLesson);
      setStep(3);
      setTimeout(() => {
        onImportComplete();
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'} font-bold`}>1</div>
        <div className={`h-1 w-16 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'} font-bold`}>2</div>
        <div className={`h-1 w-16 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'} font-bold`}>3</div>
      </div>

      {step === 1 && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
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
                onClick={handleMockUpload} // Mocking file selection
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-400 mt-4">Supports Standard Lesson Template v1.0</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm text-left flex items-start">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-bold">Template Requirements:</p>
              <ul className="list-disc ml-4 mt-1 space-y-1">
                <li>Sheet 1: Lesson_Metadata (ID, Title, Note Body)</li>
                <li>Sheet 2: Bible_Quiz (Reference, Questions, Options A-D)</li>
                <li>Sheet 3: Note_Quiz (Questions linked to Note)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === 2 && parsedLesson && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Preview Import</h2>
              <p className="text-sm text-gray-500">Review content before publishing</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Valid Package
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Metadata Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Lesson Title</label>
                <div className="text-gray-900 font-medium">{parsedLesson.title}</div>
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
                <h3 className="font-semibold text-gray-700">Leadership Note: {parsedLesson.leadership_note.title}</h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {parsedLesson.leadership_note.body.replace(/<[^>]*>?/gm, '')}
              </p>
            </div>

            {/* Quiz Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="text-2xl font-bold text-indigo-700">{parsedLesson.bible_quizzes.length}</div>
                <div className="text-sm text-indigo-600">Bible Questions</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-700">{parsedLesson.note_quizzes.length}</div>
                <div className="text-sm text-purple-600">Note Questions</div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 mr-3"
              >
                Cancel
              </button>
              <button 
                onClick={handleCommit}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                Import Lesson <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-12">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Successful!</h2>
          <p className="text-gray-500">The lesson has been added to the curriculum library.</p>
        </div>
      )}
    </div>
  );
};