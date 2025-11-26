import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS com clsx e tailwind-merge
 * @param {...any} inputs - Classes CSS para combinar
 * @returns {string} - String com classes CSS combinadas
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
