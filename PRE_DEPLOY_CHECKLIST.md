# ✅ Checklist de Pré-Deploy - PCA App

**Data:** 2025-11-29
**Ambiente:** _[Staging / Produção]_
**Responsável:** _[Nome]_

---

## 🎯 Objetivo

Garantir que o sistema está pronto para deploy em ambiente de produção, validando qualidade, segurança e performance.

---

## 📋 FASE 1: Validações Técnicas

### 1.1 - Build de Produção

Execute o build e valide ausência de erros:

```bash
npm run build
```

**Checklist:**
- [ ] Build completo sem erros
- [ ] Build completo sem warnings críticos
- [ ] Arquivos gerados em `dist/`:
  - [ ] `index.html` existe
  - [ ] `assets/*.js` existem
  - [ ] `assets/*.css` existem
- [ ] Bundle size aceitável (< 500 KB total gzipped)

**Resultado do Build:**
```
✓ built in ___ ms
dist/index.html                   ___ KB
dist/assets/index-[hash].js       ___ KB │ gzip: ___ KB
dist/assets/index-[hash].css      ___ KB │ gzip: ___ KB
Total size (gzipped): ___ KB
```

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

### 1.2 - Linting (Qualidade de Código)

Execute o linter e corrija todos os avisos:

```bash
npm run lint
```

**Checklist:**
- [ ] 0 erros de ESLint
- [ ] 0 warnings de ESLint (ou apenas warnings não-críticos documentados)

**Resultado do Lint:**
```
✓ ___ files checked
✓ 0 errors
✓ 0 warnings
```

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

### 1.3 - Formatação de Código

Execute o Prettier para garantir formatação consistente:

```bash
npm run format
```

**Checklist:**
- [ ] Todos os arquivos formatados corretamente
- [ ] Nenhum arquivo modificado (se já estava formatado)

**Status:** ⏳ Pendente / ✅ Aprovado

---

### 1.4 - Auditoria de Segurança

Execute auditoria de dependências:

```bash
npm audit
```

**Checklist:**
- [ ] 0 vulnerabilidades críticas
- [ ] 0 vulnerabilidades altas
- [ ] Vulnerabilidades médias/baixas documentadas e aceitas

**Resultado do Audit:**
```
found ___ vulnerabilities (___ low, ___ moderate, ___ high, ___ critical)
```

**Se houver vulnerabilidades altas/críticas, execute:**
```bash
npm audit fix
```

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

### 1.5 - Testes Unitários (se implementados)

**Nota:** Esta seção será aplicável após FASE 2 do PRODUCTION_ROADMAP.md

```bash
npm run test
npm run test:coverage
```

**Checklist:**
- [ ] Todos os testes passando
- [ ] Cobertura > 70% (meta)
- [ ] Nenhum teste quebrado ou skipped

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado / N/A (testes não implementados)

---

## 🔐 FASE 2: Validações de Segurança

### 2.1 - Variáveis de Ambiente

**Checklist:**
- [ ] Arquivo `.env` existe na raiz (para desenvolvimento)
- [ ] `.env` está no `.gitignore` (nunca commitado)
- [ ] Variáveis obrigatórias configuradas:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Valores das variáveis estão corretos (testados localmente)

**Para Produção (Vercel):**
- [ ] Variáveis configuradas no Vercel Dashboard:
  - [ ] `VITE_SUPABASE_URL` (apontando para Supabase de PRODUÇÃO)
  - [ ] `VITE_SUPABASE_ANON_KEY` (chave `anon` de PRODUÇÃO)
- [ ] ⚠️ **NUNCA** usar `service_role` key no frontend

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

### 2.2 - Row Level Security (RLS)

**Checklist:**
- [ ] RLS está habilitado em todas as tabelas:
  - [ ] `unidades_gestoras`
  - [ ] `demandas`
  - [ ] `pca`
  - [ ] `pca_itens`
- [ ] Políticas RLS implementadas:
  - [ ] `enable-rls.sql` executado no Supabase
  - [ ] ⚠️ **IMPORTANTE:** Se ainda usando políticas permissivas (`USING (true)`), o sistema **NÃO ESTÁ PRONTO PARA PRODUÇÃO**
    - [ ] Leia `PRODUCTION_ROADMAP.md` → FASE 1 (Autenticação)
    - [ ] Implemente autenticação antes de ir para produção

**Verificar RLS no Supabase:**
```sql
-- Execute no SQL Editor do Supabase:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('unidades_gestoras', 'demandas', 'pca', 'pca_itens');

-- Resultado esperado: rowsecurity = true para todas as tabelas
```

**Verificar Políticas:**
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- Deve retornar 16 políticas (4 por tabela: SELECT, INSERT, UPDATE, DELETE)
```

**Status:** ⏳ Pendente / ✅ Aprovado / ⚠️ Permissivo (não recomendado para produção)

---

### 2.3 - Dados Sensíveis

**Checklist:**
- [ ] Nenhuma credencial hardcoded no código
- [ ] Nenhum `console.log` com dados sensíveis em produção
- [ ] API keys não estão commitadas no Git
- [ ] `.env` está no `.gitignore`

**Buscar por credenciais hardcoded:**
```bash
# Buscar por padrões suspeitos no código:
grep -r "password" --include="*.js" --include="*.jsx" src/
grep -r "secret" --include="*.js" --include="*.jsx" src/
grep -r "api_key" --include="*.js" --include="*.jsx" src/
```

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

## 📊 FASE 3: Validações de Performance

### 3.1 - Testes de Carga (500+ registros)

**Checklist:**
- [ ] Script `supabase-seed-performance.sql` executado
- [ ] Sistema testado com 500+ demandas
- [ ] Resultados documentados em `PERFORMANCE_TEST_RESULTS.md`
- [ ] Dados de teste limpos após validação:
  ```sql
  DELETE FROM demandas WHERE item LIKE '[TESTE]%';
  ```

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

### 3.2 - Lighthouse Audit

**Instruções:**
1. Rode o build local: `npm run build && npm run preview`
2. Abra o navegador em `http://localhost:4173`
3. DevTools (F12) → Lighthouse → Run audit

**Checklist:**
- [ ] Performance score > 90 (Desktop)
- [ ] Performance score > 85 (Mobile)
- [ ] Accessibility score > 95
- [ ] Best Practices score > 95
- [ ] SEO score > 90

**Resultado:**
```
Performance:      ___ / 100
Accessibility:    ___ / 100
Best Practices:   ___ / 100
SEO:              ___ / 100
```

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

## 🗄️ FASE 4: Validações do Supabase

### 4.1 - Schema do Banco

**Checklist:**
- [ ] Script `supabase-schema.sql` executado com sucesso
- [ ] Todas as tabelas criadas:
  - [ ] `unidades_gestoras` (6 registros seed)
  - [ ] `demandas`
  - [ ] `pca`
  - [ ] `pca_itens`
- [ ] Constraints e foreign keys funcionando
- [ ] Triggers e funções criadas (se aplicável)

**Verificar no Supabase:**
```sql
-- Contar tabelas criadas:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Verificar seed de unidades:
SELECT COUNT(*) FROM unidades_gestoras;
-- Resultado esperado: 6
```

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

### 4.2 - Backup Configurado

**Checklist:**
- [ ] Backup automático configurado no Supabase:
  - [ ] Frequência: Diário (produção) / Semanal (dev)
  - [ ] Retenção: 30 dias (ou conforme plano)
- [ ] Script `scripts/backup.sh` testado localmente
- [ ] Procedimento de restore testado (ver `BACKUP.md`)

**Instruções:**
1. Acesse Supabase Dashboard → Database → Backups
2. Verifique se "Automatic backups" está habilitado
3. Execute um backup manual de teste

**Status:** ⏳ Pendente / ✅ Aprovado / N/A (Supabase Free Tier - backups limitados)

---

## 🚀 FASE 5: Deploy

### 5.1 - Ambiente de Staging (Recomendado)

**Checklist:**
- [ ] Projeto Supabase de Staging criado
- [ ] Scripts SQL executados em Staging
- [ ] Deploy para Vercel (branch `staging`)
- [ ] URL de staging acessível: `https://pca-staging.vercel.app`
- [ ] Testes manuais aprovados em staging:
  - [ ] Página inicial carrega
  - [ ] Dashboard carrega
  - [ ] Criar demanda funciona
  - [ ] Relatórios funcionam
  - [ ] Exportação CSV funciona

**Status:** ⏳ Pendente / ✅ Aprovado / N/A (deploying direto para produção)

---

### 5.2 - Ambiente de Produção

**Checklist (Supabase):**
- [ ] Projeto Supabase de Produção criado
- [ ] Scripts SQL executados em Produção:
  - [ ] `supabase-schema.sql` (estrutura + seed)
  - [ ] `enable-rls.sql` (segurança)
  - [ ] ⚠️ **NÃO** executar `supabase-seed-performance.sql` (apenas teste)
- [ ] Backup automático configurado (diário)
- [ ] URL e chaves anotadas:
  ```
  VITE_SUPABASE_URL: https://[project-ref].supabase.co
  VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1...
  ```

**Checklist (Vercel):**
- [ ] Repositório conectado ao Vercel
- [ ] Branch de produção: `main`
- [ ] Variáveis de ambiente configuradas:
  - [ ] `VITE_SUPABASE_URL` (produção)
  - [ ] `VITE_SUPABASE_ANON_KEY` (produção)
- [ ] Arquivo `vercel.json` commitado (configuração de rewrites)
- [ ] Deploy executado com sucesso
- [ ] URL de produção acessível

**Domínio Customizado (Opcional):**
- [ ] Domínio registrado (ex: `pca.prefeitura.gov.br`)
- [ ] DNS configurado (CNAME para Vercel)
- [ ] HTTPS ativo (automático no Vercel)

**Status:** ⏳ Pendente / ✅ Aprovado

---

### 5.3 - Smoke Tests em Produção

**Após o deploy, execute estes testes manuais:**

| Teste | Resultado | Status |
|-------|-----------|--------|
| **1. Página inicial carrega** | ___ | ⏳ Pendente |
| **2. Dashboard carrega (sem erros no console)** | ___ | ⏳ Pendente |
| **3. Criar nova demanda** | ___ | ⏳ Pendente |
| **4. Editar demanda existente** | ___ | ⏳ Pendente |
| **5. Deletar demanda** | ___ | ⏳ Pendente |
| **6. Visualizar relatórios** | ___ | ⏳ Pendente |
| **7. Exportar CSV** | ___ | ⏳ Pendente |
| **8. Navegação entre páginas (sem 404)** | ___ | ⏳ Pendente |

**Status:** ⏳ Pendente / ✅ Aprovado / ❌ Reprovado

---

## 📊 FASE 6: Monitoramento

### 6.1 - Vercel Analytics

**Checklist:**
- [ ] Vercel Analytics habilitado no projeto
- [ ] Core Web Vitals sendo rastreados
- [ ] Dashboard de analytics acessível

**Instruções:**
1. Acesse Vercel Dashboard → Seu Projeto → Analytics
2. Habilite se não estiver ativo

**Status:** ⏳ Pendente / ✅ Aprovado

---

### 6.2 - Sentry (Erro Tracking) - Opcional mas Recomendado

**Checklist:**
- [ ] Conta Sentry criada (https://sentry.io)
- [ ] Projeto criado no Sentry
- [ ] SDK instalado no projeto:
  ```bash
  npm install @sentry/react @sentry/vite-plugin
  ```
- [ ] `Sentry.init()` configurado em `src/main.jsx`
- [ ] Variável `VITE_SENTRY_DSN` configurada no Vercel
- [ ] Testes de erro funcionando (disparar erro proposital e verificar no Sentry)

**Status:** ⏳ Pendente / ✅ Aprovado / N/A (não implementado nesta versão)

---

## 📚 FASE 7: Documentação

### 7.1 - Documentação Técnica

**Checklist:**
- [ ] `README.md` atualizado com status do projeto
- [ ] `INSTALL.md` completo e testado
- [ ] `CONFIG.md` com todas as variáveis documentadas
- [ ] `SECURITY.md` com políticas de segurança
- [ ] `DEPLOY.md` com guia de deploy
- [ ] `BACKUP.md` com procedimentos de backup
- [ ] `PERFORMANCE.md` com resultados de testes

**Status:** ⏳ Pendente / ✅ Aprovado

---

### 7.2 - Documentação para Usuários

**Checklist:**
- [ ] `docs/USER_GUIDE.md` criado:
  - [ ] Como fazer login (se aplicável)
  - [ ] Como criar demanda
  - [ ] Como visualizar relatórios
  - [ ] Como exportar dados
  - [ ] FAQ
- [ ] Vídeo tutorial criado (opcional)
- [ ] `RELEASE_NOTES.md` publicado (versão 1.0)

**Status:** ⏳ Pendente / ✅ Aprovado / N/A (não implementado nesta versão)

---

## ✅ RESUMO FINAL

### Checklist Consolidado

| Fase | Itens | Aprovados | Reprovados | Status |
|------|-------|-----------|-----------|--------|
| **1. Validações Técnicas** | 5 | ___ | ___ | ⏳ Pendente |
| **2. Validações de Segurança** | 3 | ___ | ___ | ⏳ Pendente |
| **3. Validações de Performance** | 2 | ___ | ___ | ⏳ Pendente |
| **4. Validações do Supabase** | 2 | ___ | ___ | ⏳ Pendente |
| **5. Deploy** | 3 | ___ | ___ | ⏳ Pendente |
| **6. Monitoramento** | 2 | ___ | ___ | ⏳ Pendente |
| **7. Documentação** | 2 | ___ | ___ | ⏳ Pendente |
| **TOTAL** | **19** | **___** | **___** | **⏳ Pendente** |

---

### Decisão Final

**Sistema está pronto para produção?**

- [ ] ✅ **SIM** - Todos os itens críticos aprovados, pode fazer deploy
- [ ] ⚠️ **COM RESSALVAS** - Alguns itens reprovados mas não-bloqueantes (documentar quais)
- [ ] ❌ **NÃO** - Itens críticos reprovados, deploy bloqueado

**Bloqueadores Identificados:**
1. _[Listar bloqueadores críticos, se houver]_
2. _[Listar bloqueadores críticos, se houver]_

**Ressalvas Aceitáveis (Não-Bloqueantes):**
1. _[Listar itens não-críticos reprovados, se houver]_
2. _[Listar itens não-críticos reprovados, se houver]_

---

### Próximos Passos

**Se APROVADO:**
1. [ ] Fazer deploy para produção
2. [ ] Executar smoke tests (FASE 5.3)
3. [ ] Monitorar primeiras 24h (Vercel Analytics + Sentry)
4. [ ] Notificar usuários finais
5. [ ] Agendar revisão pós-deploy (1 semana)

**Se REPROVADO:**
1. [ ] Corrigir bloqueadores identificados
2. [ ] Re-executar checklist
3. [ ] Solicitar nova aprovação

---

## 📝 Aprovações

**Executado por:** _[Nome]_
**Data de Execução:** _[Data]_
**Aprovado por:** _[Nome do Responsável Técnico]_
**Data de Aprovação:** _[Data]_

**Assinatura Digital:** _[Commit hash ou link do PR]_

---

**Última Atualização:** 2025-11-29
