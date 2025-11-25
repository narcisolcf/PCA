# 📋 PCA - Plano de Contratação Anual

Sistema de gestão do **Plano de Contratação Anual (PCA)** para municípios brasileiros, desenvolvido conforme a **Lei 14.133/2021** (Nova Lei de Licitações).

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-4-blue?logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Beta-yellow)
![RLS](https://img.shields.io/badge/RLS-Enabled-green?logo=postgresql)
![Performance](https://img.shields.io/badge/Tested-500%2B%20records-blue)

> **Status do Projeto:** Sistema em fase beta com validações completas, tratamento de erros robusto, RLS implementado e testado com 500+ registros.

---

## ✨ Funcionalidades

- **Dashboard** - Visão geral com gráficos e estatísticas
- **Demandas (DFD)** - CRUD completo de demandas de contratação
- **Unidades Gestoras** - Cadastro de secretarias e órgãos
- **PCA** - Acompanhamento das 5 fases do processo
- **Relatórios** - Análises por status, unidade e trimestre
- **Exportação CSV** - Download de relatórios

---

## 🚀 Instalação Rápida

> **📚 Para instruções detalhadas, consulte [INSTALL.md](INSTALL.md)**

### Resumo

1. **Clone e instale:**
   ```bash
   git clone https://github.com/seu-usuario/PCA.git
   cd PCA
   npm install
   ```

2. **Configure o Supabase:**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Copie URL e chave `anon` (Settings → API)
   - Crie `.env` na raiz:
     ```env
     VITE_SUPABASE_URL=https://seu-projeto.supabase.co
     VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
     ```

3. **Execute scripts SQL (na ordem):**
   - ✅ `supabase-schema.sql` (estrutura + seed)
   - ✅ `enable-rls.sql` (segurança RLS - recomendado)
   - 📊 `supabase-seed-performance.sql` (500 demandas de teste - opcional)

4. **Rode o projeto:**
   ```bash
   npm run dev
   ```

5. **Acesse:** http://localhost:5173

---

## 📚 Documentação do Projeto

| Documento | Descrição |
|-----------|-----------|
| **[INSTALL.md](INSTALL.md)** | 📦 Guia completo de instalação passo a passo (15-30 min) |
| **[CONFIG.md](CONFIG.md)** | ⚙️ Configuração de variáveis de ambiente e deploy |
| **[SECURITY.md](SECURITY.md)** | 🔐 Política de segurança RLS e plano de autenticação |
| **[PERFORMANCE.md](PERFORMANCE.md)** | 📊 Guia de testes de performance com 500+ registros |
| **[ROADMAP_AUDITORIA.md](ROADMAP_AUDITORIA.md)** | 🎯 Roadmap de auditoria e status do projeto (59% completo) |

### ⚠️ Avisos Importantes

- **Autenticação:** O sistema ainda **não possui autenticação** implementada
- **RLS:** Row Level Security está habilitado com **políticas permissivas** (acesso público)
- **Produção:** Antes de usar em produção, implemente autenticação e restrinja políticas RLS
- **Limites Testados:** Sistema testado com até **500 demandas** sem perda de performance

---

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React
│   ├── ui.jsx        # Componentes base (Button, Input, Modal...)
│   ├── Header.jsx    # Navegação principal
│   ├── DemandaForm.jsx
│   └── DemandasTable.jsx
├── pages/            # Páginas da aplicação
│   ├── Dashboard.jsx
│   ├── Demandas.jsx
│   ├── Unidades.jsx
│   ├── PCA.jsx
│   └── Relatorios.jsx
├── hooks/            # Custom hooks
│   └── useData.js    # Hooks de dados (useDemandas, useUnidades)
├── lib/              # Utilitários
│   ├── supabase.js   # Cliente e helpers do Supabase
│   └── utils.js      # Funções auxiliares
└── index.css         # Estilos globais
```

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **React 19** | Framework frontend |
| **Vite** | Build tool |
| **Tailwind CSS 4** | Estilização |
| **Supabase** | Backend (PostgreSQL + Auth) |
| **Chart.js** | Gráficos |
| **Lucide React** | Ícones |
| **React Router** | Navegação |

---

## 📊 Modelo de Dados

```
unidades_gestoras (Secretarias)
├── id, nome, sigla, responsavel, email, telefone

demandas (DFD - Itens)
├── id, unidade_id, item, descricao, justificativa
├── quantidade, valor_unitario, valor_total (calculado)
├── data_prevista, trimestre, status, prioridade

pca (Plano Anual)
├── id, ano, titulo, descricao
├── valor_total, valor_aprovado, status
```

---

## 🔐 Segurança

### Status Atual

✅ **Row Level Security (RLS)** - Implementado com políticas permissivas
✅ **Chaves API** - Usando `anon` key (segura para frontend)
✅ **Validações** - Formulários com validação completa
✅ **Tratamento de Erros** - Mensagens amigáveis em português
⚠️ **Autenticação** - Não implementada (planejada para futuro)

### Políticas RLS Atuais

O sistema possui 16 políticas de acesso (4 por tabela) que **permitem acesso público** enquanto não há autenticação:

```sql
-- Exemplo: Política SELECT para demandas
CREATE POLICY "Acesso público: SELECT em demandas"
ON demandas FOR SELECT TO anon, authenticated
USING (true);  -- Permissiva: permite todos os acessos
```

**Por quê?** O sistema não possui login/autenticação ainda.

**Quando implementar Auth:**
1. Consulte `SECURITY.md` para plano de migração em 3 fases
2. Implemente Supabase Auth (login/senha ou OAuth)
3. Atualize políticas para restringir acesso por `auth.uid()`

### Boas Práticas

✅ Use apenas a chave `anon` (nunca `service_role` no frontend)
✅ Mantenha `.env` no `.gitignore` (nunca commite credenciais)
✅ Use HTTPS em produção (Vercel/Netlify fornecem automaticamente)
✅ Consulte `CONFIG.md` para configurações de segurança avançadas

---

## 📝 Licença

MIT License - Uso livre para fins educacionais e governamentais.
