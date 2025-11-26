/**
 * Sistema de Tratamento de Erros
 * Converte erros técnicos do Supabase/PostgreSQL em mensagens amigáveis
 */

// Mapa de códigos de erro PostgreSQL para mensagens em português
const POSTGRES_ERROR_CODES = {
  // Violações de Constraints
  23505:
    'Já existe um registro com estes dados. Por favor, verifique se não está duplicado.',
  23503:
    'Não é possível excluir este registro pois existem outros dados vinculados a ele.',
  23502: 'Um campo obrigatório não foi preenchido.',
  23514: 'Os dados fornecidos não atendem aos critérios de validação.',

  // Permissões e RLS
  42501: 'Você não tem permissão para realizar esta ação.',
  '42P01': 'A tabela solicitada não existe no banco de dados.',

  // Dados
  '22P02': 'Formato de dados inválido.',
  22001: 'O texto fornecido é muito longo para este campo.',

  // Conexão
  '08000': 'Erro de conexão com o banco de dados.',
  '08006': 'Conexão perdida com o banco de dados.',
  '57P03': 'O banco de dados está indisponível no momento.',
};

// Códigos de erro específicos do Supabase/PostgREST
const SUPABASE_ERROR_CODES = {
  PGRST116: 'Nenhum resultado encontrado.',
  PGRST204: 'Operação realizada, mas sem dados retornados.',
  PGRST301: 'Múltiplos resultados encontrados quando apenas um era esperado.',
};

/**
 * Categorias de erro para tratamento diferenciado
 */
const ERROR_TYPES = {
  NETWORK: 'network',
  DATABASE: 'database',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  UNKNOWN: 'unknown',
};

/**
 * Ícones para cada tipo de erro (para usar em Toasts)
 */
const ERROR_ICONS = {
  [ERROR_TYPES.NETWORK]: '⚠️',
  [ERROR_TYPES.DATABASE]: '💾',
  [ERROR_TYPES.VALIDATION]: '❌',
  [ERROR_TYPES.PERMISSION]: '🔒',
  [ERROR_TYPES.NOT_FOUND]: '🔍',
  [ERROR_TYPES.UNKNOWN]: '🐛',
};

/**
 * Determina o tipo de erro baseado no código
 * @param {string} code - Código do erro
 * @returns {string} Tipo do erro
 */
function getErrorType(code) {
  if (!code) return ERROR_TYPES.UNKNOWN;

  // Erros de rede (HTTP status codes)
  if (code >= 500 && code < 600) return ERROR_TYPES.NETWORK;
  if (code === 'ECONNREFUSED' || code === 'ENOTFOUND')
    return ERROR_TYPES.NETWORK;

  // Erros de permissão
  if (code === '42501' || code === 401 || code === 403)
    return ERROR_TYPES.PERMISSION;

  // Erros de não encontrado
  if (code === 'PGRST116' || code === 404) return ERROR_TYPES.NOT_FOUND;

  // Erros de validação (constraints)
  if (code.startsWith('23')) return ERROR_TYPES.VALIDATION;

  // Erros de banco de dados
  if (code.startsWith('22') || code.startsWith('42') || code.startsWith('08')) {
    return ERROR_TYPES.DATABASE;
  }

  return ERROR_TYPES.UNKNOWN;
}

/**
 * Extrai mensagem amigável do erro do Supabase
 * @param {Object} error - Objeto de erro do Supabase
 * @returns {string} Mensagem amigável
 */
function getErrorMessage(error) {
  // Se já é uma string, retorna direto
  if (typeof error === 'string') return error;

  // Tenta extrair o código de erro
  const code = error.code || error.status || error.statusCode;

  // Verifica mapeamentos conhecidos
  if (code) {
    // Códigos PostgreSQL
    if (POSTGRES_ERROR_CODES[code]) {
      return POSTGRES_ERROR_CODES[code];
    }

    // Códigos Supabase/PostgREST
    if (SUPABASE_ERROR_CODES[code]) {
      return SUPABASE_ERROR_CODES[code];
    }

    // Erros HTTP genéricos
    if (code >= 500) {
      return 'O servidor está temporariamente indisponível. Tente novamente em alguns instantes.';
    }
    if (code === 404) {
      return 'O recurso solicitado não foi encontrado.';
    }
    if (code === 401 || code === 403) {
      return 'Você não tem permissão para acessar este recurso.';
    }
    if (code === 400) {
      return 'Os dados enviados são inválidos. Verifique e tente novamente.';
    }
  }

  // Mensagens específicas do Supabase
  if (error.message) {
    const msg = error.message.toLowerCase();

    // Problemas de conexão
    if (
      msg.includes('fetch') ||
      msg.includes('network') ||
      msg.includes('conexão')
    ) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
    }

    // Timeout
    if (msg.includes('timeout')) {
      return 'A operação demorou muito e foi cancelada. Tente novamente.';
    }

    // Duplicate key
    if (msg.includes('duplicate') || msg.includes('duplicat')) {
      return 'Já existe um registro com estes dados.';
    }

    // Foreign key
    if (msg.includes('foreign key') || msg.includes('fk_')) {
      return 'Não é possível excluir este registro pois existem outros dados vinculados a ele.';
    }

    // Retorna a mensagem original se for legível
    if (error.message.length < 200 && !error.message.includes('PGRST')) {
      return error.message;
    }
  }

  // Mensagem genérica de fallback
  return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}

/**
 * Handler principal de erros do Supabase
 * @param {Error|Object} error - Erro capturado
 * @param {Object} options - Opções de configuração
 * @returns {Object} Objeto padronizado de erro
 */
export function handleSupabaseError(error, options = {}) {
  const {
    showDebug = import.meta.env.DEV, // Mostra debug apenas em desenvolvimento
    context = '', // Contexto da operação (ex: "criar demanda")
  } = options;

  // Extrai informações do erro
  const code = error.code || error.status || error.statusCode;
  const errorType = getErrorType(code);
  const message = getErrorMessage(error);
  const icon = ERROR_ICONS[errorType];

  // Log detalhado para desenvolvimento
  if (showDebug) {
    console.group(`🔴 Erro ${context ? `(${context})` : ''}`);
    console.error('Tipo:', errorType);
    console.error('Código:', code || 'N/A');
    console.error('Mensagem original:', error.message || error);
    console.error('Mensagem tratada:', message);
    console.error('Objeto completo:', error);
    console.groupEnd();
  }

  // Retorna objeto padronizado
  return {
    success: false,
    error: message,
    errorType,
    errorCode: code,
    errorIcon: icon,
    // Inclui detalhes técnicos apenas em dev
    ...(showDebug && { _debug: error }),
  };
}

/**
 * Verifica se o erro é de rede (passível de retry)
 * @param {Object} errorResult - Resultado do handleSupabaseError
 * @returns {boolean}
 */
export function isNetworkError(errorResult) {
  return errorResult.errorType === ERROR_TYPES.NETWORK;
}

/**
 * Verifica se o erro é de permissão
 * @param {Object} errorResult - Resultado do handleSupabaseError
 * @returns {boolean}
 */
export function isPermissionError(errorResult) {
  return errorResult.errorType === ERROR_TYPES.PERMISSION;
}

/**
 * Verifica se o erro é de validação
 * @param {Object} errorResult - Resultado do handleSupabaseError
 * @returns {boolean}
 */
export function isValidationError(errorResult) {
  return errorResult.errorType === ERROR_TYPES.VALIDATION;
}

/**
 * Helper para retry de operações com falha de rede
 * @param {Function} operation - Função async a executar
 * @param {Object} options - Opções de retry
 * @returns {Promise} Resultado da operação
 */
export async function retryOnNetworkError(operation, options = {}) {
  const { maxRetries = 1, delayMs = 2000, onRetry = null } = options;

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const errorResult = handleSupabaseError(error);

      // Se não é erro de rede, não tenta novamente
      if (!isNetworkError(errorResult)) {
        throw error;
      }

      // Se já esgotou as tentativas, lança o erro
      if (attempt >= maxRetries) {
        throw error;
      }

      // Aguarda antes de tentar novamente
      if (onRetry) {
        onRetry(attempt + 1, maxRetries + 1);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * (attempt + 1))
      );
    }
  }

  throw lastError;
}

/**
 * Exporta constantes úteis
 */
export { ERROR_TYPES, ERROR_ICONS };
