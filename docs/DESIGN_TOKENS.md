# Design Tokens - PCA App

> Sistema de Design baseado nas diretrizes do Design System do gov.br com adaptações modernas

**Versão:** 1.0
**Última Atualização:** 26 de Novembro de 2025

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Espaçamentos](#espaçamentos)
5. [Sombras e Efeitos](#sombras-e-efeitos)
6. [Animações](#animações)
7. [Sistema de Variantes (CVA)](#sistema-de-variantes-cva)
8. [Acessibilidade](#acessibilidade)
9. [Exemplos de Uso](#exemplos-de-uso)

---

## Visão Geral

O sistema de design do PCA App utiliza **design tokens** para garantir consistência visual em todo o aplicativo. Todos os valores são definidos em formato **HSL** (Hue, Saturation, Lightness) para facilitar manipulação dinâmica de cores.

### Princípios

- ✅ **Consistência:** Uso de tokens em vez de valores hardcoded
- ✅ **Acessibilidade:** WCAG AA compliant em todos os componentes
- ✅ **Escalabilidade:** Fácil adicionar novos tokens sem quebrar código existente
- ✅ **Gov.br Compliant:** Baseado no Design System oficial do governo brasileiro

---

## Paleta de Cores

Todas as cores são definidas em formato HSL com 10-11 variações (50-950).

### 🔵 Cores Primárias (Azul Gov.br)

Utilizada para elementos principais, CTAs e navegação.

| Token | HSL | Hex | Uso Recomendado |
|-------|-----|-----|-----------------|
| `--color-primary-50` | `hsl(214, 100%, 97%)` | `#EFF6FF` | Backgrounds leves |
| `--color-primary-100` | `hsl(214, 95%, 93%)` | `#DBEAFE` | Backgrounds suaves |
| `--color-primary-200` | `hsl(213, 97%, 87%)` | `#BFDBFE` | Backgrounds médios |
| `--color-primary-300` | `hsl(212, 96%, 78%)` | `#93C5FD` | Backgrounds escuros |
| `--color-primary-400` | `hsl(213, 94%, 68%)` | `#60A5FA` | Elementos secundários |
| `--color-primary-500` | `hsl(217, 91%, 60%)` | `#3B82F6` | **Cor principal** |
| `--color-primary-600` | `hsl(221, 83%, 53%)` | `#2563EB` | Botões primários |
| `--color-primary-700` | `hsl(224, 76%, 48%)` | `#1D4ED8` | Hover states |
| `--color-primary-800` | `hsl(226, 71%, 40%)` | `#1E40AF` | Active states |
| `--color-primary-900` | `hsl(224, 64%, 33%)` | `#1E3A8A` | Textos escuros |
| `--color-primary-950` | `hsl(226, 57%, 21%)` | `#172554` | Textos muito escuros |

**Contraste WCAG AA:**
- ✅ `primary-600` em branco: 4.5:1 (Aprovado)
- ✅ `primary-700` em branco: 7:1 (AAA)

### 🟢 Cores de Sucesso (Verde)

Utilizada para feedbacks positivos, confirmações e estados de sucesso.

| Token | HSL | Hex | Uso Recomendado |
|-------|-----|-----|-----------------|
| `--color-success-50` | `hsl(142, 76%, 96%)` | `#F0FDF4` | Backgrounds leves |
| `--color-success-100` | `hsl(141, 84%, 93%)` | `#DCFCE7` | Backgrounds suaves |
| `--color-success-500` | `hsl(142, 71%, 45%)` | `#22C55E` | **Cor principal** |
| `--color-success-600` | `hsl(142, 76%, 36%)` | `#16A34A` | Botões |
| `--color-success-700` | `hsl(142, 72%, 29%)` | `#15803D` | Hover/Active |

### 🔴 Cores de Erro/Perigo (Vermelho)

Utilizada para erros, alertas críticos e ações destrutivas.

| Token | HSL | Hex | Uso Recomendado |
|-------|-----|-----|-----------------|
| `--color-danger-50` | `hsl(0, 86%, 97%)` | `#FEF2F2` | Backgrounds leves |
| `--color-danger-100` | `hsl(0, 93%, 94%)` | `#FEE2E2` | Backgrounds suaves |
| `--color-danger-500` | `hsl(0, 84%, 60%)` | `#EF4444` | **Cor principal** |
| `--color-danger-600` | `hsl(0, 72%, 51%)` | `#DC2626` | Botões |
| `--color-danger-700` | `hsl(0, 74%, 42%)` | `#B91C1C` | Hover/Active |

### 🟡 Cores de Aviso (Amarelo/Laranja)

Utilizada para avisos, atenção e alertas não críticos.

| Token | HSL | Hex | Uso Recomendado |
|-------|-----|-----|-----------------|
| `--color-warning-50` | `hsl(48, 100%, 96%)` | `#FEFCE8` | Backgrounds leves |
| `--color-warning-100` | `hsl(48, 96%, 89%)` | `#FEF9C3` | Backgrounds suaves |
| `--color-warning-500` | `hsl(38, 92%, 50%)` | `#F59E0B` | **Cor principal** |
| `--color-warning-600` | `hsl(32, 95%, 44%)` | `#D97706` | Botões |
| `--color-warning-700` | `hsl(26, 90%, 37%)` | `#B45309` | Hover/Active |

### ⚫ Cores Neutras (Slate)

Utilizada para textos, bordas, backgrounds e elementos neutros.

| Token | HSL | Hex | Uso Recomendado |
|-------|-----|-----|-----------------|
| `--color-slate-50` | `hsl(210, 40%, 98%)` | `#F8FAFC` | Backgrounds claros |
| `--color-slate-100` | `hsl(210, 40%, 96%)` | `#F1F5F9` | Backgrounds suaves |
| `--color-slate-200` | `hsl(214, 32%, 91%)` | `#E2E8F0` | Borders leves |
| `--color-slate-300` | `hsl(213, 27%, 84%)` | `#CBD5E1` | Borders médias |
| `--color-slate-400` | `hsl(215, 20%, 65%)` | `#94A3B8` | Placeholders |
| `--color-slate-500` | `hsl(215, 16%, 47%)` | `#64748B` | Textos secundários |
| `--color-slate-600` | `hsl(215, 19%, 35%)` | `#475569` | Textos principais |
| `--color-slate-700` | `hsl(215, 25%, 27%)` | `#334155` | Headings |
| `--color-slate-800` | `hsl(217, 33%, 17%)` | `#1E293B` | Textos escuros |
| `--color-slate-900` | `hsl(222, 47%, 11%)` | `#0F172A` | Textos muito escuros |

---

## Tipografia

### Fontes

```css
--font-sans: 'Rawline', 'Plus Jakarta Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

- **Rawline:** Fonte oficial do Design System gov.br
- **Plus Jakarta Sans:** Fallback moderna
- **JetBrains Mono:** Para código e números

### Tamanhos

| Classe | Tamanho | Line Height | Uso |
|--------|---------|-------------|-----|
| `.text-xs` | 0.75rem (12px) | 1rem | Labels pequenos |
| `.text-sm` | 0.875rem (14px) | 1.25rem | Textos secundários |
| `.text-base` | 1rem (16px) | 1.5rem | Texto padrão |
| `.text-lg` | 1.125rem (18px) | 1.75rem | Subtítulos |
| `.text-xl` | 1.25rem (20px) | 1.75rem | Títulos pequenos |
| `.text-2xl` | 1.5rem (24px) | 2rem | Títulos médios |
| `.text-3xl` | 1.875rem (30px) | 2.25rem | Títulos grandes |
| `.text-4xl` | 2.25rem (36px) | 2.5rem | Headings principais |

### Pesos

| Classe | Peso | Uso |
|--------|------|-----|
| `.font-light` | 300 | Textos leves |
| `.font-normal` | 400 | Texto padrão |
| `.font-medium` | 500 | Ênfase leve |
| `.font-semibold` | 600 | Subtítulos |
| `.font-bold` | 700 | Títulos |

---

## Espaçamentos

Sistema baseado em múltiplos de 4px para consistência.

| Token | Valor | Uso Recomendado |
|-------|-------|-----------------|
| `--spacing-xs` | 0.25rem (4px) | Espaços mínimos |
| `--spacing-sm` | 0.5rem (8px) | Espaços pequenos |
| `--spacing-md` | 1rem (16px) | **Espaço padrão** |
| `--spacing-lg` | 1.5rem (24px) | Espaços grandes |
| `--spacing-xl` | 2rem (32px) | Espaços muito grandes |
| `--spacing-2xl` | 3rem (48px) | Seções |
| `--spacing-3xl` | 4rem (64px) | Grandes seções |

### Classes Tailwind Equivalentes

```css
p-1  = 4px   (--spacing-xs)
p-2  = 8px   (--spacing-sm)
p-4  = 16px  (--spacing-md)
p-6  = 24px  (--spacing-lg)
p-8  = 32px  (--spacing-xl)
p-12 = 48px  (--spacing-2xl)
p-16 = 64px  (--spacing-3xl)
```

---

## Sombras e Efeitos

### Sombras Padrão

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Sombras sutis |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Sombras médias |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Sombras grandes |
| `--shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Sombras muito grandes |

### Sombras Especiais

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-glass` | `0 8px 32px 0 rgba(31, 38, 135, 0.15)` | Efeito glassmorphism |
| `--shadow-glow` | `0 0 20px rgba(59, 130, 246, 0.5)` | Efeito de brilho |

### Glassmorphism

Classes prontas para efeito de vidro fosco:

```css
.glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-subtle {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## Animações

### Keyframes Disponíveis

| Animação | Duração | Uso |
|----------|---------|-----|
| `fadeIn` | 0.4s | Aparecer suavemente |
| `fadeOut` | 0.3s | Desaparecer suavemente |
| `slideIn` | 0.3s | Deslizar para dentro |
| `slideOut` | 0.3s | Deslizar para fora |
| `scaleIn` | 0.2s | Escalar para aparecer |
| `scaleOut` | 0.2s | Escalar para desaparecer |
| `shimmer` | 1.5s | Loading skeleton |
| `spin` | 0.8s | Spinner de loading |

### Classes Prontas

```css
.animate-fade-in    /* Fade in suave */
.animate-fade-out   /* Fade out suave */
.animate-slide-in   /* Slide da esquerda */
.animate-slide-out  /* Slide para esquerda */
.animate-scale-in   /* Aparece crescendo */
.animate-scale-out  /* Desaparece diminuindo */
```

---

## Sistema de Variantes (CVA)

O projeto utiliza **Class Variance Authority (CVA)** para gerenciar variantes de componentes de forma type-safe e escalável.

### Variantes Disponíveis

#### Button

```javascript
import { buttonVariants } from '@/components/theme';

<button className={buttonVariants({ variant: 'primary', size: 'md' })}>
  Clique Aqui
</button>
```

**Variantes:**
- `variant`: `primary`, `secondary`, `ghost`, `danger`, `outline`, `success`
- `size`: `sm`, `md`, `lg`
- `fullWidth`: `true`, `false`

#### Input

```javascript
import { inputVariants } from '@/components/theme';

<input className={inputVariants({ size: 'md', state: 'default' })} />
```

**Variantes:**
- `size`: `sm`, `md`, `lg` (lg = 60px altura mínima)
- `state`: `default`, `error`, `success`, `disabled`

#### Card

```javascript
import { cardVariants } from '@/components/theme';

<div className={cardVariants({ variant: 'glass', padding: 'lg' })}>
  Conteúdo
</div>
```

**Variantes:**
- `variant`: `default`, `glass`, `elevated`, `outline`
- `padding`: `none`, `sm`, `md`, `lg`
- `hover`: `true`, `false`

### Exemplo Completo

```jsx
import { cn } from '@/lib/cn';
import { buttonVariants, cardVariants } from '@/components/theme';

function MyComponent() {
  return (
    <div className={cn(cardVariants({ variant: 'glass', padding: 'lg' }))}>
      <h2>Título do Card</h2>
      <p>Descrição do conteúdo</p>
      <button
        className={cn(
          buttonVariants({ variant: 'primary', size: 'md' }),
          'mt-4'  // Classes adicionais
        )}
      >
        Confirmar
      </button>
    </div>
  );
}
```

---

## Acessibilidade

### Padrões WCAG AA

✅ **Contraste de Cores**
- Todos os pares de cores texto/fundo atendem WCAG AA (mínimo 4.5:1)
- Títulos grandes atendem WCAG AAA (mínimo 7:1)

✅ **Focus Visible**
```css
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

✅ **Navegação por Teclado**
- Todos os elementos interativos são acessíveis via Tab
- Ordem de tabulação lógica em formulários
- Escape fecha modais

✅ **ARIA Labels**
- Botões sem texto têm `aria-label`
- Campos com erro têm `aria-describedby`
- Elementos decorativos têm `aria-hidden`

### Checklist de Acessibilidade

- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande (>18px)
- [ ] Todas as imagens têm `alt` text
- [ ] Todos os inputs têm `<label>` associado
- [ ] Focus visível em todos os elementos interativos
- [ ] Navegação por teclado funcional
- [ ] Testado com leitor de tela (NVDA/VoiceOver)

---

## Exemplos de Uso

### Formulário Completo

```jsx
import { cn } from '@/lib/cn';
import { inputVariants, buttonVariants, cardVariants } from '@/components/theme';

function ContactForm() {
  return (
    <div className={cn(cardVariants({ padding: 'lg' }))}>
      <h2 className="text-2xl font-bold mb-6">Entre em Contato</h2>

      <form className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nome <span className="text-danger-500">*</span>
          </label>
          <input
            type="text"
            className={cn(inputVariants({ size: 'md' }))}
            placeholder="Seu nome completo"
            required
          />
        </div>

        {/* Email com erro */}
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

        {/* Mensagem */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mensagem
          </label>
          <textarea
            className={cn(inputVariants({ size: 'md' }), 'min-h-[120px]')}
            placeholder="Sua mensagem..."
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className={cn(buttonVariants({ variant: 'primary', size: 'md' }))}
          >
            Enviar
          </button>
          <button
            type="button"
            className={cn(buttonVariants({ variant: 'ghost', size: 'md' }))}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
```

### Card com Glassmorphism

```jsx
function GlassCard() {
  return (
    <div className={cn(cardVariants({ variant: 'glass', padding: 'lg', hover: true }))}>
      <h3 className="text-xl font-semibold mb-2">Card com Efeito Glass</h3>
      <p className="text-slate-600 mb-4">
        Este card utiliza efeito de vidro fosco (glassmorphism)
      </p>
      <button className={cn(buttonVariants({ variant: 'primary' }))}>
        Ver Mais
      </button>
    </div>
  );
}
```

---

## Referências

- [Design System do Gov.br](https://www.gov.br/ds/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Class Variance Authority](https://cva.style/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Última Atualização:** 26 de Novembro de 2025
**Mantido por:** Equipe de Desenvolvimento PCA
