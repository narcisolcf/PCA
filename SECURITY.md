# 🔐 Segurança - Row Level Security (RLS)

**Status:** ✅ RLS Implementado (Modo Permissivo)
**Última Atualização:** 2025-11-24
**Responsável:** Tech Lead Database

---

## 📋 Resumo Executivo

O sistema **PCA** possui Row Level Security (RLS) configurado no banco de dados Supabase para todas as tabelas críticas. Atualmente, as políticas estão em **modo permissivo** (acesso público total), permitindo que a aplicação funcione sem autenticação.

**⚠️ IMPORTANTE:** Quando a autenticação for implementada, estas políticas **DEVEM** ser atualizadas para restringir acesso baseado em perfis de usuário.

---

## 🛡️ Tabelas Protegidas por RLS

| Tabela | RLS Ativo | Políticas Aplicadas | Status |
|--------|-----------|---------------------|--------|
| `unidades_gestoras` | ✅ Sim | SELECT, INSERT, UPDATE, DELETE (público) | Permissivo |
| `demandas` | ✅ Sim | SELECT, INSERT, UPDATE, DELETE (público) | Permissivo |
| `pca` | ✅ Sim | SELECT, INSERT, UPDATE, DELETE (público) | Permissivo |
| `pca_itens` | ✅ Sim | SELECT, INSERT, UPDATE, DELETE (público) | Permissivo |

**Total:** 4 tabelas protegidas

---

## 🔧 Como Aplicar RLS ao Banco de Dados

### Opção 1: Executar Script de Migração (Recomendado)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Copie todo o conteúdo do arquivo `enable-rls.sql`
4. Cole no editor e execute
5. Verifique se não houve erros

### Opção 2: Comandos Manuais

```sql
-- Habilitar RLS
ALTER TABLE unidades_gestoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pca ENABLE ROW LEVEL SECURITY;
ALTER TABLE pca_itens ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas (exemplo para unidades_gestoras)
CREATE POLICY "Acesso público: SELECT em unidades_gestoras"
ON unidades_gestoras FOR SELECT TO anon, authenticated USING (true);

-- Repetir para INSERT, UPDATE, DELETE e outras tabelas
-- (Veja enable-rls.sql para script completo)
```

---

## 🔍 Políticas Atuais (Modo Permissivo)

### Exemplo: Tabela `unidades_gestoras`

```sql
-- SELECT (Leitura) - Qualquer usuário pode ler
CREATE POLICY "Acesso público: SELECT em unidades_gestoras"
ON unidades_gestoras
FOR SELECT
TO anon, authenticated
USING (true);  -- ← Permite tudo

-- INSERT (Criação) - Qualquer usuário pode criar
CREATE POLICY "Acesso público: INSERT em unidades_gestoras"
ON unidades_gestoras
FOR INSERT
TO anon, authenticated
WITH CHECK (true);  -- ← Permite tudo

-- UPDATE (Atualização) - Qualquer usuário pode atualizar
CREATE POLICY "Acesso público: UPDATE em unidades_gestoras"
ON unidades_gestoras
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);  -- ← Permite tudo

-- DELETE (Exclusão) - Qualquer usuário pode deletar
CREATE POLICY "Acesso público: DELETE em unidades_gestoras"
ON unidades_gestoras
FOR DELETE
TO anon, authenticated
USING (true);  -- ← Permite tudo
```

**Padrões repetidos para:** `demandas`, `pca`, `pca_itens`

---

## ⚠️ Riscos da Configuração Atual

| Risco | Nível | Descrição | Mitigação Atual |
|-------|-------|-----------|-----------------|
| Acesso não autorizado | 🟡 Médio | Qualquer pessoa com a URL pode acessar dados | Usar em ambiente interno/controlado |
| Modificação de dados | 🟡 Médio | Qualquer um pode criar/editar/deletar | Backup regular + monitoramento |
| Vazamento de informações | 🟡 Médio | Dados públicos sem login | Não armazenar dados sensíveis antes de auth |
| Falta de auditoria | 🟡 Médio | Não há rastreamento de quem fez o quê | Implementar logs de auditoria futuros |

**Recomendação:** Use esta configuração **APENAS** em:
- Ambientes de desenvolvimento
- Redes internas/controladas
- Antes de ir para produção pública

---

## 🚀 Plano de Migração para Autenticação

### Fase 1: Implementar Autenticação (Futuro)

1. **Habilitar Supabase Auth**
   - Configurar provedores (email/senha, Google, etc)
   - Criar tabela `users` ou usar `auth.users` do Supabase

2. **Criar Tabela de Perfis**
   ```sql
   CREATE TABLE user_profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     role VARCHAR(20) CHECK (role IN ('admin', 'gestor', 'visualizador')),
     unidade_id UUID REFERENCES unidades_gestoras(id),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Criar Tabela de Permissões**
   ```sql
   CREATE TABLE user_permissions (
     user_id UUID REFERENCES auth.users(id),
     unidade_id UUID REFERENCES unidades_gestoras(id),
     can_read BOOLEAN DEFAULT true,
     can_write BOOLEAN DEFAULT false,
     can_delete BOOLEAN DEFAULT false,
     PRIMARY KEY (user_id, unidade_id)
   );
   ```

### Fase 2: Substituir Políticas Permissivas

**Exemplo de política restrita para `unidades_gestoras`:**

```sql
-- DELETAR política permissiva
DROP POLICY "Acesso público: SELECT em unidades_gestoras" ON unidades_gestoras;

-- CRIAR política restrita
CREATE POLICY "Usuários autenticados podem ler unidades permitidas"
ON unidades_gestoras
FOR SELECT
TO authenticated
USING (
  -- Admins podem ver tudo
  auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
  OR
  -- Outros veem apenas suas unidades
  id IN (
    SELECT unidade_id FROM user_permissions
    WHERE user_id = auth.uid() AND can_read = true
  )
);

-- CRIAR políticas para INSERT, UPDATE, DELETE seguindo mesma lógica
```

### Fase 3: Perfis de Acesso

| Perfil | Permissões | Use Case |
|--------|-----------|----------|
| **Admin** | Acesso total a tudo | Gestor do sistema |
| **Gestor** | CRUD na própria unidade | Secretário de pasta |
| **Visualizador** | Apenas leitura | Equipe de apoio |

---

## ✅ Checklist de Segurança

### Antes de Ir para Produção

- [ ] Implementar autenticação (Supabase Auth ou similar)
- [ ] Criar tabelas de perfis e permissões
- [ ] Substituir TODAS as políticas permissivas por restritas
- [ ] Testar acessos com diferentes perfis
- [ ] Implementar logs de auditoria
- [ ] Configurar backup automático
- [ ] Ativar 2FA para contas admin
- [ ] Revisar e atualizar este documento

### Após Habilitar RLS (Agora)

- [x] Executar `enable-rls.sql` no Supabase
- [x] Verificar que RLS está ativo em todas as tabelas
- [x] Testar CRUD completo na aplicação
- [x] Confirmar que não há erros de permissão

---

## 🔬 Como Verificar RLS no Supabase

### Verificar se RLS está ativo

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('unidades_gestoras', 'demandas', 'pca', 'pca_itens');
```

**Resultado esperado:** `rowsecurity = true` para todas

### Listar políticas aplicadas

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Resultado esperado:** 16 políticas (4 operações × 4 tabelas)

---

## 📚 Recursos e Referências

- [Documentação RLS do Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Postgres RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Best Practices for RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## 📞 Contato

**Dúvidas sobre segurança?**
- Consulte o Tech Lead responsável
- Revise `enable-rls.sql` para detalhes de implementação
- Leia `ROADMAP_AUDITORIA.md` Item 1 para contexto

---

**Última revisão:** 2025-11-24
**Próxima revisão:** Após implementação de autenticação
**Status:** 🟡 Segurança básica implementada, aguardando autenticação para restringir acesso
