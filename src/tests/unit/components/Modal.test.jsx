/**
 * Testes Unitários - Modal Component
 * Valida funcionalidade, acessibilidade e interatividade
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../../components/ui/Modal';

describe('Modal Component', () => {
  // ==================== RENDERIZAÇÃO ====================
  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
          Content
        </Modal>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
          Content
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
          Content
        </Modal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
          <p>Modal Content</p>
        </Modal>
      );

      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should render actions if provided', () => {
      render(
        <Modal
          isOpen={true}
          onClose={vi.fn()}
          title="Test Modal"
          actions={<button>Action Button</button>}
        >
          Content
        </Modal>
      );

      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });
  });

  // ==================== TAMANHOS ====================
  describe('Sizes', () => {
    it('should render with small size', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" size="sm">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog').firstChild;
      expect(dialog).toHaveClass('max-w-md');
    });

    it('should render with medium size (default)', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog').firstChild;
      expect(dialog).toHaveClass('max-w-lg');
    });

    it('should render with large size', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" size="lg">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog').firstChild;
      expect(dialog).toHaveClass('max-w-2xl');
    });
  });

  // ==================== ACESSIBILIDADE ====================
  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test">
          Content
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test">
          Content
        </Modal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(screen.getByText('Test Modal')).toHaveAttribute('id', 'modal-title');
    });

    it('should have aria-label on close button', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test">
          Content
        </Modal>
      );

      const closeButton = screen.getByLabelText('Fechar modal');
      expect(closeButton).toBeInTheDocument();
    });
  });

  // ==================== INTERATIVIDADE ====================
  describe('Interactivity', () => {
    it('should call onClose when close button is clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test">
          Content
        </Modal>
      );

      const closeButton = screen.getByLabelText('Fechar modal');
      fireEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked (closeOnOverlayClick=true)', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test" closeOnOverlayClick={true}>
          Content
        </Modal>
      );

      const overlay = screen.getByRole('dialog');
      fireEvent.click(overlay);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when overlay is clicked (closeOnOverlayClick=false)', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test" closeOnOverlayClick={false}>
          Content
        </Modal>
      );

      const overlay = screen.getByRole('dialog');
      fireEvent.click(overlay);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when modal content is clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const content = screen.getByText('Content');
      fireEvent.click(content);

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // ==================== VARIANTES ====================
  describe('Variants', () => {
    it('should render with default variant', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog').firstChild;
      expect(dialog).toHaveClass('bg-white');
    });

    it('should render with glass variant', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" variant="glass">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog').firstChild;
      expect(dialog).toHaveClass('glass');
    });
  });

  // ==================== CLASSES CUSTOMIZADAS ====================
  describe('Custom Classes', () => {
    it('should accept custom className', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" className="custom-class">
          Content
        </Modal>
      );

      const modalContent = screen.getByRole('dialog').firstChild;
      expect(modalContent).toHaveClass('custom-class');
    });
  });

  // ==================== ANIMAÇÕES ====================
  describe('Animations', () => {
    it('should have backdrop animation', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test">
          Content
        </Modal>
      );

      const backdrop = screen.getByRole('dialog');
      expect(backdrop).toHaveClass('animate-fade-in');
    });

    it('should have modal animation', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test">
          Content
        </Modal>
      );

      const modalContent = screen.getByRole('dialog').firstChild;
      expect(modalContent).toHaveClass('animate-scale-in');
    });

    it('should have backdrop blur', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test">
          Content
        </Modal>
      );

      const backdrop = screen.getByRole('dialog');
      expect(backdrop).toHaveClass('backdrop-blur-sm');
    });
  });
});
