/**
 * Testes Unitários - useTable Hook
 * Valida ordenação, paginação e filtragem
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTable } from '../../../hooks/useTable';

// Mock data
const mockData = [
  { id: 1, name: 'Alice', age: 30, city: 'New York' },
  { id: 2, name: 'Bob', age: 25, city: 'Los Angeles' },
  { id: 3, name: 'Charlie', age: 35, city: 'Chicago' },
  { id: 4, name: 'Diana', age: 28, city: 'Houston' },
  { id: 5, name: 'Eve', age: 32, city: 'Phoenix' },
  { id: 6, name: 'Frank', age: 27, city: 'Philadelphia' },
  { id: 7, name: 'Grace', age: 31, city: 'San Antonio' },
  { id: 8, name: 'Hank', age: 29, city: 'San Diego' },
  { id: 9, name: 'Ivy', age: 26, city: 'Dallas' },
  { id: 10, name: 'Jack', age: 33, city: 'San Jose' },
  { id: 11, name: 'Kate', age: 24, city: 'Austin' },
  { id: 12, name: 'Leo', age: 36, city: 'Jacksonville' },
];

describe('useTable Hook', () => {
  // ==================== INICIALIZAÇÃO ====================
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useTable({ data: mockData }));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.sortField).toBeNull();
      expect(result.current.sortDirection).toBe('asc');
      expect(result.current.totalItems).toBe(mockData.length);
    });

    it('should initialize with custom page size', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      expect(result.current.data).toHaveLength(5);
      expect(result.current.totalPages).toBe(Math.ceil(mockData.length / 5));
    });

    it('should initialize with custom sort field', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        initialSortField: 'name',
        initialSortDirection: 'desc'
      }));

      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('desc');
    });
  });

  // ==================== PAGINAÇÃO ====================
  describe('Pagination', () => {
    it('should paginate data correctly', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      expect(result.current.data).toHaveLength(5);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.startIndex).toBe(0);
      expect(result.current.endIndex).toBe(5);
    });

    it('should navigate to next page', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.data).toHaveLength(5);
      expect(result.current.startIndex).toBe(5);
      expect(result.current.endIndex).toBe(10);
    });

    it('should navigate to previous page', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.prevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should go to specific page', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.data).toHaveLength(2); // Last page with remaining items
    });

    it('should not go to page beyond total pages', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      const { totalPages } = result.current;

      act(() => {
        result.current.goToPage(10); // Beyond total pages
      });

      expect(result.current.currentPage).toBe(totalPages); // Should clamp to last page
    });

    it('should not go to page less than 1', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      act(() => {
        result.current.goToPage(0); // Less than 1
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should reset pagination', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      act(() => {
        result.current.goToPage(3);
        result.current.resetPagination();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should have correct hasNextPage and hasPrevPage', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      // Page 1
      expect(result.current.hasPrevPage).toBe(false);
      expect(result.current.hasNextPage).toBe(true);

      // Page 2
      act(() => {
        result.current.nextPage();
      });

      expect(result.current.hasPrevPage).toBe(true);
      expect(result.current.hasNextPage).toBe(true);

      // Last page
      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.hasPrevPage).toBe(true);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  // ==================== ORDENAÇÃO ====================
  describe('Sorting', () => {
    it('should sort data by field ascending', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 100 // Show all data
      }));

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('asc');
      expect(result.current.data[0].name).toBe('Alice');
      expect(result.current.data[11].name).toBe('Leo');
    });

    it('should sort data by field descending', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 100
      }));

      act(() => {
        result.current.handleSort('name'); // First click: asc
      });

      expect(result.current.sortDirection).toBe('asc');
      expect(result.current.data[0].name).toBe('Alice');

      act(() => {
        result.current.handleSort('name'); // Second click: desc
      });

      expect(result.current.sortDirection).toBe('desc');
      expect(result.current.data[0].name).toBe('Leo');
      expect(result.current.data[11].name).toBe('Alice');
    });

    it('should sort numeric fields correctly', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 100
      }));

      act(() => {
        result.current.handleSort('age');
      });

      expect(result.current.data[0].age).toBe(24); // Kate
      expect(result.current.data[11].age).toBe(36); // Leo
    });

    it('should reset to page 1 when sorting changes', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should toggle sort direction on same field', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 100
      }));

      act(() => {
        result.current.handleSort('age');
      });

      expect(result.current.sortDirection).toBe('asc');

      act(() => {
        result.current.handleSort('age');
      });

      expect(result.current.sortDirection).toBe('desc');

      act(() => {
        result.current.handleSort('age');
      });

      expect(result.current.sortDirection).toBe('asc');
    });

    it('should set sort programmatically', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 100
      }));

      act(() => {
        result.current.setSort('name', 'desc');
      });

      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('desc');
    });
  });

  // ==================== FILTRAGEM ====================
  describe('Filtering', () => {
    it('should filter data with custom filter function', () => {
      const filterFn = (item) => item.age > 30;

      const { result } = renderHook(() => useTable({
        data: mockData,
        filterFn,
        pageSize: 100
      }));

      expect(result.current.data.length).toBeLessThan(mockData.length);
      expect(result.current.data.every(item => item.age > 30)).toBe(true);
    });

    it('should update pagination when filter changes', () => {
      const { result, rerender } = renderHook(
        ({ filterFn }) => useTable({
          data: mockData,
          filterFn,
          pageSize: 5
        }),
        {
          initialProps: { filterFn: null }
        }
      );

      const initialTotalPages = result.current.totalPages;

      // Apply filter
      rerender({ filterFn: (item) => item.age > 30 });

      expect(result.current.totalPages).toBeLessThanOrEqual(initialTotalPages);
    });
  });

  // ==================== INFORMAÇÕES ====================
  describe('Information', () => {
    it('should indicate if table is empty', () => {
      const { result } = renderHook(() => useTable({
        data: [],
        pageSize: 10
      }));

      expect(result.current.isEmpty).toBe(true);
    });

    it('should provide correct totalItems', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      expect(result.current.totalItems).toBe(mockData.length);
    });

    it('should provide correct itemsInPage', () => {
      const { result } = renderHook(() => useTable({
        data: mockData,
        pageSize: 5
      }));

      expect(result.current.itemsInPage).toBe(5);

      act(() => {
        result.current.goToPage(3); // Last page with 2 items
      });

      expect(result.current.itemsInPage).toBe(2);
    });
  });

  // ==================== EDGE CASES ====================
  describe('Edge Cases', () => {
    it('should handle empty data array', () => {
      const { result } = renderHook(() => useTable({
        data: [],
        pageSize: 10
      }));

      expect(result.current.data).toEqual([]);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.isEmpty).toBe(true);
    });

    it('should handle single item', () => {
      const { result } = renderHook(() => useTable({
        data: [mockData[0]],
        pageSize: 10
      }));

      expect(result.current.data).toHaveLength(1);
      expect(result.current.totalPages).toBe(1);
    });

    it('should handle data update', () => {
      const { result, rerender } = renderHook(
        ({ data }) => useTable({ data, pageSize: 5 }),
        { initialProps: { data: mockData.slice(0, 5) } }
      );

      expect(result.current.totalPages).toBe(1);

      rerender({ data: mockData });

      expect(result.current.totalPages).toBe(3);
    });
  });
});
