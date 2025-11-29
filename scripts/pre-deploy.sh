#!/bin/bash

# =============================================================================
# Script de Pré-Deploy - PCA App
# =============================================================================
#
# OBJETIVO: Executar validações automáticas antes do deploy para produção
#
# COMO USAR:
#   chmod +x scripts/pre-deploy.sh
#   ./scripts/pre-deploy.sh
#
# =============================================================================

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0
WARNINGS=0

# Funções auxiliares
function log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

function log_success() {
  echo -e "${GREEN}✅ $1${NC}"
  ((PASSED++))
}

function log_error() {
  echo -e "${RED}❌ $1${NC}"
  ((FAILED++))
}

function log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
  ((WARNINGS++))
}

function separator() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
}

# =============================================================================
# INÍCIO DO SCRIPT
# =============================================================================

clear
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║            🚀 PRÉ-DEPLOY CHECKLIST - PCA APP 🚀                  ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
log_info "Iniciando validações automáticas..."
separator

# =============================================================================
# FASE 1: VALIDAÇÕES TÉCNICAS
# =============================================================================

echo "📋 FASE 1: Validações Técnicas"
echo ""

# 1.1 - Build de Produção
log_info "1.1 - Testando build de produção..."
if npm run build > /dev/null 2>&1; then
  log_success "Build de produção concluído sem erros"

  # Verificar tamanho do bundle
  BUNDLE_SIZE=$(du -sh dist/ | awk '{print $1}')
  log_info "Tamanho do bundle: $BUNDLE_SIZE"

  # Verificar se dist/index.html existe
  if [ -f "dist/index.html" ]; then
    log_success "dist/index.html gerado corretamente"
  else
    log_error "dist/index.html não encontrado"
  fi
else
  log_error "Build de produção falhou"
fi

# 1.2 - Linting
log_info "1.2 - Executando ESLint..."
if npm run lint > /dev/null 2>&1; then
  log_success "ESLint: 0 erros"
else
  log_warning "ESLint encontrou problemas (execute 'npm run lint' para detalhes)"
fi

# 1.3 - Formatação
log_info "1.3 - Verificando formatação (Prettier)..."
if npm run format:check > /dev/null 2>&1; then
  log_success "Todos os arquivos estão formatados corretamente"
else
  log_warning "Alguns arquivos precisam de formatação (execute 'npm run format')"
fi

# 1.4 - Auditoria de Segurança
log_info "1.4 - Executando npm audit..."
AUDIT_OUTPUT=$(npm audit 2>&1 || true)

if echo "$AUDIT_OUTPUT" | grep -q "found 0 vulnerabilities"; then
  log_success "npm audit: 0 vulnerabilidades encontradas"
elif echo "$AUDIT_OUTPUT" | grep -q "critical"; then
  log_error "npm audit: vulnerabilidades CRÍTICAS encontradas"
  echo "$AUDIT_OUTPUT" | grep "critical"
elif echo "$AUDIT_OUTPUT" | grep -q "high"; then
  log_warning "npm audit: vulnerabilidades ALTAS encontradas (execute 'npm audit' para detalhes)"
else
  log_success "npm audit: apenas vulnerabilidades baixas/médias (aceitável)"
fi

# 1.5 - Testes (se existirem)
log_info "1.5 - Verificando testes unitários..."
if [ -d "src/tests" ] && [ "$(ls -A src/tests 2>/dev/null)" ]; then
  if npm run test > /dev/null 2>&1; then
    log_success "Todos os testes passaram"

    # Verificar cobertura (se disponível)
    if [ -f "coverage/coverage-summary.json" ]; then
      COVERAGE=$(cat coverage/coverage-summary.json | grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*' | awk -F: '{print $3"/"$2}')
      log_info "Cobertura de código: $COVERAGE linhas"
    fi
  else
    log_error "Alguns testes falharam"
  fi
else
  log_warning "Testes unitários não implementados (recomendado para produção)"
fi

separator

# =============================================================================
# FASE 2: VALIDAÇÕES DE SEGURANÇA
# =============================================================================

echo "🔐 FASE 2: Validações de Segurança"
echo ""

# 2.1 - Variáveis de Ambiente
log_info "2.1 - Verificando variáveis de ambiente..."
if [ -f ".env" ]; then
  log_success ".env existe"

  # Verificar se .env está no .gitignore
  if grep -q ".env" .gitignore 2>/dev/null; then
    log_success ".env está no .gitignore"
  else
    log_error ".env NÃO está no .gitignore (risco de vazamento de credenciais)"
  fi

  # Verificar variáveis obrigatórias
  if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
    log_success "Variáveis obrigatórias presentes no .env"
  else
    log_error "Variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY ausentes no .env"
  fi
else
  log_warning ".env não encontrado (certifique-se de configurar variáveis no Vercel)"
fi

# 2.2 - Buscar credenciais hardcoded
log_info "2.2 - Buscando credenciais hardcoded no código..."
HARDCODED=0

if grep -r "password" --include="*.js" --include="*.jsx" src/ > /dev/null 2>&1; then
  log_warning "Palavra 'password' encontrada no código (verificar se não está hardcoded)"
  ((HARDCODED++))
fi

if grep -r "secret" --include="*.js" --include="*.jsx" src/ > /dev/null 2>&1; then
  log_warning "Palavra 'secret' encontrada no código (verificar se não está hardcoded)"
  ((HARDCODED++))
fi

if [ $HARDCODED -eq 0 ]; then
  log_success "Nenhuma credencial hardcoded encontrada"
fi

# 2.3 - Verificar console.log em produção
log_info "2.3 - Buscando console.log no código..."
CONSOLE_COUNT=$(grep -r "console.log" --include="*.js" --include="*.jsx" src/ 2>/dev/null | wc -l)

if [ "$CONSOLE_COUNT" -gt 0 ]; then
  log_warning "Encontrados $CONSOLE_COUNT console.log no código (considere remover para produção)"
else
  log_success "Nenhum console.log encontrado"
fi

separator

# =============================================================================
# FASE 3: VALIDAÇÕES DE ARQUIVOS CRÍTICOS
# =============================================================================

echo "📁 FASE 3: Validações de Arquivos Críticos"
echo ""

# Verificar arquivos essenciais
CRITICAL_FILES=(
  "supabase-schema.sql"
  "enable-rls.sql"
  "vercel.json"
  "README.md"
  "INSTALL.md"
  "SECURITY.md"
  "DEPLOY.md"
)

for FILE in "${CRITICAL_FILES[@]}"; do
  if [ -f "$FILE" ]; then
    log_success "$FILE existe"
  else
    log_error "$FILE não encontrado"
  fi
done

separator

# =============================================================================
# FASE 4: VALIDAÇÕES DE DOCUMENTAÇÃO
# =============================================================================

echo "📚 FASE 4: Validações de Documentação"
echo ""

# Verificar documentação técnica
DOCS=(
  "README.md"
  "INSTALL.md"
  "CONFIG.md"
  "SECURITY.md"
  "PERFORMANCE.md"
  "BACKUP.md"
  "DEPLOY.md"
)

DOCS_FOUND=0
for DOC in "${DOCS[@]}"; do
  if [ -f "$DOC" ]; then
    ((DOCS_FOUND++))
  fi
done

log_info "Documentação encontrada: $DOCS_FOUND/${#DOCS[@]} arquivos"

if [ "$DOCS_FOUND" -eq "${#DOCS[@]}" ]; then
  log_success "Toda a documentação técnica está presente"
elif [ "$DOCS_FOUND" -ge $((${#DOCS[@]} * 3 / 4)) ]; then
  log_warning "Documentação parcialmente completa ($DOCS_FOUND/${#DOCS[@]})"
else
  log_error "Documentação incompleta ($DOCS_FOUND/${#DOCS[@]})"
fi

separator

# =============================================================================
# RESUMO FINAL
# =============================================================================

echo "═══════════════════════════════════════════════════════════════════"
echo "                        📊 RESUMO FINAL                             "
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Passou:    $PASSED${NC}"
echo -e "${YELLOW}⚠️  Avisos:    $WARNINGS${NC}"
echo -e "${RED}❌ Falhou:    $FAILED${NC}"
echo ""

# Decisão final
if [ "$FAILED" -eq 0 ]; then
  if [ "$WARNINGS" -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                   ║${NC}"
    echo -e "${GREEN}║       ✅ SISTEMA PRONTO PARA DEPLOY EM PRODUÇÃO ✅               ║${NC}"
    echo -e "${GREEN}║                                                                   ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Próximos passos:"
    echo "  1. Executar deploy: npm run build && vercel --prod"
    echo "  2. Executar smoke tests (ver PRE_DEPLOY_CHECKLIST.md - FASE 5.3)"
    echo "  3. Monitorar primeiras 24h (Vercel Analytics + Sentry)"
    echo ""
    exit 0
  else
    echo -e "${YELLOW}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║                                                                   ║${NC}"
    echo -e "${YELLOW}║      ⚠️  SISTEMA APROVADO COM RESSALVAS ⚠️                       ║${NC}"
    echo -e "${YELLOW}║                                                                   ║${NC}"
    echo -e "${YELLOW}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Avisos encontrados: $WARNINGS"
    echo "Revise os avisos acima e decida se são aceitáveis para produção."
    echo ""
    echo "Para prosseguir com deploy:"
    echo "  1. Revisar avisos acima"
    echo "  2. Se aceitável: npm run build && vercel --prod"
    echo ""
    exit 0
  fi
else
  echo -e "${RED}╔═══════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║                                                                   ║${NC}"
  echo -e "${RED}║         ❌ DEPLOY BLOQUEADO - CORRIJA OS ERROS ❌                ║${NC}"
  echo -e "${RED}║                                                                   ║${NC}"
  echo -e "${RED}╚═══════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Erros críticos encontrados: $FAILED"
  echo "Corrija os erros acima antes de fazer deploy para produção."
  echo ""
  echo "Para re-executar validações:"
  echo "  ./scripts/pre-deploy.sh"
  echo ""
  exit 1
fi
