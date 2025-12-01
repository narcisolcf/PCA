/**
 * Sistema de Variantes com CVA (Class Variance Authority)
 * Visual: Premium / Linear Style / Glassmorphism
 */

import { cva } from 'class-variance-authority';

/**
 * BUTTON VARIANTS
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900',
        ghost:
          'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
        danger:
          'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700',
        outline:
          'border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
        success:
          'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
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
 * INPUT VARIANTS (Refatorado: Clean Style)
 */
export const inputVariants = cva(
  'w-full rounded-2xl border-0 bg-slate-100/50 px-5 text-slate-700 transition-all duration-300 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:shadow-xl focus:shadow-primary-500/5 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100',
  {
    variants: {
      size: {
        sm: 'h-9 text-sm',
        md: 'h-12 text-base',
        lg: 'h-[60px] text-base', // Altura premium 60px
      },
      state: {
        default: '',
        error:
          'bg-red-50/50 text-red-900 focus:ring-red-500/10 placeholder:text-red-300',
        success:
          'bg-emerald-50/50 text-emerald-900 focus:ring-emerald-500/10',
        disabled: 'bg-slate-100 text-slate-400 shadow-none',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

/**
 * SELECT VARIANTS (Refatorado: Clean Style)
 */
export const selectVariants = cva(
  'w-full rounded-2xl border-0 bg-slate-100/50 px-5 text-slate-700 transition-all duration-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:shadow-xl focus:shadow-primary-500/5 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:bg-slate-100',
  {
    variants: {
      size: {
        sm: 'h-9 text-sm',
        md: 'h-12 text-base',
        lg: 'h-[60px] text-base', // Altura premium 60px
      },
      state: {
        default: '',
        error: 'bg-red-50/50 text-red-900 focus:ring-red-500/10',
        disabled: 'bg-slate-100 cursor-not-allowed opacity-60',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

/**
 * TEXTAREA VARIANTS (Refatorado: Clean Style)
 */
export const textareaVariants = cva(
  'w-full rounded-2xl border-0 bg-slate-100/50 px-5 py-4 text-slate-700 transition-all duration-300 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:shadow-xl focus:shadow-primary-500/5 disabled:cursor-not-allowed disabled:opacity-50 resize-none leading-relaxed hover:bg-slate-100',
  {
    variants: {
      state: {
        default: '',
        error: 'bg-red-50/50 text-red-900 focus:ring-red-500/10',
        success: 'bg-emerald-50/50 text-emerald-900 focus:ring-emerald-500/10',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

/**
 * LABEL VARIANTS (Refatorado: Micro-Label Style)
 */
export const labelVariants = cva(
  'block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-3 select-none',
  {
    variants: {
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-primary-400",
      },
      disabled: {
        true: 'opacity-50',
      },
    },
  }
);

// Mantém os outros sem alterações drásticas, apenas ajustes finos
export const cardVariants = cva(
  'rounded-3xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white border border-slate-100 shadow-sm',
        glass: 'bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl',
        elevated: 'bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1',
        outline: 'border-2 border-slate-200 bg-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:bg-slate-50/50 cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export const modalVariants = cva(
  'relative shadow-2xl overflow-hidden',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
      },
      variant: {
        default: 'bg-white rounded-3xl',
        glass: 'bg-white/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.1)]',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'glass', // Mudado padrão para glass
    },
  }
);

export const badgeVariants = cva(
  'inline-flex items-center rounded-full font-semibold transition-colors ring-1 ring-inset',
  {
    variants: {
      variant: {
        primary: 'bg-blue-50 text-blue-700 ring-blue-700/10',
        secondary: 'bg-slate-50 text-slate-600 ring-slate-500/10',
        success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        danger: 'bg-red-50 text-red-700 ring-red-600/10',
        warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const alertVariants = cva(
  'rounded-2xl p-4 flex items-start gap-3 border',
  {
    variants: {
      variant: {
        info: 'bg-blue-50/50 border-blue-100 text-blue-900',
        success: 'bg-emerald-50/50 border-emerald-100 text-emerald-900',
        warning: 'bg-amber-50/50 border-amber-100 text-amber-900',
        danger: 'bg-red-50/50 border-red-100 text-red-900',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);