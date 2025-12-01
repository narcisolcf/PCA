import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { modalVariants } from '../theme';

/**
 * Modal Component - Premium Design
 * Componente de modal (dialog) com glassmorphism e animações suaves
 *
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmar Ação"
 *   size="md"
 *   variant="glass"
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
  variant = 'glass',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/60 backdrop-blur-xl animate-fade-in"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          modalVariants({ size, variant }),
          'w-full max-h-[90vh] overflow-y-auto',
          'p-8 sm:p-10 md:p-12',
          'animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300',
          'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com design premium */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100/50">
          {title && (
            <div className="flex-1">
              <h2
                id="modal-title"
                className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              >
                {title}
              </h2>
              <div className="mt-2 h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full" />
            </div>
          )}
          <button
            onClick={onClose}
            className="ml-4 p-2.5 rounded-xl hover:bg-slate-100/80 active:bg-slate-200/80 transition-all duration-200 group flex-shrink-0"
            aria-label="Fechar modal"
          >
            <X
              className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Content com espaçamento otimizado */}
        <div className="mb-8">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="flex gap-3 justify-end pt-6 border-t border-slate-100/50">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper para criar actions facilmente
Modal.Actions = function ModalActions({ children }) {
  return <div className="flex gap-3 justify-end">{children}</div>;
};
