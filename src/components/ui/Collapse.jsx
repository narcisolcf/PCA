import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Collapse Component
 * Componente de collapse (accordion) seguindo padrão gov.br
 *
 * @example
 * <Collapse title="Mostrar Mais Informações">
 *   <p>Conteúdo oculto que pode ser expandido</p>
 * </Collapse>
 *
 * <Collapse title="FAQ 1" defaultOpen>
 *   <p>Resposta da FAQ</p>
 * </Collapse>
 */
export default function Collapse({
  title,
  children,
  defaultOpen = false,
  onChange,
  className,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <div className={cn('border border-slate-200 rounded-lg', className)}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors rounded-t-lg"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-slate-900">{title}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-slate-500 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 pt-0 border-t border-slate-100">{children}</div>
      </div>
    </div>
  );
}
