import { useEffect } from 'react';
import { Button, Input, Textarea, Select, Modal } from './ui';
import { formatCurrency, getQuarter, PRIORITY_CONFIG } from '../lib/utils';
import { validators } from '../lib/validators';
import { useForm } from '../hooks';
import { Calendar, TrendingUp } from 'lucide-react'; // Ícones adicionais

export function DemandaForm({
  isOpen,
  onClose,
  onSubmit,
  unidades = [],
  initialData = null,
  loading = false,
}) {
  const getInitialValues = () => {
    if (initialData) {
      return {
        unidade_id: initialData.unidade_id || '',
        item: initialData.item || '',
        descricao: initialData.descricao || '',
        justificativa: initialData.justificativa || '',
        quantidade: initialData.quantidade || 1,
        valor_unitario: initialData.valor_unitario || 0,
        data_prevista: initialData.data_prevista?.split('T')[0] || '',
        prioridade: initialData.prioridade || 3,
        status: initialData.status || 'pendente',
      };
    }
    return {
      unidade_id: '',
      item: '',
      descricao: '',
      justificativa: '',
      quantidade: 1,
      valor_unitario: 0,
      data_prevista: '',
      prioridade: 3,
      status: 'pendente',
    };
  };

  const validationRules = {
    unidade_id: [validators.required],
    item: [validators.required, validators.minLen(3), validators.maxLen(255)],
    descricao: [validators.maxLen(5000)],
    justificativa: [validators.maxLen(5000)],
    quantidade: [validators.required, validators.positive, validators.maxValue(999999)],
    valor_unitario: [validators.required, validators.nonNegative, validators.maxValue(999999999.99)],
  };

  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: getInitialValues(),
    validationRules,
    onSubmit: (formValues) => {
      const trimestre = getQuarter(formValues.data_prevista);
      onSubmit({ ...formValues, trimestre });
    },
    devMode: import.meta.env.DEV,
  });

  useEffect(() => {
    if (isOpen) {
      reset(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const valorTotal = values.quantidade * values.valor_unitario;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Demanda' : 'Nova Demanda'}
      size="lg"
      variant="glass" // Estilo Glass
    >
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Seção 1: Informações Principais */}
        <div className="grid grid-cols-1 gap-8">
          <Select
            label="Unidade Gestora"
            name="unidade_id"
            value={values.unidade_id}
            onChange={handleChange}
            error={errors.unidade_id}
            options={unidades.map((u) => ({ value: u.id, label: u.nome }))}
            placeholder="Selecione a secretaria responsável..."
            size="lg"
            autoFocus
          />

          <Input
            label="Item ou Serviço"
            name="item"
            value={values.item}
            onChange={handleChange}
            error={errors.item}
            placeholder="Ex: Aquisição de notebooks..."
            size="lg"
          />
        </div>

        {/* Seção 2: Detalhes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Textarea
            label="Descrição Técnica"
            name="descricao"
            value={values.descricao}
            onChange={handleChange}
            placeholder="Especificações detalhadas..."
            rows={4}
          />
          <Textarea
            label="Justificativa da Compra"
            name="justificativa"
            value={values.justificativa}
            onChange={handleChange}
            placeholder="Por que é necessário? Qual o impacto?"
            rows={4}
          />
        </div>

        {/* Seção 3: Valores e Prazos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Input
            label="Quantidade"
            name="quantidade"
            type="number"
            min="1"
            value={values.quantidade}
            onChange={handleChange}
            error={errors.quantidade}
            size="lg"
          />

          <Input
            label="Valor Unitário (R$)"
            name="valor_unitario"
            type="number"
            step="0.01"
            min="0"
            value={values.valor_unitario}
            onChange={handleChange}
            error={errors.valor_unitario}
            size="lg"
          />

          <Input
            label="Previsão de Compra"
            name="data_prevista"
            type="date"
            value={values.data_prevista}
            onChange={handleChange}
            size="lg"
          />
        </div>

        {/* Seção 4: Metadados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Select
            label="Nível de Prioridade"
            name="prioridade"
            value={values.prioridade}
            onChange={handleChange}
            options={Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
              value,
              label: `${config.icon} ${config.label}`,
            }))}
            size="lg"
          />

          {initialData && (
            <Select
              label="Status Atual"
              name="status"
              value={values.status}
              onChange={handleChange}
              options={[
                { value: 'pendente', label: '⏳ Pendente' },
                { value: 'em_analise', label: '🔍 Em Análise' },
                { value: 'aprovada', label: '✅ Aprovada' },
                { value: 'rejeitada', label: '❌ Rejeitada' },
              ]}
              size="lg"
            />
          )}
        </div>

        {/* Card de Valor Total (Highlight) */}
        <div className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-8 shadow-inner group">
          {/* Background Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Investimento Total Estimado
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-light tracking-tight text-slate-900">
                  {formatCurrency(valorTotal)}
                </span>
              </div>
            </div>

            {values.data_prevista && (
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm">
                <Calendar className="w-4 h-4 text-primary-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-400 leading-none">
                    Previsão
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {getQuarter(values.data_prevista)} / {new Date(values.data_prevista).getFullYear()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            size="lg"
            className="text-slate-500 hover:text-slate-800"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="px-8 shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all"
          >
            {initialData ? 'Salvar Alterações' : 'Confirmar Demanda'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}