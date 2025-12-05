import React, { useState } from 'react';
import { lmsService } from './services/lmsService';
import { Dashboard } from './components/Dashboard';
import { LessonImporter } from './components/LessonImporter';
import { LessonView } from './components/LessonView';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Search, Bell, Menu, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { Role } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState(lmsService.getCurrentUser());
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'IMPORT' | 'LESSON'>('DASHBOARD');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  // --- FULL SCREEN LESSON MODE ---
  if (currentView === 'LESSON' && selectedLessonId) {
    const lesson = lmsService.getLessonById(selectedLessonId);
    if (lesson) {
      return (
        <div className="min-h-screen bg-gray-100">
           <LessonView 
             lesson={lesson} 
             userId={currentUser.id} 
             onExit={() => setCurrentView('DASHBOARD')} 
           />
        </div>
      );
    }
  }

  // --- MAIN APP SHELL ---
  return (
    <div className="flex h-screen bg-neutral-bg font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-20 shadow-sm relative`}>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:text-indigo-600 transition z-50"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-6 w-full'}`}>
             <div className="h-8 w-8 bg-scripture-blue text-white rounded-lg flex items-center justify-center flex-shrink-0">
               <GraduationCap size={20} />
             </div>
             {!isSidebarCollapsed && (
               <span className="ml-3 font-serif font-bold text-gray-800 tracking-tight text-lg">KingdomLMS</span>
             )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <NavItem collapsed={isSidebarCollapsed} active={currentView === 'DASHBOARD'} icon={LayoutDashboard} label="Dashboard" onClick={() => setCurrentView('DASHBOARD')} />
          {currentUser.role !== 'STUDENT' && (
            <NavItem collapsed={isSidebarCollapsed} active={currentView === 'IMPORT'} icon={BookOpen} label="Curriculum" onClick={() => setCurrentView('IMPORT')} />
          )}
          <NavItem collapsed={isSidebarCollapsed} active={false} icon={Users} label="Classes" onClick={() => {}} />
          <NavItem collapsed={isSidebarCollapsed} active={false} icon={Settings} label="Settings" onClick={() => {}} />
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
           <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} mb-4`}>
             <img src={currentUser.avatarUrl} alt="User" className="h-9 w-9 rounded-full border border-gray-200 shadow-sm" />
             {!isSidebarCollapsed && (
               <div className="ml-3 overflow-hidden">
                 <p className="text-sm font-bold text-gray-800 truncate">{currentUser.name}</p>
                 <p className="text-xs text-gray-500 capitalize">{currentUser.role.toLowerCase()}</p>
               </div>
             )}
           </div>

           {!isSidebarCollapsed && (
             <div className="mb-3 px-1">
               <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Demo Role Switch</label>
               <select 
                 value={currentUser.role} 
                 onChange={handleRoleSwitch}
                 className="w-full text-xs bg-white border border-gray-300 rounded p-1.5 focus:ring-1 focus:ring-indigo-500"
               >
                 <option value="ADMIN">Administrator</option>
                 <option value="MENTOR">Mentor</option>
                 <option value="STUDENT">Student</option>
               </select>
             </div>
           )}

           <button className={`flex items-center w-full ${isSidebarCollapsed ? 'justify-center' : 'px-2'} py-2 text-sm text-gray-500 hover:text-red-600 transition rounded-md hover:bg-red-50`}>
             <LogOut size={18} />
             {!isSidebarCollapsed && <span className="ml-3 font-medium">Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* GLOBAL HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8 z-10 sticky top-0">
          
          {/* Global Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text"
                placeholder="Search lessons, scripture, or notes..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 ml-4">
            <button className="p-2 text-gray-400 hover:text-indigo-600 relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
            <span className="text-xs font-medium text-gray-500 hidden md:block">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-neutral-bg scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {currentView === 'DASHBOARD' && (
               <Dashboard user={currentUser} onNavigate={handleNavigate} />
             )}
             {currentView === 'IMPORT' && (
               <LessonImporter onImportComplete={() => setCurrentView('DASHBOARD')} />
             )}
          </div>
        </main>

      </div>
    </div>
  );
}

const NavItem = ({ active, collapsed, icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-3 mb-1 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-indigo-50 text-scripture-blue font-bold shadow-sm' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
    `}
    title={collapsed ? label : undefined}
  >
    <Icon className={`h-5 w-5 ${active ? 'text-scripture-blue' : 'text-gray-400 group-hover:text-gray-600'}`} />
    {!collapsed && <span className="ml-3">{label}</span>}
  </button>
);

export default App;