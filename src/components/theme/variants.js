/**
 * Sistema de Variantes com CVA (Class Variance Authority)
 * Define todas as variantes de estilo para componentes do projeto PCA
 */

import { cva } from 'class-variance-authority';

/**
 * ==================== BUTTON VARIANTS ====================
 * Variantes para o componente Button
 */
export const buttonVariants = cva(
  // Classes base (sempre aplicadas)
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md hover:shadow-lg',
        secondary:
          'bg-slate-200 text-slate-900 hover:bg-slate-300 active:bg-slate-400',
        ghost:
          'hover:bg-slate-100 active:bg-slate-200 text-slate-700 hover:text-slate-900',
        danger:
          'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-md hover:shadow-lg',
        outline:
          'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
        success:
          'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-md hover:shadow-lg',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * ==================== INPUT VARIANTS ====================
 * Variantes para o componente Input (Design Moderno - Estilo Linear/Vercel)
 */
export const inputVariants = cva(
  // Classes base - Visual limpo e fluido
  'w-full rounded-2xl border-0 bg-slate-50 px-5 py-3 text-slate-900 transition-all duration-300 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:shadow-sm',
  {
    variants: {
      size: {
        sm: 'h-9 text-sm px-4 py-2 rounded-xl',
        md: 'h-11 text-base px-5 py-3 rounded-2xl',
        lg: 'h-[60px] text-base px-5 py-4 rounded-2xl', // Altura mínima 60px conforme especificação
      },
      state: {
        default: '',
        error:
          'bg-danger-50 focus:bg-danger-50 focus:ring-danger-100 text-danger-900',
        success:
          'bg-success-50 focus:bg-success-50 focus:ring-success-100 text-success-900',
        disabled: 'bg-slate-100 cursor-not-allowed hover:bg-slate-100',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

/**
 * ==================== SELECT VARIANTS ====================
 * Variantes para o componente Select (Design Moderno - Estilo Linear/Vercel)
 */
export const selectVariants = cva(
  // Classes base - Visual limpo e fluido
  'w-full rounded-2xl border-0 bg-slate-50 px-5 py-3 text-slate-900 transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:shadow-sm',
  {
    variants: {
      size: {
        sm: 'h-9 text-sm px-4 py-2 rounded-xl',
        md: 'h-11 text-base px-5 py-3 rounded-2xl',
        lg: 'h-[60px] text-base px-5 py-4 rounded-2xl', // Altura mínima 60px conforme especificação
      },
      state: {
        default: '',
        error:
          'bg-danger-50 focus:bg-danger-50 focus:ring-danger-100 text-danger-900',
        disabled: 'bg-slate-100 cursor-not-allowed hover:bg-slate-100',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

/**
 * ==================== CARD VARIANTS ====================
 * Variantes para o componente Card
 */
export const cardVariants = cva(
  // Classes base
  'rounded-xl transition-all',
  {
    variants: {
      variant: {
        default: 'bg-white border border-slate-200 shadow-sm',
        glass: 'glass shadow-glass', // Usa classe global .glass definida em globals.css
        elevated: 'bg-white shadow-lg hover:shadow-xl',
        outline: 'border-2 border-slate-300',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'card-hover cursor-pointer', // Usa classe global .card-hover
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

/**
 * ==================== MODAL VARIANTS ====================
 * Variantes para o componente Modal
 */
export const modalVariants = cva(
  // Classes base para o container do modal
  'relative rounded-xl shadow-2xl',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
      },
      variant: {
        default: 'bg-white',
        glass: 'glass', // Usa classe global .glass
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

/**
 * ==================== BADGE VARIANTS ====================
 * Variantes para o componente Badge
 */
export const badgeVariants = cva(
  // Classes base
  'inline-flex items-center rounded-full font-semibold transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-slate-100 text-slate-800',
        success: 'bg-success-100 text-success-800',
        danger: 'bg-danger-100 text-danger-800',
        warning: 'bg-warning-100 text-warning-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * ==================== ALERT VARIANTS ====================
 * Variantes para o componente Alert
 */
export const alertVariants = cva(
  // Classes base
  'rounded-lg p-4 border-l-4 flex items-start gap-3',
  {
    variants: {
      variant: {
        info: 'bg-primary-50 border-primary-500 text-primary-900',
        success: 'bg-success-50 border-success-500 text-success-900',
        warning: 'bg-warning-50 border-warning-500 text-warning-900',
        danger: 'bg-danger-50 border-danger-500 text-danger-900',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

/**
 * ==================== TEXTAREA VARIANTS ====================
 * Variantes para o componente Textarea (Design Moderno - Estilo Linear/Vercel)
 */
export const textareaVariants = cva(
  // Classes base - Visual limpo e fluido
  'w-full rounded-2xl border-0 bg-slate-50 px-5 py-4 text-slate-900 transition-all duration-300 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none leading-relaxed hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:shadow-sm',
  {
    variants: {
      state: {
        default: '',
        error:
          'bg-danger-50 focus:bg-danger-50 focus:ring-danger-100 text-danger-900',
        success:
          'bg-success-50 focus:bg-success-50 focus:ring-success-100 text-success-900',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

/**
 * ==================== LABEL VARIANTS ====================
 * Variantes para o componente Label (Design Moderno - Discreto)
 */
export const labelVariants = cva(
  // Classes base - Labels discretos e modernos
  'block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1',
  {
    variants: {
      required: {
        true: "after:content-['*'] after:ml-1 after:text-danger-400",
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
  }
);
