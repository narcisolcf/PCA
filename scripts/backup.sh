#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# PCA Database Backup Script
# ============================================================================
# Usage: ./backup.sh [output_directory]
# Requires: SUPABASE_DB_URL environment variable
# ============================================================================

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
readonly BACKUP_DIR="${1:-$PROJECT_ROOT}"
readonly BACKUP_FILE="${BACKUP_DIR}/backup_pca_${TIMESTAMP}.sql"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

check_dependencies() {
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump not found. Install PostgreSQL client 14+"
        log_info "Debian/Ubuntu: sudo apt install postgresql-client"
        log_info "macOS: brew install postgresql"
        log_info "Or use Docker: docker run --rm postgres:14 pg_dump --version"
        exit 1
    fi
}

validate_env() {
    if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
        log_error "SUPABASE_DB_URL environment variable not set"
        log_info "Export it: export SUPABASE_DB_URL='postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres'"
        exit 1
    fi

    if [[ ! "$SUPABASE_DB_URL" =~ ^postgresql:// ]]; then
        log_error "Invalid SUPABASE_DB_URL format. Must start with postgresql://"
        exit 1
    fi
}

test_connection() {
    log_info "Testing database connection..."
    if ! psql "$SUPABASE_DB_URL" -c "SELECT version();" &> /dev/null; then
        log_error "Failed to connect to database"
        log_info "Verify SUPABASE_DB_URL and network connectivity"
        exit 1
    fi
    log_info "Connection successful"
}

create_backup_dir() {
    if [[ ! -d "$BACKUP_DIR" ]]; then
        log_info "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

execute_backup() {
    log_info "Starting backup..."
    log_info "Output: $BACKUP_FILE"

    if pg_dump "$SUPABASE_DB_URL" \
        --no-owner \
        --no-acl \
        --clean \
        --if-exists \
        --file="$BACKUP_FILE"; then
        log_info "Backup completed successfully"
    else
        log_error "Backup failed"
        exit 1
    fi
}

verify_backup() {
    log_info "Verifying backup integrity..."

    if [[ ! -f "$BACKUP_FILE" ]]; then
        log_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi

    local file_size
    file_size=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null)

    if [[ "$file_size" -lt 1024 ]]; then
        log_error "Backup file too small (< 1KB). Likely corrupted."
        exit 1
    fi

    if ! head -n 5 "$BACKUP_FILE" | grep -q "PostgreSQL database dump"; then
        log_error "Invalid backup file header"
        exit 1
    fi

    log_info "Backup verified successfully"
    log_info "File size: $(numfmt --to=iec-i --suffix=B "$file_size" 2>/dev/null || echo "${file_size} bytes")"
}

compress_backup() {
    log_info "Compressing backup..."
    if gzip -f "$BACKUP_FILE"; then
        log_info "Compressed: ${BACKUP_FILE}.gz"
        readonly FINAL_FILE="${BACKUP_FILE}.gz"
    else
        log_warn "Compression failed, keeping uncompressed"
        readonly FINAL_FILE="$BACKUP_FILE"
    fi
}

cleanup_old_backups() {
    local retention_days=30
    log_info "Cleaning up backups older than $retention_days days..."

    find "$BACKUP_DIR" -name "backup_pca_*.sql*" -type f -mtime +$retention_days -delete 2>/dev/null || true
}

print_summary() {
    echo ""
    log_info "============================================"
    log_info "Backup Summary"
    log_info "============================================"
    log_info "File: $(basename "$FINAL_FILE")"
    log_info "Location: $BACKUP_DIR"
    log_info "Timestamp: $TIMESTAMP"
    log_info "============================================"
    echo ""
}

main() {
    log_info "PCA Database Backup - Starting..."

    check_dependencies
    validate_env
    test_connection
    create_backup_dir
    execute_backup
    verify_backup
    compress_backup
    cleanup_old_backups
    print_summary

    log_info "Backup process completed successfully"
    exit 0
}

main "$@"
