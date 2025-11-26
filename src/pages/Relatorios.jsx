import { useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  Download,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PageHeader } from '../components/Header';
import { Card, Button, LoadingState } from '../components/ui';
import { useDemandas, useUnidades } from '../hooks/useData';
import { formatCurrency, STATUS_CONFIG } from '../lib/utils';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export function RelatoriosPage() {
  const { demandas, loading: loadingDemandas } = useDemandas();
  const { unidades, loading: loadingUnidades } = useUnidades();

  const analytics = useMemo(() => {
    // Por Status
    const byStatus = demandas.reduce((acc, d) => {
      acc[d.status] = acc[d.status] || { count: 0, valor: 0 };
      acc[d.status].count += 1;
      acc[d.status].valor += parseFloat(d.valor_total) || 0;
      return acc;
    }, {});

    // Por Unidade
    const byUnidade = demandas.reduce((acc, d) => {
      const nome = d.unidade?.nome || 'Sem Unidade';
      acc[nome] = acc[nome] || { count: 0, valor: 0 };
      acc[nome].count += 1;
      acc[nome].valor += parseFloat(d.valor_total) || 0;
      return acc;
    }, {});

    // Por Trimestre
    const byTrimestre = demandas.reduce((acc, d) => {
      const q = d.trimestre || 'Não definido';
      acc[q] = acc[q] || { count: 0, valor: 0 };
      acc[q].count += 1;
      acc[q].valor += parseFloat(d.valor_total) || 0;
      return acc;
    }, {});

    // Por Prioridade
    const byPrioridade = demandas.reduce((acc, d) => {
      const p = d.prioridade || 3;
      acc[p] = acc[p] || { count: 0, valor: 0 };
      acc[p].count += 1;
      acc[p].valor += parseFloat(d.valor_total) || 0;
      return acc;
    }, {});

    // Totais
    const total = demandas.reduce(
      (sum, d) => sum + (parseFloat(d.valor_total) || 0),
      0
    );

    return { byStatus, byUnidade, byTrimestre, byPrioridade, total };
  }, [demandas]);

  // Chart data
  const statusChartData = {
    labels: Object.keys(analytics.byStatus).map(
      (s) => STATUS_CONFIG[s]?.label || s
    ),
    datasets: [
      {
        data: Object.values(analytics.byStatus).map((v) => v.valor),
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)', // pendente - amber
          'rgba(59, 130, 246, 0.8)', // em_analise - blue
          'rgba(16, 185, 129, 0.8)', // aprovada - emerald
          'rgba(239, 68, 68, 0.8)', // rejeitada - red
        ],
        borderWidth: 0,
      },
    ],
  };

  const unidadeChartData = {
    labels: Object.keys(analytics.byUnidade),
    datasets: [
      {
        label: 'Valor Total',
        data: Object.values(analytics.byUnidade).map((v) => v.valor),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const trimestreChartData = {
    labels: ['Q1 (Jan-Mar)', 'Q2 (Abr-Jun)', 'Q3 (Jul-Set)', 'Q4 (Out-Dez)'],
    datasets: [
      {
        label: 'Valor por Trimestre',
        data: [
          analytics.byTrimestre['Q1']?.valor || 0,
          analytics.byTrimestre['Q2']?.valor || 0,
          analytics.byTrimestre['Q3']?.valor || 0,
          analytics.byTrimestre['Q4']?.valor || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => formatCurrency(ctx.raw),
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `R$ ${(value / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  const handleExportCSV = () => {
    const headers = [
      'Item',
      'Unidade',
      'Quantidade',
      'Valor Unit.',
      'Valor Total',
      'Status',
      'Trimestre',
    ];
    const rows = demandas.map((d) => [
      d.item,
      d.unidade?.nome || '',
      d.quantidade,
      d.valor_unitario,
      d.valor_total,
      STATUS_CONFIG[d.status]?.label || d.status,
      d.trimestre || '',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-pca-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loadingDemandas || loadingUnidades) {
    return <LoadingState message="Carregando relatórios..." />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Relatórios"
        description="Análises e visualizações do Plano de Contratação Anual"
        action={
          <Button onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-3xl font-bold text-blue-700">{demandas.length}</p>
          <p className="text-sm text-blue-600">Total de Demandas</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <p className="text-3xl font-bold text-emerald-700">
            {unidades.length}
          </p>
          <p className="text-sm text-emerald-600">Unidades Gestoras</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <p className="text-2xl font-bold text-amber-700">
            {formatCurrency(analytics.total)}
          </p>
          <p className="text-sm text-amber-600">Valor Total</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-2xl font-bold text-purple-700">
            {formatCurrency(analytics.byStatus?.aprovada?.valor || 0)}
          </p>
          <p className="text-sm text-purple-600">Valor Aprovado</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">
              Distribuição por Status
            </h3>
          </div>
          <div className="h-64">
            {Object.keys(analytics.byStatus).length > 0 ? (
              <Doughnut data={statusChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Sem dados para exibir
              </div>
            )}
          </div>
        </Card>

        {/* Trimestre Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">
              Valor por Trimestre
            </h3>
          </div>
          <div className="h-64">
            <Bar
              data={trimestreChartData}
              options={{ ...chartOptions, indexAxis: 'x' }}
            />
          </div>
        </Card>

        {/* Unidade Chart */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-slate-900">
              Valor por Unidade Gestora
            </h3>
          </div>
          <div className="h-80">
            {Object.keys(analytics.byUnidade).length > 0 ? (
              <Bar data={unidadeChartData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Sem dados para exibir
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Status Table */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Resumo por Status
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-right py-2 font-semibold text-slate-600">
                    Qtde
                  </th>
                  <th className="text-right py-2 font-semibold text-slate-600">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.byStatus).map(([status, data]) => (
                  <tr key={status} className="border-b border-slate-100">
                    <td className="py-3">
                      <span
                        className={`status-badge ${STATUS_CONFIG[status]?.color}`}
                      >
                        {STATUS_CONFIG[status]?.icon}{' '}
                        {STATUS_CONFIG[status]?.label || status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">
                      {data.count}
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-900">
                      {formatCurrency(data.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50">
                  <td className="py-3 font-bold">Total</td>
                  <td className="py-3 text-right font-bold">
                    {demandas.length}
                  </td>
                  <td className="py-3 text-right font-bold text-blue-600">
                    {formatCurrency(analytics.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* By Unidade Table */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Resumo por Unidade
          </h3>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-semibold text-slate-600">
                    Unidade
                  </th>
                  <th className="text-right py-2 font-semibold text-slate-600">
                    Demandas
                  </th>
                  <th className="text-right py-2 font-semibold text-slate-600">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.byUnidade)
                  .sort((a, b) => b[1].valor - a[1].valor)
                  .map(([unidade, data]) => (
                    <tr key={unidade} className="border-b border-slate-100">
                      <td className="py-3 font-medium text-slate-900">
                        {unidade}
                      </td>
                      <td className="py-3 text-right">{data.count}</td>
                      <td className="py-3 text-right font-semibold text-slate-900">
                        {formatCurrency(data.valor)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
