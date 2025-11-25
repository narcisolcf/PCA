# 📦 Guia de Instalação - Sistema PCA

Este documento fornece instruções detalhadas para instalar e configurar o Sistema PCA (Plano de Contratações Anual) do zero.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Software Necessário

- **Node.js** versão 18.x ou superior ([Download](https://nodejs.org/))
- **npm** versão 9.x ou superior (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Navegador moderno** (Chrome, Firefox, Edge ou Safari)

### Conta Supabase

- Criar uma conta gratuita em [supabase.com](https://supabase.com)
- Criar um novo projeto no Supabase Dashboard

### Verificar Instalação

```bash
node --version   # Deve retornar v18.x.x ou superior
npm --version    # Deve retornar 9.x.x ou superior
git --version    # Deve retornar 2.x.x ou superior
```

---

## 🚀 Instalação Passo a Passo

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/PCA.git
cd PCA
```

### Passo 2: Instalar Dependências

```bash
npm install
```

**Tempo estimado:** 1-2 minutos

**O que acontece:**
- Instala React 19, Vite, Supabase Client e todas as dependências
- Cria a pasta `node_modules` (não commitada no Git)

---

## 🗄️ Passo 3: Configurar Banco de Dados (Supabase)

### 3.1. Criar Projeto no Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** PCA Sistema (ou nome de sua preferência)
   - **Database Password:** Crie uma senha forte (anote em local seguro)
   - **Region:** Escolha a região mais próxima (ex: South America)
4. Clique em **"Create new project"**
5. Aguarde 2-3 minutos até o projeto estar pronto

### 3.2. Executar Scripts SQL (ORDEM IMPORTANTE!)

Acesse: **Dashboard → SQL Editor**

#### ⚠️ IMPORTANTE: Executar na ordem exata abaixo!

#### **Script 1: Estrutura do Banco (`supabase-schema.sql`)**

1. Abra o arquivo `supabase-schema.sql` do repositório
2. Copie **todo o conteúdo**
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
5. Aguarde confirmação de sucesso

**O que este script faz:**
- ✅ Cria 4 tabelas: `unidades_gestoras`, `demandas`, `pca`, `pca_itens`
- ✅ Cria triggers para cálculo automático de `valor_total`
- ✅ Insere 6 unidades gestoras padrão (seed inicial)

#### **Script 2: Segurança RLS (`enable-rls.sql`)** - OPCIONAL mas RECOMENDADO

1. Abra o arquivo `enable-rls.sql` do repositório
2. Copie **todo o conteúdo**
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"**
5. Aguarde confirmação de sucesso

**O que este script faz:**
- ✅ Habilita Row Level Security (RLS) nas 4 tabelas
- ✅ Cria 16 políticas de acesso permissivas (permite acesso público temporário)
- ✅ Documenta estratégia de segurança para futuro (quando implementar autenticação)

**Nota:** Consulte `SECURITY.md` para entender a estratégia de segurança RLS.

#### **Script 3: Dados de Teste (`supabase-seed-performance.sql`)** - OPCIONAL

> ⚠️ Execute APENAS se quiser testar o sistema com 500 demandas fictícias

1. Abra o arquivo `supabase-seed-performance.sql` do repositório
2. Copie **todo o conteúdo**
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"**
5. Aguarde confirmação: `"500 rows affected"`

**O que este script faz:**
- ✅ Insere 500 demandas de teste com prefixo `[TESTE]`
- ✅ Distribui status, valores e datas de forma realista
- ✅ Permite testes de performance (consulte `PERFORMANCE.md`)

**Para remover os dados de teste depois:**
```sql
DELETE FROM demandas WHERE item LIKE '[TESTE]%';
```

### 3.3. Obter Credenciais de API

1. No Supabase Dashboard, vá em **Settings → API**
2. Copie os seguintes valores:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon / public key** (chave longa começando com `eyJ...`)

**⚠️ IMPORTANTE:**
- ✅ Use a chave **`anon`** (pública) - é segura para usar no frontend
- ❌ **NUNCA** use a chave `service_role` no código frontend (é privada)

---

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

### 4.1. Criar arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env`:

```bash
# Linux/Mac
touch .env

# Windows (PowerShell)
New-Item .env
```

### 4.2. Preencher `.env`

Abra o arquivo `.env` e adicione:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...sua-chave-aqui
```

**Substitua:**
- `https://seu-projeto.supabase.co` → Seu **Project URL** do Supabase
- `eyJhbGc...sua-chave-aqui` → Sua **anon key** do Supabase

**Exemplo real:**
```env
VITE_SUPABASE_URL=https://xyzabcdefg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiY2RlZmciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ1Njc4OX0.abcdef1234567890
```

### 4.3. Verificar `.gitignore`

Certifique-se de que `.env` está listado no `.gitignore` (já deve estar):

```gitignore
.env
.env.local
```

**⚠️ NUNCA commite o arquivo `.env` no Git!**

Consulte `CONFIG.md` para mais detalhes sobre configuração.

---

## ▶️ Passo 5: Executar o Projeto

### 5.1. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

**Saída esperada:**
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5.2. Acessar no Navegador

Abra seu navegador e acesse: **http://localhost:5173**

**Você deve ver:**
- ✅ Dashboard com gráficos
- ✅ Menu lateral com 4 páginas (Dashboard, Demandas, PCA, Unidades, Relatórios)
- ✅ 6 unidades gestoras padrão

---

## ✅ Passo 6: Verificação de Instalação

Use este checklist para confirmar que tudo está funcionando:

### Checklist de Verificação

- [ ] **Servidor iniciado** - `npm run dev` executou sem erros
- [ ] **Página carrega** - http://localhost:5173 abre sem erros
- [ ] **Console limpo** - DevTools (F12) não mostra erros em vermelho
- [ ] **Dados aparecem** - Dashboard mostra 6 unidades gestoras
- [ ] **Supabase conectado** - Cards do Dashboard mostram números (não "0" ou "Carregando...")
- [ ] **Navegação funciona** - Todas as páginas do menu abrem corretamente

### Se tudo estiver ✅ - Sucesso! 🎉

Seu sistema PCA está instalado e pronto para uso!

---

## 🐛 Troubleshooting (Solução de Problemas)

### Problema 1: "Cannot find module 'X'"

**Causa:** Dependências não foram instaladas corretamente.

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema 2: Erro de CORS no console

**Erro:** `Access to fetch at 'https://xxx.supabase.co' has been blocked by CORS policy`

**Causa:** URL ou chave do Supabase incorreta no `.env`.

**Solução:**
1. Verifique se `VITE_SUPABASE_URL` está correto (deve começar com `https://`)
2. Verifique se `VITE_SUPABASE_ANON_KEY` está correto (deve começar com `eyJ`)
3. Reinicie o servidor: `Ctrl+C` e depois `npm run dev`

### Problema 3: "relation 'demandas' does not exist"

**Causa:** Script `supabase-schema.sql` não foi executado ou deu erro.

**Solução:**
1. Vá no Supabase Dashboard → SQL Editor
2. Execute novamente o script `supabase-schema.sql` completo
3. Verifique se há mensagem de erro e corrija

### Problema 4: Dashboard mostra "0" em todos os cards

**Causa:** Banco de dados vazio ou RLS bloqueando acesso.

**Solução:**
1. Verifique se o script `supabase-schema.sql` inseriu as 6 unidades (vá em Table Editor → unidades_gestoras)
2. Se RLS estiver habilitado, execute `enable-rls.sql` para criar políticas
3. Verifique erros no Console (F12)

### Problema 5: Porta 5173 já está em uso

**Erro:** `Port 5173 is already in use`

**Solução:**
```bash
# Opção 1: Matar o processo na porta 5173 (Linux/Mac)
lsof -ti:5173 | xargs kill -9

# Opção 2: Usar porta diferente
npm run dev -- --port 3000
```

### Problema 6: `.env` não está sendo lido

**Causa:** Variáveis de ambiente com `VITE_` são carregadas apenas no build time.

**Solução:**
1. Sempre que alterar `.env`, **reinicie** o servidor (`Ctrl+C` e depois `npm run dev`)
2. Certifique-se de que as variáveis começam com `VITE_`

---

## 🔒 Segurança e Boas Práticas

### ✅ Faça

- ✅ Use a chave `anon` do Supabase (é segura para frontend)
- ✅ Habilite RLS executando `enable-rls.sql` (proteção extra)
- ✅ Mantenha `.env` no `.gitignore`
- ✅ Use senhas fortes no Supabase

### ❌ Não Faça

- ❌ NUNCA commite `.env` no Git
- ❌ NUNCA use a chave `service_role` no código frontend
- ❌ NUNCA compartilhe suas credenciais publicamente
- ❌ NUNCA desabilite RLS em produção sem autenticação adequada

---

## 📚 Próximos Passos

Após instalar com sucesso:

1. **Leia a documentação:**
   - `CONFIG.md` - Configurações avançadas
   - `SECURITY.md` - Estratégia de segurança RLS
   - `PERFORMANCE.md` - Como testar performance com 500+ registros

2. **Explore o sistema:**
   - Crie algumas demandas manualmente
   - Gere um PCA a partir das demandas
   - Visualize os relatórios

3. **Desenvolvimento:**
   - Consulte `ROADMAP_AUDITORIA.md` para ver o status e próximas features
   - Leia `README.md` para entender a arquitetura

---

## 🆘 Precisa de Ajuda?

- **Documentação:** Leia os arquivos `.md` na raiz do projeto
- **Issues:** Abra uma issue no GitHub (se aplicável)
- **Logs:** Sempre verifique o Console do navegador (F12) para erros

---

**Tempo total de instalação:** ~15-30 minutos (incluindo criação do projeto Supabase)

**Última atualização:** 2025-11-25
**Versão do Node.js testada:** 18.x, 20.x, 22.x
**Navegadores testados:** Chrome 120+, Firefox 120+, Edge 120+
