
import React, { useState, useEffect } from 'react';
import { X, Save, Building, Receipt, HandCoins } from 'lucide-react';
import { Measurement, Project } from '../types';
import { calculateMeasurement, formatCurrency } from '../utils/calculations';

interface MeasurementFormProps {
  measurement?: Measurement;
  projects: Project[];
  selectedProjectId?: string | null;
  onSave: (m: Measurement) => void;
  onClose: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ measurement, projects, selectedProjectId, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Measurement>>({
    projectId: selectedProjectId || projects[0]?.id || '',
    name: '',
    periodStart: '',
    periodEnd: '',
    receivedValue: 0,
    dateReceived: '',
    labor: 0,
    materials: 0,
    equipment: 0,
    miscellaneous: 0,
    taxRate: 6.0,
    commissionRate: 0,
  });

  useEffect(() => {
    if (measurement) {
      setFormData(measurement);
    } else if (selectedProjectId) {
      setFormData(prev => ({ ...prev, projectId: selectedProjectId }));
    }
  }, [measurement, selectedProjectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) {
      alert("Por favor, selecione uma obra para este lançamento.");
      return;
    }
    const updated = calculateMeasurement(formData);
    onSave(updated);
  };

  const livePreview = calculateMeasurement(formData);

  const darkInput = "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{measurement ? 'Editar Lançamento' : 'Novo Lançamento Financeiro'}</h2>
            <p className="text-sm text-slate-500">Gestão de Receitas, Despesas e Impostos.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Identificação */}
          <section>
            <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Building size={16} /> Identificação e Período
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Obra</label>
                <select name="projectId" value={formData.projectId} onChange={handleChange} disabled={!!selectedProjectId && !measurement} className={darkInput}>
                  <option value="">Selecione...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Referência (Ex: Março/2026)</label>
                <input required name="name" value={formData.name} onChange={handleChange} placeholder="Mês/Ano" className={darkInput} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Início do Período</label>
                <input required type="date" name="periodStart" value={formData.periodStart} onChange={handleChange} className={darkInput} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Fim do Período</label>
                <input required type="date" name="periodEnd" value={formData.periodEnd} onChange={handleChange} className={darkInput} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Receitas */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <HandCoins size={16} /> Receitas e Tributos
              </h3>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Valor da Receita (R$)</label>
                  <input required type="number" step="0.01" name="receivedValue" value={formData.receivedValue} onChange={handleChange} className={darkInput + " text-lg font-bold text-emerald-400"} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Imposto (%)</label>
                    <input required type="number" step="0.1" name="taxRate" value={formData.taxRate} onChange={handleChange} className={darkInput} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400">Comissão (%)</label>
                    <input required type="number" step="0.1" name="commissionRate" value={formData.commissionRate} onChange={handleChange} className={darkInput} />
                  </div>
                </div>
              </div>
            </div>

            {/* Despesas */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                <Receipt size={16} /> Detalhamento de Despesas
              </h3>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Mão de Obra (R$)</label>
                  <input required type="number" step="0.01" name="labor" value={formData.labor} onChange={handleChange} className={darkInput} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Material (R$)</label>
                  <input required type="number" step="0.01" name="materials" value={formData.materials} onChange={handleChange} className={darkInput} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Aluguel de Equipamentos (R$)</label>
                  <input required type="number" step="0.01" name="equipment" value={formData.equipment} onChange={handleChange} className={darkInput} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Despesas Avulsas (R$)</label>
                  <input required type="number" step="0.01" name="miscellaneous" value={formData.miscellaneous} onChange={handleChange} className={darkInput} />
                </div>
              </div>
            </div>
          </div>

          {/* Resumo Dinâmico */}
          <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 flex flex-wrap items-center justify-between gap-8">
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Receita Bruta</p>
              <p className="text-2xl font-bold text-emerald-500">{formatCurrency(livePreview.receivedValue)}</p>
            </div>
            <div className="h-12 w-px bg-slate-800 hidden md:block"></div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Custo Operacional</p>
              <p className="text-2xl font-bold text-slate-300">{formatCurrency(livePreview.labor + livePreview.materials + livePreview.equipment + livePreview.miscellaneous)}</p>
            </div>
            <div className="h-12 w-px bg-slate-800 hidden md:block"></div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Impostos e Comissões</p>
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(livePreview.taxAmount + livePreview.commissionAmount)}</p>
            </div>
            <div className="h-12 w-px bg-slate-800 hidden md:block"></div>
            <div className="bg-amber-500/10 px-8 py-4 rounded-2xl border border-amber-500/20">
              <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Saldo Líquido</p>
              <p className={`text-3xl font-black ${livePreview.balance >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                {formatCurrency(livePreview.balance)}
              </p>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-400 font-bold hover:text-slate-100 transition-colors">Cancelar</button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-10 py-3 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400 shadow-xl shadow-amber-500/10 transition-all active:scale-95">
            <Save size={18} />
            {measurement ? 'Salvar Alterações' : 'Confirmar Lançamento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementForm;
