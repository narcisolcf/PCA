import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { inputVariants } from '../theme';

/**
 * Input Component
 * Componente de input reutilizável com validação e estados
 *
 * @example
 * <Input
 *   label="Nome"
 *   type="text"
 *   placeholder="Digite seu nome"
 *   required
 * />
 *
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Email inválido"
 *   size="lg"
 * />
 */
const Input = forwardRef(
  (
    {
      className,
      type = 'text',
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
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(inputVariants({ size, state }), className)}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
