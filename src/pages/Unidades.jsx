import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Building2,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { PageHeader } from '../components/Header';
import {
  Button,
  Card,
  Input,
  Modal,
  LoadingState,
  EmptyState,
  Toast,
} from '../components/ui';
import { useUnidades, useDemandas } from '../hooks/useData';
import { formatCurrency } from '../lib/utils';
import { validators, validateForm, hasErrors } from '../lib/validators';

function UnidadeForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    sigla: initialData?.sigla || '',
    responsavel: initialData?.responsavel || '',
    email: initialData?.email || '',
    telefone: initialData?.telefone || '',
  });

  const [errors, setErrors] = useState({});

  // Resetar erros quando modal abre/fecha ou quando muda initialData
  useEffect(() => {
    const newFormData = {
      nome: initialData?.nome || '',
      sigla: initialData?.sigla || '',
      responsavel: initialData?.responsavel || '',
      email: initialData?.email || '',
      telefone: initialData?.telefone || '',
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(newFormData);
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpar erro do campo quando usuário digita
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const validationRules = {
      nome: [validators.required, validators.minLen(3), validators.maxLen(255)],
      sigla: [validators.maxLen(20)],
      responsavel: [validators.maxLen(255)],
      email: [validators.email, validators.maxLen(255)],
      telefone: [validators.phone],
    };

    const newErrors = validateForm(formData, validationRules);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Unidade' : 'Nova Unidade Gestora'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Unidade *"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Ex: Secretaria de Saúde"
          error={errors.nome}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Sigla"
            name="sigla"
            value={formData.sigla}
            onChange={handleChange}
            placeholder="Ex: SEMUS"
            error={errors.sigla}
          />
          <Input
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(99) 99999-9999"
            error={errors.telefone}
          />
        </div>

        <Input
          label="Responsável"
          name="responsavel"
          value={formData.responsavel}
          onChange={handleChange}
          placeholder="Nome do gestor responsável"
          error={errors.responsavel}
        />

        <Input
          label="E-mail"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@municipio.gov.br"
          error={errors.email}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Salvar Alterações' : 'Criar Unidade'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function UnidadesPage() {
  const { unidades, loading, createUnidade, updateUnidade, deleteUnidade } =
    useUnidades();
  const { demandas } = useDemandas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (unidade = null) => {
    setEditingUnidade(unidade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUnidade(null);
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);

    try {
      if (editingUnidade) {
        const result = await updateUnidade(editingUnidade.id, data);
        if (result.success) {
          showToast('Unidade atualizada com sucesso!');
          handleCloseModal();
        } else {
          showToast(result.error || 'Erro ao atualizar unidade', 'error');
        }
      } else {
        const result = await createUnidade(data);
        if (result.success) {
          showToast('Unidade criada com sucesso!');
          handleCloseModal();
        } else {
          showToast(result.error || 'Erro ao criar unidade', 'error');
        }
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const hasDemandas = demandas.some((d) => d.unidade_id === id);
    if (hasDemandas) {
      showToast(
        'Não é possível excluir uma unidade com demandas cadastradas',
        'error'
      );
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir esta unidade?')) return;

    const result = await deleteUnidade(id);
    if (result.success) {
      showToast('Unidade excluída com sucesso!');
    } else {
      showToast(result.error || 'Erro ao excluir unidade', 'error');
    }
  };

  // Calculate stats per unit
  const getUnidadeStats = (unidadeId) => {
    const unidadeDemandas = demandas.filter((d) => d.unidade_id === unidadeId);
    return {
      count: unidadeDemandas.length,
      valor: unidadeDemandas.reduce(
        (sum, d) => sum + (parseFloat(d.valor_total) || 0),
        0
      ),
    };
  };

  if (loading) {
    return <LoadingState message="Carregando unidades..." />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Unidades Gestoras"
        description="Cadastre e gerencie as secretarias e órgãos do município"
        action={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Nova Unidade
          </Button>
        }
      />

      {unidades.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon="🏛️"
            title="Nenhuma unidade cadastrada"
            description="Comece cadastrando as secretarias e órgãos que farão parte do PCA."
            action={
              <Button onClick={() => handleOpenModal()}>+ Nova Unidade</Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unidades.map((unidade) => {
            const stats = getUnidadeStats(unidade.id);

            return (
              <Card key={unidade.id} className="p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(unidade)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(unidade.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  {unidade.nome}
                </h3>
                {unidade.sigla && (
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium mb-3">
                    {unidade.sigla}
                  </span>
                )}

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  {unidade.responsavel && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      {unidade.responsavel}
                    </div>
                  )}
                  {unidade.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a
                        href={`mailto:${unidade.email}`}
                        className="hover:text-blue-600"
                      >
                        {unidade.email}
                      </a>
                    </div>
                  )}
                  {unidade.telefone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {unidade.telefone}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      Demandas
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {stats.count}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      Valor Total
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(stats.valor)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <UnidadeForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingUnidade}
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
