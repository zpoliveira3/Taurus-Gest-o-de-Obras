
import React from 'react';
import { LayoutDashboard, ClipboardList, LogOut, User as UserIcon, Construction, Building2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: { username: string };
  onLogout: () => void;
  currentPage: 'dashboard' | 'projects' | 'measurements';
  setPage: (page: 'dashboard' | 'projects' | 'measurements') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, setPage }) => {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Construction size={24} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">ConstructMaster</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setPage('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'dashboard' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Painel Geral</span>
          </button>

          <button
            onClick={() => setPage('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'projects' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 size={20} />
            <span className="font-medium">Obras</span>
          </button>
          
          <button
            onClick={() => setPage('measurements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === 'measurements' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ClipboardList size={20} />
            <span className="font-medium">Medições</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="bg-slate-700 p-1.5 rounded-full">
              <UserIcon size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate">{user.username}</span>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Admin</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
