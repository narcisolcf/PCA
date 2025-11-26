import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { buttonVariants } from '../theme';

/**
 * Button Component
 * Componente de botão reutilizável com variantes de estilo
 *
 * @example
 * <Button variant="primary" size="md">Clique Aqui</Button>
 * <Button variant="danger" size="lg" fullWidth>Deletar</Button>
 * <Button variant="ghost" disabled>Cancelar</Button>
 */
const Button = forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      disabled = false,
      loading = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {loading ? (
          <>
            <span className="spinner spinner-sm mr-2" />
            Carregando...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
