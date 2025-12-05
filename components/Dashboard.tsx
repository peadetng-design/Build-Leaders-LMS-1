import React from 'react';
import { User, Lesson } from '../types';
import { BookOpen, Users, Trophy, Clock, BarChart3, ArrowUpRight } from 'lucide-react';
import { lmsService } from '../services/lmsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  user: User;
  onNavigate: (view: string, lessonId?: string) => void;
}

export const Dashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const lessons = lmsService.getAllLessons();

  const StatsCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Mock Data for Charts
  const data = [
    { name: 'Genesis 1', score: 85 },
    { name: 'Exodus 3', score: 72 },
    { name: 'John 3', score: 90 },
    { name: 'Acts 2', score: 65 },
  ];

  if (user.role === 'STUDENT') {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
            <p className="text-gray-500">Continue your journey in Kingdom Leadership.</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
            Resume Learning
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Lessons Completed" value="12" icon={BookOpen} color="bg-blue-500" />
          <StatsCard title="Average Quiz Score" value="88%" icon={Trophy} color="bg-yellow-500" />
          <StatsCard title="Learning Hours" value="24.5" icon={Clock} color="bg-green-500" />
        </div>

        {/* Recent Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Available Lessons</h3>
            <div className="space-y-4">
              {lessons.map(lesson => (
                <div key={lesson.lesson_id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition cursor-pointer" onClick={() => onNavigate('lesson', lesson.lesson_id)}>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold mr-4">
                      {lesson.chapter}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                      <p className="text-sm text-gray-500">{lesson.bible_quizzes.length + lesson.note_quizzes.length} Questions • Mixed Type</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage curriculum, users, and system analytics.</p>
          </div>
          <button 
            onClick={() => onNavigate('import')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center"
          >
            <UploadIcon className="mr-2 h-4 w-4" /> Upload Lesson Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Total Students" value="1,240" icon={Users} color="bg-indigo-500" />
          <StatsCard title="Active Lessons" value={lessons.length} icon={BookOpen} color="bg-pink-500" />
          <StatsCard title="Avg. Class Score" value="76%" icon={BarChart3} color="bg-purple-500" />
          <StatsCard title="Pending Approvals" value="3" icon={Clock} color="bg-orange-500" />
        </div>

        {/* Lesson Management List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Course Content Library</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book/Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.map(lesson => (
                <tr key={lesson.lesson_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lesson.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.book} {lesson.chapter}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {lesson.lesson_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.bible_quizzes.length + lesson.note_quizzes.length} items</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onNavigate('lesson', lesson.lesson_id)} className="text-indigo-600 hover:text-indigo-900">Preview</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

// Helper for icon
const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);