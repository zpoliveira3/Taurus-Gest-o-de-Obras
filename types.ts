
export interface Project {
  id: string;
  name: string;
  contractor: string;
  startDate: string;
  status: 'active' | 'completed' | 'on_hold';
}

export interface Measurement {
  id: string;
  projectId: string;
  name: string; 
  periodStart: string;
  periodEnd: string;
  receivedValue: number; // Receita
  dateReceived: string;
  labor: number; // Mão de obra
  materials: number; // Material
  equipment: number; // Aluguel de equipamentos
  miscellaneous: number; // Despesas avulsas
  taxRate: number;
  commissionRate: number;
  taxAmount: number;
  commissionAmount: number;
  totalExpenses: number;
  balance: number;
}

export interface Summary {
  totalReceived: number;
  totalExpenses: number;
  totalProfit: number;
  totalTax: number;
  totalCommission: number;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}
