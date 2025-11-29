/**
 * Testes Unitários - useForm Hook
 * Valida gerenciamento de estado de formulário
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../../../hooks/useForm';

describe('useForm Hook', () => {
  // ==================== INICIALIZAÇÃO ====================
  describe('Initialization', () => {
    it('should initialize with empty values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: {},
          onSubmit: vi.fn(),
        })
      );

      expect(result.current.values).toEqual({});
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.submitCount).toBe(0);
    });

    it('should initialize with provided values', () => {
      const initialValues = { name: 'John', email: 'john@test.com' };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        })
      );

      expect(result.current.values).toEqual(initialValues);
    });

    it('should initialize isValid as true when no validation rules', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit: vi.fn(),
        })
      );

      expect(result.current.isValid).toBe(true);
    });

    it('should initialize isDirty as false', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit: vi.fn(),
        })
      );

      expect(result.current.isDirty).toBe(false);
    });
  });

  // ==================== GERENCIAMENTO DE VALORES ====================
  describe('Value Management', () => {
    it('should update values on handleChange', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'John' },
        });
      });

      expect(result.current.values.name).toBe('John');
    });

    it('should mark field as touched on handleBlur', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleBlur({
          target: { name: 'name' },
        });
      });

      expect(result.current.touched.name).toBe(true);
    });

    it('should set field value programmatically', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.setFieldValue('name', 'Jane');
      });

      expect(result.current.values.name).toBe('Jane');
    });

    it('should mark form as dirty when value changes', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit: vi.fn(),
        })
      );

      expect(result.current.isDirty).toBe(false);

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'Jane' },
        });
      });

      expect(result.current.isDirty).toBe(true);
    });
  });

  // ==================== VALIDAÇÃO ====================
  describe('Validation', () => {
    it('should validate field with validation rules', () => {
      const validationRules = {
        name: (value) => (value ? null : 'Nome é obrigatório'),
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validationRules,
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.validateField('name');
      });

      expect(result.current.errors.name).toBe('Nome é obrigatório');
    });

    it('should clear error when field becomes valid', () => {
      const validationRules = {
        name: (value) => (value ? null : 'Nome é obrigatório'),
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validationRules,
          onSubmit: vi.fn(),
        })
      );

      // Primeiro, cria um erro
      act(() => {
        result.current.validateField('name');
      });

      expect(result.current.errors.name).toBe('Nome é obrigatório');

      // Depois, preenche o campo e valida novamente
      act(() => {
        result.current.setFieldValue('name', 'John');
        result.current.validateField('name');
      });

      expect(result.current.errors.name).toBeUndefined();
    });

    it('should set field error programmatically', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.setFieldError('name', 'Custom error');
      });

      expect(result.current.errors.name).toBe('Custom error');
    });

    it('should validate all fields with validate()', () => {
      const validationRules = {
        name: (value) => (value ? null : 'Nome é obrigatório'),
        email: (value) => (value ? null : 'Email é obrigatório'),
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
          validationRules,
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.validate();
      });

      expect(result.current.errors.name).toBe('Nome é obrigatório');
      expect(result.current.errors.email).toBe('Email é obrigatório');
    });

    it('should update isValid based on errors', () => {
      const validationRules = {
        name: (value) => (value ? null : 'Nome é obrigatório'),
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validationRules,
          onSubmit: vi.fn(),
        })
      );

      // Initially valid (no validation run yet)
      expect(result.current.isValid).toBe(true);

      // Validate and expect invalid
      act(() => {
        result.current.validate();
      });

      expect(result.current.isValid).toBe(false);

      // Fix error and validate again
      act(() => {
        result.current.setFieldValue('name', 'John');
        result.current.validate();
      });

      expect(result.current.isValid).toBe(true);
    });
  });

  // ==================== SUBMISSÃO ====================
  describe('Submission', () => {
    it('should call onSubmit with values when form is valid', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
    });

    it('should set isSubmitting to true during submission', async () => {
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit,
        })
      );

      const submitPromise = act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      // During submission
      expect(result.current.isSubmitting).toBe(true);

      await submitPromise;

      // After submission
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should increment submitCount on each submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit,
        })
      );

      expect(result.current.submitCount).toBe(0);

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.submitCount).toBe(1);

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(result.current.submitCount).toBe(2);
    });

    it('should not submit when form is invalid', async () => {
      const onSubmit = vi.fn();
      const validationRules = {
        name: (value) => (value ? null : 'Nome é obrigatório'),
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validationRules,
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(onSubmit).not.toHaveBeenCalled();
      expect(result.current.errors.name).toBe('Nome é obrigatório');
    });
  });

  // ==================== RESET ====================
  describe('Reset', () => {
    it('should reset form to initial values', () => {
      const initialValues = { name: 'John' };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        })
      );

      // Change value
      act(() => {
        result.current.setFieldValue('name', 'Jane');
      });

      expect(result.current.values.name).toBe('Jane');

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.values.name).toBe('John');
    });

    it('should clear errors on reset', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          onSubmit: vi.fn(),
        })
      );

      // Set error
      act(() => {
        result.current.setFieldError('name', 'Error');
      });

      expect(result.current.errors.name).toBe('Error');

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.errors).toEqual({});
    });

    it('should clear touched on reset', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          onSubmit: vi.fn(),
        })
      );

      // Mark as touched
      act(() => {
        result.current.handleBlur({ target: { name: 'name' } });
      });

      expect(result.current.touched.name).toBe(true);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.touched).toEqual({});
    });
  });

  // ==================== TRANSFORM ====================
  describe('Transform', () => {
    it('should transform values before submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const transform = (values) => ({
        ...values,
        name: values.name.toUpperCase(),
      });

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'john' },
          transform,
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(onSubmit).toHaveBeenCalledWith({ name: 'JOHN' });
    });
  });
});
