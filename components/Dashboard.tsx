
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Wallet, HardHat, HandCoins, Receipt } from 'lucide-react';
import { Measurement } from '../types';
import { calculateSummary, formatCurrency } from '../utils/calculations';

interface DashboardProps {
  measurements: Measurement[];
}

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string, icon: any, color: string, trend?: 'up' | 'down' }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <span className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {trend === 'up' ? 'ATIVO' : 'ALERTA'}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{title}</p>
    <h3 className="text-xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ measurements = [] }) => {
  const summary = calculateSummary(measurements);
  
  const chartData = useMemo(() => {
    if (!measurements || measurements.length === 0) return [];
    return measurements.map(m => ({
      name: m.name || 'Sem Nome',
      recebido: Number(m.receivedValue) || 0,
      gastos: (Number(m.totalExpenses) || 0) - (Number(m.taxAmount) || 0) - (Number(m.commissionAmount) || 0),
      impostos: Number(m.taxAmount) || 0,
      comissao: Number(m.commissionAmount) || 0,
      lucro: Number(m.balance) || 0
    }));
  }, [measurements]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Painel Executivo</h1>
        <p className="text-slate-500 mt-1 font-medium">Resumo financeiro consolidado de todas as obras.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Faturamento Bruto" value={formatCurrency(summary.totalReceived)} icon={DollarSign} color="bg-emerald-600" trend="up" />
        <StatCard title="Custos de Obra" value={formatCurrency(summary.totalExpenses)} icon={HardHat} color="bg-slate-700" />
        <StatCard title="Total Impostos" value={formatCurrency(summary.totalTax)} icon={Receipt} color="bg-amber-600" />
        <StatCard title="Total Comissões" value={formatCurrency(summary.totalCommission)} icon={HandCoins} color="bg-rose-600" />
        <StatCard title="Resultado Líquido" value={formatCurrency(summary.totalProfit)} icon={Wallet} color={summary.totalProfit >= 0 ? "bg-blue-600" : "bg-red-600"} trend={summary.totalProfit >= 0 ? 'up' : 'down'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[450px]">
          <h2 className="text-lg font-black text-slate-800 mb-8">Performance por Medição</h2>
          <div className="h-[350px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(value) => `R$ ${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="recebido" name="Recebido" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gastos" name="Gastos" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                <TrendingUp size={48} className="opacity-10 mb-2" />
                <p className="font-bold text-sm">Aguardando dados para gerar gráfico...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white">
          <h2 className="text-lg font-black mb-8 flex items-center gap-2">
             <Percent size={20} className="text-amber-500" /> Rentabilidade
          </h2>
          <div className="space-y-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Margem Líquida</p>
              <p className="text-4xl font-black text-amber-500">
                {summary.totalReceived > 0 ? ((summary.totalProfit / summary.totalReceived) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between text-xs font-bold text-slate-400">
                 <span>Impostos / Faturamento</span>
                 <span className="text-white">{summary.totalReceived > 0 ? ((summary.totalTax / summary.totalReceived) * 100).toFixed(1) : 0}%</span>
               </div>
               <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                 <div className="bg-amber-600 h-full" style={{ width: `${summary.totalReceived > 0 ? Math.min((summary.totalTax/summary.totalReceived)*100, 100) : 0}%` }}></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
