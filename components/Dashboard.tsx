
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Wallet, HardHat, HandCoins, Receipt } from 'lucide-react';
import { Measurement, Summary } from '../types';
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
        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          Fluxo
        </span>
      )}
    </div>
    <p className="text-slate-500 text-xs font-black uppercase tracking-wider">{title}</p>
    <h3 className="text-xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ measurements }) => {
  const summary = calculateSummary(measurements);
  
  const chartData = measurements.map(m => ({
    name: m.name,
    recebido: m.receivedValue,
    gastos: m.totalExpenses - m.taxAmount - m.commissionAmount,
    impostos: m.taxAmount,
    comissao: m.commissionAmount,
    lucro: m.balance
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Visão Geral do Negócio</h1>
        <p className="text-slate-500 mt-1 font-medium">Controle total sobre o faturamento e rentabilidade das suas obras.</p>
      </div>

      {/* Cards de Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard 
          title="Faturamento Bruto" 
          value={formatCurrency(summary.totalReceived)} 
          icon={DollarSign} 
          color="bg-emerald-600"
          trend="up"
        />
        <StatCard 
          title="Custos de Obra" 
          value={formatCurrency(summary.totalExpenses)} 
          icon={HardHat} 
          color="bg-slate-700" 
        />
        <StatCard 
          title="Total Impostos" 
          value={formatCurrency(summary.totalTax)} 
          icon={Receipt} 
          color="bg-amber-600" 
        />
        <StatCard 
          title="Total Comissões" 
          value={formatCurrency(summary.totalCommission)} 
          icon={HandCoins} 
          color="bg-rose-600" 
        />
        <StatCard 
          title="Resultado Líquido" 
          value={formatCurrency(summary.totalProfit)} 
          icon={Wallet} 
          color={summary.totalProfit >= 0 ? "bg-blue-600" : "bg-red-600"}
          trend={summary.totalProfit >= 0 ? 'up' : 'down'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparativo Gráfico */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-800">Fluxo Financeiro por Medição</h2>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-emerald-600">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div> Receita
              </span>
              <span className="flex items-center gap-2 text-slate-400">
                <div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div> Custos
              </span>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(value) => `R$ ${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 800 }}
                  labelStyle={{ marginBottom: '8px', fontWeight: 900, color: '#1e293b' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="recebido" name="Recebido" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="gastos" name="Custo Operacional" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detalhamento de Custos */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col text-white">
          <h2 className="text-lg font-black mb-8 flex items-center gap-2">
             <Percent size={20} className="text-amber-500" />
             Mix de Despesas
          </h2>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>MÃO DE OBRA</span>
                <span className="text-white">{formatCurrency(measurements.reduce((a, b) => a + b.labor, 0))}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>MATERIAIS</span>
                <span className="text-white">{formatCurrency(measurements.reduce((a, b) => a + b.materials, 0))}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>IMPOSTOS E TAXAS</span>
                <span className="text-white">{formatCurrency(summary.totalTax)}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-800">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Lucratividade Média</p>
              <p className="text-3xl font-black text-white">
                {summary.totalReceived > 0 ? ((summary.totalProfit / summary.totalReceived) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
