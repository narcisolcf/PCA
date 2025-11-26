# Diretrizes do Aplicativo

Este documento consolida as diretrizes de frontend, UX/UI e stack técnica para o desenvolvimento do aplicativo.

---

## 1. Stack Técnica

### 1.1 Dependências Obrigatórias

| Dependência | Finalidade |
|-------------|------------|
| Tailwind CSS | Framework de estilos utilitários |
| Lucide React | Biblioteca de ícones |
| Class Variance Authority (CVA) | Gerenciamento de variantes de componentes |
| tailwindcss-animate | Animações e transições |

### 1.2 Configuração do Tailwind

O arquivo `tailwind.config.ts` deve ser estruturado para receber customizações futuras, incluindo plugins, temas e extensões.

**Extensões customizadas obrigatórias:**

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      backgroundImage: {
        'gradient-water': '/* gradiente água */',
        'gradient-glass': '/* gradiente vidro */',
      },
      boxShadow: {
        'shadow-glass': '/* sombra vidro */',
        'shadow-glow': '/* sombra brilho */',
      },
      backdropFilter: {
        'blur-subtle': 'blur(4px)',
        'blur-medium': 'blur(8px)',
        'blur-strong': 'blur(16px)',
      },
    },
  },
}
```

---

## 2. Identidade Visual

### 2.1 Tipografia

**Fonte principal:** Rawline (Design System gov.br)

A tipografia deve seguir os padrões estabelecidos pelo Design System do Governo Federal, garantindo consistência com aplicações governamentais.

Referência: https://www.gov.br/ds/fundamentos-visuais/tipografia

### 2.2 Sistema de Cores (Design Tokens)

As cores devem ser definidas em `globals.css` utilizando variáveis CSS no espaço de cores **HSL** para facilitar manipulação dinâmica.

```css
/* globals.css */
:root {
  --primary: 210 100% 50%;
  --secondary: 220 80% 60%;
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  /* ... demais tokens */
}
```

**Regras de contraste:**
- Verificar contraste de texto em relação a fundos e gradientes
- Ajustar luminosidade e saturação conforme necessário para garantir legibilidade (WCAG AA mínimo)

---

## 3. Componentes de Interface

### 3.1 Padrões do Design System gov.br

Os seguintes componentes devem seguir os padrões oficiais:

| Componente | Referência |
|------------|------------|
| Página de Erro | https://www.gov.br/ds/templates/erro?tab=designer |
| Dropdown (Elemento Flutuante) | https://www.gov.br/ds/padroes/design/dropdown |
| Formulários | https://www.gov.br/ds/padroes/design/formulario |
| Collapse (Expandir/Retrair) | https://www.gov.br/ds/padroes/design/collapse |
| Content Overflow | https://www.gov.br/ds/padroes/design/contentoverflow |

### 3.2 Layout Semântico

A estrutura da aplicação deve utilizar componentes React semânticos:

```
├── Header
├── HeroSection
├── Features
├── [Conteúdo Principal]
└── Footer
```

Utilizar classes do Tailwind (Flexbox e Grid) para posicionamento dos elementos.

---

## 4. Formulários

### 4.1 Espaçamento e Dimensões

| Elemento | Especificação |
|----------|---------------|
| Campos input | Espaço vertical generoso entre label e texto digitado |
| Select | Altura mínima de **60px** |
| Datepicker | Altura mínima de **60px** |
| Textarea | Utilizar `leading-relaxed` para melhor legibilidade |

**Regra geral:** Manter visual uniforme em todo o formulário.

### 4.2 Comportamento UX

| Comportamento | Descrição |
|---------------|-----------|
| Loading states | Exibir indicadores visuais com transições suaves |
| Reset automático | Limpar formulário após cadastro bem-sucedido |
| Alert de sucesso | Exibir feedback após ação concluída |
| Modal | Fechamento automático após ação |
| Estado limpo | Preparar formulário para próximo cadastro |
| Debug | Console.log dos dados em ambiente de desenvolvimento |

### 4.3 Botões Contextuais

Botões de ação devem ser específicos ao contexto. Exemplo: botão "Novo Agente" deve aparecer apenas na tabela de agentes, não globalmente.

---

## 5. Efeitos Visuais

### 5.1 Glassmorphism

Aplicar o efeito de vidro fosco em componentes como cards, modais e barras de navegação.

**Implementação:**

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
```

**Classes Tailwind equivalentes:**
- Fundo: `bg-white/25`
- Blur: `backdrop-blur-md`
- Borda: `border border-white/20`
- Sombra: `shadow-glass` (customizada)

### 5.2 Profundidade 3D

Utilizar as classes customizadas de `boxShadow` para criar elevação e profundidade:
- `shadow-glass` para componentes com efeito vidro
- `shadow-glow` para elementos de destaque/CTA

---

## 6. Responsividade

O design deve ser **responsivo** para:
- Desktop (telas ≥1024px)
- Tablet (telas 768px - 1023px)
- Mobile (telas <768px)

Utilizar breakpoints padrão do Tailwind CSS:
- `sm:` (640px)
- `md:` (768px)
- `lg:` (1024px)
- `xl:` (1280px)
- `2xl:` (1536px)

---

## 7. Análise de Conflitos

### 7.1 Conflitos Identificados

⚠️ **Ponto de Atenção: Glassmorphism vs Design System gov.br**

O Design System do gov.br possui uma identidade visual própria e consolidada. O efeito Glassmorphism (vidro fosco, semi-transparência) é uma tendência de design moderna que pode conflitar com os padrões visuais oficiais do governo.

**Recomendação:** 
- Se o aplicativo for de uso **interno/corporativo** ou voltado para municípios com identidade própria: o Glassmorphism pode ser aplicado livremente.
- Se o aplicativo precisar seguir **estritamente** o Design System gov.br para conformidade visual federal: limitar o uso de Glassmorphism a elementos não conflitantes ou consultar as diretrizes oficiais.

### 7.2 Compatibilidades Confirmadas

✅ **Tailwind CSS** é mencionado em múltiplas fontes e é a base técnica confirmada.

✅ **Tipografia Rawline** não conflita com as demais diretrizes técnicas.

✅ **Comportamentos UX** (loading states, reset, alerts) são complementares e não conflitam com nenhum padrão visual.

✅ **Altura mínima de 60px** para select/datepicker é compatível com os padrões de formulário do gov.br.

---

## 8. Checklist de Implementação

- [ ] Configurar `tailwind.config.ts` com extensões customizadas
- [ ] Definir Design Tokens em `globals.css` (cores HSL)
- [ ] Instalar dependências: Tailwind CSS, Lucide React, CVA, tailwindcss-animate
- [ ] Implementar tipografia Rawline
- [ ] Criar componentes base: Header, Footer, HeroSection, Features
- [ ] Implementar padrões de formulário com altura mínima e espaçamento
- [ ] Configurar loading states e feedback visual
- [ ] Aplicar efeito Glassmorphism nos componentes apropriados
- [ ] Testar responsividade em todos os breakpoints
- [ ] Validar contraste de cores (acessibilidade WCAG AA)

---

## 9. Referências

- Design System gov.br: https://www.gov.br/ds/
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev/
- Class Variance Authority: https://cva.style/docs

---

*Documento gerado em: Novembro/2025*
*Versão: 1.0*
