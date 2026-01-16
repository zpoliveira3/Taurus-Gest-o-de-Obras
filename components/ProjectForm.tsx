
import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectFormProps {
  project?: Project;
  onSave: (p: Project) => void;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    contractor: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData: Project = {
      id: project?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      contractor: formData.contractor || '',
      startDate: formData.startDate || '',
      status: (formData.status as any) || 'active'
    };
    onSave(projectData);
  };

  const inputStyles = "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg text-white">
              <Building2 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              {project ? 'Editar Obra' : 'Nova Obra'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-400">Nome da Obra</label>
            <input 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Edifício Central"
              className={inputStyles}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-400">Contratante</label>
            <input 
              required 
              value={formData.contractor}
              onChange={(e) => setFormData({...formData, contractor: e.target.value})}
              placeholder="Nome do Cliente ou Empresa"
              className={inputStyles}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-400">Data de Início</label>
              <input 
                required 
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className={inputStyles}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-400">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                className={inputStyles}
              >
                <option value="active">Ativa</option>
                <option value="completed">Concluída</option>
                <option value="on_hold">Suspensa</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-slate-400 font-bold hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-amber-500 text-slate-900 font-black rounded-xl hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Salvar Obra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
