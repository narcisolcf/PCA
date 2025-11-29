# 🚀 Roadmap de Produção - PCA App

**Objetivo:** Preparar o sistema PCA para uso real por usuários finais
**Status Atual:** 87% da auditoria técnica concluída | 0% de preparação para produção
**Data de Criação:** 2025-11-29

---

## 📊 Situação Atual

### ✅ Itens Concluídos (Base Técnica)
- Design System completo com tokens HSL e variantes CVA
- 10 componentes UI base + hooks customizados (useForm, useTable, useData)
- Validações de formulário robustas
- Tratamento de erros em português
- RLS habilitado (políticas permissivas temporárias)
- Documentação técnica completa (INSTALL.md, CONFIG.md, SECURITY.md, etc.)
- Scripts de backup automatizados
- CI/CD configurado (GitHub Actions)
- Bundle otimizado -76% (lazy loading implementado)
- Pre-commit hooks (ESLint + Prettier)

### ❌ Bloqueadores Críticos

#### 1. 🔐 AUTENTICAÇÃO INEXISTENTE (CRÍTICO)
**Impacto:** Sistema inutilizável em produção - qualquer pessoa pode acessar e modificar todos os dados

**Situação Atual:**
- Sem login/logout
- RLS com políticas `USING (true)` (acesso público total)
- Sem controle de permissões por usuário/unidade

**Risco:** 🔴 CRÍTICO - Dados sensíveis expostos publicamente

---

#### 2. 🧪 ZERO TESTES AUTOMATIZADOS (ALTO)
**Impacto:** Alto risco de bugs em produção, regressões não detectadas

**Situação Atual:**
- 0 testes unitários
- 0 testes E2E
- Vitest e Playwright instalados mas não configurados
- Nenhuma cobertura de código

**Risco:** 🟠 ALTO - Qualidade não garantida

---

#### 3. 📊 PERFORMANCE NÃO TESTADA (MÉDIO)
**Impacto:** Sistema pode ficar lento com dados reais

**Situação Atual:**
- Script de seed criado (`supabase-seed-performance.sql`)
- Nunca executado
- Sistema não testado com 500+ registros
- Dashboard e relatórios não testados sob carga

**Risco:** 🟡 MÉDIO - Performance desconhecida

---

#### 4. 🚀 DEPLOY NÃO REALIZADO (ALTO)
**Impacto:** Sistema não acessível para usuários finais

**Situação Atual:**
- Checklist de deploy criado em `DEPLOY.md`
- Nunca executado
- Sem ambiente de staging
- Sem monitoramento configurado

**Risco:** 🟠 ALTO - Sistema não deployável

---

## 🎯 FASES DE PRODUÇÃO

### 📋 FASE 1: AUTENTICAÇÃO E SEGURANÇA (2-3 semanas)
**Prioridade:** 🔴 CRÍTICA
**Objetivo:** Tornar o sistema seguro e pronto para múltiplos usuários

#### 1.1 - Implementar Supabase Auth
- [ ] Configurar Supabase Auth (Email/Password)
- [ ] Criar tabela `user_profiles`:
  ```sql
  CREATE TABLE user_profiles (
    id uuid REFERENCES auth.users PRIMARY KEY,
    email text NOT NULL,
    nome text NOT NULL,
    unidade_id uuid REFERENCES unidades_gestoras,
    role text CHECK (role IN ('admin', 'gestor', 'visualizador')),
    created_at timestamptz DEFAULT now()
  );
  ```
- [ ] Criar página de Login (`/login`)
- [ ] Criar página de Registro (`/signup`)
- [ ] Implementar fluxo de recuperação de senha
- [ ] Adicionar botão de Logout no Header

**Entregas:**
- ✅ Usuários podem se cadastrar e fazer login
- ✅ Sessão persistente (localStorage)
- ✅ Redirect para `/login` se não autenticado

---

#### 1.2 - Migrar Políticas RLS (Fase Crítica)
- [ ] Criar políticas RLS restritivas baseadas em `auth.uid()`
  ```sql
  -- Exemplo: Demandas (usuário vê apenas sua unidade)
  CREATE POLICY "Usuários veem demandas de sua unidade"
  ON demandas FOR SELECT
  TO authenticated
  USING (
    unidade_id IN (
      SELECT unidade_id FROM user_profiles WHERE id = auth.uid()
    )
  );
  ```
- [ ] Implementar políticas para:
  - `unidades_gestoras` (admin vê tudo, gestor vê apenas sua unidade)
  - `demandas` (gestor vê apenas sua unidade)
  - `pca` (admin vê tudo)
  - `pca_itens` (baseado no PCA)
- [ ] Criar role `admin` com acesso total
- [ ] Testar políticas com usuários reais
- [ ] Remover políticas permissivas antigas (`USING (true)`)

**Entregas:**
- ✅ RLS restritivo funcionando
- ✅ Usuários veem apenas dados de sua unidade
- ✅ Admins têm acesso total
- ✅ Zero vazamento de dados

---

#### 1.3 - Controle de Permissões (RBAC)
- [ ] Criar tabela `user_permissions`:
  ```sql
  CREATE TABLE user_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES user_profiles,
    resource text NOT NULL, -- 'demandas', 'pca', 'relatorios'
    action text NOT NULL, -- 'create', 'read', 'update', 'delete'
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, resource, action)
  );
  ```
- [ ] Criar hook `useAuth` com:
  - `user` (dados do usuário logado)
  - `role` (admin, gestor, visualizador)
  - `can(action, resource)` (verificar permissão)
  - `logout()`
- [ ] Proteger rotas sensíveis (ex: `/pca` apenas para admin)
- [ ] Ocultar botões de ação para usuários sem permissão

**Entregas:**
- ✅ Controle granular de permissões
- ✅ Visualizadores não podem criar/editar
- ✅ Gestores gerenciam apenas sua unidade
- ✅ Admins têm acesso total

---

#### 1.4 - Auditoria de Segurança
- [ ] Validar todas as páginas exigem autenticação
- [ ] Testar RLS com múltiplos usuários simultâneos
- [ ] Verificar não há endpoints públicos expostos
- [ ] Executar scan de vulnerabilidades (npm audit)
- [ ] Revisar código para SQL injection, XSS
- [ ] Documentar políticas de segurança em `SECURITY.md`

**Entregas:**
- ✅ Sistema 100% seguro
- ✅ Documentação de segurança atualizada
- ✅ Zero vulnerabilidades conhecidas

**🎯 Critérios de Aceitação FASE 1:**
- ✅ Usuários podem fazer login/logout
- ✅ RLS restritivo funcionando
- ✅ Apenas admins veem todas as demandas
- ✅ Gestores veem apenas sua unidade
- ✅ Scan de segurança aprovado (npm audit)

---

### 🧪 FASE 2: TESTES E QUALIDADE (2-3 semanas)
**Prioridade:** 🟠 ALTA
**Objetivo:** Garantir qualidade e prevenir bugs em produção

#### 2.1 - Testes Unitários (Vitest + Testing Library)
- [ ] Configurar Vitest com coverage (meta: 70%+)
- [ ] Testar componentes críticos:
  - [ ] `Button.test.jsx` (variantes, loading, disabled)
  - [ ] `Input.test.jsx` (validação, erro, máscaras)
  - [ ] `FormField.test.jsx` (label, erro, hint)
  - [ ] `Modal.test.jsx` (open/close, ESC key, overlay)
  - [ ] `DemandaForm.test.jsx` (validação, submit, reset)
- [ ] Testar hooks customizados:
  - [ ] `useForm.test.js` (validação, submit, reset)
  - [ ] `useAuth.test.js` (login, logout, permissions)
  - [ ] `useData.test.js` (fetch, create, update, delete)
- [ ] Testar utilitários:
  - [ ] `validators.test.js` (email, phone, currency, date)
  - [ ] `errorHandler.test.js` (mapeamento de erros Supabase)

**Comandos:**
```bash
npm run test          # Executar testes
npm run test:coverage # Gerar relatório de cobertura
npm run test:ui       # Interface visual de testes
```

**Entregas:**
- ✅ 70%+ de cobertura de testes
- ✅ Testes passando em CI/CD
- ✅ Relatório de cobertura gerado

---

#### 2.2 - Testes de Integração
- [ ] Testar fluxo completo de demanda:
  - [ ] Criar demanda
  - [ ] Editar demanda
  - [ ] Deletar demanda
  - [ ] Validar persistência no Supabase
- [ ] Testar autenticação:
  - [ ] Login com credenciais válidas
  - [ ] Login com credenciais inválidas
  - [ ] Logout
  - [ ] Recuperação de senha
- [ ] Testar RLS:
  - [ ] Usuário A não vê dados de Usuário B
  - [ ] Admin vê todos os dados
  - [ ] Gestor vê apenas sua unidade

**Entregas:**
- ✅ Fluxos críticos testados
- ✅ RLS validado com testes automatizados

---

#### 2.3 - Testes E2E (Playwright)
- [ ] Configurar Playwright com múltiplos navegadores
- [ ] Criar testes E2E:
  - [ ] `auth.spec.js`:
    - Login bem-sucedido
    - Login com senha errada
    - Logout
    - Redirect para `/login` se não autenticado
  - [ ] `demandas.spec.js`:
    - Criar nova demanda
    - Editar demanda existente
    - Deletar demanda
    - Filtrar demandas
    - Paginação
  - [ ] `dashboard.spec.js`:
    - Carregar dashboard
    - Verificar gráficos renderizam
    - Verificar estatísticas corretas
  - [ ] `relatorios.spec.js`:
    - Gerar relatório
    - Exportar CSV
    - Filtros funcionam
- [ ] Executar testes em CI/CD
- [ ] Screenshot tests para regressão visual

**Comandos:**
```bash
npx playwright test                  # Executar testes E2E
npx playwright test --ui             # Modo interativo
npx playwright test --project=chrome # Apenas Chrome
npx playwright show-report           # Ver relatório
```

**Entregas:**
- ✅ 10+ testes E2E críticos
- ✅ Testes passando em Chrome, Firefox, Safari
- ✅ Screenshots de regressão visual

---

#### 2.4 - Testes de Performance
- [ ] Executar `supabase-seed-performance.sql` (500 demandas)
- [ ] Testar Dashboard com 500+ registros:
  - [ ] Tempo de carregamento < 3s
  - [ ] Gráficos renderizam sem lag
  - [ ] Scroll suave na listagem
- [ ] Testar Relatórios:
  - [ ] Geração de gráficos < 2s
  - [ ] Exportação CSV < 5s
  - [ ] Filtros responsivos
- [ ] Executar Lighthouse:
  - [ ] Performance > 90
  - [ ] Accessibility > 95
  - [ ] Best Practices > 95
  - [ ] SEO > 90
- [ ] Medir Core Web Vitals:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Documentar resultados em `PERFORMANCE.md`
- [ ] Limpar dados de teste após validação

**Entregas:**
- ✅ Sistema testado com 500+ registros
- ✅ Lighthouse score > 90
- ✅ Core Web Vitals aprovados
- ✅ Gargalos documentados (se houver)

**🎯 Critérios de Aceitação FASE 2:**
- ✅ Cobertura de testes > 70%
- ✅ 10+ testes E2E passando
- ✅ Lighthouse score > 90
- ✅ Sistema testado com 500+ registros
- ✅ CI/CD rodando testes automaticamente

---

### 🚀 FASE 3: DEPLOY E INFRAESTRUTURA (1 semana)
**Prioridade:** 🟠 ALTA
**Objetivo:** Sistema no ar e acessível para usuários finais

#### 3.1 - Ambiente de Staging
- [ ] Criar projeto Supabase de Staging
- [ ] Executar scripts SQL em staging:
  - `supabase-schema.sql`
  - `enable-rls.sql`
  - Seed básico (6 unidades + 10 demandas de teste)
- [ ] Deploy para Vercel (ambiente staging):
  - Branch: `staging`
  - URL: `https://pca-staging.vercel.app`
  - Variáveis de ambiente: Supabase Staging
- [ ] Testar fluxo completo em staging:
  - [ ] Criar conta
  - [ ] Fazer login
  - [ ] Criar demanda
  - [ ] Visualizar dashboard
  - [ ] Gerar relatório
  - [ ] Fazer logout

**Entregas:**
- ✅ Ambiente de staging funcional
- ✅ Testes manuais aprovados
- ✅ URL de staging acessível

---

#### 3.2 - Ambiente de Produção
- [ ] Criar projeto Supabase de Produção (tier pago recomendado)
- [ ] Executar scripts SQL em produção:
  - `supabase-schema.sql`
  - `enable-rls.sql` (políticas restritivas)
- [ ] Criar usuário admin inicial manualmente no Supabase
- [ ] Configurar backup automático (diário):
  - Retention: 30 dias
  - Restauração testada
- [ ] Deploy para Vercel (produção):
  - Branch: `main`
  - URL: Domínio customizado (ex: `pca.prefeitura.gov.br`)
  - Variáveis de ambiente: Supabase Produção
- [ ] Configurar monitoramento:
  - [ ] Vercel Analytics (Core Web Vitals)
  - [ ] Sentry (erros em produção)
  - [ ] Supabase Logs (queries lentas)

**Entregas:**
- ✅ Produção deployada e estável
- ✅ Domínio customizado configurado
- ✅ Backup automático funcionando
- ✅ Monitoramento ativo

---

#### 3.3 - Documentação para Usuários Finais
- [ ] Criar `docs/USER_GUIDE.md`:
  - Como fazer login
  - Como criar uma demanda
  - Como visualizar relatórios
  - Como exportar dados
  - FAQ
- [ ] Criar vídeo tutorial (opcional):
  - 5-10 minutos
  - Screencast com narração
  - Hospedado no YouTube (unlisted)
- [ ] Criar `RELEASE_NOTES.md`:
  - Funcionalidades incluídas na v1.0
  - Limitações conhecidas
  - Roadmap futuro

**Entregas:**
- ✅ Guia do usuário completo
- ✅ Vídeo tutorial (opcional)
- ✅ Release notes publicados

---

#### 3.4 - Go-Live
- [ ] Executar checklist pré-deploy (`DEPLOY.md`):
  - [ ] Build sem erros
  - [ ] Lint sem avisos
  - [ ] Testes passando (70%+ cobertura)
  - [ ] Lighthouse > 90
  - [ ] RLS validado
  - [ ] Variáveis de produção configuradas
  - [ ] Backup funcionando
- [ ] Fazer deploy para produção
- [ ] Smoke tests em produção:
  - [ ] Página inicial carrega
  - [ ] Login funciona
  - [ ] Dashboard carrega
  - [ ] Criar demanda funciona
  - [ ] Relatórios funcionam
- [ ] Notificar usuários finais:
  - Email com link de acesso
  - Credenciais iniciais (ou link de registro)
  - Link para guia do usuário
- [ ] Monitorar primeiras 24h:
  - [ ] Errors no Sentry
  - [ ] Performance no Vercel Analytics
  - [ ] Logs do Supabase

**Entregas:**
- ✅ Sistema em produção
- ✅ Usuários notificados
- ✅ Monitoramento ativo
- ✅ Sem erros críticos nas primeiras 24h

**🎯 Critérios de Aceitação FASE 3:**
- ✅ Staging funcionando sem erros
- ✅ Produção deployada em domínio customizado
- ✅ Backup automático configurado
- ✅ Monitoramento ativo (Vercel + Sentry)
- ✅ Documentação para usuários pronta
- ✅ Smoke tests aprovados em produção

---

### 🔧 FASE 4: MANUTENÇÃO E MELHORIAS (contínuo)
**Prioridade:** 🟢 MÉDIA
**Objetivo:** Manter sistema estável e adicionar melhorias baseadas em feedback

#### 4.1 - Monitoramento Contínuo
- [ ] Revisar dashboard Vercel Analytics semanalmente
- [ ] Revisar erros no Sentry diariamente
- [ ] Revisar logs do Supabase semanalmente
- [ ] Criar alertas:
  - [ ] Error rate > 5% (notificar Slack/Email)
  - [ ] Performance score < 80 (notificar)
  - [ ] Database usage > 80% (notificar)

**Entregas:**
- ✅ Alertas configurados
- ✅ Revisões semanais agendadas

---

#### 4.2 - Coleta de Feedback dos Usuários
- [ ] Criar formulário de feedback in-app (modal discreto)
- [ ] Configurar analytics de uso:
  - Páginas mais visitadas
  - Funcionalidades mais usadas
  - Tempo médio de sessão
  - Taxa de conversão (login → criação de demanda)
- [ ] Realizar entrevistas com usuários-chave:
  - O que funciona bem?
  - O que precisa melhorar?
  - Funcionalidades desejadas
- [ ] Documentar feedback em `FEEDBACK.md`

**Entregas:**
- ✅ Sistema de feedback ativo
- ✅ Analytics configurados
- ✅ Entrevistas realizadas (3+ usuários)

---

#### 4.3 - Roadmap de Melhorias Futuras
Baseado no feedback dos usuários, priorizar:

**🔴 Prioridade Alta (1-2 meses):**
- [ ] Notificações por email (demanda aprovada/rejeitada)
- [ ] Paginação server-side (se sistema ficar lento)
- [ ] Filtros avançados (múltiplos critérios simultâneos)
- [ ] Exportação de relatórios em PDF

**🟡 Prioridade Média (3-6 meses):**
- [ ] Dashboard customizável (widgets arrastáveis)
- [ ] Histórico de alterações (audit log)
- [ ] Comentários em demandas (discussão interna)
- [ ] Aprovação em múltiplos níveis (workflow)

**🟢 Prioridade Baixa (6+ meses):**
- [ ] Modo escuro (dark mode)
- [ ] PWA (instalável no celular)
- [ ] Integração com sistema de licitações
- [ ] API pública (para integrações externas)

**Entregas:**
- ✅ Roadmap futuro documentado
- ✅ Priorização baseada em feedback
- ✅ Timeline estimado

---

## 📊 Resumo Executivo

| Fase | Duração | Prioridade | Entregas Principais | Bloqueio |
|------|---------|------------|---------------------|----------|
| **FASE 1: Autenticação** | 2-3 sem | 🔴 CRÍTICA | Login, RLS restritivo, RBAC | Sistema inseguro |
| **FASE 2: Testes** | 2-3 sem | 🟠 ALTA | 70%+ cobertura, E2E, Lighthouse > 90 | Qualidade não garantida |
| **FASE 3: Deploy** | 1 sem | 🟠 ALTA | Staging + Produção, Monitoramento | Sistema não acessível |
| **FASE 4: Manutenção** | Contínuo | 🟢 MÉDIA | Feedback, Melhorias, Roadmap | N/A |

**Total estimado:** 5-7 semanas para MVP em produção

---

## ✅ Checklist de Produção Final

### Antes do Go-Live
- [ ] **Segurança:**
  - [ ] Autenticação funcionando
  - [ ] RLS restritivo validado
  - [ ] Políticas permissivas removidas
  - [ ] npm audit aprovado (0 vulnerabilidades)
- [ ] **Qualidade:**
  - [ ] Cobertura de testes > 70%
  - [ ] Testes E2E passando (10+)
  - [ ] Lighthouse score > 90
  - [ ] Sistema testado com 500+ registros
- [ ] **Infraestrutura:**
  - [ ] Backup automático configurado
  - [ ] Monitoramento ativo (Vercel + Sentry)
  - [ ] Domínio customizado configurado
  - [ ] Variáveis de produção validadas
- [ ] **Documentação:**
  - [ ] Guia do usuário completo
  - [ ] Release notes publicados
  - [ ] Vídeo tutorial (opcional)

### Pós-Go-Live (Primeiras 48h)
- [ ] Zero erros críticos no Sentry
- [ ] Performance estável (Lighthouse > 90)
- [ ] Usuários conseguem fazer login
- [ ] Funcionalidades principais funcionando (CRUD demandas)
- [ ] Backup executado com sucesso

---

## 🎯 Critérios de Sucesso do Projeto

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Segurança** | RLS restritivo + Autenticação | Auditoria manual |
| **Qualidade** | 70%+ cobertura de testes | `npm run test:coverage` |
| **Performance** | Lighthouse > 90 | Chrome DevTools |
| **Estabilidade** | Error rate < 1% | Sentry Dashboard |
| **Usabilidade** | NPS > 70 (Net Promoter Score) | Formulário de feedback |
| **Disponibilidade** | Uptime > 99.5% | Vercel Analytics |

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Bugs críticos em produção** | 🟡 Média | 🔴 Alto | FASE 2 (testes extensivos) |
| **Performance ruim com muitos dados** | 🟡 Média | 🟠 Médio | FASE 2.4 (testes de carga) |
| **Vazamento de dados** | 🟢 Baixa | 🔴 Crítico | FASE 1.2 (RLS restritivo) |
| **Falha no deploy** | 🟢 Baixa | 🟠 Médio | FASE 3.1 (staging primeiro) |
| **Resistência dos usuários** | 🟡 Média | 🟠 Médio | FASE 3.3 (treinamento) + FASE 4.2 (feedback) |

---

## 📞 Próximos Passos Imediatos

1. **✅ Aprovar este roadmap** com stakeholders
2. **🔴 Iniciar FASE 1.1** - Implementar Supabase Auth (2-3 dias)
3. **📅 Agendar** reunião de planejamento de sprint
4. **👥 Definir** responsáveis por cada fase
5. **📊 Criar** quadro Kanban para tracking (GitHub Projects ou Trello)

---

**Última Atualização:** 2025-11-29
**Responsável:** Equipe de Desenvolvimento
**Aprovado por:** _[Pendente]_
**Data de Aprovação:** _[Pendente]_
