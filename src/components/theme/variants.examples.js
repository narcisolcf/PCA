/**
 * Exemplos de Uso das Variantes CVA
 * Este arquivo demonstra como usar as variantes definidas em variants.js
 */

import { cn } from '../../lib/cn';
import {
  buttonVariants,
  inputVariants,
  cardVariants,
  badgeVariants,
} from './variants';

/**
 * ==================== EXEMPLOS DE BUTTON ====================
 */

// Exemplo 1: Button primário padrão (medium)
const PrimaryButton = () => (
  <button className={cn(buttonVariants())}>Botão Primário</button>
);

// Exemplo 2: Button secundário small
const SecondaryButtonSmall = () => (
  <button className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}>
    Pequeno
  </button>
);

// Exemplo 3: Button danger large com fullWidth
const DangerButtonLarge = () => (
  <button
    className={cn(
      buttonVariants({ variant: 'danger', size: 'lg', fullWidth: true })
    )}
  >
    Deletar Tudo
  </button>
);

// Exemplo 4: Button ghost com classes adicionais
const GhostButtonWithExtraClasses = () => (
  <button className={cn(buttonVariants({ variant: 'ghost' }), 'italic')}>
    Cancelar
  </button>
);

/**
 * ==================== EXEMPLOS DE INPUT ====================
 */

// Exemplo 1: Input padrão (medium, default state)
const DefaultInput = () => (
  <input
    type="text"
    className={cn(inputVariants())}
    placeholder="Digite algo..."
  />
);

// Exemplo 2: Input large com state error
const ErrorInputLarge = () => (
  <input
    type="email"
    className={cn(inputVariants({ size: 'lg', state: 'error' }))}
    placeholder="Email inválido"
  />
);

// Exemplo 3: Input small com state success
const SuccessInputSmall = () => (
  <input
    type="text"
    className={cn(inputVariants({ size: 'sm', state: 'success' }))}
    value="Email válido!"
  />
);

/**
 * ==================== EXEMPLOS DE CARD ====================
 */

// Exemplo 1: Card padrão com padding medium
const DefaultCard = () => (
  <div className={cn(cardVariants())}>
    <h3>Título do Card</h3>
    <p>Conteúdo do card</p>
  </div>
);

// Exemplo 2: Card com efeito glass e padding large
const GlassCardLarge = () => (
  <div className={cn(cardVariants({ variant: 'glass', padding: 'lg' }))}>
    <h2>Card com Glassmorphism</h2>
    <p>Este card tem efeito de vidro fosco</p>
  </div>
);

// Exemplo 3: Card elevated com hover effect
const ElevatedCardWithHover = () => (
  <div
    className={cn(cardVariants({ variant: 'elevated', hover: true }))}
    onClick={() => console.log('Card clicado!')}
  >
    <h3>Card Clicável</h3>
    <p>Passe o mouse para ver o efeito</p>
  </div>
);

// Exemplo 4: Card outline sem padding (para conteúdo customizado)
const OutlineCardNoPadding = () => (
  <div className={cn(cardVariants({ variant: 'outline', padding: 'none' }))}>
    <div className="p-6 border-b">
      <h3>Header Customizado</h3>
    </div>
    <div className="p-6">
      <p>Conteúdo com padding customizado</p>
    </div>
  </div>
);

/**
 * ==================== EXEMPLOS DE BADGE ====================
 */

// Exemplo 1: Badge success medium
const SuccessBadge = () => (
  <span className={cn(badgeVariants({ variant: 'success' }))}>Ativo</span>
);

// Exemplo 2: Badge danger small
const DangerBadgeSmall = () => (
  <span className={cn(badgeVariants({ variant: 'danger', size: 'sm' }))}>
    Erro
  </span>
);

// Exemplo 3: Badge warning large
const WarningBadgeLarge = () => (
  <span className={cn(badgeVariants({ variant: 'warning', size: 'lg' }))}>
    Atenção
  </span>
);

/**
 * ==================== EXEMPLOS DE COMPOSIÇÃO ====================
 */

// Exemplo: Card com múltiplos elementos usando variantes
const ComplexCard = () => (
  <div className={cn(cardVariants({ variant: 'elevated', padding: 'lg' }))}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Título do Card</h2>
      <span className={cn(badgeVariants({ variant: 'success' }))}>Novo</span>
    </div>
    <p className="mb-4 text-slate-600">
      Descrição detalhada do conteúdo do card com informações importantes.
    </p>
    <div className="flex gap-2">
      <button className={cn(buttonVariants({ variant: 'primary' }))}>
        Confirmar
      </button>
      <button className={cn(buttonVariants({ variant: 'ghost' }))}>
        Cancelar
      </button>
    </div>
  </div>
);

/**
 * ==================== EXEMPLO DE FORM COMPLETO ====================
 */
const FormWithVariants = () => (
  <div className={cn(cardVariants({ padding: 'lg' }))}>
    <h2 className="text-xl font-bold mb-6">Formulário de Exemplo</h2>

    <div className="space-y-4">
      {/* Campo Nome */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nome Completo <span className="text-danger-500">*</span>
        </label>
        <input
          type="text"
          className={cn(inputVariants({ size: 'md' }))}
          placeholder="Digite seu nome"
        />
      </div>

      {/* Campo Email com erro */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email <span className="text-danger-500">*</span>
        </label>
        <input
          type="email"
          className={cn(inputVariants({ size: 'md', state: 'error' }))}
          placeholder="email@exemplo.com"
        />
        <p className="error-text">Email inválido</p>
      </div>

      {/* Campo Descrição */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Descrição
        </label>
        <textarea
          className={cn(
            inputVariants({ size: 'md' }),
            'min-h-[120px] resize-y'
          )}
          placeholder="Digite uma descrição..."
        />
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <button
          className={cn(buttonVariants({ variant: 'primary', size: 'md' }))}
        >
          Enviar
        </button>
        <button
          className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

export {
  PrimaryButton,
  SecondaryButtonSmall,
  DangerButtonLarge,
  GhostButtonWithExtraClasses,
  DefaultInput,
  ErrorInputLarge,
  SuccessInputSmall,
  DefaultCard,
  GlassCardLarge,
  ElevatedCardWithHover,
  OutlineCardNoPadding,
  SuccessBadge,
  DangerBadgeSmall,
  WarningBadgeLarge,
  ComplexCard,
  FormWithVariants,
};
