# 🔍 Guia de Diagnóstico - Falha de Deploy na Vercel

## ✅ PROBLEMA IDENTIFICADO

**Erro:** "A implantação foi cancelada porque foi criada com um commit não verificado."

**Causa:** A Vercel está configurada para aceitar apenas commits assinados (GPG), mas seus commits não estão assinados.

## Status Atual

- ✅ **Lint**: Passou localmente
- ✅ **Build**: Passou localmente (7.77s, 1817 módulos)
- ✅ **GitHub Actions CI**: Passou com sucesso
- ❌ **Vercel Deploy**: Rejeitando commits não verificados

---

## 🚀 SOLUÇÃO RÁPIDA (RECOMENDADA)

### Desabilitar verificação de commits na Vercel

1. Acesse: <https://vercel.com/narcisoc/pca/settings/git>
2. Procure por **"Deploy Protection"** ou **"Git Configuration"**
3. **Desabilite** a opção: **"Only deploy verified commits"** ou **"Require verified commits"**
4. Salve as configurações
5. Volte para Deployments e clique em **"Redeploy"** em uma implantação recente

✅ **Isso deve resolver imediatamente!**

---

## 🔐 SOLUÇÃO ALTERNATIVA (Mais Segura)

### Configurar assinatura GPG nos commits

Veja o guia completo em: `scripts/setup-gpg.md`

**Resumo rápido:**

```powershell
# 1. Instalar GPG4Win (se não tiver)
choco install gpg4win

# 2. Gerar chave GPG
gpg --full-generate-key

# 3. Configurar Git
git config --global commit.gpgsign true
git config --global user.signingkey SUA_KEY_ID

# 4. Adicionar chave ao GitHub
# https://github.com/settings/keys

# 5. Fazer commit assinado
git commit --allow-empty -S -m "fix: Habilitar commits verificados"
git push origin main
```

---

## 📋 Checklist de Investigação

### 1. Verificar Logs da Vercel (PRIORITÁRIO)

**Ação:** Faça login na Vercel e acesse os logs detalhados

1. Acesse: <https://vercel.com/narcisoc/pca/deployments>
2. Clique em uma implantação com erro (ícone vermelho 🔴)
3. Procure por:
   - Mensagens de erro no build
   - Avisos sobre dependências
   - Problemas de memória/timeout
   - Erros de TypeScript/ESLint

### 2. Possíveis Causas Comuns

#### A) Variáveis de Ambiente Faltando

**Sintoma:** Build falha ao tentar acessar `process.env.VITE_*`

**Solução:**

```bash
# Verifique se as variáveis de ambiente estão configuradas na Vercel:
# Settings > Environment Variables

# Variáveis necessárias (se aplicável):
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

#### B) Versão do Node.js Incompatível

**Sintoma:** Erro ao instalar dependências ou build

**Solução:**

1. Na Vercel: Settings > General > Node.js Version
2. Defina para: **18.x** (mesma versão do CI)

#### C) Comando de Build Incorreto

**Sintoma:** Vercel não encontra os arquivos de build

**Solução:**

1. Verifique em: Settings > General
2. Build Command deve ser: `npm run build`
3. Output Directory deve ser: `dist`

#### D) Dependências em devDependencies

**Sintoma:** Módulos não encontrados durante o build

**Solução:**

```bash
# Algumas dependências podem precisar estar em "dependencies"
# Verifique se @tailwindcss/vite, vite, etc. estão acessíveis
```

#### E) Timeout ou Limite de Memória

**Sintoma:** Build é cancelado após muito tempo

**Solução:**

- Considere otimizar o build
- Verifique o plano da Vercel (limites de tempo/memória)

### 3. Verificações de Configuração

#### vercel.json ✅

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Status:** Configuração correta ✅

#### package.json ✅

```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

**Status:** Script de build correto ✅

#### vite.config.js ✅

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**Status:** Configuração básica correta ✅

### 4. Ações Imediatas

#### Opção 1: Forçar Redeploy Limpo

```bash
# Já tentado - commit 292192e
git commit --allow-empty -m "chore: Forçar atualização da Vercel"
git push origin main
```

#### Opção 2: Verificar se há Builds Antigos Travados

1. Na Vercel, vá em Deployments
2. Cancele manualmente qualquer build "Running" antigo
3. Tente um novo deploy

#### Opção 3: Adicionar Configuração de Build Explícita

Adicione ao `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

#### Opção 4: Verificar .gitignore

Certifique-se de que a pasta `dist/` está no `.gitignore`:

```
dist/
node_modules/
.env.local
```

## 🎯 Próximos Passos

1. **PRIORITÁRIO:** Acesse os logs da Vercel e copie a mensagem de erro exata
2. Verifique a versão do Node.js na Vercel (deve ser 18.x)
3. Confirme que as variáveis de ambiente estão configuradas (se necessário)
4. Tente cancelar builds antigos e fazer um redeploy

## 📝 Template para Reportar Erro

Quando encontrar o erro nos logs da Vercel, copie e cole aqui:

```
=== ERRO DA VERCEL ===
[Cole aqui a mensagem de erro completa dos logs]

Timestamp:
Commit: 292192e
Branch: main
```

## 🔗 Links Úteis

- Vercel Dashboard: <https://vercel.com/narcisoc/pca>
- GitHub Actions: <https://github.com/narcisolcf/PCA/actions>
- Documentação Vite + Vercel: <https://vitejs.dev/guide/static-deploy.html#vercel>
