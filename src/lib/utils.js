// Format currency to BRL
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

// Format date to Brazilian format
export function formatDate(date) {
  if (!date) return '-';
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

// Format date to ISO string (YYYY-MM-DD)
export function toISODate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Get quarter from date
export function getQuarter(date) {
  if (!date) return null;
  const month = new Date(date).getMonth();
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
}

// Status labels and colors
export const STATUS_CONFIG = {
  pendente: {
    label: 'Pendente',
    color: 'bg-amber-100 text-amber-800',
    icon: '⏳',
  },
  em_analise: {
    label: 'Em Análise',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔍',
  },
  aprovada: {
    label: 'Aprovada',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '✅',
  },
  rejeitada: {
    label: 'Rejeitada',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
  rascunho: {
    label: 'Rascunho',
    color: 'bg-slate-100 text-slate-800',
    icon: '📝',
  },
  publicado: {
    label: 'Publicado',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '📢',
  },
};

// Priority labels
export const PRIORITY_CONFIG = {
  1: { label: 'Crítica', color: 'text-red-600', icon: '🔴' },
  2: { label: 'Alta', color: 'text-orange-600', icon: '🟠' },
  3: { label: 'Média', color: 'text-yellow-600', icon: '🟡' },
  4: { label: 'Baixa', color: 'text-green-600', icon: '🟢' },
  5: { label: 'Mínima', color: 'text-slate-600', icon: '⚪' },
};

// Calculate totals from array of demandas
export function calculateTotals(demandas) {
  return demandas.reduce(
    (acc, d) => {
      acc.total += d.valor_total || 0;
      acc.count += 1;
      acc.byStatus[d.status] =
        (acc.byStatus[d.status] || 0) + (d.valor_total || 0);
      return acc;
    },
    { total: 0, count: 0, byStatus: {} }
  );
}

// Debounce function
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Generate unique ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Class names helper
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
