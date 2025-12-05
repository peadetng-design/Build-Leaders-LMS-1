import React, { useState } from 'react';
import { lmsService } from './services/lmsService';
import { Dashboard } from './components/Dashboard';
import { LessonImporter } from './components/LessonImporter';
import { LessonView } from './components/LessonView';
import { Layout, LayoutDashboard, Users, BookOpen, Settings, LogOut } from 'lucide-react';
import { Role } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState(lmsService.getCurrentUser());
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'IMPORT' | 'LESSON'>('DASHBOARD');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const handleRoleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUser = lmsService.switchUser(e.target.value as Role);
    setCurrentUser(newUser);
    setCurrentView('DASHBOARD');
  };

  const handleNavigate = (view: string, lessonId?: string) => {
    if (view === 'lesson' && lessonId) {
      setSelectedLessonId(lessonId);
      setCurrentView('LESSON');
    } else if (view === 'import') {
      setCurrentView('IMPORT');
    } else {
      setCurrentView('DASHBOARD');
    }
  };

  // If viewing a lesson, take over full screen (Canvas style)
  if (currentView === 'LESSON' && selectedLessonId) {
    const lesson = lmsService.getLessonById(selectedLessonId);
    if (lesson) {
      return (
        <div className="h-screen bg-gray-100 p-4">
           <LessonView 
             lesson={lesson} 
             userId={currentUser.id} 
             onExit={() => setCurrentView('DASHBOARD')} 
           />
        </div>
      );
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Layout className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight text-white">KingdomLMS</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem active={currentView === 'DASHBOARD'} icon={LayoutDashboard} label="Dashboard" onClick={() => setCurrentView('DASHBOARD')} />
          {currentUser.role !== 'STUDENT' && (
            <NavItem active={currentView === 'IMPORT'} icon={BookOpen} label="Curriculum" onClick={() => setCurrentView('IMPORT')} />
          )}
          <NavItem active={false} icon={Users} label="Classroom" onClick={() => {}} />
          <NavItem active={false} icon={Settings} label="Settings" onClick={() => {}} />
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center mb-4">
            <img src={currentUser.avatarUrl} alt="User" className="h-10 w-10 rounded-full border-2 border-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-slate-400 capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </div>
          
          {/* Debug Role Switcher */}
          <div className="mb-2">
             <label className="text-xs text-slate-500 block mb-1">Switch Role (Demo):</label>
             <select 
               value={currentUser.role} 
               onChange={handleRoleSwitch}
               className="w-full bg-slate-800 text-xs text-slate-300 rounded p-1 border border-slate-700 focus:outline-none focus:border-indigo-500"
             >
               <option value="ADMIN">Admin</option>
               <option value="MENTOR">Mentor</option>
               <option value="STUDENT">Student</option>
             </select>
          </div>
          
          <button className="flex items-center w-full px-3 py-2 text-sm text-slate-400 hover:text-white transition">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-8 shadow-sm">
           <h2 className="text-lg font-medium text-gray-700">
             {currentView === 'IMPORT' ? 'Curriculum Management' : 'Overview'}
           </h2>
           <div className="flex items-center space-x-4">
             <span className="text-sm text-gray-500">Last login: Today, 9:41 AM</span>
           </div>
        </header>
        
        <div className="p-8">
          {currentView === 'DASHBOARD' && (
            <Dashboard user={currentUser} onNavigate={handleNavigate} />
          )}
          {currentView === 'IMPORT' && (
            <LessonImporter onImportComplete={() => setCurrentView('DASHBOARD')} />
          )}
        </div>
      </main>
    </div>
  );
}

const NavItem = ({ active, icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </button>
);

export default App;