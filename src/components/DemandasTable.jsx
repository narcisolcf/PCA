import { useState } from 'react';
import { Edit2, Trash2, Eye, ChevronDown } from 'lucide-react';
import { Table, Card, Badge, Button, EmptyState } from './ui/index';
import { useTable } from '../hooks';
import {
  formatCurrency,
  formatDate,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  cn,
} from '../lib/utils';

export function DemandasTable({
  demandas = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
}) {
  const [expandedRow, setExpandedRow] = useState(null);

  // Hook useTable para gerenciar ordenação e paginação
  const {
    data: paginatedDemandas,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    totalItems,
    startIndex,
    endIndex,
  } = useTable({
    data: demandas,
    initialSortField: 'created_at',
    initialSortDirection: 'desc',
    pageSize: 10, // 10 itens por página
  });

  // Definição das colunas para o componente Table
  const columns = [
    {
      key: 'item',
      label: 'Item',
      sortable: true,
      render: (demanda) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{demanda.item}</span>
          {demanda.descricao && (
            <span className="text-sm text-slate-500 truncate max-w-xs">
              {demanda.descricao}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'unidade',
      label: 'Unidade',
      render: (demanda) => (
        <span className="text-sm text-slate-600">
          {demanda.unidade?.sigla || demanda.unidade?.nome || '-'}
        </span>
      ),
    },
    {
      key: 'valor_total',
      label: 'Valor',
      sortable: true,
      render: (demanda) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 currency-input">
            {formatCurrency(demanda.valor_total)}
          </span>
          <span className="text-xs text-slate-500">
            {demanda.quantidade} × {formatCurrency(demanda.valor_unitario)}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (demanda) => {
        const status = STATUS_CONFIG[demanda.status] || STATUS_CONFIG.pendente;
        return (
          <Badge className={status.color}>
            {status.icon} {status.label}
          </Badge>
        );
      },
    },
    {
      key: 'prioridade',
      label: 'Prioridade',
      render: (demanda) => {
        const priority =
          PRIORITY_CONFIG[demanda.prioridade] || PRIORITY_CONFIG[3];
        return (
          <span className={cn('text-sm font-medium', priority.color)}>
            {priority.icon} {priority.label}
          </span>
        );
      },
    },
    {
      key: 'data_prevista',
      label: 'Previsão',
      sortable: true,
      render: (demanda) => (
        <div className="flex flex-col">
          <span className="text-sm text-slate-600">
            {formatDate(demanda.data_prevista)}
          </span>
          {demanda.trimestre && (
            <span className="text-xs text-slate-400">{demanda.trimestre}</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      align: 'right',
      render: (demanda) => (
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
      ),
    },
  ];

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table
          columns={columns}
          data={paginatedDemandas}
          sorting={{ field: sortField, direction: sortDirection }}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages,
            hasNextPage,
            hasPrevPage,
            totalItems,
            startIndex,
            endIndex,
          }}
          onPageChange={goToPage}
          loading={loading}
          emptyState={{
            icon: '📋',
            title: 'Nenhuma demanda cadastrada',
            description:
              'Comece adicionando a primeira demanda do seu plano de contratações.',
            action: <Button onClick={() => onEdit(null)}>+ Nova Demanda</Button>,
          }}
          hoverable
          size="md"
        />
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {demandas.length === 0 && !loading ? (
          <Card className="p-8">
            <EmptyState
              icon="📋"
              title="Nenhuma demanda cadastrada"
              description="Comece adicionando a primeira demanda do seu plano de contratações."
              action={
                <Button onClick={() => onEdit(null)}>+ Nova Demanda</Button>
              }
            />
          </Card>
        ) : (
          <Card className="divide-y divide-slate-100">
            {paginatedDemandas.map((demanda) => {
              const status =
                STATUS_CONFIG[demanda.status] || STATUS_CONFIG.pendente;
              const priority =
                PRIORITY_CONFIG[demanda.prioridade] || PRIORITY_CONFIG[3];
              const isExpanded = expandedRow === demanda.id;

              return (
                <div key={demanda.id} className="p-4">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedRow(isExpanded ? null : demanda.id)
                    }
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">
                        {demanda.item}
                      </h3>
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

            {/* Paginação Mobile */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={!hasPrevPage}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={!hasNextPage}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
