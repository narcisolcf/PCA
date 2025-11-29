/**
 * Spinner Component
 * Indicador de carregamento com variantes de tamanho
 * Otimizado com React.memo para prevenir re-renders desnecessários
 *
 * @example
 * <Spinner size="sm" />
 * <Spinner size="lg" className="text-primary-500" />
 */

import { memo } from 'react';
import { cn } from '../../lib/cn';

const spinnerSizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
};

const Spinner = memo(function Spinner({
  size = 'md',
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        spinnerSizes[size],
        className
      )}
      role="status"
      aria-label="Carregando..."
      {...props}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
