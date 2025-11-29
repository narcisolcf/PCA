import { memo } from 'react';
import { cn } from '../../lib/cn';
import { badgeVariants } from '../theme';

/**
 * Badge Component
 * Componente de badge (etiqueta) com variantes de cor e tamanho
 * Otimizado com React.memo para evitar re-renders desnecessários
 *
 * @example
 * <Badge variant="success">Ativo</Badge>
 * <Badge variant="danger" size="sm">Erro</Badge>
 * <Badge variant="warning" size="lg">Atenção</Badge>
 */
const Badge = memo(function Badge({
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
});

Badge.displayName = 'Badge';

export default Badge;
