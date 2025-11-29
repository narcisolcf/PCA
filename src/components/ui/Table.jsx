/**
 * Componente Table Reutilizável
 * Tabela genérica com ordenação, paginação e responsividade
 */

import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';
import Card from './Card';
import { EmptyState } from './EmptyState';

/**
 * Ícone de ordenação
 */
const SortIcon = ({ field, sortField, sortDirection }) => {
  if (sortField !== field) return null;
  return sortDirection === 'asc' ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  );
};

/**
 * Componente Table
 *
 * @param {Object} props
 * @param {Array} props.columns - Definição das colunas
 * @param {Array} props.data - Dados da tabela
 * @param {Object} props.sorting - Estado de ordenação { field, direction }
 * @param {Function} props.onSort - Callback de ordenação
 * @param {Object} props.pagination - Estado de paginação
 * @param {Function} props.onPageChange - Callback de mudança de página
 * @param {boolean} props.loading - Estado de carregamento
 * @param {Object} props.emptyState - Configuração de estado vazio
 * @param {string} props.className - Classes adicionais
 * @param {boolean} props.striped - Linhas zebradas
 * @param {boolean} props.hoverable - Hover nas linhas
 * @param {string} props.size - Tamanho (sm, md, lg)
 *
 * @example
 * const columns = [
 *   { key: 'name', label: 'Nome', sortable: true },
 *   { key: 'email', label: 'Email', sortable: true },
 *   { key: 'actions', label: 'Ações', align: 'right', render: (row) => <button>Edit</button> }
 * ];
 */
export default function Table({
  columns = [],
  data = [],
  sorting = null,
  onSort = null,
  pagination = null,
  onPageChange = null,
  loading = false,
  emptyState = null,
  className = '',
  striped = false,
  hoverable = true,
  size = 'md',
}) {
  // Se não há dados e não está carregando, mostra empty state
  if (data.length === 0 && !loading) {
    if (emptyState) {
      return (
        <Card className="p-8">
          <EmptyState {...emptyState} />
        </Card>
      );
    }
    return (
      <Card className="p-8">
        <EmptyState
          icon="📋"
          title="Nenhum dado encontrado"
          description="Não há registros para exibir."
        />
      </Card>
    );
  }

  // Tamanhos de padding
  const paddingClass = {
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  }[size];

  return (
    <div className={cn('w-full', className)}>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {columns.map((column) => {
                  const isSortable = column.sortable && onSort;
                  const align = column.align || 'left';

                  return (
                    <th
                      key={column.key}
                      className={cn(
                        paddingClass,
                        `text-${align} text-xs font-semibold text-slate-600 uppercase tracking-wider`,
                        isSortable &&
                          'cursor-pointer hover:bg-slate-100 transition-colors'
                      )}
                      onClick={() => isSortable && onSort(column.key)}
                      style={{ width: column.width }}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-2',
                          align === 'right' && 'justify-end',
                          align === 'center' && 'justify-center'
                        )}
                      >
                        {column.label}
                        {isSortable && sorting && (
                          <SortIcon
                            field={column.key}
                            sortField={sorting.field}
                            sortDirection={sorting.direction}
                          />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Body */}
            <tbody
              className={cn(
                'divide-y divide-slate-100',
                striped && 'divide-y-0'
              )}
            >
              {data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={cn(
                    'transition-colors',
                    hoverable && 'hover:bg-slate-50',
                    striped && rowIndex % 2 === 1 && 'bg-slate-25'
                  )}
                  style={{ animationDelay: `${rowIndex * 50}ms` }}
                >
                  {columns.map((column) => {
                    const align = column.align || 'left';
                    const cellValue = row[column.key];

                    return (
                      <td
                        key={`${row.id || rowIndex}-${column.key}`}
                        className={cn(paddingClass, `text-${align}`)}
                      >
                        {/* Renderização customizada ou valor padrão */}
                        {column.render
                          ? column.render(row, rowIndex)
                          : cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="border-t border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Info */}
              <div className="text-sm text-slate-600">
                Mostrando{' '}
                <span className="font-medium">
                  {pagination.startIndex + 1}
                </span>{' '}
                a <span className="font-medium">{pagination.endIndex}</span> de{' '}
                <span className="font-medium">{pagination.totalItems}</span>{' '}
                registros
              </div>

              {/* Navegação */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onPageChange && onPageChange(pagination.currentPage - 1)
                  }
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => {
                    const page = i + 1;
                    const isCurrentPage = page === pagination.currentPage;

                    // Mostra apenas algumas páginas ao redor da atual
                    const showPage =
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - pagination.currentPage) <= 1;

                    if (!showPage) {
                      // Mostra reticências
                      if (
                        page === pagination.currentPage - 2 ||
                        page === pagination.currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-2 text-slate-400 text-sm"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange && onPageChange(page)}
                        className={cn(
                          'min-w-[2rem] h-8 rounded-lg text-sm font-medium transition-colors',
                          isCurrentPage
                            ? 'bg-primary-500 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onPageChange && onPageChange(pagination.currentPage + 1)
                  }
                  disabled={!pagination.hasNextPage}
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <div className="spinner spinner-lg" />
          </div>
        )}
      </Card>
    </div>
  );
}
