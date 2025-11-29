/**
 * Componente EmptyState
 * Estado vazio para quando não há dados para exibir
 * Otimizado com React.memo para prevenir re-renders desnecessários
 */

import { memo } from 'react';
import { cn } from '../../lib/utils';

/**
 * @param {Object} props
 * @param {string} props.icon - Emoji ou ícone a exibir
 * @param {string} props.title - Título do estado vazio
 * @param {string} props.description - Descrição
 * @param {React.ReactNode} props.action - Botão de ação (opcional)
 * @param {string} props.className - Classes adicionais
 */
export const EmptyState = memo(function EmptyState({
  icon = '📭',
  title = 'Nenhum dado encontrado',
  description = '',
  action = null,
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12',
        className
      )}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mb-6 max-w-md">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
