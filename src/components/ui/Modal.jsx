import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { modalVariants } from '../theme';
import Button from './Button';

/**
 * Modal Component
 * Componente de modal (dialog) com overlay e animações
 *
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmar Ação"
 *   size="md"
 * >
 *   <p>Tem certeza que deseja continuar?</p>
 * </Modal>
 */
export default function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  variant = 'default',
  closeOnOverlayClick = true,
  className,
}) {
  // Fecha modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          modalVariants({ size, variant }),
          'w-full p-6 animate-scale-in',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 id="modal-title" className="text-xl font-bold">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">{children}</div>

        {/* Actions */}
        {actions && <div className="flex gap-3 justify-end">{actions}</div>}
      </div>
    </div>
  );
}

// Helper para criar actions facilmente
Modal.Actions = function ModalActions({ children }) {
  return <div className="flex gap-3 justify-end">{children}</div>;
};
