import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { textareaVariants } from '../theme';

/**
 * Textarea Component
 * Componente de textarea reutilizável com leading relaxed
 *
 * @example
 * <Textarea
 *   placeholder="Digite sua mensagem..."
 *   rows={4}
 *   maxLength={500}
 * />
 *
 * <Textarea
 *   error="Mensagem muito curta"
 *   rows={6}
 * />
 */
const Textarea = forwardRef(
  (
    {
      className,
      error,
      disabled = false,
      rows = 4,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    // Determina o estado baseado nas props
    const state = error ? 'error' : disabled ? 'disabled' : 'default';

    // Calcula caracteres restantes se maxLength for fornecido
    const remainingChars = maxLength && value ? maxLength - value.length : null;

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          className={cn(textareaVariants({ state }), className)}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {maxLength && value && (
          <p className="hint-text text-right">
            {remainingChars} caracteres restantes
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
