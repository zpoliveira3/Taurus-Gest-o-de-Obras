
import React from 'react';
import { Plus, Building2, Calendar, User, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onAdd: () => void;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onAdd, onEdit, onDelete, onSelect }) => {
  const getStatusBadge = (status: Project['status']) => {
    switch(status) {
      case 'active': return <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">Ativa</span>;
      case 'completed': return <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-500/20">Concluída</span>;
      case 'on_hold': return <span className="px-3 py-1 bg-amber-900/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/20">Suspensa</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Suas Obras</h1>
          <p className="text-slate-500 mt-1">Gerencie o financeiro e medições de cada empreendimento.</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-slate-950 rounded-2xl hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all font-black active:scale-95"
        >
          <Plus size={24} />
          Nova Obra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col relative overflow-hidden"
          >
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-8">
                <div className="bg-slate-900 p-5 rounded-3xl text-amber-500 shadow-xl shadow-slate-900/10">
                  <Building2 size={32} />
                </div>
                <div className="flex flex-col items-end gap-3">
                  {getStatusBadge(project.status)}
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(project); }}
                      className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100"
                      title="Editar Obra"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(project.id); }}
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                      title="Excluir Obra"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{project.name}</h3>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <span className="font-bold">{project.contractor}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Calendar size={16} className="text-slate-500" />
                  </div>
                  <span className="font-medium">Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => onSelect(project.id)}
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10"
              >
                Gerenciar Medições
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full py-32 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400">
            <div className="bg-white p-6 rounded-full shadow-inner mb-6">
              <Building2 size={64} className="opacity-20" />
            </div>
            <p className="text-xl font-bold">Inicie cadastrando sua primeira obra.</p>
            <p className="text-slate-500 mb-8">Todos os seus registros financeiros serão organizados por obra.</p>
            <button 
              onClick={onAdd} 
              className="px-10 py-4 bg-amber-500 text-slate-950 font-black rounded-2xl hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all"
            >
              Começar Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
