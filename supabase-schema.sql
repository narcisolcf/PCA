-- ============================================
-- SCHEMA DO BANCO DE DADOS - PCA (Plano de Contratação Anual)
-- Execute este SQL no Editor SQL do Supabase
-- ============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: Unidades Gestoras (Secretarias)
-- ============================================
CREATE TABLE IF NOT EXISTS unidades_gestoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  sigla VARCHAR(20),
  responsavel VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(20),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca por nome
CREATE INDEX idx_unidades_nome ON unidades_gestoras(nome);

-- ============================================
-- TABELA: Demandas (Itens do DFD)
-- ============================================
CREATE TABLE IF NOT EXISTS demandas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unidade_id UUID REFERENCES unidades_gestoras(id) ON DELETE CASCADE,
  item VARCHAR(255) NOT NULL,
  descricao TEXT,
  justificativa TEXT,
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_unitario DECIMAL(15, 2) NOT NULL DEFAULT 0,
  valor_total DECIMAL(15, 2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED,
  data_prevista DATE,
  trimestre VARCHAR(10), -- Q1, Q2, Q3, Q4
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'aprovada', 'rejeitada')),
  prioridade INTEGER DEFAULT 3 CHECK (prioridade BETWEEN 1 AND 5),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_demandas_unidade ON demandas(unidade_id);
CREATE INDEX idx_demandas_status ON demandas(status);
CREATE INDEX idx_demandas_data ON demandas(data_prevista);

-- ============================================
-- TABELA: PCA (Plano de Contratação Anual)
-- ============================================
CREATE TABLE IF NOT EXISTS pca (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ano INTEGER NOT NULL UNIQUE,
  titulo VARCHAR(255),
  descricao TEXT,
  valor_total DECIMAL(15, 2) DEFAULT 0,
  valor_aprovado DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'em_analise', 'aprovado', 'publicado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- ============================================
-- TABELA: Itens do PCA (Vinculação de demandas ao PCA)
-- ============================================
CREATE TABLE IF NOT EXISTS pca_itens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pca_id UUID REFERENCES pca(id) ON DELETE CASCADE,
  demanda_id UUID REFERENCES demandas(id) ON DELETE CASCADE,
  valor_aprovado DECIMAL(15, 2),
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pca_id, demanda_id)
);

-- ============================================
-- TRIGGERS para atualização automática
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_unidades_gestoras_updated_at
  BEFORE UPDATE ON unidades_gestoras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demandas_updated_at
  BEFORE UPDATE ON demandas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pca_updated_at
  BEFORE UPDATE ON pca
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS para relatórios
-- ============================================

-- View: Resumo por Unidade
CREATE OR REPLACE VIEW vw_resumo_por_unidade AS
SELECT 
  u.id,
  u.nome,
  u.sigla,
  COUNT(d.id) as total_demandas,
  COALESCE(SUM(d.valor_total), 0) as valor_total,
  COUNT(CASE WHEN d.status = 'aprovada' THEN 1 END) as demandas_aprovadas,
  COALESCE(SUM(CASE WHEN d.status = 'aprovada' THEN d.valor_total END), 0) as valor_aprovado
FROM unidades_gestoras u
LEFT JOIN demandas d ON u.id = d.unidade_id
GROUP BY u.id, u.nome, u.sigla;

-- View: Resumo por Status
CREATE OR REPLACE VIEW vw_resumo_por_status AS
SELECT 
  status,
  COUNT(*) as quantidade,
  COALESCE(SUM(valor_total), 0) as valor_total
FROM demandas
GROUP BY status;

-- View: Resumo por Trimestre
CREATE OR REPLACE VIEW vw_resumo_por_trimestre AS
SELECT 
  trimestre,
  COUNT(*) as quantidade,
  COALESCE(SUM(valor_total), 0) as valor_total
FROM demandas
WHERE trimestre IS NOT NULL
GROUP BY trimestre
ORDER BY trimestre;

-- ============================================
-- DADOS INICIAIS (Seeds)
-- ============================================

-- Inserir Unidades Gestoras padrão
INSERT INTO unidades_gestoras (nome, sigla, responsavel, email) VALUES
  ('Secretaria de Saúde', 'SEMUS', 'João Silva', 'saude@municipio.gov.br'),
  ('Secretaria de Educação', 'SEMED', 'Maria Santos', 'educacao@municipio.gov.br'),
  ('Secretaria de Obras e Serviços Urbanos', 'SEOSP', 'Pedro Oliveira', 'obras@municipio.gov.br'),
  ('Secretaria de Administração e Finanças', 'SEMAF', 'Ana Costa', 'administracao@municipio.gov.br'),
  ('Secretaria de Assistência Social', 'SEMAS', 'Carlos Lima', 'assistencia@municipio.gov.br'),
  ('Gabinete do Prefeito', 'GAB', 'Lucia Ferreira', 'gabinete@municipio.gov.br')
ON CONFLICT DO NOTHING;

-- Criar PCA para o ano atual
INSERT INTO pca (ano, titulo, descricao, status) VALUES
  (2025, 'Plano de Contratações Anual 2025', 'PCA consolidado para o exercício de 2025', 'rascunho')
ON CONFLICT (ano) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Opcional
-- ============================================

-- Habilitar RLS (descomente se necessário)
-- ALTER TABLE unidades_gestoras ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE demandas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pca ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (ajuste conforme necessário)
-- CREATE POLICY "Permitir leitura pública" ON unidades_gestoras FOR SELECT USING (true);
-- CREATE POLICY "Permitir leitura pública" ON demandas FOR SELECT USING (true);
-- CREATE POLICY "Permitir leitura pública" ON pca FOR SELECT USING (true);

-- ============================================
-- GRANTS (permissões para o anon key)
-- ============================================

-- Permissões para leitura/escrita (ajuste conforme necessário)
GRANT ALL ON unidades_gestoras TO anon, authenticated;
GRANT ALL ON demandas TO anon, authenticated;
GRANT ALL ON pca TO anon, authenticated;
GRANT ALL ON pca_itens TO anon, authenticated;
GRANT SELECT ON vw_resumo_por_unidade TO anon, authenticated;
GRANT SELECT ON vw_resumo_por_status TO anon, authenticated;
GRANT SELECT ON vw_resumo_por_trimestre TO anon, authenticated;
