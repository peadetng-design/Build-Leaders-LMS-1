import React from 'react';
import { User, Lesson } from '../types';
import { BookOpen, Users, Trophy, Clock, BarChart3, ArrowRight, PlayCircle, Calendar, Star, Bell } from 'lucide-react';
import { lmsService } from '../services/lmsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  user: User;
  onNavigate: (view: string, lessonId?: string) => void;
}

export const Dashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const lessons = lmsService.getAllLessons();

  // --- SUB-COMPONENTS ---

  const HeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-scripture-blue to-indigo-900 rounded-2xl shadow-xl mb-10 text-white p-8 md:p-12">
       {/* Decorative Animated SVG Background */}
       <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-float">
             <path fill="#E6B73A" d="M45,-76.2C58.9,-69.3,71.1,-59.1,80.4,-47.1C89.7,-35.1,96.1,-21.3,95.3,-7.8C94.5,5.7,86.5,18.9,76.5,30.3C66.5,41.7,54.5,51.3,42.5,58.8C30.5,66.3,18.5,71.7,5.9,73.6C-6.7,75.5,-19.9,73.9,-32.1,67.6C-44.3,61.3,-55.5,50.3,-64.3,37.8C-73.1,25.3,-79.5,11.3,-78.7,-2.3C-77.9,-15.9,-69.9,-29.1,-60,-40.3C-50.1,-51.5,-38.3,-60.7,-25.7,-68.3C-13.1,-75.9,-0.3,-81.9,13.2,-82.1L13.2,0L0,0Z" transform="translate(100 100)" />
          </svg>
       </div>
       
       <div className="relative z-10 max-w-2xl">
         <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold tracking-wider mb-4 border border-white/20 text-warm-gold">
           {user.role === 'STUDENT' ? 'CONTINUE YOUR JOURNEY' : `WELCOME BACK, ${user.name.split(' ')[0].toUpperCase()}`}
         </span>
         <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
           {user.role === 'STUDENT' ? 'The fear of the Lord is the beginning of wisdom.' : 'Equipping the next generation of Kingdom Leaders.'}
         </h1>
         <div className="flex flex-wrap gap-4">
           <button 
             onClick={() => user.role === 'STUDENT' ? onNavigate('lesson', lessons[0].lesson_id) : onNavigate('import')}
             className="bg-warm-gold text-indigo-900 px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-yellow-400 hover:scale-105 transition-all flex items-center"
           >
             {user.role === 'STUDENT' ? <><PlayCircle className="mr-2 h-5 w-5" /> Continue Study</> : <><BookOpen className="mr-2 h-5 w-5" /> Manage Curriculum</>}
           </button>
           {user.role === 'STUDENT' && (
             <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-medium backdrop-blur-sm transition-all">
               View Progress
             </button>
           )}
         </div>
       </div>
    </div>
  );

  const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
           <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        {value.includes('%') && <span className="text-green-500 text-xs font-bold flex items-center">+2.4% <ArrowRight className="h-3 w-3 ml-1" /></span>}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 font-serif">{value}</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );

  // --- MOCK DATA ---
  const performanceData = [
    { name: 'Gen 1', score: 85 },
    { name: 'Exo 3', score: 72 },
    { name: 'Joh 3', score: 90 },
    { name: 'Act 2', score: 65 },
    { name: 'Rom 8', score: 95 },
  ];

  // --- ROLE VIEWS ---

  if (user.role === 'STUDENT') {
    return (
      <div className="animate-fadeIn">
        <HeroSection />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <StatCard label="Lessons Completed" value="12" icon={BookOpen} colorClass="bg-scripture-blue" />
          <StatCard label="Avg. Quiz Score" value="88%" icon={Trophy} colorClass="bg-warm-gold" />
          <StatCard label="Learning Hours" value="24h" icon={Clock} colorClass="bg-soft-olive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Lessons */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-xl font-bold font-serif text-gray-900">Recent Studies</h2>
              <button className="text-sm text-indigo-600 font-medium hover:underline">View Library</button>
            </div>
            
            {lessons.slice(0, 3).map((lesson, idx) => (
              <div 
                key={lesson.lesson_id} 
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center group"
                onClick={() => onNavigate('lesson', lesson.lesson_id)}
              >
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 font-display font-bold text-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {idx + 1}
                </div>
                <div className="ml-5 flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{lesson.book} {lesson.chapter}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-xs text-gray-400">{lesson.lesson_type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{lesson.title}</h3>
                  <div className="flex items-center mt-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-4">
                      <div className="h-full bg-soft-olive rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500">Resume</span>
                  </div>
                </div>
                <div className="ml-4">
                   <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                     <ArrowRight className="h-4 w-4" />
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Side Panel: Tip of the day */}
          <div className="space-y-6">
             <div className="bg-gradient-to-b from-indigo-900 to-scripture-blue text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                <Star className="h-32 w-32 text-white opacity-5 absolute -top-4 -right-4" />
                <h3 className="text-lg font-display font-bold mb-3 relative z-10">Verse of the Day</h3>
                <p className="font-serif italic text-lg opacity-90 mb-4 relative z-10">
                  "Trust in the Lord with all thine heart; and lean not unto thine own understanding."
                </p>
                <p className="text-xs font-bold tracking-widest uppercase opacity-70 relative z-10">— Proverbs 3:5</p>
             </div>

             <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                 <Calendar className="h-4 w-4 mr-2 text-gray-400" /> Upcoming Events
               </h3>
               <div className="space-y-4">
                 <div className="flex items-start">
                   <div className="bg-indigo-50 text-indigo-700 rounded px-2 py-1 text-xs font-bold text-center mr-3">
                     <div>OCT</div>
                     <div className="text-lg">12</div>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-800">Leadership Webinar</p>
                     <p className="text-xs text-gray-500">2:00 PM • Zoom</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="animate-fadeIn">
       <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Overview</h1>
            <p className="text-gray-500 mt-1">Manage curriculum quality and monitor system health.</p>
          </div>
          <div className="flex space-x-3">
             <button onClick={() => onNavigate('import')} className="bg-scripture-blue text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-indigo-800 transition flex items-center">
               <BookOpen className="mr-2 h-4 w-4" /> Upload Lesson
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Active Students" value="1,240" icon={Users} colorClass="bg-indigo-500" />
          <StatCard label="Published Lessons" value={lessons.length.toString()} icon={BookOpen} colorClass="bg-pink-500" />
          <StatCard label="Avg. Class Score" value="76%" icon={BarChart3} colorClass="bg-purple-500" />
          <StatCard label="Pending Reviews" value="3" icon={Bell} colorClass="bg-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <h3 className="font-bold text-gray-900 mb-6">System Analytics</h3>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={performanceData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                   <Tooltip 
                     cursor={{ fill: '#f9fafb' }} 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                   />
                   <Bar dataKey="score" fill="#0B3D91" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
               <h3 className="font-bold text-gray-900">Recent Activity</h3>
             </div>
             <div className="divide-y divide-gray-100">
               {[1,2,3,4].map((i) => (
                 <div key={i} className="p-4 flex items-center hover:bg-gray-50">
                   <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                     JS
                   </div>
                   <div className="flex-1">
                     <p className="text-sm font-medium text-gray-900">John Student completed <span className="text-indigo-600">Genesis 1</span></p>
                     <p className="text-xs text-gray-400">2 hours ago</p>
                   </div>
                   <div className="text-xs font-bold text-green-600">92%</div>
                 </div>
               ))}
             </div>
           </div>
        </div>
    </div>
  );
};