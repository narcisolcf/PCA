/**
 * Biblioteca de validadores para formulários
 * Funções puras que retornam string de erro ou null
 */

// Regex para validação de email (RFC 5322 simplificado)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validadores individuais
 * Cada validador retorna uma string de erro ou null se válido
 */
export const validators = {
  /**
   * Valida se o campo é obrigatório (não vazio)
   * @param {any} value - Valor a validar
   * @param {string} fieldName - Nome do campo para mensagem de erro
   * @returns {string|null} Mensagem de erro ou null
   */
  required: (value, fieldName = 'Campo') => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} é obrigatório`
    }
    if (typeof value === 'string' && value.trim() === '') {
      return `${fieldName} não pode estar vazio`
    }
    return null
  },

  /**
   * Valida formato de email
   * @param {string} value - Email a validar
   * @returns {string|null} Mensagem de erro ou null
   */
  email: (value) => {
    if (!value) return null // Se vazio, não valida (use required separadamente)
    if (!EMAIL_REGEX.test(value.trim())) {
      return 'E-mail inválido'
    }
    return null
  },

  /**
   * Cria validador de tamanho mínimo
   * @param {number} min - Tamanho mínimo
   * @returns {function} Função validadora
   */
  minLen: (min) => (value, fieldName = 'Campo') => {
    if (!value) return null // Se vazio, não valida (use required separadamente)
    const str = String(value).trim()
    if (str.length < min) {
      return `${fieldName} deve ter pelo menos ${min} caractere${min > 1 ? 's' : ''}`
    }
    return null
  },

  /**
   * Cria validador de tamanho máximo
   * @param {number} max - Tamanho máximo
   * @returns {function} Função validadora
   */
  maxLen: (max) => (value, fieldName = 'Campo') => {
    if (!value) return null
    const str = String(value).trim()
    if (str.length > max) {
      return `${fieldName} deve ter no máximo ${max} caracteres`
    }
    return null
  },

  /**
   * Valida se número é positivo (> 0)
   * @param {number} value - Número a validar
   * @param {string} fieldName - Nome do campo
   * @returns {string|null} Mensagem de erro ou null
   */
  positive: (value, fieldName = 'Valor') => {
    const num = Number(value)
    if (isNaN(num)) {
      return `${fieldName} deve ser um número válido`
    }
    if (num <= 0) {
      return `${fieldName} deve ser maior que zero`
    }
    return null
  },

  /**
   * Valida se número é não-negativo (>= 0)
   * @param {number} value - Número a validar
   * @param {string} fieldName - Nome do campo
   * @returns {string|null} Mensagem de erro ou null
   */
  nonNegative: (value, fieldName = 'Valor') => {
    const num = Number(value)
    if (isNaN(num)) {
      return `${fieldName} deve ser um número válido`
    }
    if (num < 0) {
      return `${fieldName} não pode ser negativo`
    }
    return null
  },

  /**
   * Cria validador de valor máximo
   * @param {number} max - Valor máximo permitido
   * @returns {function} Função validadora
   */
  maxValue: (max) => (value, fieldName = 'Valor') => {
    const num = Number(value)
    if (isNaN(num)) return null
    if (num > max) {
      return `${fieldName} não pode exceder ${max.toLocaleString('pt-BR')}`
    }
    return null
  },

  /**
   * Valida formato de telefone brasileiro (opcional)
   * @param {string} value - Telefone a validar
   * @returns {string|null} Mensagem de erro ou null
   */
  phone: (value) => {
    if (!value) return null
    // Remove caracteres não numéricos
    const cleaned = value.replace(/\D/g, '')
    // Aceita 10 ou 11 dígitos (com ou sem DDD)
    if (cleaned.length < 10 || cleaned.length > 11) {
      return 'Telefone inválido (use formato: (99) 99999-9999)'
    }
    return null
  },

  /**
   * Valida se data não está no passado
   * @param {string} value - Data em formato YYYY-MM-DD
   * @returns {string|null} Mensagem de erro ou null
   */
  notPastDate: (value, fieldName = 'Data') => {
    if (!value) return null
    const inputDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (inputDate < today) {
      return `${fieldName} não pode ser no passado`
    }
    return null
  }
}

/**
 * Valida um objeto de dados contra um conjunto de regras
 * @param {Object} data - Dados do formulário
 * @param {Object} rules - Regras de validação
 * @returns {Object} Objeto com erros (campo: mensagem) ou vazio se tudo válido
 *
 * @example
 * const errors = validateForm(
 *   { nome: '', email: 'invalid' },
 *   {
 *     nome: [validators.required, validators.minLen(3)],
 *     email: [validators.required, validators.email]
 *   }
 * )
 * // errors = { nome: 'Campo é obrigatório', email: 'E-mail inválido' }
 */
export function validateForm(data, rules) {
  const errors = {}

  for (const [field, validatorList] of Object.entries(rules)) {
    const value = data[field]

    // Executar cada validador para o campo
    for (const validator of validatorList) {
      const error = validator(value, field)
      if (error) {
        errors[field] = error
        break // Para no primeiro erro encontrado
      }
    }
  }

  return errors
}

/**
 * Verifica se há erros no objeto de erros
 * @param {Object} errors - Objeto de erros retornado por validateForm
 * @returns {boolean} true se há erros, false caso contrário
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}

/**
 * Limpa um erro específico do objeto de erros
 * @param {Object} errors - Objeto de erros
 * @param {string} field - Campo a limpar
 * @returns {Object} Novo objeto de erros sem o campo especificado
 */
export function clearError(errors, field) {
  const { [field]: _, ...rest } = errors
  return rest
}
