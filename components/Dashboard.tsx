import React from 'react';
import { User, Lesson } from '../types';
import { BookOpen, Users, Trophy, Clock, BarChart3, ArrowRight, PlayCircle, Calendar, Star, Bell, Upload, Plus, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';
import { lmsService } from '../services/lmsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  user: User;
  onNavigate: (view: string, lessonId?: string) => void;
}

export const Dashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const lessons = lmsService.getAllLessons();

  // --- 1. STUDENT HOMEPAGE COMPONENT ---
  const StudentHomepage = () => {
    return (
      <div className="animate-fadeIn pb-12">
        
        {/* ABOVE THE FOLD HERO */}
        {/* Design: Large, peaceful hero with subtle animated background (floating icons) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-scripture-blue to-[#1a237e] rounded-3xl shadow-2xl mb-12 text-white p-8 md:p-16 min-h-[400px] flex flex-col justify-center">
           {/* Animated Background Elements (Parallax feel) */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
              <BookOpen className="absolute top-10 right-10 w-32 h-32 animate-float-slow" />
              <Star className="absolute bottom-20 left-20 w-16 h-16 animate-float" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-warm-gold rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
           </div>
           
           <div className="relative z-10 max-w-3xl">
             <div className="flex items-center space-x-2 mb-6">
               <span className="h-px w-8 bg-warm-gold"></span>
               <span className="text-warm-gold font-bold tracking-widest text-xs uppercase">Daily Inspiration</span>
             </div>
             
             <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300">
               "The fear of the Lord is the beginning of wisdom."
             </h1>
             
             <p className="text-lg md:text-xl text-gray-200 mb-10 font-light max-w-2xl leading-relaxed">
               Continue your journey in <strong className="text-white">Genesis Chapter 1</strong>. You are 85% of the way through.
             </p>

             <div className="flex flex-wrap gap-4">
               <button 
                 onClick={() => onNavigate('lesson', lessons[0].lesson_id)}
                 className="bg-warm-gold text-indigo-950 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#f0c04a] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center group"
               >
                 <PlayCircle className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" /> 
                 Continue Lesson
               </button>
               <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-medium backdrop-blur-md transition-all flex items-center">
                 View Library
               </button>
             </div>
           </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* PERSONALIZED LEARNING CARD */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-serif font-bold text-gray-900">My Learning Path</h2>
                <button className="text-sm text-scripture-blue font-bold hover:underline">View Full Schedule</button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-2 h-full bg-soft-olive"></div>
                 <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Circular Progress */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                          <circle cx="48" cy="48" r="40" stroke="#2E8B57" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="37.68" strokeLinecap="round" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-xl font-bold text-gray-900">85%</span>
                       </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                       <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Module</div>
                       <h3 className="text-xl font-bold text-gray-900 mb-2">The Leadership Mindset in Creation</h3>
                       <p className="text-gray-500 text-sm mb-4">Genesis 1 • Leadership Principles • 15 min remaining</p>
                       <div className="flex flex-wrap justify-center md:justify-start gap-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Bible Quiz: 2/2</span>
                          <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">Note Quiz: 0/1</span>
                       </div>
                    </div>
                    
                    <div>
                       <button 
                         onClick={() => onNavigate('lesson', lessons[0].lesson_id)}
                         className="bg-scripture-blue text-white p-4 rounded-full shadow-md hover:bg-indigo-800 transition-colors group-hover:scale-110 transform duration-300"
                       >
                          <ArrowRight className="h-6 w-6" />
                       </button>
                    </div>
                 </div>
              </div>
            </section>

            {/* RECENT LESSONS LIST */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Recent Lessons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {lessons.slice(0, 4).map((lesson, idx) => (
                    <div 
                      key={lesson.lesson_id}
                      onClick={() => onNavigate('lesson', lesson.lesson_id)}
                      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
                    >
                       <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-lg ${idx === 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-500'} group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                             <BookOpen className="h-6 w-6" />
                          </div>
                          <div className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                             {lesson.book} {lesson.chapter}
                          </div>
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-scripture-blue transition-colors line-clamp-2">
                          {lesson.title}
                       </h3>
                       <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                          {lesson.description}
                       </p>
                       <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400">2 Quizzes • 1 Note</span>
                          <span className="text-xs font-bold text-indigo-600 flex items-center">
                             Start <ChevronRight className="h-3 w-3 ml-1" />
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (4 cols) - SIDEBAR WIDGETS */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* TIP OF THE DAY */}
             <div className="bg-gradient-to-br from-warm-gold to-yellow-500 rounded-2xl p-6 text-indigo-950 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Star className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center space-x-2 mb-4">
                      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                         <Star className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-900/70">Tip of the Day</span>
                   </div>
                   <p className="font-serif text-lg font-bold leading-relaxed mb-4">
                      "True leaders do not hoard authority; they distribute it to empower others."
                   </p>
                   <button className="text-xs font-bold border-b border-indigo-900/30 pb-0.5 hover:border-indigo-900 transition-colors">
                      Read full note from Genesis 1
                   </button>
                </div>
             </div>

             {/* STATS SUMMARY */}
             <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                   <Trophy className="h-4 w-4 mr-2 text-warm-gold" /> Weekly Progress
                </h3>
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="text-gray-600">Quiz Accuracy</span>
                         <span className="font-bold text-gray-900">92%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-soft-olive rounded-full" style={{ width: '92%' }}></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="text-gray-600">Lessons Completed</span>
                         <span className="font-bold text-gray-900">3/5</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-scripture-blue rounded-full" style={{ width: '60%' }}></div>
                      </div>
                   </div>
                </div>
             </div>

             {/* ANNOUNCEMENTS */}
             <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                 <Bell className="h-4 w-4 mr-2 text-gray-400" /> Announcements
               </h3>
               <div className="space-y-4">
                 {[1, 2].map((_, i) => (
                   <div key={i} className="flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                     <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-muted-crimson"></div>
                     <div>
                       <p className="text-sm font-bold text-gray-900">Live Q&A Session</p>
                       <p className="text-xs text-gray-500 mt-0.5">Tomorrow at 4:00 PM EST with Pastor Mike.</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

          </div>
        </div>
      </div>
    );
  };

  // --- 2. ADMIN / MENTOR DASHBOARD COMPONENT ---
  const AdminDashboard = () => {
    // Mock Data for charts
    const chartData = [
      { name: 'Mon', active: 120 },
      { name: 'Tue', active: 150 },
      { name: 'Wed', active: 180 },
      { name: 'Thu', active: 140 },
      { name: 'Fri', active: 200 },
      { name: 'Sat', active: 90 },
      { name: 'Sun', active: 60 },
    ];

    return (
      <div className="animate-fadeIn">
        {/* HEADER & QUICK ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
             <h1 className="text-3xl font-serif font-bold text-gray-900">
               {user.role === 'ADMIN' ? 'Admin Dashboard' : 'Mentor Overview'}
             </h1>
             <p className="text-gray-500 mt-2">Manage your curriculum, track student progress, and oversee system health.</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <button 
               onClick={() => onNavigate('import')}
               className="bg-scripture-blue text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-900 transition flex items-center"
             >
               <Upload className="mr-2 h-4 w-4" /> Upload Lesson
             </button>
             <button className="bg-white text-gray-700 border border-gray-200 px-5 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition flex items-center">
               <Plus className="mr-2 h-4 w-4" /> Create Class
             </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Students" value="1,245" subValue="+12% this week" icon={Users} colorClass="bg-indigo-500" />
          <StatCard label="Published Lessons" value={lessons.length.toString()} subValue="3 drafts pending" icon={BookOpen} colorClass="bg-pink-500" />
          <StatCard label="Avg. Class Score" value="78%" subValue="Top 10% perform" icon={Trophy} colorClass="bg-warm-gold" />
          <StatCard label="Active Classes" value="8" subValue="2 starting soon" icon={Calendar} colorClass="bg-soft-olive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* MAIN CHART AREA */}
           <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Student Activity</h3>
                <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50 p-2">
                   <option>Last 7 Days</option>
                   <option>Last 30 Days</option>
                </select>
             </div>
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                         cursor={{ fill: '#f8fafc' }}
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Bar dataKey="active" fill="#0B3D91" radius={[6, 6, 0, 0]} barSize={40} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
           </div>

           {/* RECENT ACTIVITY FEED */}
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                 <h3 className="font-bold text-gray-900">Live Feed</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                 {[1,2,3,4,5].map((i) => (
                    <div key={i} className="flex items-start p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                       <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3 flex-shrink-0 border border-gray-200">
                          <Users className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-sm text-gray-800">
                             <span className="font-bold">John Doe</span> submitted a quiz for <span className="font-medium text-indigo-700">Genesis 1</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-4 border-t border-gray-100 text-center">
                 <button className="text-sm font-bold text-scripture-blue hover:text-indigo-900">View All Activity</button>
              </div>
           </div>

        </div>

        {/* RECENT UPLOADS TABLE (Admin Only) */}
        {user.role === 'ADMIN' && (
           <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">Recent Lessons</h3>
                 <button className="text-sm text-gray-500 hover:text-gray-900">Manage All</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                       <tr>
                          <th className="px-6 py-3">Lesson Title</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody>
                       {lessons.map((lesson) => (
                          <tr key={lesson.lesson_id} className="border-b border-gray-50 hover:bg-gray-50/50">
                             <td className="px-6 py-4 font-medium text-gray-900">
                                {lesson.title}
                             </td>
                             <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{lesson.lesson_type}</span>
                             </td>
                             <td className="px-6 py-4">
                                <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded w-fit">
                                   <CheckCircle2 className="h-3 w-3 mr-1" /> Published
                                </span>
                             </td>
                             <td className="px-6 py-4 text-gray-500">
                                {new Date(lesson.created_at).toLocaleDateString()}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-indigo-600">Edit</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>
    );
  };

  // --- RENDER SWITCHER ---
  return user.role === 'STUDENT' ? <StudentHomepage /> : <AdminDashboard />;
};

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value, subValue, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
         <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-serif font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {subValue && <p className="text-xs text-green-600 font-bold mt-2 flex items-center">{subValue}</p>}
    </div>
  </div>
);

// Helper for icons
const ChevronRight = ({ className }: { className?: string }) => (
   <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
