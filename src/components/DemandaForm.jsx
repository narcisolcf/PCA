import { useEffect } from 'react';
import { Button, Input, Textarea, Select, Modal } from './ui';
import { formatCurrency, getQuarter, PRIORITY_CONFIG } from '../lib/utils';
import { validators } from '../lib/validators';
import { useForm } from '../hooks';

export function DemandaForm({
  isOpen,
  onClose,
  onSubmit,
  unidades = [],
  initialData = null,
  loading = false,
}) {
  // Preparar valores iniciais do formulário
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

  // Regras de validação
  const validationRules = {
    unidade_id: [validators.required],
    item: [validators.required, validators.minLen(3), validators.maxLen(255)],
    descricao: [validators.maxLen(5000)],
    justificativa: [validators.maxLen(5000)],
    quantidade: [
      validators.required,
      validators.positive,
      validators.maxValue(999999),
    ],
    valor_unitario: [
      validators.required,
      validators.nonNegative,
      validators.maxValue(999999999.99),
    ],
  };

  // Hook useForm com validação e handlers
  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: getInitialValues(),
    validationRules,
    onSubmit: (formValues) => {
      const trimestre = getQuarter(formValues.data_prevista);
      onSubmit({ ...formValues, trimestre });
    },
    devMode: import.meta.env.DEV, // Console.log apenas em desenvolvimento
  });

  // Reset form quando modal fecha ou initialData muda
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
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unidade Gestora */}
        <Select
          label="Unidade Gestora *"
          name="unidade_id"
          value={values.unidade_id}
          onChange={handleChange}
          error={errors.unidade_id}
          options={unidades.map((u) => ({ value: u.id, label: u.nome }))}
          placeholder="Selecione a secretaria..."
        />

        {/* Item */}
        <Input
          label="Item / Serviço *"
          name="item"
          value={values.item}
          onChange={handleChange}
          error={errors.item}
          placeholder="Ex: Papel A4, Manutenção de Ar-Condicionado..."
        />

        {/* Descrição */}
        <Textarea
          label="Descrição Detalhada"
          name="descricao"
          value={values.descricao}
          onChange={handleChange}
          placeholder="Especificações técnicas, marca de referência..."
          rows={3}
        />

        {/* Justificativa */}
        <Textarea
          label="Justificativa"
          name="justificativa"
          value={values.justificativa}
          onChange={handleChange}
          placeholder="Por que esta contratação é necessária?"
          rows={3}
        />

        {/* Grid: Quantidade, Valor, Data */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Quantidade *"
            name="quantidade"
            type="number"
            min="1"
            value={values.quantidade}
            onChange={handleChange}
            error={errors.quantidade}
          />

          <Input
            label="Valor Unitário (R$) *"
            name="valor_unitario"
            type="number"
            step="0.01"
            min="0"
            value={values.valor_unitario}
            onChange={handleChange}
            error={errors.valor_unitario}
            className="currency-input"
          />

          <Input
            label="Data Prevista"
            name="data_prevista"
            type="date"
            value={values.data_prevista}
            onChange={handleChange}
          />
        </div>

        {/* Grid: Prioridade, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Prioridade"
            name="prioridade"
            value={values.prioridade}
            onChange={handleChange}
            options={Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
              value,
              label: `${config.icon} ${config.label}`,
            }))}
          />

          {initialData && (
            <Select
              label="Status"
              name="status"
              value={values.status}
              onChange={handleChange}
              options={[
                { value: 'pendente', label: '⏳ Pendente' },
                { value: 'em_analise', label: '🔍 Em Análise' },
                { value: 'aprovada', label: '✅ Aprovada' },
                { value: 'rejeitada', label: '❌ Rejeitada' },
              ]}
            />
          )}
        </div>

        {/* Valor Total */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Valor Total Estimado
            </span>
            <span className="text-2xl font-bold text-blue-900">
              {formatCurrency(valorTotal)}
            </span>
          </div>
          {values.data_prevista && (
            <p className="text-xs text-blue-600 mt-2">
              Trimestre previsto: {getQuarter(values.data_prevista)} de{' '}
              {new Date(values.data_prevista).getFullYear()}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Salvar Alterações' : 'Criar Demanda'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
