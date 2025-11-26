import { useState } from 'react';
import {
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, Badge, Button, EmptyState } from './ui';
import {
  formatCurrency,
  formatDate,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  cn,
} from '../lib/utils';

// Sort icon component (moved outside to avoid recreation on every render)
const SortIcon = ({ field, sortField, sortDirection }) => {
  if (sortField !== field) return null;
  return sortDirection === 'asc' ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  );
};

export function DemandasTable({
  demandas = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
}) {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDemandas = [...demandas].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'valor_total') {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (demandas.length === 0 && !loading) {
    return (
      <Card className="p-8">
        <EmptyState
          icon="📋"
          title="Nenhuma demanda cadastrada"
          description="Comece adicionando a primeira demanda do seu plano de contratações."
          action={<Button onClick={() => onEdit(null)}>+ Nova Demanda</Button>}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('item')}
              >
                <div className="flex items-center gap-2">
                  Item{' '}
                  <SortIcon
                    field="item"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Unidade
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('valor_total')}
              >
                <div className="flex items-center gap-2">
                  Valor{' '}
                  <SortIcon
                    field="valor_total"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Prioridade
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('data_prevista')}
              >
                <div className="flex items-center gap-2">
                  Previsão{' '}
                  <SortIcon
                    field="data_prevista"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedDemandas.map((demanda, index) => {
              const status =
                STATUS_CONFIG[demanda.status] || STATUS_CONFIG.pendente;
              const priority =
                PRIORITY_CONFIG[demanda.prioridade] || PRIORITY_CONFIG[3];

              return (
                <tr
                  key={demanda.id}
                  className="table-row-hover transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {demanda.item}
                      </span>
                      {demanda.descricao && (
                        <span className="text-sm text-slate-500 truncate max-w-xs">
                          {demanda.descricao}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {demanda.unidade?.sigla || demanda.unidade?.nome || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 currency-input">
                        {formatCurrency(demanda.valor_total)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {demanda.quantidade} ×{' '}
                        {formatCurrency(demanda.valor_unitario)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={status.color}>
                      {status.icon} {status.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('text-sm font-medium', priority.color)}>
                      {priority.icon} {priority.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-600">
                        {formatDate(demanda.data_prevista)}
                      </span>
                      {demanda.trimestre && (
                        <span className="text-xs text-slate-400">
                          {demanda.trimestre}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView?.(demanda)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(demanda)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(demanda.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-slate-100">
        {sortedDemandas.map((demanda) => {
          const status =
            STATUS_CONFIG[demanda.status] || STATUS_CONFIG.pendente;
          const priority =
            PRIORITY_CONFIG[demanda.prioridade] || PRIORITY_CONFIG[3];
          const isExpanded = expandedRow === demanda.id;

          return (
            <div key={demanda.id} className="p-4">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedRow(isExpanded ? null : demanda.id)}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{demanda.item}</h3>
                  <p className="text-sm text-slate-500">
                    {demanda.unidade?.nome}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className={status.color}>
                      {status.icon} {status.label}
                    </Badge>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(demanda.valor_total)}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-slate-400 transition-transform',
                    isExpanded && 'rotate-180'
                  )}
                />
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                  {demanda.descricao && (
                    <p className="text-sm text-slate-600 mb-3">
                      {demanda.descricao}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Quantidade:</span>
                      <span className="ml-2 font-medium">
                        {demanda.quantidade}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Previsão:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(demanda.data_prevista)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Prioridade:</span>
                      <span className={cn('ml-2 font-medium', priority.color)}>
                        {priority.icon} {priority.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(demanda)}
                    >
                      <Edit2 className="w-4 h-4" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(demanda.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Excluir
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
