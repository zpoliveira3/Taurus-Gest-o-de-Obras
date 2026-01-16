
import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_PROJECTS, INITIAL_MEASUREMENTS } from './constants';
import { Project, Measurement } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import MeasurementList from './components/MeasurementList';
import MeasurementForm from './components/MeasurementForm';
import { Construction, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ username: '' });
  
  // Safe State Loading
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('cm_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch (e) {
      console.error("Erro ao carregar obras:", e);
      return INITIAL_PROJECTS;
    }
  });
  
  const [measurements, setMeasurements] = useState<Measurement[]>(() => {
    try {
      const saved = localStorage.getItem('cm_measurements');
      return saved ? JSON.parse(saved) : INITIAL_MEASUREMENTS;
    } catch (e) {
      console.error("Erro ao carregar medições:", e);
      return INITIAL_MEASUREMENTS;
    }
  });

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'projects' | 'measurements'>('dashboard');
  
  useEffect(() => {
    localStorage.setItem('cm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('cm_measurements', JSON.stringify(measurements));
  }, [measurements]);

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [isMeasurementFormOpen, setIsMeasurementFormOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | undefined>();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser.toLowerCase() === 'admin' && loginPass === 'admin') {
      setIsAuthenticated(true);
      setUser({ username: 'Diretor Geral' });
      setLoginError('');
    } else {
      setLoginError('Acesso Negado. Verifique os dados.');
    }
  };

  const handleSaveProject = (p: Project) => {
    setProjects(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? p : item);
      return [p, ...prev];
    });
    setIsProjectFormOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('CUIDADO: Ao excluir esta obra, todas as medições dela serão apagadas. Confirmar?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      setMeasurements(prev => prev.filter(m => m.projectId !== id));
      if (selectedProjectId === id) setSelectedProjectId(null);
    }
  };

  const handleSaveMeasurement = (m: Measurement) => {
    setMeasurements(prev => {
      const exists = prev.find(item => item.id === m.id);
      if (exists) return prev.map(item => item.id === m.id ? m : item);
      return [m, ...prev];
    });
    setIsMeasurementFormOpen(false);
  };

  const handleDeleteMeasurement = (id: string) => {
    if (window.confirm('Deseja excluir este lançamento financeiro?')) {
      setMeasurements(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredMeasurements = selectedProjectId 
    ? measurements.filter(m => m.projectId === selectedProjectId)
    : measurements;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 -left-10 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center mb-10">
              <div className="bg-amber-500 p-5 rounded-3xl mb-8">
                <Construction size={48} className="text-slate-950" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight text-center">ConstructMaster</h1>
              <p className="text-slate-400 font-medium text-center mt-2">Plataforma de Gestão de Obras</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase px-1 tracking-widest flex items-center gap-2">
                  <UserIcon size={14} /> Usuário
                </label>
                <input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:border-amber-500 transition-all font-bold" placeholder="admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase px-1 tracking-widest flex items-center gap-2">
                  <Lock size={14} /> Senha
                </label>
                <input type="password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:border-amber-500 transition-all font-bold" placeholder="admin" />
              </div>
              {loginError && <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold">{loginError}</div>}
              <button type="submit" className="w-full py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-lg hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10">Acessar</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={user} 
      onLogout={() => setIsAuthenticated(false)}
      currentPage={currentPage}
      setPage={(p) => {
        if (p !== 'measurements') setSelectedProjectId(null);
        setCurrentPage(p);
      }}
    >
      {currentPage === 'dashboard' && <Dashboard measurements={measurements} />}
      {currentPage === 'projects' && (
        <ProjectList 
          projects={projects} 
          onAdd={() => { setEditingProject(undefined); setIsProjectFormOpen(true); }}
          onEdit={(p) => { setEditingProject(p); setIsProjectFormOpen(true); }}
          onDelete={handleDeleteProject}
          onSelect={(id) => { setSelectedProjectId(id); setCurrentPage('measurements'); }}
        />
      )}
      {currentPage === 'measurements' && (
        <MeasurementList 
          measurements={filteredMeasurements}
          onAdd={() => { setEditingMeasurement(undefined); setIsMeasurementFormOpen(true); }}
          onEdit={(m) => { setEditingMeasurement(m); setIsMeasurementFormOpen(true); }}
          onDelete={handleDeleteMeasurement}
        />
      )}

      {isProjectFormOpen && <ProjectForm project={editingProject} onSave={handleSaveProject} onClose={() => setIsProjectFormOpen(false)} />}
      {isMeasurementFormOpen && <MeasurementForm measurement={editingMeasurement} projects={projects} selectedProjectId={selectedProjectId} onSave={handleSaveMeasurement} onClose={() => setIsMeasurementFormOpen(false)} />}
    </Layout>
  );
};

export default App;
