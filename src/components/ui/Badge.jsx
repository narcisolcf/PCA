import { cn } from '../../lib/cn';
import { badgeVariants } from '../theme';

/**
 * Badge Component
 * Componente de badge (etiqueta) com variantes de cor e tamanho
 *
 * @example
 * <Badge variant="success">Ativo</Badge>
 * <Badge variant="danger" size="sm">Erro</Badge>
 * <Badge variant="warning" size="lg">Atenção</Badge>
 */
export default function Badge({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
