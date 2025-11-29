import { memo } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { alertVariants } from '../theme';

/**
 * Alert Component
 * Componente de alerta com variantes de tipo
 * Otimizado com React.memo para prevenir re-renders desnecessários
 *
 * @example
 * <Alert variant="success" title="Sucesso!" message="Operação concluída" />
 * <Alert variant="danger" title="Erro!" message="Algo deu errado" onClose={() => {}} />
 */
const Alert = memo(function Alert({
  variant = 'info',
  title,
  message,
  onClose,
  className,
  children,
}) {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    danger: XCircle,
  };

  const Icon = icons[variant];

  return (
    <div className={cn(alertVariants({ variant }), className)} role="alert">
      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />

      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        {message && <p className="text-sm">{message}</p>}
        {children}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
          aria-label="Fechar alerta"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';

export default Alert;
