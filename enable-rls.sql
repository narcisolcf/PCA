-- ============================================
-- MIGRAÇÃO: HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
-- Execute este script no Editor SQL do Supabase para habilitar RLS
-- Data de criação: 2025-11-24
-- Versão: 1.0.0
--
-- ⚠️ IMPORTANTE:
-- Este script habilita RLS com políticas PERMISSIVAS (acesso público total).
-- Quando a autenticação for implementada, estas políticas devem ser atualizadas
-- para restringir acesso baseado em auth.uid().
-- ============================================

BEGIN;

-- ============================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- ============================================

-- Unidades Gestoras
ALTER TABLE unidades_gestoras ENABLE ROW LEVEL SECURITY;

-- Demandas
ALTER TABLE demandas ENABLE ROW LEVEL SECURITY;

-- PCA (Plano de Contratação Anual)
ALTER TABLE pca ENABLE ROW LEVEL SECURITY;

-- Itens do PCA
ALTER TABLE pca_itens ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS TEMPORÁRIAS (ACESSO PÚBLICO)
-- ============================================
-- ATENÇÃO: Estas políticas permitem acesso total (SELECT, INSERT, UPDATE, DELETE)
-- para usuários anônimos (anon) e autenticados. Isto é TEMPORÁRIO até que
-- a autenticação seja implementada.
-- ============================================

-- ============================================
-- TABELA: unidades_gestoras
-- ============================================

-- Permitir SELECT (leitura) para todos
CREATE POLICY "Acesso público: SELECT em unidades_gestoras"
ON unidades_gestoras
FOR SELECT
TO anon, authenticated
USING (true);

-- Permitir INSERT (criação) para todos
CREATE POLICY "Acesso público: INSERT em unidades_gestoras"
ON unidades_gestoras
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir UPDATE (atualização) para todos
CREATE POLICY "Acesso público: UPDATE em unidades_gestoras"
ON unidades_gestoras
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Permitir DELETE (exclusão) para todos
CREATE POLICY "Acesso público: DELETE em unidades_gestoras"
ON unidades_gestoras
FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- TABELA: demandas
-- ============================================

-- Permitir SELECT (leitura) para todos
CREATE POLICY "Acesso público: SELECT em demandas"
ON demandas
FOR SELECT
TO anon, authenticated
USING (true);

-- Permitir INSERT (criação) para todos
CREATE POLICY "Acesso público: INSERT em demandas"
ON demandas
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir UPDATE (atualização) para todos
CREATE POLICY "Acesso público: UPDATE em demandas"
ON demandas
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Permitir DELETE (exclusão) para todos
CREATE POLICY "Acesso público: DELETE em demandas"
ON demandas
FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- TABELA: pca
-- ============================================

-- Permitir SELECT (leitura) para todos
CREATE POLICY "Acesso público: SELECT em pca"
ON pca
FOR SELECT
TO anon, authenticated
USING (true);

-- Permitir INSERT (criação) para todos
CREATE POLICY "Acesso público: INSERT em pca"
ON pca
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir UPDATE (atualização) para todos
CREATE POLICY "Acesso público: UPDATE em pca"
ON pca
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Permitir DELETE (exclusão) para todos
CREATE POLICY "Acesso público: DELETE em pca"
ON pca
FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- TABELA: pca_itens
-- ============================================

-- Permitir SELECT (leitura) para todos
CREATE POLICY "Acesso público: SELECT em pca_itens"
ON pca_itens
FOR SELECT
TO anon, authenticated
USING (true);

-- Permitir INSERT (criação) para todos
CREATE POLICY "Acesso público: INSERT em pca_itens"
ON pca_itens
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir UPDATE (atualização) para todos
CREATE POLICY "Acesso público: UPDATE em pca_itens"
ON pca_itens
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Permitir DELETE (exclusão) para todos
CREATE POLICY "Acesso público: DELETE em pca_itens"
ON pca_itens
FOR DELETE
TO anon, authenticated
USING (true);

COMMIT;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute as queries abaixo para verificar se RLS foi habilitado corretamente:

-- Verificar se RLS está ativo em todas as tabelas
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN ('unidades_gestoras', 'demandas', 'pca', 'pca_itens');

-- Listar todas as políticas criadas
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- ============================================
-- PRÓXIMOS PASSOS (APÓS IMPLEMENTAR AUTENTICAÇÃO)
-- ============================================
--
-- 1. DELETAR as políticas de acesso público:
--    DROP POLICY "Acesso público: SELECT em unidades_gestoras" ON unidades_gestoras;
--    (repetir para todas as políticas)
--
-- 2. CRIAR políticas restritas baseadas em auth.uid():
--    Exemplo:
--    CREATE POLICY "Usuários podem ler suas próprias unidades"
--    ON unidades_gestoras
--    FOR SELECT
--    TO authenticated
--    USING (auth.uid() IN (
--      SELECT user_id FROM user_permissions
--      WHERE unidade_id = unidades_gestoras.id
--    ));
--
-- 3. DEFINIR perfis de acesso (admin, gestor, visualizador)
-- 4. CRIAR tabela de permissões por unidade/perfil
-- 5. ATUALIZAR políticas para refletir os perfis
--
-- ============================================

-- FIM DO SCRIPT DE MIGRAÇÃO RLS
