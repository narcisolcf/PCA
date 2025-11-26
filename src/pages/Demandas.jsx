import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { PageHeader } from '../components/Header';
import {
  Button,
  Input,
  Select,
  Card,
  LoadingState,
  Toast,
} from '../components/ui';
import { DemandasTable } from '../components/DemandasTable';
import { DemandaForm } from '../components/DemandaForm';
import { useDemandas, useUnidades } from '../hooks/useData';
import { formatCurrency, STATUS_CONFIG } from '../lib/utils';

export function DemandasPage() {
  const { demandas, loading, createDemanda, updateDemanda, deleteDemanda } =
    useDemandas();
  const { unidades } = useUnidades();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemanda, setEditingDemanda] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [unidadeFilter, setUnidadeFilter] = useState('');

  const filteredDemandas = useMemo(() => {
    return demandas.filter((d) => {
      const matchesSearch =
        !searchTerm ||
        d.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.descricao?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || d.status === statusFilter;
      const matchesUnidade = !unidadeFilter || d.unidade_id === unidadeFilter;

      return matchesSearch && matchesStatus && matchesUnidade;
    });
  }, [demandas, searchTerm, statusFilter, unidadeFilter]);

  const totals = useMemo(() => {
    return {
      count: filteredDemandas.length,
      valor: filteredDemandas.reduce(
        (sum, d) => sum + (parseFloat(d.valor_total) || 0),
        0
      ),
    };
  }, [filteredDemandas]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (demanda = null) => {
    setEditingDemanda(demanda);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDemanda(null);
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);

    try {
      if (editingDemanda) {
        const result = await updateDemanda(editingDemanda.id, data);
        if (result.success) {
          showToast('Demanda atualizada com sucesso!');
          handleCloseModal();
        } else {
          showToast(result.error || 'Erro ao atualizar demanda', 'error');
        }
      } else {
        const result = await createDemanda(data);
        if (result.success) {
          showToast('Demanda criada com sucesso!');
          handleCloseModal();
        } else {
          showToast(result.error || 'Erro ao criar demanda', 'error');
        }
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta demanda?')) return;

    const result = await deleteDemanda(id);
    if (result.success) {
      showToast('Demanda excluída com sucesso!');
    } else {
      showToast(result.error || 'Erro ao excluir demanda', 'error');
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = [
      'Item',
      'Unidade',
      'Quantidade',
      'Valor Unit.',
      'Valor Total',
      'Status',
      'Data Prevista',
    ];
    const rows = filteredDemandas.map((d) => [
      d.item,
      d.unidade?.nome || '',
      d.quantidade,
      d.valor_unitario,
      d.valor_total,
      STATUS_CONFIG[d.status]?.label || d.status,
      d.data_prevista || '',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demandas-pca-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Arquivo exportado com sucesso!');
  };

  if (loading) {
    return <LoadingState message="Carregando demandas..." />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Demandas"
        description="Gerencie as demandas de contratação das unidades gestoras"
        action={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Nova Demanda
          </Button>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Todos os status"
            options={[
              { value: 'pendente', label: '⏳ Pendente' },
              { value: 'em_analise', label: '🔍 Em Análise' },
              { value: 'aprovada', label: '✅ Aprovada' },
              { value: 'rejeitada', label: '❌ Rejeitada' },
            ]}
          />

          <Select
            value={unidadeFilter}
            onChange={(e) => setUnidadeFilter(e.target.value)}
            placeholder="Todas as unidades"
            options={unidades.map((u) => ({ value: u.id, label: u.nome }))}
          />

          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-600">
            Exibindo <strong>{totals.count}</strong> demanda(s)
          </span>
          <span className="text-sm text-slate-600">
            Total:{' '}
            <strong className="text-blue-600">
              {formatCurrency(totals.valor)}
            </strong>
          </span>
          {(searchTerm || statusFilter || unidadeFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setUnidadeFilter('');
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </Card>

      {/* Table */}
      <DemandasTable
        demandas={filteredDemandas}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      <DemandaForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        unidades={unidades}
        initialData={editingDemanda}
        loading={formLoading}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
