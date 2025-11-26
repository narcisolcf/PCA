import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database types for TypeScript-like autocomplete in JSDoc
/**
 * @typedef {Object} UnidadeGestora
 * @property {string} id
 * @property {string} nome
 * @property {string} sigla
 * @property {string} responsavel
 * @property {string} email
 * @property {string} created_at
 */

/**
 * @typedef {Object} Demanda
 * @property {string} id
 * @property {string} unidade_id
 * @property {string} item
 * @property {string} descricao
 * @property {string} justificativa
 * @property {number} quantidade
 * @property {number} valor_unitario
 * @property {number} valor_total
 * @property {string} data_prevista
 * @property {'pendente'|'aprovada'|'rejeitada'|'em_analise'} status
 * @property {number} prioridade
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} PCA
 * @property {string} id
 * @property {number} ano
 * @property {string} titulo
 * @property {number} valor_total
 * @property {'rascunho'|'em_analise'|'aprovado'|'publicado'} status
 * @property {string} created_at
 * @property {string} published_at
 */

// Helper functions for database operations
export const db = {
  // Unidades Gestoras
  unidades: {
    async getAll() {
      const { data, error } = await supabase
        .from('unidades_gestoras')
        .select('*')
        .order('nome')
      if (error) throw error
      return data
    },

    async create(unidade) {
      const { data, error } = await supabase
        .from('unidades_gestoras')
        .insert(unidade)
        .select()
        .single()
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('unidades_gestoras')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('unidades_gestoras')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },

  // Demandas
  demandas: {
    async getAll() {
      const { data, error } = await supabase
        .from('demandas')
        .select(`
          *,
          unidade:unidades_gestoras(id, nome, sigla)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },

    async getByUnidade(unidadeId) {
      const { data, error } = await supabase
        .from('demandas')
        .select('*')
        .eq('unidade_id', unidadeId)
        .order('prioridade')
      if (error) throw error
      return data
    },

    async create(demanda) {
      // Remove valor_total if present, as it is a generated column in DB
      const { valor_total, ...demandaData } = demanda

      const { data, error } = await supabase
        .from('demandas')
        .insert(demandaData)
        .select(`
          *,
          unidade:unidades_gestoras(id, nome, sigla)
        `)
        .single()
      if (error) throw error
      return data
    },

    async update(id, updates) {
      // Remove valor_total if present
      const { valor_total, ...updateData } = updates
      updateData.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('demandas')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          unidade:unidades_gestoras(id, nome, sigla)
        `)
        .single()
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('demandas')
        .delete()
        .eq('id', id)
      if (error) throw error
    },

    async getStats() {
      const { data, error } = await supabase
        .from('demandas')
        .select('status, valor_total, unidade_id')
      if (error) throw error
      return data
    }
  },

  // PCA (Plano de Contratação Anual)
  pca: {
    async getAll() {
      const { data, error } = await supabase
        .from('pca')
        .select('*')
        .order('ano', { ascending: false })
      if (error) throw error
      return data
    },

    async getByAno(ano) {
      const { data, error } = await supabase
        .from('pca')
        .select('*')
        .eq('ano', ano)
        .single()
      if (error) throw error
      return data
    },

    async create(pca) {
      const { data, error } = await supabase
        .from('pca')
        .insert(pca)
        .select()
        .single()
      if (error) throw error
      return data
    },

    async updateStatus(id, status) {
      const updates = { status }
      if (status === 'publicado') {
        updates.published_at = new Date().toISOString()
      }
      const { data, error } = await supabase
        .from('pca')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    }
  }
}
