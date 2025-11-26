# Guia Rápido - Design System PCA

> Começe a usar o Design System em 5 minutos

---

## 🚀 Instalação

O Design System já está configurado! Basta importar as variantes:

```javascript
import { cn } from '@/lib/cn';
import { buttonVariants, inputVariants, cardVariants } from '@/components/theme';
```

---

## 📦 Componentes Prontos

### Button

```jsx
// Botão primário padrão
<button className={buttonVariants()}>
  Clique Aqui
</button>

// Botão de perigo grande
<button className={buttonVariants({ variant: 'danger', size: 'lg' })}>
  Deletar
</button>

// Botão ghost pequeno
<button className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
  Cancelar
</button>
```

**Variantes:** `primary`, `secondary`, `ghost`, `danger`, `outline`, `success`
**Tamanhos:** `sm`, `md`, `lg`

---

### Input

```jsx
// Input padrão
<input
  className={inputVariants()}
  placeholder="Digite algo..."
/>

// Input com erro
<input
  className={inputVariants({ state: 'error' })}
  placeholder="Email inválido"
/>

// Input grande (60px altura mínima)
<input
  className={inputVariants({ size: 'lg' })}
  placeholder="Campo grande"
/>
```

**Estados:** `default`, `error`, `success`, `disabled`
**Tamanhos:** `sm`, `md`, `lg`

---

### Card

```jsx
// Card padrão
<div className={cardVariants()}>
  Conteúdo
</div>

// Card com efeito glass
<div className={cardVariants({ variant: 'glass' })}>
  Efeito de vidro fosco
</div>

// Card elevado com hover
<div className={cardVariants({ variant: 'elevated', hover: true })}>
  Card clicável
</div>
```

**Variantes:** `default`, `glass`, `elevated`, `outline`
**Padding:** `none`, `sm`, `md`, `lg`

---

## 🎨 Cores

### Usar em JSX

```jsx
<div className="bg-primary-600 text-white">
  Fundo azul gov.br
</div>

<div className="bg-success-100 text-success-800">
  Fundo verde claro
</div>

<div className="bg-danger-50 border-l-4 border-danger-500">
  Alert de erro
</div>
```

### Usar em CSS

```css
.my-element {
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}
```

---

## 📏 Espaçamentos

Use classes Tailwind padrão:

```jsx
<div className="p-4">Padding 16px</div>
<div className="p-6">Padding 24px</div>
<div className="p-8">Padding 32px</div>

<div className="m-4">Margin 16px</div>
<div className="gap-4">Gap 16px</div>
```

---

## ✨ Classes Utilitárias

### Glassmorphism

```jsx
<div className="glass p-6 rounded-xl">
  Efeito de vidro fosco
</div>

<div className="glass-dark p-6 rounded-xl">
  Vidro fosco escuro
</div>
```

### Animações

```jsx
<div className="animate-fade-in">
  Aparece suavemente
</div>

<div className="animate-slide-in">
  Desliza da esquerda
</div>
```

### Loading

```jsx
<div className="spinner"></div>       {/* 24px */}
<div className="spinner spinner-sm"></div>  {/* 16px */}
<div className="spinner spinner-lg"></div>  {/* 32px */}
```

---

## 🎯 Exemplos Práticos

### Formulário Simples

```jsx
import { cn } from '@/lib/cn';
import { inputVariants, buttonVariants } from '@/components/theme';

function LoginForm() {
  return (
    <form className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          className={cn(inputVariants())}
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Senha
        </label>
        <input
          type="password"
          className={cn(inputVariants())}
          placeholder="••••••••"
        />
      </div>

      <button className={cn(buttonVariants({ fullWidth: true }))}>
        Entrar
      </button>
    </form>
  );
}
```

### Card Informativo

```jsx
import { cn } from '@/lib/cn';
import { cardVariants, badgeVariants } from '@/components/theme';

function InfoCard() {
  return (
    <div className={cn(cardVariants({ variant: 'elevated', padding: 'lg' }))}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Título</h3>
        <span className={cn(badgeVariants({ variant: 'success' }))}>
          Novo
        </span>
      </div>
      <p className="text-slate-600">
        Descrição do conteúdo do card
      </p>
    </div>
  );
}
```

### Alert de Erro

```jsx
import { alertVariants } from '@/components/theme';

function ErrorAlert() {
  return (
    <div className={alertVariants({ variant: 'danger' })}>
      <svg className="w-5 h-5" fill="currentColor">
        {/* Ícone de erro */}
      </svg>
      <div>
        <p className="font-semibold">Erro!</p>
        <p className="text-sm">Algo deu errado. Tente novamente.</p>
      </div>
    </div>
  );
}
```

---

## 🔧 Combinando Classes

Use `cn()` para combinar variantes com classes customizadas:

```jsx
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/theme';

<button
  className={cn(
    buttonVariants({ variant: 'primary', size: 'lg' }),
    'mt-4',        // Margin top
    'shadow-xl',   // Sombra extra
    'italic'       // Texto itálico
  )}
>
  Botão Customizado
</button>
```

---

## ♿ Acessibilidade

Sempre adicione:

```jsx
// Labels em inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ARIA labels em botões sem texto
<button aria-label="Fechar" className={buttonVariants({ variant: 'ghost' })}>
  <X />
</button>

// Indicador de campo obrigatório
<label>
  Nome <span className="text-danger-500">*</span>
</label>
```

---

## 📚 Documentação Completa

Para referência completa, veja:
- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) - Todos os tokens disponíveis
- [variants.js](../src/components/theme/variants.js) - Código das variantes
- [variants.examples.js](../src/components/theme/variants.examples.js) - Mais exemplos

---

**Precisa de ajuda?** Consulte o time de desenvolvimento! 🚀
