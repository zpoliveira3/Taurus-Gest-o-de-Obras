
import { Measurement, Summary } from '../types';

export const calculateMeasurement = (m: Partial<Measurement>): Measurement => {
  const labor = m.labor || 0;
  const materials = m.materials || 0;
  const equipment = m.equipment || 0;
  const miscellaneous = m.miscellaneous || 0;
  const receivedValue = m.receivedValue || 0;
  const taxRate = m.taxRate || 0;
  const commissionRate = m.commissionRate || 0;

  const taxAmount = (receivedValue * taxRate) / 100;
  const commissionAmount = (receivedValue * commissionRate) / 100;
  
  const operationalExpenses = labor + materials + equipment + miscellaneous;
  const totalExpenses = operationalExpenses + taxAmount + commissionAmount;
  const balance = receivedValue - totalExpenses;

  return {
    ...m,
    id: m.id || Math.random().toString(36).substr(2, 9),
    name: m.name || '',
    periodStart: m.periodStart || '',
    periodEnd: m.periodEnd || '',
    receivedValue,
    dateReceived: m.dateReceived || '',
    labor,
    materials,
    equipment,
    miscellaneous,
    taxRate,
    commissionRate,
    taxAmount,
    commissionAmount,
    totalExpenses,
    balance
  } as Measurement;
};

export const calculateSummary = (measurements: Measurement[]): Summary => {
  return measurements.reduce((acc, curr) => ({
    totalReceived: acc.totalReceived + curr.receivedValue,
    totalExpenses: acc.totalExpenses + (curr.labor + curr.materials + curr.equipment + curr.miscellaneous),
    totalProfit: acc.totalProfit + curr.balance,
    totalTax: acc.totalTax + curr.taxAmount,
    totalCommission: acc.totalCommission + curr.commissionAmount,
  }), {
    totalReceived: 0,
    totalExpenses: 0,
    totalProfit: 0,
    totalTax: 0,
    totalCommission: 0,
  });
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
