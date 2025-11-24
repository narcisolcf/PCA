# 📋 PCA - Plano de Contratação Anual

Sistema de gestão do **Plano de Contratação Anual (PCA)** para municípios brasileiros, desenvolvido conforme a **Lei 14.133/2021** (Nova Lei de Licitações).

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-4-blue?logo=tailwindcss)

---

## ✨ Funcionalidades

- **Dashboard** - Visão geral com gráficos e estatísticas
- **Demandas (DFD)** - CRUD completo de demandas de contratação
- **Unidades Gestoras** - Cadastro de secretarias e órgãos
- **PCA** - Acompanhamento das 5 fases do processo
- **Relatórios** - Análises por status, unidade e trimestre
- **Exportação CSV** - Download de relatórios

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- Conta no [Supabase](https://supabase.com) (gratuita)

### 1. Clone e instale dependências

```bash
cd pca-app
npm install
```

### 2. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **Settings > API** e copie:
   - `Project URL` 
   - `anon public key`
3. Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 3. Execute o Schema SQL

1. No Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo de `supabase-schema.sql`
3. Cole e execute no editor SQL

O schema criará automaticamente:
- Tabelas: `unidades_gestoras`, `demandas`, `pca`, `pca_itens`
- Triggers para atualização automática
- Views para relatórios
- Dados iniciais (seeds) com secretarias padrão

### 4. Execute o projeto

```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

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

O Supabase oferece:
- **Row Level Security (RLS)** - Controle de acesso por linha
- **Chaves API** seguras (anon + service_role)
- **Autenticação** integrada (opcional)

Para produção, habilite o RLS e configure políticas adequadas.

---

## 📝 Licença

MIT License - Uso livre para fins educacionais e governamentais.
