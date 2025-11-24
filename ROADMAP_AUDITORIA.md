# 🎯 Roadmap de Auditoria - PCA Sistema

**Progresso Geral:** `[████░░░░░░░░░░░░░░░░] 22%`
**Última Atualização:** 2025-11-24
**Status:** Em Andamento - Validações Implementadas ✅

---

## 📊 Resumo Executivo

| Categoria | Tarefas | Concluídas | Progresso |
|-----------|---------|------------|-----------|
| 🔐 Segurança (RLS) | 8 | 0 | 0% |
| ✅ Validações | 14 | 12 | 86% |
| 🚨 Tratamento de Erros | 10 | 0 | 0% |
| ⚡ Performance | 6 | 0 | 0% |
| 📚 Documentação | 8 | 0 | 0% |
| 💾 Backup | 4 | 0 | 0% |
| 🚀 Staging/Deploy | 5 | 0 | 0% |
| **TOTAL** | **55** | **12** | **22%** |

---

## 🔐 1. SEGURANÇA - Row Level Security (RLS)

**Prioridade:** Alta
**Arquivos Afetados:** `supabase-schema.sql`
**Objetivo:** Preparar estrutura de RLS mesmo sem autenticação implementada

### 1.1 Habilitar RLS nas Tabelas
- [ ] **1.1.1** - Descomentar `ALTER TABLE unidades_gestoras ENABLE ROW LEVEL SECURITY`
- [ ] **1.1.2** - Descomentar `ALTER TABLE demandas ENABLE ROW LEVEL SECURITY`
- [ ] **1.1.3** - Descomentar `ALTER TABLE pca ENABLE ROW LEVEL SECURITY`
- [ ] **1.1.4** - Adicionar `ALTER TABLE pca_itens ENABLE ROW LEVEL SECURITY`

### 1.2 Criar Políticas de Acesso Temporárias (Sem Auth)
- [ ] **1.2.1** - Criar política `SELECT` pública para `unidades_gestoras` permitindo anon
- [ ] **1.2.2** - Criar política `INSERT/UPDATE/DELETE` pública para `unidades_gestoras` permitindo anon
- [ ] **1.2.3** - Criar política `SELECT` pública para `demandas` permitindo anon
- [ ] **1.2.4** - Criar política `INSERT/UPDATE/DELETE` pública para `demandas` permitindo anon
- [ ] **1.2.5** - Criar política `SELECT` pública para `pca` permitindo anon
- [ ] **1.2.6** - Criar política `UPDATE` pública para `pca` (apenas status) permitindo anon
- [ ] **1.2.7** - Adicionar comentários SQL explicando que são políticas temporárias até implementar Auth
- [ ] **1.2.8** - Documentar em `ROADMAP_AUTH.md` (criar) o plano futuro de restrição de políticas

**Critério de Aceitação:** Todas as tabelas com RLS habilitado e políticas permitindo operações CRUD via anon key, com documentação clara sobre temporariedade.

---

## ✅ 2. VALIDAÇÕES DE FORMULÁRIO

**Prioridade:** Alta
**Arquivos Afetados:** `src/components/DemandaForm.jsx`, `src/pages/Unidades.jsx`, `src/lib/validators.js` (criar)

### 2.1 Criar Biblioteca de Validadores
- [x] **2.1.1** - Criar arquivo `src/lib/validators.js`
- [x] **2.1.2** - Implementar `validateEmail(email)` com regex RFC 5322
- [x] **2.1.3** - Implementar `validatePhone(phone)` para formato brasileiro (opcional)
- [x] **2.1.4** - Implementar `validateCurrency(value, min, max)` para valores monetários
- [x] **2.1.5** - Implementar `validateTextLength(text, min, max)`
- [x] **2.1.6** - Implementar `validateDate(date, allowPast = false)`
- [ ] **2.1.7** - Adicionar testes unitários (opcional, mas recomendado)

### 2.2 Melhorar Validação do DemandaForm
**Arquivo:** `src/components/DemandaForm.jsx` (linha 69-78)

- [x] **2.2.1** - Adicionar limite de caracteres para `item` (max 255) conforme schema SQL
- [x] **2.2.2** - Adicionar limite de caracteres para `descricao` (max 5000 recomendado)
- [x] **2.2.3** - Adicionar limite de caracteres para `justificativa` (max 5000 recomendado)
- [ ] **2.2.4** - Validar `data_prevista` não pode ser no passado (exceto se editando demanda antiga)
- [x] **2.2.5** - Validar `valor_unitario` não pode ser zero (apenas positivo)
- [x] **2.2.6** - Validar `valor_unitario` não pode exceder 999.999.999,99 (limite DECIMAL(15,2))
- [x] **2.2.7** - Validar `quantidade` não pode exceder 999.999 (limite razoável)

### 2.3 Melhorar Validação do UnidadeForm
**Arquivo:** `src/pages/Unidades.jsx` (componente UnidadeForm, linha 8-89)

- [x] **2.3.1** - Validar `nome` obrigatório e max 255 caracteres (linha 24 já valida vazio)
- [x] **2.3.2** - Validar `sigla` max 20 caracteres (conforme schema linha 15)
- [x] **2.3.3** - Validar `email` formato válido usando `validateEmail()` (linha 72 tem type="email", mas HTML5 validation é fraco)
- [x] **2.3.4** - Validar `telefone` formato brasileiro (xx) xxxxx-xxxx ou similar (opcional, máscara)
- [x] **2.3.5** - Validar `responsavel` max 255 caracteres
- [x] **2.3.6** - Exibir mensagens de erro claras para cada campo inválido (criar estado `errors`)
- [x] **2.3.7** - Adicionar feedback visual de erro (border vermelho, texto de erro abaixo do campo)

**Critério de Aceitação:** Formulários não permitem submissão com dados inválidos, com mensagens claras e feedback visual. Valores respeitam limites do schema SQL.

---

## 🚨 3. TRATAMENTO DE ERROS

**Prioridade:** Alta
**Arquivos Afetados:** `src/hooks/useData.js`, `src/lib/errorHandler.js` (criar), componentes de páginas

### 3.1 Criar Sistema de Tratamento de Erros
- [ ] **3.1.1** - Criar arquivo `src/lib/errorHandler.js`
- [ ] **3.1.2** - Implementar função `parseSupabaseError(error)` que retorna mensagem amigável
- [ ] **3.1.3** - Mapear códigos de erro comuns do Supabase (ex: `PGRST116` = not found, `23505` = unique violation)
- [ ] **3.1.4** - Criar categorias de erro: NETWORK, DATABASE, VALIDATION, UNKNOWN
- [ ] **3.1.5** - Implementar função `getErrorMessage(error)` que retorna string legível para o usuário

### 3.2 Melhorar useData.js
**Arquivo:** `src/hooks/useData.js`

- [ ] **3.2.1** - Importar `parseSupabaseError` em `useData.js`
- [ ] **3.2.2** - Substituir `err.message` por `parseSupabaseError(err)` nos hooks `useDemandas` (linhas 16, 34, 45, 56)
- [ ] **3.2.3** - Substituir `err.message` por `parseSupabaseError(err)` nos hooks `useUnidades` (linhas 84, 101, 112, 123)
- [ ] **3.2.4** - Substituir `err.message` por `parseSupabaseError(err)` no hook `usePCA` (linhas 152, 177)
- [ ] **3.2.5** - Adicionar retry automático (1x) para erros de rede (status 500-599) com delay de 2s

### 3.3 Melhorar Feedback Visual
- [ ] **3.3.1** - Garantir que todas as páginas usem Toast para exibir erros (já implementado na maioria)
- [ ] **3.3.2** - Adicionar ícones específicos para tipo de erro no Toast (⚠️ network, ❌ validation, 🐛 unknown)
- [ ] **3.3.3** - Criar estado de "Erro Crítico" para quando Supabase está offline (substituir loading infinito por tela de erro com botão "Tentar Novamente")
- [ ] **3.3.4** - Implementar componente `<ErrorBoundary>` no `App.jsx` para capturar erros não tratados do React

**Critério de Aceitação:** Erros exibem mensagens amigáveis ao usuário, com ícones apropriados. Retry automático para erros de rede. Supabase offline exibe tela de erro com botão de retry.

---

## ⚡ 4. PERFORMANCE E TESTES DE CARGA

**Prioridade:** Média
**Arquivos Afetados:** `seed_performance.sql` (criar), `src/hooks/useData.js`

### 4.1 Criar Script de Seed para Performance
- [ ] **4.1.1** - Criar arquivo `seed_performance.sql` na raiz do projeto
- [ ] **4.1.2** - Gerar 500 demandas de teste distribuídas entre as 6 unidades padrão
- [ ] **4.1.3** - Variar status (50% pendente, 30% aprovada, 15% em_analise, 5% rejeitada)
- [ ] **4.1.4** - Variar valores entre R$ 1.000 e R$ 500.000 para simular cenário real
- [ ] **4.1.5** - Distribuir datas entre Q1-Q4 de 2025
- [ ] **4.1.6** - Adicionar comentário SQL com instruções de como executar e como limpar os dados de teste

### 4.2 Testar e Documentar Performance
- [ ] **4.2.1** - Executar seed no Supabase e testar Dashboard com 500+ demandas
- [ ] **4.2.2** - Medir tempo de carregamento inicial (target: < 3s)
- [ ] **4.2.3** - Testar página Relatórios com 500+ demandas (verificar gráficos e tabelas)
- [ ] **4.2.4** - Testar filtros na página Demandas com 500+ registros
- [ ] **4.2.5** - Documentar gargalos encontrados (se houver) e soluções futuras (paginação, lazy loading)
- [ ] **4.2.6** - Adicionar nota no README sobre limites recomendados (ex: "Sistema testado com até 1000 demandas")

**Critério de Aceitação:** Sistema testado com 500+ registros. Tempo de carregamento < 3s. Gargalos documentados com soluções propostas.

---

## 📚 5. DOCUMENTAÇÃO

**Prioridade:** Alta
**Arquivos Afetados:** `INSTALL.md` (criar), `CONFIG.md` (criar), `CONTRIBUTING.md` (criar), `README.md` (atualizar)

### 5.1 Criar Guia de Instalação Detalhado
- [ ] **5.1.1** - Criar arquivo `INSTALL.md` na raiz
- [ ] **5.1.2** - Seção "Pré-requisitos": Node.js versão, npm/yarn, navegador
- [ ] **5.1.3** - Seção "Passo 1: Criar Projeto Supabase" com prints/screenshots
- [ ] **5.1.4** - Seção "Passo 2: Executar Schema SQL" com instruções detalhadas
- [ ] **5.1.5** - Seção "Passo 3: Configurar Variáveis de Ambiente" com exemplo do .env
- [ ] **5.1.6** - Seção "Passo 4: Instalar Dependências e Executar" (`npm install && npm run dev`)
- [ ] **5.1.7** - Seção "Verificação de Instalação" com checklist (Supabase conectado, 6 unidades seed, sem erros no console)
- [ ] **5.1.8** - Seção "Troubleshooting" com erros comuns (credenciais erradas, schema não executado, CORS)

### 5.2 Criar Guia de Configuração
- [ ] **5.2.1** - Criar arquivo `CONFIG.md` na raiz
- [ ] **5.2.2** - Documentar todas as variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] **5.2.3** - Explicar diferença entre `anon key` e `service_role key` (quando usar cada uma)
- [ ] **5.2.4** - Documentar configurações opcionais (timeouts, limites, etc)
- [ ] **5.2.5** - Seção "Deploy" com instruções para Vercel/Netlify (como configurar env vars em produção)

### 5.3 Atualizar README Existente
- [ ] **5.3.1** - Adicionar badge de "Status: Beta" no topo do README.md
- [ ] **5.3.2** - Adicionar link para `INSTALL.md` na seção de instalação
- [ ] **5.3.3** - Adicionar seção "⚠️ Avisos Importantes" mencionando que não tem autenticação ainda
- [ ] **5.3.4** - Adicionar seção "Limitações Conhecidas" (sem auth, RLS aberto, limite de 1000 demandas recomendado)

### 5.4 Criar Guia de Contribuição (Opcional mas Recomendado)
- [ ] **5.4.1** - Criar arquivo `CONTRIBUTING.md` com padrões de código
- [ ] **5.4.2** - Documentar estrutura de commits (usar Conventional Commits)
- [ ] **5.4.3** - Documentar processo de PR (se aplicável)

**Critério de Aceitação:** Qualquer desenvolvedor consegue instalar e rodar o sistema seguindo `INSTALL.md` em menos de 30 minutos. Configurações claras em `CONFIG.md`.

---

## 💾 6. BACKUP E RECUPERAÇÃO

**Prioridade:** Média
**Arquivos Afetados:** `BACKUP.md` (criar), scripts na pasta `scripts/backup/` (criar)

### 6.1 Documentar Procedimento de Backup
- [ ] **6.1.1** - Criar arquivo `BACKUP.md` na raiz
- [ ] **6.1.2** - Documentar backup via interface do Supabase (Dashboard > Database > Backups)
- [ ] **6.1.3** - Documentar backup manual via `pg_dump` (para usuários avançados)
- [ ] **6.1.4** - Criar script bash `scripts/backup/backup.sh` que executa pg_dump automatizado

### 6.2 Definir Estratégia de Backup
- [ ] **6.2.1** - Documentar frequência recomendada (diário para produção, semanal para dev)
- [ ] **6.2.2** - Documentar retenção recomendada (30 dias de backups)
- [ ] **6.2.3** - Documentar teste de restore (fazer backup, apagar dados de teste, fazer restore)
- [ ] **6.2.4** - Adicionar seção no README linkando para `BACKUP.md`

**Critério de Aceitação:** Procedimento de backup documentado e testado. Script automatizado funcional (opcional). Teste de restore bem-sucedido.

---

## 🚀 7. STAGING E VERIFICAÇÃO DE BUILD

**Prioridade:** Alta (antes de deploy)
**Arquivos Afetados:** `DEPLOY.md` (criar), `package.json` (verificar scripts)

### 7.1 Verificar Processo de Build
- [ ] **7.1.1** - Executar `npm run build` e verificar se compila sem erros
- [ ] **7.1.2** - Executar `npm run preview` e testar todas as funcionalidades
- [ ] **7.1.3** - Verificar tamanho do bundle (target: < 500KB gzipped para inicial)
- [ ] **7.1.4** - Verificar se variáveis de ambiente funcionam corretamente no build de produção
- [ ] **7.1.5** - Testar build em diferentes navegadores (Chrome, Firefox, Safari, Edge)

### 7.2 Criar Checklist de Deploy
- [ ] **7.2.1** - Criar arquivo `DEPLOY.md` com checklist pré-deploy
- [ ] **7.2.2** - Itens do checklist: variáveis configuradas, RLS habilitado, seed executado, build testado
- [ ] **7.2.3** - Documentar plataformas recomendadas (Vercel para frontend)
- [ ] **7.2.4** - Documentar necessidade de HTTPS (obrigatório para Supabase)
- [ ] **7.2.5** - Criar seção "Pós-Deploy" com testes de smoke (acessar dashboard, criar demanda, gerar relatório)

**Critério de Aceitação:** Build funciona sem erros. Preview testado. Checklist de deploy documentado e validado.

---

## 📈 8. MÉTRICAS DE SUCESSO

Ao final da auditoria, os seguintes critérios devem ser atendidos:

- ✅ **Segurança:** RLS habilitado em todas as tabelas com políticas documentadas
- ✅ **Validações:** Todos os formulários validam dados antes de enviar ao backend
- ✅ **Erros:** Mensagens de erro amigáveis em 100% dos fluxos
- ✅ **Performance:** Sistema testado com 500+ registros, carregamento < 3s
- ✅ **Documentação:** `INSTALL.md` e `CONFIG.md` completos e testados
- ✅ **Backup:** Procedimento documentado e testado com sucesso
- ✅ **Deploy:** Build funcional e checklist de deploy validado

---

## 🎯 PRÓXIMOS PASSOS (Não inclusos nesta auditoria)

Os seguintes itens foram identificados mas serão tratados em fases futuras:

1. **Autenticação e Autorização** (Alta prioridade - fase 2)
   - Implementar Supabase Auth (login/logout)
   - Criar perfis de usuário (admin, gestor, visualizador)
   - Restringir políticas RLS baseadas em `auth.uid()`
   - Adicionar controle de permissões por unidade

2. **Paginação e Otimizações Avançadas** (Média prioridade - fase 3)
   - Implementar paginação server-side na listagem de demandas
   - Lazy loading de dados pesados
   - Cache de consultas frequentes
   - Índices adicionais no banco conforme uso real

3. **Testes Automatizados** (Baixa prioridade - fase 4)
   - Testes unitários (Jest/Vitest)
   - Testes de integração (Testing Library)
   - Testes E2E (Playwright/Cypress)
   - CI/CD com GitHub Actions

---

## 🏁 STATUS ATUAL

**Fase Atual:** Validações Implementadas ✅
**Próxima Tarefa:** Tratamento de Erros (Item 3) ou RLS (Item 1)
**Bloqueadores:** Nenhum
**Progresso:** 12/55 tarefas completadas (22%)

### ✅ Completado Nesta Sessão (2025-11-24)

**Item 2 - Validações de Formulário (86% concluído)**

1. **Biblioteca de Validadores Criada** (`src/lib/validators.js`)
   - ✅ Validadores reutilizáveis: `required`, `email`, `phone`, `minLen`, `maxLen`, `positive`, `nonNegative`, `maxValue`, `notPastDate`
   - ✅ Função helper `validateForm(data, rules)` para validação centralizada
   - ✅ Helpers: `hasErrors()`, `clearError()`

2. **DemandaForm.jsx Refatorado**
   - ✅ Validação de campos obrigatórios: `unidade_id`, `item`, `quantidade`, `valor_unitario`
   - ✅ Limites de caracteres: `item` (255), `descricao` (5000), `justificativa` (5000)
   - ✅ Limites de valores: `quantidade` (999.999), `valor_unitario` (999.999.999,99)
   - ✅ Mensagens de erro claras e contextuais

3. **UnidadeForm Refatorado** (`src/pages/Unidades.jsx`)
   - ✅ Estado de `errors` implementado
   - ✅ Validação completa: `nome`, `sigla`, `email`, `telefone`, `responsavel`
   - ✅ Feedback visual em todos os campos (prop `error`)
   - ✅ Reset de erros ao abrir/fechar modal

**Pendente:**
- ⏳ Validação de `data_prevista` não no passado (2.2.4)
- ⏳ Testes unitários (2.1.7 - opcional)

### 📋 Próximos Passos Recomendados

**Opção A - Tratamento de Erros (Item 3)** - Recomendado
- Criar `src/lib/errorHandler.js`
- Melhorar mensagens de erro do Supabase
- Implementar retry automático

**Opção B - RLS (Item 1)**
- Habilitar Row Level Security
- Criar políticas de acesso

---

**Última modificação:** 2025-11-24 por Claude (Desenvolvedor Front-end Sênior)
**Próxima revisão:** Após implementar Item 3 ou Item 1
