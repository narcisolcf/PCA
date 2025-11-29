/**
 * Hook para gerenciar estado e lógica de tabelas
 * Fornece ordenação, paginação e outras funcionalidades comuns de tabelas
 */

import { useState, useMemo, useCallback } from 'react';

/**
 * Hook useTable
 *
 * @param {Object} config - Configuração do hook
 * @param {Array} config.data - Dados da tabela
 * @param {string} config.initialSortField - Campo inicial de ordenação
 * @param {string} config.initialSortDirection - Direção inicial ('asc' ou 'desc')
 * @param {number} config.pageSize - Tamanho da página (padrão: 10, 0 = sem paginação)
 * @param {Function} config.filterFn - Função customizada de filtro
 *
 * @returns {Object} Estado e métodos da tabela
 *
 * @example
 * const { sortedData, sortField, sortDirection, handleSort, currentPage, totalPages, nextPage, prevPage } = useTable({
 *   data: demandas,
 *   initialSortField: 'created_at',
 *   initialSortDirection: 'desc',
 *   pageSize: 10
 * });
 */
export function useTable({
  data = [],
  initialSortField = null,
  initialSortDirection = 'asc',
  pageSize = 10,
  filterFn = null,
}) {
  // Estado de ordenação
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  // Estado de paginação
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Alterna ordenação por campo
   */
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        // Mesmo campo: inverte direção
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        // Novo campo: ordena ascendente
        setSortField(field);
        setSortDirection('asc');
      }
      // Reset para primeira página ao ordenar
      setCurrentPage(1);
    },
    [sortField]
  );

  /**
   * Define ordenação programaticamente
   */
  const setSort = useCallback((field, direction = 'asc') => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1);
  }, []);

  /**
   * Dados filtrados (se filterFn fornecido)
   */
  const filteredData = useMemo(() => {
    if (!filterFn) return data;
    return data.filter(filterFn);
  }, [data, filterFn]);

  /**
   * Dados ordenados
   */
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Conversão automática para números se necessário
      if (typeof aVal === 'string' && !isNaN(parseFloat(aVal))) {
        aVal = parseFloat(aVal);
      }
      if (typeof bVal === 'string' && !isNaN(parseFloat(bVal))) {
        bVal = parseFloat(bVal);
      }

      // Comparação
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  /**
   * Dados paginados
   */
  const paginatedData = useMemo(() => {
    if (pageSize === 0) return sortedData; // Sem paginação

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  /**
   * Informações de paginação
   */
  const totalPages = useMemo(() => {
    if (pageSize === 0) return 1;
    return Math.ceil(sortedData.length / pageSize);
  }, [sortedData.length, pageSize]);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  /**
   * Navegação de páginas
   */
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const goToPage = useCallback(
    (page) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  /**
   * Reset paginação para primeira página
   */
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    // Dados
    data: paginatedData, // Dados a serem exibidos
    sortedData, // Todos os dados ordenados (sem paginação)
    filteredData, // Todos os dados filtrados (sem ordenação/paginação)
    totalItems: sortedData.length,

    // Ordenação
    sortField,
    sortDirection,
    handleSort,
    setSort,

    // Paginação
    currentPage,
    totalPages,
    pageSize,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,

    // Info
    isEmpty: sortedData.length === 0,
    itemsInPage: paginatedData.length,
    startIndex: pageSize === 0 ? 0 : (currentPage - 1) * pageSize,
    endIndex:
      pageSize === 0
        ? sortedData.length
        : Math.min(currentPage * pageSize, sortedData.length),
  };
}
