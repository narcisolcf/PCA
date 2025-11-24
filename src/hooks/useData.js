import { useState, useEffect, useCallback } from 'react'
import { db } from '../lib/supabase'

export function useDemandas() {
  const [demandas, setDemandas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDemandas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.demandas.getAll()
      setDemandas(data || [])
    } catch (err) {
      console.error('Erro ao carregar demandas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDemandas()
  }, [fetchDemandas])

  const createDemanda = async (demanda) => {
    try {
      const newDemanda = await db.demandas.create(demanda)
      setDemandas(prev => [newDemanda, ...prev])
      return { success: true, data: newDemanda }
    } catch (err) {
      console.error('Erro ao criar demanda:', err)
      return { success: false, error: err.message }
    }
  }

  const updateDemanda = async (id, updates) => {
    try {
      const updated = await db.demandas.update(id, updates)
      setDemandas(prev => prev.map(d => d.id === id ? updated : d))
      return { success: true, data: updated }
    } catch (err) {
      console.error('Erro ao atualizar demanda:', err)
      return { success: false, error: err.message }
    }
  }

  const deleteDemanda = async (id) => {
    try {
      await db.demandas.delete(id)
      setDemandas(prev => prev.filter(d => d.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Erro ao deletar demanda:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    demandas,
    loading,
    error,
    refresh: fetchDemandas,
    createDemanda,
    updateDemanda,
    deleteDemanda
  }
}

export function useUnidades() {
  const [unidades, setUnidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUnidades = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.unidades.getAll()
      setUnidades(data || [])
    } catch (err) {
      console.error('Erro ao carregar unidades:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUnidades()
  }, [fetchUnidades])

  const createUnidade = async (unidade) => {
    try {
      const newUnidade = await db.unidades.create(unidade)
      setUnidades(prev => [...prev, newUnidade])
      return { success: true, data: newUnidade }
    } catch (err) {
      console.error('Erro ao criar unidade:', err)
      return { success: false, error: err.message }
    }
  }

  const updateUnidade = async (id, updates) => {
    try {
      const updated = await db.unidades.update(id, updates)
      setUnidades(prev => prev.map(u => u.id === id ? updated : u))
      return { success: true, data: updated }
    } catch (err) {
      console.error('Erro ao atualizar unidade:', err)
      return { success: false, error: err.message }
    }
  }

  const deleteUnidade = async (id) => {
    try {
      await db.unidades.delete(id)
      setUnidades(prev => prev.filter(u => u.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Erro ao deletar unidade:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    unidades,
    loading,
    error,
    refresh: fetchUnidades,
    createUnidade,
    updateUnidade,
    deleteUnidade
  }
}

export function usePCA() {
  const [pca, setPca] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentYear = new Date().getFullYear()

  const fetchPCA = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Tenta buscar o PCA do ano atual
      const data = await db.pca.getByAno(currentYear) 
      setPca(data)
    } catch (err) {
      console.error(`Erro ao carregar PCA do ano ${currentYear}:`, err)
      setError(err.message)
      // Se não encontrar, ele não lida com a criação automática aqui, 
      // mas podemos assumir que o seed já criou um rascunho.
    } finally {
      setLoading(false)
    }
  }, [currentYear])

  useEffect(() => {
    fetchPCA()
  }, [fetchPCA])

  const updatePCAStatus = async (status) => {
    if (!pca) {
      // Se o PCA não existir (o que é improvável se o seed rodar), retorna erro.
      return { success: false, error: 'PCA do ano atual não encontrado.' }
    }
    
    try {
      const updated = await db.pca.updateStatus(pca.id, status)
      setPca(updated) // Atualiza o estado
      return { success: true, data: updated }
    } catch (err) {
      console.error('Erro ao atualizar status do PCA:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    pca,
    loading,
    error,
    refresh: fetchPCA,
    updatePCAStatus
  }
}
