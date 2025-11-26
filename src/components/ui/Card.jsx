import { cn } from '../../lib/cn';
import { cardVariants } from '../theme';

/**
 * Card Component
 * Componente de card reutilizável com variantes de estilo
 *
 * @example
 * <Card variant="default" padding="md">
 *   <h3>Título</h3>
 *   <p>Conteúdo</p>
 * </Card>
 *
 * <Card variant="glass" padding="lg" hover>
 *   <h2>Card com Glassmorphism</h2>
 * </Card>
 */
export default function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(cardVariants({ variant, padding, hover }), className)}
      {...props}
    >
      {children}
    </div>
  );
}
