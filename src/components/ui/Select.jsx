import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { selectVariants } from '../theme';

/**
 * Select Component
 * Componente de select (dropdown) reutilizável com altura mínima 60px para lg
 *
 * @example
 * <Select
 *   options={[
 *     { value: '1', label: 'Opção 1' },
 *     { value: '2', label: 'Opção 2' }
 *   ]}
 *   placeholder="Selecione uma opção"
 *   size="lg"
 * />
 */
const Select = forwardRef(
  (
    {
      className,
      options = [],
      placeholder = 'Selecione...',
      size = 'md',
      error,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Determina o estado baseado nas props
    const state = error ? 'error' : disabled ? 'disabled' : 'default';

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(selectVariants({ size, state }), 'pr-10', className)}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Ícone de chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
