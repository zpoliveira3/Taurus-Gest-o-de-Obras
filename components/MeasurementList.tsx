
import React from 'react';
import { Plus, Edit3, Trash2, Calendar, Download } from 'lucide-react';
import { Measurement } from '../types';
import { formatCurrency } from '../utils/calculations';

interface MeasurementListProps {
  measurements: Measurement[];
  onAdd: () => void;
  onEdit: (m: Measurement) => void;
  onDelete: (id: string) => void;
}

const MeasurementList: React.FC<MeasurementListProps> = ({ measurements, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestão de Medições</h1>
          <p className="text-slate-500 mt-1">Lançamentos de receitas, despesas e impostos por período.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold"
            onClick={() => window.print()}
          >
            <Download size={18} />
            Exportar PDF
          </button>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 rounded-xl hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all font-black active:scale-95"
          >
            <Plus size={20} />
            Nova Medição
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medição</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Período</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Receita</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Despesas</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Saldo Líquido</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-black text-slate-900">{m.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">ID: {m.id}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="font-medium">
                        {new Date(m.periodStart).toLocaleDateString('pt-BR')} - {new Date(m.periodEnd).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="font-bold text-emerald-600">{formatCurrency(m.receivedValue)}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="text-sm font-bold text-slate-700">{formatCurrency(m.totalExpenses)}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Tx: {m.taxRate}% | Com: {m.commissionRate}%</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-black ${
                      m.balance >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                    }`}>
                      {formatCurrency(m.balance)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => onEdit(m)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 active:scale-90"
                        title="Editar"
                      >
                        <Edit3 size={18} className="pointer-events-none" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => onDelete(m.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 active:scale-90"
                        title="Excluir"
                      >
                        <Trash2 size={18} className="pointer-events-none" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {measurements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <Plus className="text-slate-300" size={32} />
                      </div>
                      <p className="text-slate-400 font-bold">Nenhuma medição encontrada.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MeasurementList;
