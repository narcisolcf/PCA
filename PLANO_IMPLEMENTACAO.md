# Plano de Implementação - Aplicativo PCA
**Data:** Novembro 2025
**Versão:** 1.0
**Status:** Em Elaboração

---

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Fases de Implementação](#fases-de-implementação)
4. [Matriz de Testes](#matriz-de-testes)
5. [Plano de Refatoração](#plano-de-refatoração)
6. [Cronograma de Entrega](#cronograma-de-entrega)

---

## Visão Geral

Este plano estrutura a implementação do aplicativo PCA conforme as diretrizes definidas em `DIRETRIZES_APP.md`. O projeto é baseado em React + Vite com Tailwind CSS e segue os padrões de Design System do gov.br.

### Objetivos Principais
✅ Implementar design tokens e sistema de cores HSL
✅ Criar componentes base reutilizáveis com CVA
✅ Aplicar efeitos visuais (glassmorphism)
✅ Implementar formulários com UX aprimorada
✅ Garantir responsividade e acessibilidade WCAG AA
✅ Estruturar testes automatizados
✅ Refatorar código existente para padrões modernos

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes base (Button, Input, Select, etc)
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── FormField.jsx
│   │   └── index.js
│   ├── layout/               # Componentes de layout
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── index.js
│   ├── sections/             # Seções de página
│   │   ├── HeroSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   └── index.js
│   ├── forms/                # Formulários específicos
│   │   ├── DemandaForm.jsx
│   │   ├── UnidadeForm.jsx
│   │   └── index.js
│   ├── tables/               # Tabelas
│   │   ├── DemandasTable.jsx
│   │   └── index.js
│   └── theme/                # Temas e variantes
│       ├── variants.js       # CVA variants
│       └── index.js
├── styles/
│   ├── globals.css           # Design tokens e estilos globais
│   ├── animations.css        # Animações customizadas
│   └── utilities.css         # Classes utilitárias
├── hooks/
│   ├── useData.js
│   ├── useForm.js
│   ├── useTheme.js
│   └── index.js
├── lib/
│   ├── supabase.js
│   ├── errorHandler.js
│   ├── validators.js
│   ├── utils.js
│   └── constants.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Demandas.jsx
│   ├── Unidades.jsx
│   ├── Relatorios.jsx
│   ├── NotFound.jsx
│   └── ErrorPage.jsx
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── e2e/
│   │   ├── forms.spec.js
│   │   ├── navigation.spec.js
│   │   └── tables.spec.js
│   └── integration/
│       ├── supabase.test.js
│       └── forms.test.js
├── App.jsx
└── main.jsx

public/
├── fonts/                    # Fonte Rawline
└── images/

config/
├── tailwind.config.ts        # Configuração Tailwind
├── vite.config.js
└── tsconfig.json
```

---

## Fases de Implementação

### ⚙️ FASE 1: Setup e Configuração
**Duração Estimada:** Preparatória
**Objetivo:** Configurar ambiente de desenvolvimento

#### 1.1 - Verificar e Completar Dependências
**Status:** ⏳ Pendente

**Subtarefas:**
- [ ] Verificar instalação do Tailwind CSS
- [ ] Instalar Lucide React (ícones)
- [ ] Instalar Class Variance Authority (CVA)
- [ ] Instalar tailwindcss-animate
- [ ] Instalar Playwright para testes E2E
- [ ] Instalar Jest/Vitest para testes unitários
- [ ] Configurar ESLint e Prettier
- [ ] Adicionar fontes do gov.br (Rawline)

**Testes:**
- [ ] `npm install` sem erros
- [ ] Todas as dependências listadas em `package.json`
- [ ] Verificar import de todas as dependências

---

#### 1.2 - Configurar Tailwind CSS com Extensões
**Status:** ⏳ Pendente

**Arquivo:** `tailwind.config.ts`

**Subtarefas:**
- [ ] Criar `tailwind.config.ts` com estrutura base
- [ ] Adicionar extensões de `backgroundImage`:
  - `gradient-water`
  - `gradient-glass`
- [ ] Adicionar extensões de `boxShadow`:
  - `shadow-glass`
  - `shadow-glow`
- [ ] Adicionar extensões de `backdropFilter`:
  - `blur-subtle` (4px)
  - `blur-medium` (8px)
  - `blur-strong` (16px)
- [ ] Configurar plugins (tailwindcss-animate)
- [ ] Adicionar breakpoints customizados se necessário

**Testes:**
- [ ] Classes customizadas estão disponíveis no Tailwind
- [ ] Build não gera warnings
- [ ] Verificar arquivo compilado

---

#### 1.3 - Configurar Design Tokens em globals.css
**Status:** ⏳ Pendente

**Arquivo:** `src/styles/globals.css`

**Subtarefas:**
- [ ] Definir paleta de cores em HSL:
  - Cores primárias
  - Cores secundárias
  - Cores de status (sucesso, erro, aviso)
  - Cores de fundo
  - Cores de texto
- [ ] Adicionar variáveis para tipografia
- [ ] Definir espaçamentos padrão
- [ ] Configurar tema claro/escuro (se aplicável)
- [ ] Importar fonte Rawline
- [ ] Aplicar reset CSS

**Testes:**
- [ ] Verificar todas as variáveis CSS definidas
- [ ] Fonte Rawline carrega corretamente
- [ ] Cores estão com contraste adequado (WCAG AA)

---

### 🎨 FASE 2: Design Tokens e Sistema de Variantes
**Duração Estimada:** Implementação inicial
**Objetivo:** Estabelecer base visual consistente

#### 2.1 - Criar Sistema de Variantes com CVA
**Status:** ⏳ Pendente

**Arquivo:** `src/components/theme/variants.js`

**Subtarefas:**
- [ ] Definir variantes para Button (size, variant, state)
- [ ] Definir variantes para Input (size, state, type)
- [ ] Definir variantes para Card (variant, elevation)
- [ ] Definir variantes para Select (size, state)
- [ ] Documentar todas as combinações de variantes
- [ ] Criar exemplos de uso

**Variantes Obrigatórias:**

```javascript
// Button
- variant: primary, secondary, ghost, danger
- size: sm, md, lg
- state: default, hover, active, disabled, loading

// Input
- size: sm, md, lg
- state: default, focus, error, success
- type: text, email, password

// Card
- variant: default, glass, elevated
- padding: sm, md, lg
- border: none, subtle, prominent

// Modal
- size: sm, md, lg
- variant: default, glass
```

**Testes:**
- [ ] Todas as variantes podem ser combinadas
- [ ] Clientes ESM conseguem importar variantes
- [ ] Geração de classes CSS corretas

---

#### 2.2 - Documentar Design System
**Status:** ⏳ Pendente

**Arquivo:** `docs/DESIGN_TOKENS.md`

**Subtarefas:**
- [ ] Documentar paleta de cores com valores HSL
- [ ] Criar guia de tipografia
- [ ] Documentar espaçamentos
- [ ] Documentar efeitos visuais
- [ ] Criar exemplos de uso de componentes
- [ ] Adicionar padrões de acessibilidade

**Testes:**
- [ ] Documentação reflete código implementado
- [ ] Exemplos são executáveis

---

### 🧩 FASE 3: Componentes Base
**Duração Estimada:** Implementação core
**Objetivo:** Criar biblioteca de componentes reutilizáveis

#### 3.1 - Implementar Componentes de Formulário
**Status:** ⏳ Pendente

**Arquivo:** `src/components/ui/`

**Subtarefas:**

##### 3.1.1 - Componente Input
```jsx
// Props esperadas:
- label: string
- type: text|email|password|number|date
- placeholder: string
- value: string
- onChange: function
- error: string
- required: boolean
- disabled: boolean
- size: sm|md|lg
- maxLength: number
- hint: string
```

- [ ] Implementar Input com validações
- [ ] Adicionar ícones opcionais
- [ ] Implementar indicador de erro
- [ ] Adicionar hint text
- [ ] Estilizar com variantes CVA
- [ ] Testes unitários

##### 3.1.2 - Componente Select
```jsx
// Props esperadas:
- label: string
- options: array
- value: string
- onChange: function
- placeholder: string
- disabled: boolean
- error: string
- size: sm|md|lg (altura mínima 60px)
- searchable: boolean
- multi: boolean
```

- [ ] Implementar Select com altura mínima 60px
- [ ] Suporte a busca (se multi)
- [ ] Indicador de erro
- [ ] Integração com Dropdown do gov.br
- [ ] Testes unitários

##### 3.1.3 - Componente Textarea
```jsx
// Props esperadas:
- label: string
- value: string
- onChange: function
- placeholder: string
- error: string
- rows: number
- maxLength: number
- leading: relaxed|normal
```

- [ ] Implementar Textarea
- [ ] Usar `leading-relaxed` por padrão
- [ ] Indicador de caracteres restantes
- [ ] Auto-resize opcionalmente
- [ ] Testes unitários

##### 3.1.4 - Componente Datepicker
```jsx
// Props esperadas:
- label: string
- value: date
- onChange: function
- minDate: date
- maxDate: date
- error: string
- size: sm|md|lg (altura mínima 60px)
```

- [ ] Implementar Datepicker
- [ ] Altura mínima 60px
- [ ] Validação de datas
- [ ] Integração com biblioteca de datas
- [ ] Testes unitários

##### 3.1.5 - Componente FormField
```jsx
// Wrapper para campos de formulário
- label: string
- required: boolean
- error: string
- hint: string
- children: element
```

- [ ] Implementar FormField wrapper
- [ ] Indicador de campo obrigatório
- [ ] Exibição de erros
- [ ] Hint text
- [ ] Testes unitários

**Testes Integrados:**
- [ ] Todos os inputs funcionam em navegadores modernos
- [ ] Validações funcionam corretamente
- [ ] Estados visuais (focus, error, disabled) funcionam
- [ ] Acessibilidade: labels associados, ARIA attributes

---

#### 3.2 - Implementar Componentes de Layout
**Status:** ⏳ Pendente

**Arquivo:** `src/components/layout/`

##### 3.2.1 - Componente Header
```jsx
// Props esperadas:
- title: string
- subtitle: string
- user: object
- onLogout: function
- navigation: array
```

- [ ] Implementar Header com efeito glassmorphism
- [ ] Menu de navegação
- [ ] Seção de usuário/logout
- [ ] Responsivo (mobile menu hamburger)
- [ ] Sticky positioning
- [ ] Testes

##### 3.2.2 - Componente Footer
```jsx
// Props esperadas:
- links: array
- copyright: string
- socialLinks: array
```

- [ ] Implementar Footer
- [ ] Links de navegação
- [ ] Copyright
- [ ] Links de redes sociais
- [ ] Responsivo
- [ ] Testes

##### 3.2.3 - Componente Sidebar (se necessário)
- [ ] Implementar Sidebar
- [ ] Navegação lateral
- [ ] Collapse/expand
- [ ] Responsivo
- [ ] Testes

---

#### 3.3 - Implementar Componentes de Apresentação
**Status:** ⏳ Pendente

**Arquivo:** `src/components/ui/`

##### 3.3.1 - Componente Button
```jsx
// Props esperadas:
- variant: primary|secondary|ghost|danger
- size: sm|md|lg
- disabled: boolean
- loading: boolean
- onClick: function
- icon: element
- children: element
```

- [ ] Implementar Button com CVA
- [ ] Estados: default, hover, active, disabled, loading
- [ ] Suporte a ícones
- [ ] Loading spinner animado
- [ ] Acessibilidade
- [ ] Testes

##### 3.3.2 - Componente Card
```jsx
// Props esperadas:
- variant: default|glass|elevated
- padding: sm|md|lg
- border: none|subtle|prominent
- children: element
```

- [ ] Implementar Card
- [ ] Efeito glassmorphism opcional
- [ ] Variações de padding
- [ ] Elevação com sombras
- [ ] Testes

##### 3.3.3 - Componente Modal
```jsx
// Props esperadas:
- isOpen: boolean
- onClose: function
- title: string
- children: element
- actions: array (botões)
- size: sm|md|lg
- variant: default|glass
```

- [ ] Implementar Modal
- [ ] Fechar ao clicar fora (opcional)
- [ ] Fechar automático após ação
- [ ] Glassmorphism styling
- [ ] Overlay backdrop
- [ ] Acessibilidade (focus trap)
- [ ] Testes

##### 3.3.4 - Componente Alert
```jsx
// Props esperadas:
- type: success|error|warning|info
- title: string
- message: string
- onClose: function
- autoClose: boolean
- duration: number
```

- [ ] Implementar Alert com animação suave
- [ ] 4 variações de tipo
- [ ] Auto-fechar opcional
- [ ] Ícones apropriados
- [ ] Testes

##### 3.3.5 - Componente Badge
```jsx
// Props esperadas:
- variant: primary|secondary|success|error
- size: sm|md|lg
- children: element
```

- [ ] Implementar Badge
- [ ] Variações de cor e tamanho
- [ ] Testes

##### 3.3.6 - Componente Collapse
```jsx
// Props esperadas:
- title: string
- children: element
- defaultOpen: boolean
- onChange: function
```

- [ ] Implementar Collapse
- [ ] Seguir padrão gov.br
- [ ] Animações suaves
- [ ] Acessibilidade
- [ ] Testes

**Testes Integrados (Fase 3):**
- [ ] Todos os componentes renderizam sem erros
- [ ] Props opcionais funcionam corretamente
- [ ] Estados visuais aplicados corretamente
- [ ] Acessibilidade: ARIA attributes, keyboard navigation
- [ ] Responsividade em todos os breakpoints
- [ ] Screenshot tests para componentes visuais

---

### 📝 FASE 4: Componentes de Domínio (Formulários Específicos)
**Duração Estimada:** Implementação de features
**Objetivo:** Implementar formulários do aplicativo

#### 4.1 - Refatorar DemandaForm
**Status:** ⏳ Pendente

**Arquivo Atual:** `src/components/DemandaForm.jsx`

**Subtarefas:**
- [ ] Refatorar para usar componentes base (Input, Select, Textarea)
- [ ] Implementar validações:
  - Campos obrigatórios
  - Formato de email (se aplicável)
  - Datas válidas
  - Comprimento mínimo/máximo
- [ ] Adicionar loading state durante submissão
- [ ] Implementar reset automático após sucesso
- [ ] Exibir alert de sucesso
- [ ] Exibir erros de validação
- [ ] Console.log de dados em desenvolvimento
- [ ] Implementar hook customizado `useForm`
- [ ] Testes unitários e E2E

**Campos Esperados:**
- [ ] Validar quais campos existem
- [ ] Implementar handlers de mudança
- [ ] Implementar handler de submissão

---

#### 4.2 - Criar UnidadeForm (se necessário)
**Status:** ⏳ Pendente

**Arquivo:** `src/components/forms/UnidadeForm.jsx`

**Subtarefas:**
- [ ] Implementar formulário de Unidade
- [ ] Usar componentes base
- [ ] Validações apropriadas
- [ ] Estados de carregamento
- [ ] Feedback visual
- [ ] Testes

---

#### 4.3 - Criar Hook useForm Customizado
**Status:** ⏳ Pendente

**Arquivo:** `src/hooks/useForm.js`

**Subtarefas:**
- [ ] Implementar gerenciamento de estado do formulário
- [ ] Validação automática
- [ ] Reset de formulário
- [ ] Handlers de mudança
- [ ] Handlers de submissão
- [ ] Suporte a dados iniciais
- [ ] Documentação de uso
- [ ] Testes unitários

**Exemplo de Uso:**
```javascript
const { values, errors, touched, handleChange, handleSubmit, reset } = useForm({
  initialValues: { name: '', email: '' },
  onSubmit: (values) => { /* ... */ },
  validate: (values) => { /* ... */ }
});
```

---

### 📊 FASE 5: Componentes de Tabelas e Listagens
**Duração Estimada:** Implementação de features
**Objetivo:** Implementar visualização de dados

#### 5.1 - Refatorar DemandasTable
**Status:** ⏳ Pendente

**Arquivo Atual:** `src/components/DemandasTable.jsx`

**Subtarefas:**
- [ ] Extrair componente Table base
- [ ] Implementar ordenação por coluna
- [ ] Implementar paginação
- [ ] Implementar filtros
- [ ] Implementar busca
- [ ] Loading states
- [ ] Estado vazio (empty state)
- [ ] Responsividade (scroll horizontal em mobile)
- [ ] Ações contextuais (editar, deletar, etc)
- [ ] Testes

---

#### 5.2 - Criar Componente Table Base
**Status:** ⏳ Pendente

**Arquivo:** `src/components/ui/Table.jsx`

**Subtarefas:**
- [ ] Implementar componente Table reutilizável
- [ ] Props para colunas
- [ ] Props para dados
- [ ] Renderização de células customizáveis
- [ ] Headers com opções de ordenação
- [ ] Paginação integrada
- [ ] Responsividade
- [ ] Acessibilidade
- [ ] Testes

---

### 🎨 FASE 6: Efeitos Visuais e Temas
**Duração Estimada:** Refinamento visual
**Objetivo:** Aplicar efeitos glassmorphism e temas

#### 6.1 - Implementar Glassmorphism
**Status:** ⏳ Pendente

**Componentes para Aplicar:**
- [ ] Header com vidro fosco
- [ ] Cards principais com efeito glass
- [ ] Modais com efeito glass
- [ ] Floating elements com blur

**Classe Tailwind Customizada:**
```css
.glass-effect {
  @apply bg-white/25 backdrop-blur-md border border-white/20 shadow-glass;
}
```

**Subtarefas:**
- [ ] Criar classe `.glass-effect`
- [ ] Aplicar em Header
- [ ] Aplicar em Cards principais
- [ ] Aplicar em Modais
- [ ] Testar contraste (WCAG AA)
- [ ] Testar em navegadores modernos

---

#### 6.2 - Implementar Animações
**Status:** ⏳ Pendente

**Arquivo:** `src/styles/animations.css`

**Animações Obrigatórias:**
- [ ] Fade in/out
- [ ] Slide in/out
- [ ] Scale in/out
- [ ] Loading spinner
- [ ] Pulse (indicador vivo)
- [ ] Bounce (feedback)

**Subtarefas:**
- [ ] Definir animações em CSS
- [ ] Integrar com tailwindcss-animate
- [ ] Usar em transições de estado
- [ ] Documentar
- [ ] Testes visuais

---

### 🔍 FASE 7: Acessibilidade e Responsividade
**Duração Estimada:** Validação
**Objetivo:** Garantir WCAG AA e responsividade

#### 7.1 - Auditoria de Acessibilidade
**Status:** ⏳ Pendente

**Subtarefas:**
- [ ] Verificar contraste de cores (WCAG AA)
  - Utilizar ferramentas: WebAIM Contrast Checker
  - Ajustar cores conforme necessário
- [ ] Verificar labels em inputs
  - Todas as inputs devem ter `<label>` associado
  - Usar atributo `htmlFor`
- [ ] Adicionar ARIA attributes
  - `aria-label` em botões sem texto
  - `aria-describedby` em campos com erros
  - `aria-hidden` em elementos decorativos
- [ ] Testar navegação por teclado
  - Tab order correto
  - Focus visível em todos os elementos
  - Escape fecha modais
- [ ] Testar com leitores de tela
  - NVDA (Windows)
  - JAWS (Windows)
  - VoiceOver (macOS)

**Ferramenta:** axe DevTools, WAVE, Lighthouse

---

#### 7.2 - Testar Responsividade
**Status:** ⏳ Pendente

**Breakpoints a Testar:**
- [ ] Mobile: 320px, 375px, 425px
- [ ] Tablet: 768px, 810px, 1024px
- [ ] Desktop: 1280px, 1536px, 1920px

**Elementos a Testar:**
- [ ] Header (menu hamburger em mobile)
- [ ] Sidebar (toggle em mobile)
- [ ] Formulários (layout empilhado em mobile)
- [ ] Tabelas (scroll horizontal em mobile)
- [ ] Cards (grid responsivo)
- [ ] Modais (fullscreen em mobile)

**Ferramentas:**
- [ ] DevTools Chrome (device emulation)
- [ ] Testes em dispositivos reais (se possível)

---

### ✅ FASE 8: Testes Automatizados
**Duração Estimada:** Cobertura de testes
**Objetivo:** Garantir qualidade através de testes

#### 8.1 - Testes Unitários (Jest/Vitest)
**Status:** ⏳ Pendente

**Escopo:**
- [ ] Testes de componentes UI (Button, Input, Card, etc)
- [ ] Testes de hooks (useData, useForm, useTheme)
- [ ] Testes de utilidades (validators, errorHandler, utils)

**Estrutura:**
```
src/tests/unit/
├── components/
│   ├── Button.test.js
│   ├── Input.test.js
│   ├── Modal.test.js
│   └── ...
├── hooks/
│   ├── useForm.test.js
│   ├── useData.test.js
│   └── ...
└── utils/
    ├── validators.test.js
    ├── errorHandler.test.js
    └── ...
```

**Exemplo de Teste:**
```javascript
describe('Button Component', () => {
  it('should render with correct variant', () => {
    render(<Button variant="primary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

**Cobertura Esperada:** 70%+

---

#### 8.2 - Testes de Integração
**Status:** ⏳ Pendente

**Escopo:**
- [ ] Teste de fluxo de formulário (submit, validação, sucesso)
- [ ] Teste de integração com Supabase
- [ ] Teste de navegação entre páginas
- [ ] Teste de autenticação (login/logout)

**Estrutura:**
```
src/tests/integration/
├── forms.test.js
├── supabase.test.js
├── auth.test.js
└── ...
```

---

#### 8.3 - Testes E2E (Playwright)
**Status:** ⏳ Pendente

**Escopo:**
- [ ] Fluxo de criação de demanda
- [ ] Fluxo de edição de demanda
- [ ] Fluxo de deleção de demanda
- [ ] Fluxo de visualização de relatórios
- [ ] Fluxo de navegação geral

**Estrutura:**
```
e2e/
├── forms.spec.js          # Testes de formulários
├── navigation.spec.js     # Testes de navegação
├── demandas.spec.js       # Testes de CRUD de demandas
├── tables.spec.js         # Testes de tabelas
└── ...
```

**Exemplo de Teste E2E:**
```javascript
test('should create demanda successfully', async ({ page }) => {
  await page.goto('/demandas');
  await page.click('button:has-text("Nova Demanda")');
  await page.fill('input[name="titulo"]', 'Demanda Teste');
  await page.fill('input[name="descricao"]', 'Descrição teste');
  await page.click('button:has-text("Enviar")');
  await expect(page).toHaveURL('/demandas');
  await expect(page.locator('text=Demanda Teste')).toBeVisible();
});
```

---

#### 8.4 - Testes de Performance
**Status:** ⏳ Pendente

**Subtarefas:**
- [ ] Medir Lighthouse scores (>90)
- [ ] Verificar Core Web Vitals
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1
- [ ] Otimizar bundle size
- [ ] Testar carregamento de imagens
- [ ] Testar cache estratégico

**Ferramentas:**
- [ ] Lighthouse
- [ ] WebPageTest
- [ ] Chrome DevTools Performance

---

### 🔧 FASE 9: Refatoração e Otimização
**Duração Estimada:** Melhoria contínua
**Objetivo:** Código limpo e performático

#### 9.1 - Refatoração de Código Existente
**Status:** ⏳ Pendente

**Arquivo:** `src/components/ui.jsx` (consolidado)

**Subtarefas:**
- [ ] Dividir componentes monolíticos
- [ ] Mover cada componente para arquivo individual
- [ ] Adicionar proptypes ou TypeScript
- [ ] Documentar com JSDoc
- [ ] Remover código duplicado
- [ ] Melhorar nomenclatura

**Estrutura Após Refatoração:**
```
src/components/ui/
├── Button.jsx
├── Input.jsx
├── Select.jsx
├── Modal.jsx
├── Card.jsx
├── Alert.jsx
├── Badge.jsx
├── Collapse.jsx
└── index.js (export all)
```

---

#### 9.2 - Otimização de Performance
**Status:** ⏳ Pendente

**Subtarefas:**
- [ ] Implementar React.memo para componentes puros
- [ ] Otimizar re-renders com useMemo/useCallback
- [ ] Lazy load pages com React.lazy
- [ ] Otimizar imagens
  - Formato moderno (WebP)
  - Responsive images (srcset)
  - Lazy loading (loading="lazy")
- [ ] Tree-shaking em imports
- [ ] Remover imports desnecessários

**Exemplo:**
```javascript
// ❌ Evitar
import * as utils from './utils';

// ✅ Preferir
import { specificFunction } from './utils';
```

---

#### 9.3 - Melhorar Qualidade do Código
**Status:** ⏳ Pendente

**Subtarefas:**
- [ ] Aumentar cobertura de testes para 80%+
- [ ] Aplicar ESLint rules
- [ ] Aplicar Prettier formatting
- [ ] Adicionar pre-commit hooks (husky)
- [ ] Documentar funções complexas com JSDoc
- [ ] Manter imports em ordem alfabética
- [ ] Utilizar constantes ao invés de magic strings

**Exemplo:**
```javascript
// ❌ Evitar
const status = data.filter(item => item.type === 'demanda');

// ✅ Preferir
const DEMANDA_TYPE = 'demanda';
const demandas = data.filter(item => item.type === DEMANDA_TYPE);
```

---

#### 9.4 - Documentação do Código
**Status:** ⏳ Pendente

**Documentos a Criar:**
- [ ] `docs/COMPONENTS.md` - Catálogo de componentes
- [ ] `docs/HOOKS.md` - Hooks customizados
- [ ] `docs/SETUP.md` - Setup do projeto
- [ ] `docs/ARCHITECTURE.md` - Arquitetura geral
- [ ] `docs/TESTING.md` - Estratégia de testes
- [ ] `docs/CONTRIBUTING.md` - Guia para contribuição

---

### 🚀 FASE 10: Deploy e Finalização
**Duração Estimada:** Validação e entrega
**Objetivo:** Preparar para produção

#### 10.1 - Verificação Pré-Deploy
**Status:** ⏳ Pendente

**Subtarefas:**
- [ ] Garantir build sem erros: `npm run build`
- [ ] Verificar variáveis de ambiente (.env)
- [ ] Executar testes: `npm test`
- [ ] Executar testes E2E: `npx playwright test`
- [ ] Rodar Lighthouse: `npm run lighthouse`
- [ ] Validar com ESLint: `npm run lint`
- [ ] Executar Prettier: `npm run format`

---

#### 10.2 - Documentação Final
**Status:** ⏳ Pendente

**Subtarefas:**
- [ ] Atualizar README.md
- [ ] Criar guia de instalação
- [ ] Documentar ambiente de produção
- [ ] Criar guia de troubleshooting
- [ ] Documentar processos de CI/CD

---

#### 10.3 - Entrega e Manutenção
**Status:** ⏳ Pendente

**Subtarefas:**
- [ ] Deploy para staging
- [ ] Testes em staging
- [ ] Deploy para produção
- [ ] Monitoramento de erros
- [ ] Plano de manutenção

---

## 📊 Matriz de Testes

| Componente | Unitário | Integração | E2E | Acessibilidade | Performance |
|-----------|----------|-----------|-----|----------------|-------------|
| Button | ✅ | - | - | ✅ | - |
| Input | ✅ | ✅ | - | ✅ | - |
| Select | ✅ | ✅ | - | ✅ | - |
| Modal | ✅ | ✅ | ✅ | ✅ | - |
| Form | ✅ | ✅ | ✅ | ✅ | ✅ |
| Table | ✅ | ✅ | ✅ | ✅ | ✅ |
| Page | - | ✅ | ✅ | ✅ | ✅ |
| Hook (useForm) | ✅ | ✅ | - | - | - |
| Util (validator) | ✅ | - | - | - | - |

---

## 🔄 Plano de Refatoração

### Prioridade Alta (Eixo 1)
1. Dividir `src/components/ui.jsx` em componentes individuais
2. Criar sistema de Design Tokens em `globals.css`
3. Implementar `useForm` hook customizado
4. Refatorar formulários existentes

### Prioridade Média (Eixo 2)
1. Extrair componente Table base
2. Implementar glassmorphism
3. Adicionar documentação completa
4. Otimizar performance

### Prioridade Baixa (Eixo 3)
1. TypeScript migration (opcional)
2. Storybook integration (opcional)
3. Dark mode (opcional)

---

## 📅 Cronograma de Entrega

**Fase 1 (Setup):** Preparatório
**Fase 2 (Design Tokens):** Semana 1
**Fase 3 (Componentes Base):** Semana 2-3
**Fase 4 (Formulários):** Semana 4
**Fase 5 (Tabelas):** Semana 5
**Fase 6 (Efeitos Visuais):** Semana 6
**Fase 7 (Acessibilidade):** Semana 7
**Fase 8 (Testes):** Semana 8-9
**Fase 9 (Refatoração):** Semana 10-11
**Fase 10 (Deploy):** Semana 12

---

## 📋 Checklist de Validação Final

### Antes de Deploy
- [ ] Todos os testes passam (unitários, integração, E2E)
- [ ] Cobertura de testes >= 80%
- [ ] Lighthouse score >= 90
- [ ] Acessibilidade: WCAG AA validado
- [ ] Responsividade: testado em 3+ dispositivos
- [ ] Sem console errors ou warnings
- [ ] Build otimizado (size < limite)
- [ ] Documentação completa
- [ ] Código review aprovado
- [ ] Performance OK (Core Web Vitals)

### Pós-Deploy
- [ ] Monitoramento de erros ativo
- [ ] Logs de acesso funcionando
- [ ] Backups configurados
- [ ] Plano de rollback preparado
- [ ] Notificação de usuarios (se necessário)

---

## 🎯 Métricas de Sucesso

| Métrica | Meta | Status |
|---------|------|--------|
| Cobertura de Testes | >= 80% | ⏳ Pendente |
| Lighthouse Score | >= 90 | ⏳ Pendente |
| Acessibilidade WCAG | AA | ⏳ Pendente |
| Core Web Vitals | Todos "Bom" | ⏳ Pendente |
| Bundle Size | < 500KB | ⏳ Pendente |
| Tempo de Carregamento | < 2s | ⏳ Pendente |
| Componentes Reutilizáveis | 15+ | ⏳ Pendente |
| Documentação | 100% completa | ⏳ Pendente |

---

## 📝 Notas e Considerações

### Conflitos Resolvidos
- ✅ Glassmorphism vs Design System gov.br
  - Decisão: Usar glassmorphism em elementos secundários (cards, modals)
  - Manter padrões principais do gov.br na navegação e estrutura

### Riscos Identificados
1. **Compatibilidade de Navegadores:** Glassmorphism depende de `backdrop-filter`
   - Fallback: degradação graciosa com cores sólidas
2. **Performance:** Blur intenso pode impactar em devices mobiles
   - Mitigação: testes de performance, blur-strong apenas em desktop
3. **Acessibilidade:** Glassmorphism pode afetar contraste
   - Mitigação: auditoria WCAG AA obrigatória

### Próximas Etapas (Beyond MVP)
- [ ] TypeScript migration
- [ ] Dark mode support
- [ ] Storybook para documentação visual
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Analytics integração
- [ ] A/B testing framework

---

**Última Atualização:** 26 de Novembro de 2025
**Responsável:** Equipe de Desenvolvimento
**Status Geral:** 🔴 Não Iniciado
