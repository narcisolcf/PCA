# 🚀 Guia de Deploy - PCA App

## Opção 1: Deploy com Vercel (Recomendado)

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Repositório GitHub com o código do projeto
- Projeto Supabase configurado

### Passo a Passo

#### 1. Conectar Repositório
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Import Git Repository"**
3. Selecione o repositório: `narcisolcf/PCA`
4. Clique em **"Import"**

#### 2. Configurar Variáveis de Ambiente
Na seção **"Environment Variables"**, adicione:

| Nome | Valor | Onde Encontrar |
|------|-------|----------------|
| `VITE_SUPABASE_URL` | `https://[project-ref].supabase.co` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase → Settings → API → `anon` `public` |

#### 3. Configurar Build
As configurações de build são detectadas automaticamente:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

#### 4. Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (~2 minutos)
3. Acesse a URL de produção: `https://[project-name].vercel.app`

### Deployments Automáticos
Após o primeiro deploy, cada `push` para `main` dispara um novo deploy automaticamente.

---

## Opção 2: Deploy Manual com Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build e Run
```bash
docker build -t pca-app .
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=https://[project-ref].supabase.co \
  -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1... \
  pca-app
```

---

## ✅ Checklist de Produção

### Antes do Deploy
- [ ] Remover seed de performance (`supabase-seed-performance.sql` executado apenas em DEV)
- [ ] Validar variáveis de ambiente em Produção (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Verificar se RLS está habilitado em **todas** as tabelas no Supabase
- [ ] Executar `npm run build` localmente e confirmar ausência de erros
- [ ] Executar `npm run lint` e corrigir todos os avisos

### Após o Deploy
- [ ] Testar autenticação (login/logout)
- [ ] Testar criação de demanda
- [ ] Verificar dashboard (valores devem bater com banco)
- [ ] Testar relatórios (gráficos devem renderizar)
- [ ] Confirmar políticas RLS (usuários só veem suas unidades)
- [ ] Testar em navegadores diferentes (Chrome, Firefox, Safari)
- [ ] Validar responsividade (mobile, tablet, desktop)

### Monitoramento
- [ ] Configurar alertas de erro (Vercel Analytics ou Sentry)
- [ ] Monitorar métricas de performance (Core Web Vitals)
- [ ] Configurar backup automático do Supabase (ver `BACKUP.md`)

---

## 🔧 Troubleshooting

### Erro: "Failed to fetch"
**Causa:** Variáveis de ambiente não configuradas.
**Solução:** Verificar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel Vercel.

### Erro: "Build failed - ESLint warnings"
**Causa:** Pipeline CI está configurado para falhar em avisos de lint.
**Solução:** Executar `npm run lint` localmente e corrigir todos os avisos.

### Página 404 ao acessar rotas diretas
**Causa:** SPA rewrites não configurados.
**Solução:** Confirmar que `vercel.json` existe com a configuração de `rewrites`.

### Assets não carregam
**Causa:** Caminho incorreto dos assets após build.
**Solução:** Verificar `vite.config.js` → `base` deve ser `'/'` (padrão).

---

## 📊 Métricas Esperadas

| Métrica | Valor Alvo | Como Medir |
|---------|-----------|------------|
| First Contentful Paint (FCP) | < 1.8s | Lighthouse |
| Time to Interactive (TTI) | < 3.9s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Build Time | < 2 min | Vercel Deployments |
| Bundle Size | < 500 KB | `npm run build` output |

---

## 🔗 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Vite Build Config](https://vite.dev/config/)
- [Supabase Environments](https://supabase.com/docs/guides/platform/environments)
- [BACKUP.md](./BACKUP.md) - Estratégia de Backup e DR
