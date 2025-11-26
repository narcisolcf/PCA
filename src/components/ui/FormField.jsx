import { cn } from '../../lib/cn';
import { labelVariants } from '../theme';

/**
 * FormField Component
 * Wrapper para campos de formulário com label, hint e mensagem de erro
 *
 * @example
 * <FormField
 *   label="Nome Completo"
 *   required
 *   error="Nome é obrigatório"
 *   hint="Digite seu nome completo"
 * >
 *   <Input type="text" />
 * </FormField>
 */
export default function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className,
  disabled = false,
}) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(labelVariants({ required, disabled }))}
        >
          {label}
        </label>
      )}

      <div>
        {/* Clone children para adicionar aria attributes */}
        {typeof children === 'function'
          ? children({ errorId, hintId })
          : children}
      </div>

      {hint && !error && <p className="hint-text">{hint}</p>}

      {error && (
        <p id={errorId} className="error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
