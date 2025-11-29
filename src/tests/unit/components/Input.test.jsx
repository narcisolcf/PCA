/**
 * Testes Unitários - Input Component
 * Valida funcionalidade, acessibilidade e estados
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../../components/ui/Input';

describe('Input Component', () => {
  // ==================== RENDERIZAÇÃO ====================
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter name" />);
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });

    it('should render with value', () => {
      render(<Input value="Test value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('Test value');
    });

    it('should render with default type (text)', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should render with email type', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
  });

  // ==================== TAMANHOS ====================
  describe('Sizes', () => {
    it('should render with small size', () => {
      render(<Input size="sm" />);
      expect(screen.getByRole('textbox')).toHaveClass('h-9');
    });

    it('should render with medium size (default)', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('h-11');
    });

    it('should render with large size', () => {
      render(<Input size="lg" />);
      expect(screen.getByRole('textbox')).toHaveClass('h-[60px]');
    });
  });

  // ==================== ESTADOS ====================
  describe('States', () => {
    it('should have error state', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-danger-500');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should have disabled styles', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('cursor-not-allowed');
    });
  });

  // ==================== ACESSIBILIDADE ====================
  describe('Accessibility', () => {
    it('should have aria-invalid=false by default', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('should have aria-invalid=true when error exists', () => {
      render(<Input error="Error message" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should support forwardRef', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should have focus ring styles', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('focus:outline-none');
    });
  });

  // ==================== INTERATIVIDADE ====================
  describe('Interactivity', () => {
    it('should call onChange handler when value changes', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should update value on change', () => {
      const { rerender } = render(<Input value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveValue('');

      rerender(<Input value="updated" onChange={() => {}} />);

      expect(input).toHaveValue('updated');
    });

    it('should call onBlur handler when blurred', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should call onFocus handler when focused', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== CLASSES CUSTOMIZADAS ====================
  describe('Custom Classes', () => {
    it('should accept custom className', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('rounded-lg');
    });
  });

  // ==================== OUTROS ATRIBUTOS ====================
  describe('Other Props', () => {
    it('should accept name attribute', () => {
      render(<Input name="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
    });

    it('should accept required attribute', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should accept maxLength attribute', () => {
      render(<Input maxLength={10} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
    });

    it('should accept data attributes', () => {
      render(<Input data-testid="custom-input" />);
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });
  });
});
