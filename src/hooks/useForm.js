/**
 * Hook customizado para gerenciamento de formulários
 * Fornece estado, validação e handlers para formulários reutilizáveis
 */

import { useState, useCallback, useEffect } from 'react';
import { validateForm, hasErrors } from '../lib/validators';

/**
 * Hook useForm
 *
 * @param {Object} config - Configuração do hook
 * @param {Object} config.initialValues - Valores iniciais do formulário
 * @param {Object} config.validationRules - Regras de validação por campo
 * @param {Function} config.onSubmit - Callback executado ao submeter formulário válido
 * @param {Function} config.transform - Função para transformar valores antes de submeter (opcional)
 * @param {boolean} config.validateOnChange - Validar a cada mudança (padrão: false)
 * @param {boolean} config.validateOnBlur - Validar ao sair do campo (padrão: true)
 * @param {boolean} config.resetOnSubmit - Resetar formulário após submissão bem-sucedida (padrão: false)
 * @param {boolean} config.devMode - Ativar logs em modo desenvolvimento (padrão: process.env.NODE_ENV === 'development')
 *
 * @returns {Object} Estado e métodos do formulário
 *
 * @example
 * const { values, errors, touched, handleChange, handleSubmit, reset } = useForm({
 *   initialValues: { name: '', email: '' },
 *   validationRules: {
 *     name: [validators.required, validators.minLen(3)],
 *     email: [validators.required, validators.email]
 *   },
 *   onSubmit: (values) => console.log('Submitted:', values)
 * });
 */
export function useForm({
  initialValues = {},
  validationRules = {},
  onSubmit,
  transform = null,
  validateOnChange = false,
  validateOnBlur = true,
  resetOnSubmit = false,
  devMode = import.meta.env.DEV,
}) {
  // Estado do formulário
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Log de desenvolvimento
  useEffect(() => {
    if (devMode) {
      console.log('🔵 [useForm] Estado atual:', {
        values,
        errors,
        touched,
        isSubmitting,
        submitCount,
      });
    }
  }, [values, errors, touched, isSubmitting, submitCount, devMode]);

  /**
   * Reseta o formulário para os valores iniciais
   */
  const reset = useCallback(
    (newInitialValues = initialValues) => {
      setValues(newInitialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
      setSubmitCount(0);

      if (devMode) {
        console.log('🔄 [useForm] Formulário resetado:', newInitialValues);
      }
    },
    [initialValues, devMode]
  );

  /**
   * Reseta o formulário quando initialValues mudar (útil para edição)
   */
  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Valida todo o formulário
   */
  const validate = useCallback(() => {
    const newErrors = validateForm(values, validationRules);

    if (devMode) {
      console.log('✅ [useForm] Validação executada:', {
        values,
        errors: newErrors,
        hasErrors: hasErrors(newErrors),
      });
    }

    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [values, validationRules, devMode]);

  /**
   * Valida um campo específico
   */
  const validateField = useCallback(
    (fieldName) => {
      const fieldRules = validationRules[fieldName];
      if (!fieldRules) return;

      const fieldValue = values[fieldName];
      let fieldError = null;

      // Executar validadores do campo
      for (const validator of fieldRules) {
        const error = validator(fieldValue, fieldName);
        if (error) {
          fieldError = error;
          break;
        }
      }

      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
      }));
    },
    [values, validationRules]
  );

  /**
   * Handler para mudanças em campos
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      // Converter valores numéricos
      const finalValue =
        type === 'number' ? (parseFloat(newValue) || 0) : newValue;

      setValues((prev) => ({
        ...prev,
        [name]: finalValue,
      }));

      // Limpar erro quando usuário começa a digitar
      if (errors[name]) {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }

      // Validar durante mudança se configurado
      if (validateOnChange && touched[name]) {
        // Validar após atualização do estado
        setTimeout(() => validateField(name), 0);
      }
    },
    [errors, touched, validateOnChange, validateField]
  );

  /**
   * Handler para blur (quando usuário sai do campo)
   */
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;

      // Marcar campo como tocado
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validar ao sair do campo se configurado
      if (validateOnBlur) {
        validateField(name);
      }
    },
    [validateOnBlur, validateField]
  );

  /**
   * Define valor de um campo programaticamente
   */
  const setFieldValue = useCallback(
    (name, value) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (devMode) {
        console.log(`📝 [useForm] Campo "${name}" atualizado:`, value);
      }
    },
    [devMode]
  );

  /**
   * Define erro de um campo programaticamente
   */
  const setFieldError = useCallback(
    (name, error) => {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    []
  );

  /**
   * Define múltiplos erros de uma vez
   */
  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  /**
   * Handler para submissão do formulário
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      setSubmitCount((prev) => prev + 1);

      // Marcar todos os campos como tocados
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Validar formulário
      const isValid = validate();

      if (!isValid) {
        if (devMode) {
          console.warn('❌ [useForm] Validação falhou:', errors);
        }
        return;
      }

      // Preparar valores para submissão
      const submitValues = transform ? transform(values) : values;

      if (devMode) {
        console.log('🚀 [useForm] Submetendo formulário:', {
          values: submitValues,
          submitCount: submitCount + 1,
        });
      }

      try {
        setIsSubmitting(true);
        await onSubmit(submitValues);

        if (devMode) {
          console.log('✅ [useForm] Submissão bem-sucedida');
        }

        // Resetar formulário após submissão se configurado
        if (resetOnSubmit) {
          reset();
        }
      } catch (error) {
        if (devMode) {
          console.error('❌ [useForm] Erro na submissão:', error);
        }
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      values,
      validate,
      onSubmit,
      transform,
      resetOnSubmit,
      reset,
      devMode,
      errors,
      submitCount,
    ]
  );

  /**
   * Verifica se formulário é válido
   */
  const isValid = !hasErrors(errors);

  /**
   * Verifica se algum campo foi modificado
   */
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    // Estado
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    isValid,
    isDirty,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Métodos
    reset,
    validate,
    validateField,
    setFieldValue,
    setFieldError,
    setFormErrors,
  };
}
