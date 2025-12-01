/**
 * Exemplos de Uso das Variantes CVA - Design System Premium
 * Demonstração dos componentes com visual Glassmorphism e Inputs de 60px
 */

import { cn } from '../../lib/cn';
import {
  buttonVariants,
  inputVariants,
  cardVariants,
  badgeVariants,
  textareaVariants, // Adicionado import que faltava
} from './variants';

/**
 * ==================== EXEMPLOS DE BUTTON ====================
 */

// Exemplo 1: Button primário padrão
const PrimaryButton = () => (
  <button className={cn(buttonVariants())}>Confirmar Ação</button>
);

// Exemplo 2: Button secundário pequeno
const SecondaryButtonSmall = () => (
  <button className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}>
    Voltar
  </button>
);

// Exemplo 3: Button de perigo grande (Full Width)
const DangerButtonLarge = () => (
  <button
    className={cn(
      buttonVariants({ variant: 'danger', size: 'lg', fullWidth: true })
    )}
  >
    Excluir Permanentemente
  </button>
);

// Exemplo 4: Button ghost para ações secundárias
const GhostButton = () => (
  <button className={cn(buttonVariants({ variant: 'ghost' }))}>
    Cancelar
  </button>
);

/**
 * ==================== EXEMPLOS DE INPUT (60px Standard) ====================
 */

// Exemplo 1: Input Premium (Large - 60px) - Padrão do Projeto
const PremiumInput = () => (
  <input
    type="text"
    className={cn(inputVariants({ size: 'lg' }))}
    placeholder="Digite seu nome completo..."
  />
);

// Exemplo 2: Input com Erro
const ErrorInput = () => (
  <input
    type="email"
    className={cn(inputVariants({ size: 'lg', state: 'error' }))}
    placeholder="email@invalido.com"
    defaultValue="email@invalido"
  />
);

// Exemplo 3: Input Sucesso
const SuccessInput = () => (
  <input
    type="text"
    className={cn(inputVariants({ size: 'lg', state: 'success' }))}
    defaultValue="Cadastro verificado"
  />
);

/**
 * ==================== EXEMPLOS DE CARD (Glassmorphism) ====================
 */

// Exemplo 1: Card Glass (Vidro) - Ideal para fundos coloridos/gradientes
const GlassCard = () => (
  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl">
    <div className={cn(cardVariants({ variant: 'glass', padding: 'lg' }))}>
      <h2 className="text-2xl font-light text-slate-800 mb-2">Efeito Vidro</h2>
      <p className="text-slate-500">
        Este card flutua sobre o fundo com um desfoque suave (backdrop-blur).
      </p>
    </div>
  </div>
);

// Exemplo 2: Card Elevado (Sombra suave)
const ElevatedCard = () => (
  <div className={cn(cardVariants({ variant: 'elevated', padding: 'md', hover: true }))}>
    <h3 className="font-semibold text-slate-900">Card Interativo</h3>
    <p className="text-slate-500 text-sm mt-1">Passe o mouse para ver a elevação.</p>
  </div>
);

/**
 * ==================== EXEMPLOS DE BADGE ====================
 */

const BadgeShowcase = () => (
  <div className="flex gap-2">
    <span className={cn(badgeVariants({ variant: 'success', size: 'md' }))}>
      ● Aprovada
    </span>
    <span className={cn(badgeVariants({ variant: 'warning', size: 'md' }))}>
      ● Pendente
    </span>
    <span className={cn(badgeVariants({ variant: 'primary', size: 'sm' }))}>
      Novo
    </span>
  </div>
);

/**
 * ==================== EXEMPLO DE FORMULÁRIO COMPLETO ====================
 * Mostra a harmonia entre Inputs grandes e Labels discretos
 */
const FormWithVariants = () => (
  <div className="max-w-md mx-auto p-8 bg-slate-50 rounded-3xl">
    <div className={cn(cardVariants({ variant: 'glass', padding: 'lg' }))}>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Novo Cadastro</h2>

      <div className="space-y-6">
        {/* Campo Nome */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-3">
            Nome Completo <span className="text-blue-500">*</span>
          </label>
          <input
            type="text"
            className={cn(inputVariants({ size: 'lg' }))}
            placeholder="Como gostaria de ser chamado?"
          />
        </div>

        {/* Campo Email */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-3">
            E-mail Corporativo
          </label>
          <input
            type="email"
            className={cn(inputVariants({ size: 'lg' }))}
            placeholder="seu.nome@empresa.com"
          />
        </div>

        {/* Campo Descrição */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-3">
            Observações
          </label>
          <textarea
            className={cn(textareaVariants(), 'min-h-[120px]')}
            placeholder="Digite os detalhes aqui..."
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4">
          <button className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}>
            Cancelar
          </button>
          <button className={cn(buttonVariants({ variant: 'primary', size: 'lg', fullWidth: true }))}>
            Salvar Cadastro
          </button>
        </div>
      </div>
    </div>
  </div>
);

export {
  PrimaryButton,
  SecondaryButtonSmall,
  DangerButtonLarge,
  GhostButton,
  PremiumInput,
  ErrorInput,
  SuccessInput,
  GlassCard,
  ElevatedCard,
  BadgeShowcase,
  FormWithVariants,
};