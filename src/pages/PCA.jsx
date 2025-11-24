import { useState, useMemo } from 'react'
import {
  ClipboardList,
  FileText,
  CheckCircle,
  Send,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { PageHeader } from '../components/Header'
import { Card, Button, Badge, LoadingState, Toast } from '../components/ui'
import { useDemandas, useUnidades, usePCA } from '../hooks/useData' // Adicionado usePCA
import { formatCurrency, STATUS_CONFIG } from '../lib/utils'

const PHASES = [
  {
    id: 1,
    title: 'Preparação',
    icon: '📋',
    description: 'Definir responsáveis, cronograma e ferramentas de coleta.'
  },
  {
    id: 2,
    title: 'Coleta',
    icon: '📝',
    description: 'Receber demandas de todas as unidades gestoras.'
  },
  {
    id: 3,
    title: 'Análise',
    icon: '🔍',
    description: 'Consolidar, priorizar e verificar viabilidade orçamentária.'
  },
  {
    id: 4,
    title: 'Aprovação',
    icon: '✅',
    description: 'Parecer jurídico e aprovação da autoridade competente.'
  },
  {
    id: 5,
    title: 'Publicação',
    icon: '📢',
    description: 'Publicar no Portal da Transparência e PNCP.'
  }
]

export function PCAPage() {
  const { demandas, loading: loadingDemandas } = useDemandas()
  const { unidades, loading: loadingUnidades } = useUnidades()
  const { pca, loading: loadingPCA, updatePCAStatus } = usePCA() // Usa o novo hook

  const [currentPhase, setCurrentPhase] = useState(2)
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Lógica para Publicar o PCA
  const handlePublishPCA = async () => {
    if (!window.confirm('Tem certeza que deseja Publicar o PCA? Esta ação o tornará público.')) return

    setFormLoading(true)
    const result = await updatePCAStatus('publicado')

    if (result.success) {
      showToast('PCA publicado com sucesso!', 'success')
      // Opcional: avançar a fase da timeline para 5 (Publicação)
      setCurrentPhase(5)
    } else {
      showToast(result.error || 'Erro ao publicar PCA.', 'error')
    }
    setFormLoading(false)
  }

  const stats = useMemo(() => {
    const total = demandas.reduce((sum, d) => sum + (parseFloat(d.valor_total) || 0), 0)
    const aprovado = demandas
      .filter(d => d.status === 'aprovada')
      .reduce((sum, d) => sum + (parseFloat(d.valor_total) || 0), 0)
    const pendente = demandas
      .filter(d => d.status === 'pendente')
      .reduce((sum, d) => sum + (parseFloat(d.valor_total) || 0), 0)

    const byQuarter = demandas.reduce((acc, d) => {
      const q = d.trimestre || 'Sem data'
      acc[q] = (acc[q] || 0) + (parseFloat(d.valor_total) || 0)
      return acc
    }, {})

    const unidadesComDemanda = new Set(demandas.map(d => d.unidade_id)).size
    const unidadesPendentes = unidades.length - unidadesComDemanda

    return {
      total,
      aprovado,
      pendente,
      byQuarter,
      totalDemandas: demandas.length,
      demandasAprovadas: demandas.filter(d => d.status === 'aprovada').length,
      unidadesComDemanda,
      unidadesPendentes
    }
  }, [demandas, unidades])

  if (loadingDemandas || loadingUnidades || loadingPCA) {
    return <LoadingState message="Carregando PCA..." />
  }

  // Determinar o status real do PCA (rascunho, aprovado, etc)
  const pcaStatus = pca?.status || 'rascunho'
  const isPublished = pcaStatus === 'publicado'

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Plano de Contratação Anual ${pca?.ano || new Date().getFullYear()}`}
        description={`PCA ${pca?.ano || new Date().getFullYear()} - Acompanhe o processo de elaboração`}
      />

      {/* PCA Header/Status */}
      <Card className="p-4 mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">Status Geral do PCA:</h3>
        <Badge
          className={STATUS_CONFIG[pcaStatus]?.color}
          variant={pcaStatus === 'publicado' ? 'success' : 'warning'}
        >
          {STATUS_CONFIG[pcaStatus]?.icon} {STATUS_CONFIG[pcaStatus]?.label}
        </Badge>
      </Card>


      {/* Phase Timeline */}
      <Card className="p-6 mb-8">
        <h3 className="font-semibold text-slate-900 mb-6">Fases do Processo</h3>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded">
            <div
              className="h-full bg-blue-600 rounded transition-all duration-500"
              style={{ width: `${((currentPhase - 1) / (PHASES.length - 1)) * 100}%` }}
            />
          </div>

          {/* Phase Steps */}
          <div className="relative flex justify-between">
            {PHASES.map((phase) => {
              const isActive = phase.id === currentPhase
              const isComplete = phase.id < currentPhase

              return (
                <button
                  key={phase.id}
                  onClick={() => setCurrentPhase(phase.id)}
                  className="flex flex-col items-center group"
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    transition-all duration-300 z-10
                    ${isComplete
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-100'
                        : 'bg-white border-2 border-slate-200 text-slate-400 group-hover:border-blue-300'
                    }
                  `}>
                    {isComplete ? '✓' : phase.icon}
                  </div>
                  <span className={`
                    mt-2 text-xs font-medium text-center
                    ${isActive ? 'text-blue-600' : 'text-slate-500'}
                  `}>
                    {phase.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Current Phase Details */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{PHASES[currentPhase - 1].icon}</span>
            <div>
              <h4 className="font-semibold text-blue-900">
                Fase {currentPhase}: {PHASES[currentPhase - 1].title}
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                {PHASES[currentPhase - 1].description}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Demandas</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalDemandas}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Demandas Aprovadas</p>
              <p className="text-2xl font-bold text-slate-900">{stats.demandasAprovadas}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Valor Total</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.total)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Unidades Pendentes</p>
              <p className="text-2xl font-bold text-slate-900">{stats.unidadesPendentes}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Distribution by Quarter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Distribuição por Trimestre</h3>
          <div className="space-y-4">
            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
              const valor = stats.byQuarter[q] || 0
              const percentage = stats.total > 0 ? (valor / stats.total) * 100 : 0

              return (
                <div key={q} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{q} - {
                      q === 'Q1' ? 'Jan-Mar' :
                        q === 'Q2' ? 'Abr-Jun' :
                          q === 'Q3' ? 'Jul-Set' : 'Out-Dez'
                    }</span>
                    <span className="text-slate-600">{formatCurrency(valor)}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${q === 'Q1' ? 'bg-blue-500' :
                          q === 'Q2' ? 'bg-emerald-500' :
                            q === 'Q3' ? 'bg-amber-500' : 'bg-purple-500'
                        }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Resumo Financeiro</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600">Valor Total Demandado</span>
              <span className="text-xl font-bold text-slate-900">{formatCurrency(stats.total)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
              <span className="text-emerald-700">Valor Aprovado</span>
              <span className="text-xl font-bold text-emerald-700">{formatCurrency(stats.aprovado)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl">
              <span className="text-amber-700">Valor Pendente</span>
              <span className="text-xl font-bold text-amber-700">{formatCurrency(stats.pendente)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Ações do PCA</h3>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="secondary"
            onClick={() => showToast('Funcionalidade em desenvolvimento')}
            disabled={isPublished}
          >
            <FileText className="w-4 h-4" />
            Gerar Relatório Consolidado
          </Button>
          <Button
            variant="secondary"
            onClick={() => showToast('Funcionalidade em desenvolvimento')}
            disabled={isPublished}
          >
            <Send className="w-4 h-4" />
            Enviar para Análise Jurídica
          </Button>
          <Button
            variant="success"
            onClick={handlePublishPCA}
            loading={formLoading}
            disabled={isPublished}
          >
            <CheckCircle className="w-4 h-4" />
            {isPublished ? 'PCA Publicado' : 'Publicar PCA'}
          </Button>
        </div>
        {isPublished && (
          <p className="text-sm text-emerald-600 mt-3 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Este PCA já foi publicado em {pca?.published_at ? new Date(pca.published_at).toLocaleDateString() : 'data não registrada'}.
          </p>
        )}
      </Card>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
