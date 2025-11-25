# 📊 Guia de Teste de Performance - PCA Sistema

Este documento descreve como testar a performance do sistema PCA com uma massa de dados significativa (500+ demandas).

---

## 🎯 Objetivo

Avaliar o comportamento do Dashboard, Relatórios e outras páginas quando o sistema possui uma quantidade realista de dados, identificando possíveis gargalos de performance.

---

## 📋 Pré-requisitos

- Acesso ao Supabase Dashboard do projeto
- Sistema PCA rodando localmente ou em staging
- Conexão com o banco de dados configurada

---

## 🚀 Como Executar o Script de Seed

### Passo 1: Acessar o SQL Editor

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto PCA
3. No menu lateral, clique em **"SQL Editor"**

### Passo 2: Executar o Script

1. Abra o arquivo `supabase-seed-performance.sql` do repositório
2. Copie **todo o conteúdo** do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
5. Aguarde a confirmação: `"500 rows affected"`

### Passo 3: Verificar Inserção

O próprio script executará queries de verificação ao final, mostrando:

- ✅ Total de demandas de teste inseridas
- ✅ Distribuição por status (50% pendente, 30% aprovada, 15% em_analise, 5% rejeitada)
- ✅ Distribuição por trimestre (Q1, Q2, Q3, Q4)
- ✅ Estatísticas de valores (mínimo, médio, máximo, total)

**Exemplo de saída esperada:**

```
total_demandas_teste: 500
unidades_utilizadas: 6

status       | quantidade | percentual
-------------|------------|------------
pendente     | 250        | 50.0%
aprovada     | 150        | 30.0%
em_analise   | 75         | 15.0%
rejeitada    | 25         | 5.0%
```

---

## 🔍 O Que Observar Após a Inserção

### 1. Dashboard Principal (`/`)

**Métricas a Avaliar:**

- ⏱️ **Tempo de carregamento inicial:** Deve ser < 3 segundos
- 📈 **Renderização dos gráficos:** Observe se há travamentos ou lentidão
- 🔄 **Atualização de dados:** Verifique se os cards de totais carregam rapidamente
- 📊 **Gráfico de barras por trimestre:** Deve exibir corretamente os 4 trimestres

**Como Testar:**

1. Acesse `http://localhost:5173/` (ou URL de staging)
2. Abra o DevTools (F12) > Network
3. Recarregue a página (Ctrl+R)
4. Observe o tempo até "DOMContentLoaded" e "Load"
5. Anote o tempo de resposta da query Supabase para `demandas`

**Critério de Sucesso:**

- ✅ Carregamento completo em menos de 3 segundos
- ✅ Gráficos renderizados sem erros
- ✅ Interface responsiva (sem congelamentos)

---

### 2. Página de Relatórios (`/relatorios`)

**Métricas a Avaliar:**

- 📊 **Gráfico de Pizza (Status):** Renderiza 500+ registros sem travamento?
- 📊 **Gráfico de Barras (Unidades):** Exibe todas as unidades corretamente?
- 📊 **Gráfico de Linha (Trimestral):** Mostra a distribuição ao longo do ano?
- 📋 **Tabela de Demandas:** Carrega todos os registros ou precisa de paginação?

**Como Testar:**

1. Acesse `/relatorios`
2. Observe o tempo de renderização dos gráficos
3. Teste interações (hover, zoom, etc.)
4. Verifique se os totais batem com os dados inseridos

**Critério de Sucesso:**

- ✅ Gráficos carregam em menos de 2 segundos
- ✅ Interações são fluidas (sem lag)
- ✅ Dados estão corretos (totais, percentuais)

---

### 3. Página de Demandas (`/demandas`)

**Métricas a Avaliar:**

- 📜 **Scroll da lista:** Suave ou trava com 500+ itens?
- 🔍 **Filtros:** Respondem rapidamente?
- ➕ **Criação de nova demanda:** Continua funcionando normalmente?
- ✏️ **Edição/Exclusão:** Performance mantida?

**Como Testar:**

1. Acesse `/demandas`
2. Teste scroll até o final da lista
3. Aplique filtros (por unidade, status, etc.)
4. Crie uma nova demanda
5. Edite e delete uma demanda de teste

**Critério de Sucesso:**

- ✅ Scroll fluido (considerar virtual scrolling se travar)
- ✅ Filtros respondem em menos de 1 segundo
- ✅ CRUD continua funcionando normalmente

---

### 4. Página de PCA (`/pca`)

**Métricas a Avaliar:**

- 📊 **Listagem de PCAs:** Carrega rapidamente?
- 🔍 **Visualização de itens:** Muitos itens não causam lentidão?
- 📄 **Geração de relatórios:** (se implementada) Tempo razoável?

**Como Testar:**

1. Acesse `/pca`
2. Verifique se os PCAs gerados a partir das 500+ demandas carregam corretamente
3. Teste a visualização detalhada de um PCA com muitos itens

**Critério de Sucesso:**

- ✅ Listagem carrega em menos de 2 segundos
- ✅ Visualização de detalhes é responsiva

---

## 📈 Documentando Resultados

Após realizar os testes, documente os resultados no `ROADMAP_AUDITORIA.md`:

### Template de Documentação:

```markdown
### Resultados dos Testes de Performance (500 demandas)

**Ambiente:** [Local / Staging]
**Data:** [DD/MM/YYYY]
**Navegador:** [Chrome X.X / Firefox X.X]

| Página      | Tempo de Carregamento | Observações                          |
|-------------|----------------------|--------------------------------------|
| Dashboard   | X.Xs                 | ✅ Fluido / ⚠️ Lento / ❌ Travou    |
| Relatórios  | X.Xs                 | ✅ Fluido / ⚠️ Lento / ❌ Travou    |
| Demandas    | X.Xs                 | ✅ Fluido / ⚠️ Lento / ❌ Travou    |
| PCA         | X.Xs                 | ✅ Fluido / ⚠️ Lento / ❌ Travou    |

**Gargalos Identificados:**
- [ ] Nenhum (sistema performa bem)
- [ ] Listagem de demandas precisa de paginação
- [ ] Gráficos demoram para renderizar
- [ ] Filtros são lentos
- [ ] Outro: _______________

**Soluções Propostas:**
1. Implementar paginação server-side na listagem de demandas
2. Adicionar lazy loading para gráficos
3. Otimizar queries com índices adicionais
4. Implementar cache de dados frequentes
```

---

## 🧹 Como Limpar os Dados de Teste

Quando terminar os testes, você pode facilmente remover todas as demandas de teste:

### Método 1: Via SQL Editor

```sql
DELETE FROM demandas WHERE item LIKE '[TESTE]%';
```

### Método 2: Via Interface (Manual)

1. Acesse `/demandas`
2. Filtre por itens contendo `[TESTE]`
3. Delete manualmente (mais trabalhoso, use apenas para verificação)

---

## 🎯 Próximos Passos

Após documentar os resultados:

1. **Se performance OK (< 3s):**
   - ✅ Marcar tarefas de performance como concluídas
   - ✅ Adicionar nota no README sobre limite testado (500+ demandas)
   - ✅ Prosseguir para próximo item do roadmap

2. **Se houver gargalos:**
   - ⚠️ Documentar detalhadamente no roadmap
   - ⚠️ Criar issues/tasks específicas para otimizações
   - ⚠️ Priorizar soluções (paginação, lazy loading, índices)
   - ⚠️ Implementar melhorias antes de prosseguir

---

## 📚 Referências

- **Supabase Performance:** https://supabase.com/docs/guides/platform/performance
- **React Performance:** https://react.dev/learn/render-and-commit
- **PostgreSQL Indexing:** https://www.postgresql.org/docs/current/indexes.html

---

**Última atualização:** 2025-11-25
**Responsável:** Tech Lead / QA
