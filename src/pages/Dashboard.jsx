import { useMemo } from 'react'
import { 
  FileText, 
  Building2, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { PageHeader } from '../components/Header'
import { Card, StatsCard, LoadingState } from '../components/ui'
import { useDemandas, useUnidades } from '../hooks/useData'
import { formatCurrency, STATUS_CONFIG } from '../lib/utils'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export function DashboardPage() {
  const { demandas, loading: loadingDemandas } = useDemandas()
  const { unidades, loading: loadingUnidades } = useUnidades()

  const stats = useMemo(() => {
    const total = demandas.reduce((sum, d) => sum + (parseFloat(d.valor_total) || 0), 0)
    const aprovado = demandas
      .filter(d => d.status === 'aprovada')
      .reduce((sum, d) => sum + (parseFloat(d.valor_total) || 0), 0)
    
    const byStatus = demandas.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1
      return acc
    }, {})

    const byUnidade = demandas.reduce((acc, d) => {
      const unidadeNome = d.unidade?.nome || 'Sem Unidade'
      if (!acc[unidadeNome]) {
        acc[unidadeNome] = { count: 0, valor: 0 }
      }
      acc[unidadeNome].count += 1
      acc[unidadeNome].valor += parseFloat(d.valor_total) || 0
      return acc
    }, {})

    return { total, aprovado, byStatus, byUnidade }
  }, [demandas])

  const donutData = {
    labels: Object.keys(stats.byStatus).map(s => STATUS_CONFIG[s]?.label || s),
    datasets: [{
      data: Object.values(stats.byStatus),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',   // blue
        'rgba(16, 185, 129, 0.8)',   // emerald
        'rgba(245, 158, 11, 0.8)',   // amber
        'rgba(239, 68, 68, 0.8)'     // red
      ],
      borderWidth: 0
    }]
  }

  const barData = {
    labels: Object.keys(stats.byUnidade).slice(0, 6),
    datasets: [{
      label: 'Valor Total (R$)',
      data: Object.values(stats.byUnidade).slice(0, 6).map(u => u.valor),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 8
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `R$ ${(value / 1000).toFixed(0)}k`
        }
      }
    }
  }

  if (loadingDemandas || loadingUnidades) {
    return <LoadingState message="Carregando dashboard..." />
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Dashboard"
        description={`Visão geral do Plano de Contratações ${new Date().getFullYear()}`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<FileText className="w-5 h-5" />}
          label="Total de Demandas"
          value={demandas.length}
          color="blue"
        />
        <StatsCard
          icon={<Building2 className="w-5 h-5" />}
          label="Unidades Gestoras"
          value={unidades.length}
          color="purple"
        />
        <StatsCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Valor Total"
          value={formatCurrency(stats.total)}
          color="emerald"
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Valor Aprovado"
          value={formatCurrency(stats.aprovado)}
          color="amber"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-900">
                {stats.byStatus.pendente || 0}
              </p>
              <p className="text-sm text-amber-700">Pendentes</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">
                {stats.byStatus.em_analise || 0}
              </p>
              <p className="text-sm text-blue-700">Em Análise</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-900">
                {stats.byStatus.aprovada || 0}
              </p>
              <p className="text-sm text-emerald-700">Aprovadas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-900">
                {stats.byStatus.rejeitada || 0}
              </p>
              <p className="text-sm text-red-700">Rejeitadas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Distribuição por Status
          </h3>
          <div className="h-64">
            {Object.keys(stats.byStatus).length > 0 ? (
              <Doughnut data={donutData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Sem dados para exibir
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Valor por Unidade Gestora
          </h3>
          <div className="h-64">
            {Object.keys(stats.byUnidade).length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Sem dados para exibir
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Demandas */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Últimas Demandas
        </h3>
        <div className="space-y-3">
          {demandas.slice(0, 5).map(demanda => (
            <div 
              key={demanda.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-900">{demanda.item}</p>
                <p className="text-sm text-slate-500">{demanda.unidade?.nome}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  {formatCurrency(demanda.valor_total)}
                </p>
                <span className={`text-xs ${STATUS_CONFIG[demanda.status]?.color}`}>
                  {STATUS_CONFIG[demanda.status]?.icon} {STATUS_CONFIG[demanda.status]?.label}
                </span>
              </div>
            </div>
          ))}
          {demandas.length === 0 && (
            <p className="text-center text-slate-400 py-8">
              Nenhuma demanda cadastrada ainda
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
