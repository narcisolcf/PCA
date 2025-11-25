# ⚙️ Guia de Configuração - Sistema PCA

Este documento detalha todas as configurações, variáveis de ambiente e opções avançadas do Sistema PCA.

---

## 📋 Índice

1. [Variáveis de Ambiente](#variáveis-de-ambiente)
2. [Chaves do Supabase](#chaves-do-supabase)
3. [Configurações de Desenvolvimento](#configurações-de-desenvolvimento)
4. [Configurações de Produção](#configurações-de-produção)
5. [Segurança](#segurança)
6. [Troubleshooting](#troubleshooting)

---

## 🔑 Variáveis de Ambiente

### Arquivo `.env`

O sistema utiliza variáveis de ambiente para configurar a conexão com o Supabase. Todas as variáveis devem ser prefixadas com `VITE_` para serem acessíveis no frontend.

**Localização:** Raiz do projeto (`/PCA/.env`)

**Estrutura básica:**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variáveis Obrigatórias

| Variável | Descrição | Exemplo | Onde Obter |
|----------|-----------|---------|------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://abc123.supabase.co` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon) do Supabase | `eyJhbGc...` (JWT token) | Supabase Dashboard → Settings → API → Project API keys → `anon` `public` |

### Variáveis Opcionais

Atualmente o sistema não utiliza variáveis opcionais, mas você pode adicionar:

```env
# Opcional: Timeout para requisições (milissegundos)
VITE_API_TIMEOUT=30000

# Opcional: Ambiente (development, staging, production)
VITE_APP_ENV=development
```

---

## 🔐 Chaves do Supabase

### Tipos de Chaves

O Supabase fornece **3 tipos de chaves**. É crucial entender quando usar cada uma:

#### 1. **`anon` / `public` Key** ✅ Usar no Frontend

- **O que é:** Chave pública para acesso anônimo
- **Segurança:** ✅ Segura para expor no frontend (código JavaScript)
- **Permissões:** Respeitam Row Level Security (RLS)
- **Uso:** Aplicações frontend (React, Vue, Angular)

**Exemplo:**
```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjIzNDU2Nzg5fQ.xxx
```

#### 2. **`service_role` Key** ❌ NUNCA Usar no Frontend

- **O que é:** Chave administrativa com acesso total
- **Segurança:** ❌ CONFIDENCIAL - bypassa RLS
- **Permissões:** Acesso irrestrito a todos os dados
- **Uso:** Apenas backend (Node.js, servidores, scripts)

**⚠️ PERIGO:** Expor esta chave permite que qualquer pessoa:
- Delete todo o banco de dados
- Acesse dados protegidos por RLS
- Execute operações administrativas

**NUNCA faça:**
```env
# ❌ ERRADO - NUNCA USE NO FRONTEND!
VITE_SUPABASE_SERVICE_KEY=eyJhbGciOiJI...
```

#### 3. **JWT Secret** ❌ NUNCA Expor

- **O que é:** Segredo usado para assinar tokens JWT
- **Segurança:** ❌ CONFIDENCIAL
- **Uso:** Apenas servidores backend

### Como Obter as Chaves

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Role até **Project API keys**
5. Copie a chave `anon` `public`

**Screenshot de referência:**
```
Project API keys
├─ anon (public)     ← ✅ Use esta no .env
└─ service_role      ← ❌ NÃO use no frontend
```

---

## 🛠️ Configurações de Desenvolvimento

### Ambiente Local

**Porta padrão:** 5173 (Vite)

**Mudar porta:**
```bash
npm run dev -- --port 3000
```

**Host externo (acessar de outros dispositivos na rede):**
```bash
npm run dev -- --host
```

### Hot Module Replacement (HMR)

O Vite já vem configurado com HMR. Qualquer alteração em arquivos `.jsx`, `.js`, `.css` recarrega automaticamente.

**Desabilitar HMR (não recomendado):**
```js
// vite.config.js
export default {
  server: {
    hmr: false
  }
}
```

### DevTools e Debugging

**Console de Erros do Supabase:**

O sistema usa `console.error` e `console.group` para debugging de erros do Supabase (apenas em desenvolvimento).

**Ver logs detalhados:**
1. Abra DevTools (F12)
2. Vá na aba **Console**
3. Procure por grupos `[Supabase Error]`

**Exemplo de log:**
```
[Supabase Error] Erro ao criar demanda
├─ Tipo: DATABASE
├─ Código: 23505
├─ Mensagem: "Já existe um registro com estes dados..."
└─ Detalhes: {...}
```

---

## 🚀 Configurações de Produção

### Deploy em Vercel/Netlify

Ao fazer deploy, você precisa configurar as variáveis de ambiente na plataforma:

#### Vercel

1. Acesse seu projeto no Vercel Dashboard
2. Vá em **Settings → Environment Variables**
3. Adicione:
   - `VITE_SUPABASE_URL` → `https://seu-projeto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` → `eyJhbGc...`
4. Selecione os ambientes: **Production**, **Preview**, **Development**
5. Clique em **Save**
6. **Re-deploy** o projeto

#### Netlify

1. Acesse seu site no Netlify Dashboard
2. Vá em **Site settings → Build & deploy → Environment**
3. Clique em **Edit variables**
4. Adicione as mesmas variáveis acima
5. Clique em **Save**
6. Faça um novo deploy

### HTTPS Obrigatório

**⚠️ IMPORTANTE:** O Supabase **exige HTTPS** em produção.

- ✅ Vercel e Netlify fornecem HTTPS automaticamente
- ❌ Não use HTTP em produção
- ❌ Localhost com HTTP funciona apenas em desenvolvimento

### Otimizações de Build

**Build de produção:**
```bash
npm run build
```

**Testar build localmente:**
```bash
npm run preview
```

**Otimizações automáticas do Vite:**
- ✅ Minificação de JavaScript/CSS
- ✅ Tree-shaking (remove código não usado)
- ✅ Code splitting (carregamento sob demanda)
- ✅ Compressão de assets

---

## 🔒 Segurança

### Checklist de Segurança

- [ ] `.env` está no `.gitignore`
- [ ] Usando `anon` key (não `service_role`)
- [ ] RLS habilitado no Supabase (`enable-rls.sql` executado)
- [ ] HTTPS habilitado em produção
- [ ] Credenciais nunca commitadas no Git
- [ ] Backup regular do banco de dados (veja `BACKUP.md` quando disponível)

### Row Level Security (RLS)

**Estado atual:** Políticas permissivas (permite acesso público)

**Por quê?** O sistema ainda não possui autenticação implementada.

**Quando implementar autenticação:**
1. Consulte `SECURITY.md` para plano de migração
2. Implemente autenticação usando Supabase Auth
3. Atualize políticas RLS para restringir acesso por usuário

**Verificar status do RLS:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('unidades_gestoras', 'demandas', 'pca', 'pca_itens');
```

### Proteção de Dados Sensíveis

**Nunca armazene no `.env`:**
- ❌ Senhas de usuários
- ❌ Tokens de APIs externas sensíveis
- ❌ Segredos de OAuth
- ❌ Chaves privadas

**Use o Supabase Vault** (recurso do Supabase) para segredos de backend.

---

## 🐛 Troubleshooting

### Problema: Mudanças no `.env` não aparecem

**Causa:** Vite carrega variáveis de ambiente apenas no **build time**.

**Solução:**
1. Pare o servidor (`Ctrl+C`)
2. Rode novamente: `npm run dev`

### Problema: `import.meta.env.VITE_X is undefined`

**Causa:** Variável não começa com `VITE_` ou arquivo `.env` não existe.

**Solução:**
```env
# ❌ ERRADO
SUPABASE_URL=...

# ✅ CORRETO
VITE_SUPABASE_URL=...
```

### Problema: Erro 401 Unauthorized

**Causa:** Chave `anon` incorreta ou expirada.

**Solução:**
1. Verifique se copiou a chave completa (começa com `eyJ` e é muito longa)
2. Gere uma nova chave no Supabase Dashboard (Settings → API → Reset API keys)

### Problema: CORS Error

**Causa:** URL do Supabase incorreta ou não começa com `https://`.

**Solução:**
```env
# ❌ ERRADO
VITE_SUPABASE_URL=seu-projeto.supabase.co

# ✅ CORRETO
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
```

---

## 📚 Referências Externas

- **Supabase Environment Variables:** https://supabase.com/docs/guides/getting-started/environment-variables
- **Vite Environment Variables:** https://vitejs.dev/guide/env-and-mode.html
- **Supabase Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

## 🔄 Boas Práticas

### ✅ Fazer

1. **Use `.env.example` como template:**
   ```env
   # .env.example (commitado no Git)
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-aqui
   ```

2. **Documente novas variáveis:**
   - Atualize este `CONFIG.md`
   - Adicione no `.env.example`

3. **Rotação de chaves:**
   - Em caso de vazamento, gere novas chaves no Supabase
   - Atualize `.env` e variáveis de produção

### ❌ Evitar

1. **Hardcoding de credenciais:**
   ```js
   // ❌ ERRADO
   const supabaseUrl = 'https://abc123.supabase.co'

   // ✅ CORRETO
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   ```

2. **Commitar `.env`:**
   ```bash
   # Verificar se .env está sendo ignorado
   git status

   # Se aparecer .env na lista, adicione ao .gitignore!
   ```

3. **Usar variáveis sem `VITE_` no frontend:**
   ```env
   # ❌ Não funcionará no frontend
   SECRET_KEY=abc123

   # ✅ Funcionará
   VITE_PUBLIC_KEY=abc123
   ```

---

**Última atualização:** 2025-11-25
**Versão do sistema:** 1.0.0
**Supabase:** Versão 2.x
