-- ============================================================================
-- SCRIPT DE SEED PARA TESTE DE PERFORMANCE
-- ============================================================================
--
-- OBJETIVO: Popular a tabela 'demandas' com 500+ registros de teste para
--           avaliar a performance do Dashboard e Relatórios sob carga.
--
-- COMO EXECUTAR:
--   1. Acesse o Supabase Dashboard > SQL Editor
--   2. Cole todo o conteúdo deste arquivo
--   3. Execute (Ctrl+Enter ou botão "Run")
--   4. Aguarde a confirmação: "500 rows affected"
--
-- COMO LIMPAR OS DADOS DE TESTE:
--   DELETE FROM demandas WHERE item LIKE '[TESTE]%';
--
-- DISTRIBUIÇÃO:
--   - 500 demandas distribuídas entre as unidades gestoras existentes
--   - Status: 50% pendente, 30% aprovada, 15% em_analise, 5% rejeitada
--   - Datas: Q1-Q4 de 2025 (distribuição uniforme)
--   - Valores: R$ 1.000 até R$ 500.000 (variados)
--
-- ============================================================================

-- Limpar dados de teste anteriores (se existirem)
DELETE FROM demandas WHERE item LIKE '[TESTE]%';

-- Gerar 500 demandas de teste
WITH
  -- Pegar IDs das unidades gestoras existentes
  unidades AS (
    SELECT id FROM unidades_gestoras ORDER BY id
  ),

  -- Gerar série de 500 registros
  series AS (
    SELECT generate_series(1, 500) AS n
  ),

  -- Categorias de itens para variar as descrições
  categorias AS (
    SELECT * FROM (VALUES
      ('Material de Escritório', 'Aquisição de canetas, papel A4, pastas, grampeadores e outros materiais de escritório'),
      ('Equipamentos de TI', 'Aquisição de computadores, monitores, teclados, mouses e periféricos'),
      ('Mobiliário', 'Aquisição de mesas, cadeiras, armários e estantes para escritório'),
      ('Manutenção Predial', 'Serviços de manutenção elétrica, hidráulica e civil do prédio'),
      ('Serviços de Limpeza', 'Contratação de serviços de limpeza e conservação predial'),
      ('Material de Expediente', 'Aquisição de envelopes, carimbos, etiquetas e materiais administrativos'),
      ('Software e Licenças', 'Aquisição de licenças de software e sistemas de gestão'),
      ('Equipamentos de Segurança', 'Aquisição de câmeras, alarmes e equipamentos de segurança'),
      ('Telefonia', 'Serviços de telefonia fixa, móvel e internet'),
      ('Treinamento', 'Contratação de cursos e treinamentos para servidores'),
      ('Consultoria', 'Contratação de serviços de consultoria especializada'),
      ('Veículos', 'Aquisição de veículos para uso da unidade'),
      ('Combustível', 'Aquisição de combustível para frota de veículos'),
      ('Material de Limpeza', 'Aquisição de produtos de limpeza e higienização'),
      ('Água e Energia', 'Pagamento de contas de água e energia elétrica'),
      ('Serviços Gráficos', 'Contratação de serviços de impressão e encadernação'),
      ('Material Médico', 'Aquisição de material médico e de primeiros socorros'),
      ('Uniformes', 'Aquisição de uniformes para servidores'),
      ('Seguros', 'Contratação de seguros diversos'),
      ('Viagens e Diárias', 'Pagamento de diárias e passagens para servidores em viagem')
    ) AS t(categoria, descricao)
  )

-- Inserir 500 demandas
INSERT INTO demandas (
  unidade_id,
  item,
  descricao,
  justificativa,
  quantidade,
  valor_unitario,
  valor_total,
  data_prevista,
  status,
  created_at
)
SELECT
  -- Distribuir entre unidades existentes (round-robin)
  (SELECT id FROM unidades OFFSET (s.n - 1) % (SELECT COUNT(*) FROM unidades) LIMIT 1),

  -- Item (prefixo [TESTE] para fácil identificação e limpeza)
  '[TESTE] ' || c.categoria,

  -- Descrição
  c.descricao,

  -- Justificativa (variada)
  CASE
    WHEN (s.n % 4) = 0 THEN 'Necessidade urgente identificada pela equipe de gestão. Item essencial para continuidade dos trabalhos.'
    WHEN (s.n % 4) = 1 THEN 'Demanda recorrente com base no planejamento anual. Previsto no orçamento da unidade.'
    WHEN (s.n % 4) = 2 THEN 'Solicitação baseada em levantamento de necessidades realizado com os servidores.'
    ELSE 'Adequação às normas vigentes e melhoria da qualidade dos serviços prestados.'
  END,

  -- Quantidade (varia entre 1 e 100)
  (1 + (s.n * 13) % 100)::INTEGER,

  -- Valor unitário (varia entre R$ 100 e R$ 50.000)
  -- Usando função seno para distribuição mais realista
  (100 + ABS(SIN(s.n::FLOAT / 7) * 49900))::NUMERIC(15,2),

  -- Valor total será calculado pelo trigger
  0,

  -- Data prevista (distribuir ao longo de 2025)
  -- Q1: Jan-Mar, Q2: Abr-Jun, Q3: Jul-Set, Q4: Out-Dez
  (
    DATE '2025-01-01' +
    (s.n % 365 || ' days')::INTERVAL
  )::DATE,

  -- Status (50% pendente, 30% aprovada, 15% em_analise, 5% rejeitada)
  CASE
    WHEN (s.n % 100) < 50 THEN 'pendente'
    WHEN (s.n % 100) < 80 THEN 'aprovada'
    WHEN (s.n % 100) < 95 THEN 'em_analise'
    ELSE 'rejeitada'
  END,

  -- Data de criação (variar nos últimos 30 dias)
  NOW() - (s.n % 30 || ' days')::INTERVAL

FROM series s
-- Join com categorias (round-robin)
CROSS JOIN LATERAL (
  SELECT * FROM categorias
  OFFSET (s.n - 1) % (SELECT COUNT(*) FROM categorias)
  LIMIT 1
) c;

-- ============================================================================
-- VERIFICAÇÃO PÓS-INSERÇÃO
-- ============================================================================

-- Total de demandas de teste inseridas
SELECT
  COUNT(*) AS total_demandas_teste,
  COUNT(DISTINCT unidade_id) AS unidades_utilizadas
FROM demandas
WHERE item LIKE '[TESTE]%';

-- Distribuição por status
SELECT
  status,
  COUNT(*) AS quantidade,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS percentual
FROM demandas
WHERE item LIKE '[TESTE]%'
GROUP BY status
ORDER BY quantidade DESC;

-- Distribuição por trimestre
SELECT
  CASE
    WHEN EXTRACT(MONTH FROM data_prevista) <= 3 THEN 'Q1 2025'
    WHEN EXTRACT(MONTH FROM data_prevista) <= 6 THEN 'Q2 2025'
    WHEN EXTRACT(MONTH FROM data_prevista) <= 9 THEN 'Q3 2025'
    ELSE 'Q4 2025'
  END AS trimestre,
  COUNT(*) AS quantidade
FROM demandas
WHERE item LIKE '[TESTE]%'
GROUP BY trimestre
ORDER BY trimestre;

-- Estatísticas de valores
SELECT
  ROUND(MIN(valor_total)::NUMERIC, 2) AS valor_minimo,
  ROUND(AVG(valor_total)::NUMERIC, 2) AS valor_medio,
  ROUND(MAX(valor_total)::NUMERIC, 2) AS valor_maximo,
  ROUND(SUM(valor_total)::NUMERIC, 2) AS valor_total_geral
FROM demandas
WHERE item LIKE '[TESTE]%';

-- ============================================================================
-- PRÓXIMOS PASSOS
-- ============================================================================
--
-- 1. Acesse o Dashboard do sistema e observe:
--    - Tempo de carregamento inicial
--    - Responsividade dos filtros
--    - Renderização dos gráficos
--
-- 2. Acesse a página de Relatórios e verifique:
--    - Tempo de geração dos relatórios
--    - Performance dos gráficos com 500+ registros
--    - Exportação de dados (se implementada)
--
-- 3. Teste a página de Demandas:
--    - Scroll e paginação (se implementada)
--    - Busca e filtros
--    - Criação de nova demanda
--
-- 4. Documente os resultados em ROADMAP_AUDITORIA.md
--
-- ============================================================================
