# 💾 Estratégia de Backup - PCA Sistema

## Política de Retenção

### Supabase Free Tier
- **Backups automáticos:** Não disponíveis
- **Retenção:** N/A
- **Estratégia:** Backup manual obrigatório

### Supabase Pro/Team
- **Backups automáticos:** Diários (últimos 7 dias)
- **Point-in-Time Recovery (PITR):** Disponível até 30 dias
- **Retenção configurável:** 7-90 dias
- **Localização:** Dashboard → Database → Backups

### Recomendação de Retenção

| Ambiente | Frequência | Retenção | Método |
|----------|-----------|----------|--------|
| Desenvolvimento | Semanal | 7 dias | Manual |
| Staging | Diário | 14 dias | Manual + Supabase Auto |
| Produção | Diário | 30 dias | Supabase Auto + External |

---

## Backup Manual via pg_dump

### Pré-requisitos

```bash
# PostgreSQL Client 14+
psql --version

# Ou via Docker
docker run --rm postgres:14 pg_dump --version
```

### Credenciais de Conexão

Obtenha a connection string no Supabase Dashboard:

**Settings → Database → Connection string → URI**

Formato:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Backup Completo

```bash
# Definir variáveis
export SUPABASE_DB_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
export BACKUP_FILE="backup_pca_$(date +%Y%m%d_%H%M%S).sql"

# Executar dump
pg_dump "$SUPABASE_DB_URL" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  --file="$BACKUP_FILE"

# Verificar tamanho
ls -lh "$BACKUP_FILE"
```

### Backup via Docker

```bash
docker run --rm \
  -e PGPASSWORD="your-password" \
  -v "$(pwd):/backup" \
  postgres:14 \
  pg_dump \
    -h db.xxxxx.supabase.co \
    -U postgres \
    -d postgres \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --file=/backup/backup_pca_$(date +%Y%m%d).sql
```

### Backup Específico (Apenas Dados)

```bash
# Excluir dados de teste
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --exclude-table-data="demandas" \
  --file="backup_data_only.sql"

# Ou incluir apenas tabelas específicas
pg_dump "$SUPABASE_DB_URL" \
  --table="unidades_gestoras" \
  --table="demandas" \
  --table="pca" \
  --table="pca_itens" \
  --file="backup_tables.sql"
```

### Compressão

```bash
# Backup comprimido (gzip)
pg_dump "$SUPABASE_DB_URL" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists | gzip > "backup_pca_$(date +%Y%m%d).sql.gz"

# Descompactar
gunzip backup_pca_20250125.sql.gz
```

---

## Restore (Recuperação de Desastres)

### ⚠️ AVISO CRÍTICO

**RESTORE SOBRESCREVE DADOS EXISTENTES**

- Execute `--clean` apenas em banco de teste
- Em produção, crie novo projeto Supabase primeiro
- Faça backup do estado atual antes de restore

### Restore Completo

```bash
# 1. Verificar arquivo
head -n 20 backup_pca_20250125.sql

# 2. Executar restore
psql "$SUPABASE_DB_URL" \
  --file="backup_pca_20250125.sql" \
  --echo-errors

# 3. Verificar dados
psql "$SUPABASE_DB_URL" -c "SELECT COUNT(*) FROM demandas;"
```

### Restore via Docker

```bash
docker run --rm \
  -e PGPASSWORD="your-password" \
  -v "$(pwd):/backup" \
  postgres:14 \
  psql \
    -h db.xxxxx.supabase.co \
    -U postgres \
    -d postgres \
    --file=/backup/backup_pca_20250125.sql \
    --echo-errors
```

### Restore Seletivo

```bash
# Apenas schema (sem dados)
pg_restore --schema-only backup.dump

# Apenas dados (sem schema)
pg_restore --data-only backup.dump

# Apenas uma tabela
grep "^COPY demandas" backup.sql | psql "$SUPABASE_DB_URL"
```

### Teste de Restore (Recomendado)

```bash
# 1. Criar projeto temporário no Supabase
# 2. Executar restore no projeto temp
# 3. Verificar integridade

psql "$TEMP_DB_URL" -c "\dt"  # Listar tabelas
psql "$TEMP_DB_URL" -c "SELECT COUNT(*) FROM demandas;"
psql "$TEMP_DB_URL" -c "SELECT COUNT(*) FROM pca;"

# 4. Se OK, aplicar em produção
```

---

## Script Automatizado

### Uso do backup.sh

```bash
# Tornar executável
chmod +x scripts/backup.sh

# Definir variável de ambiente
export SUPABASE_DB_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"

# Executar
./scripts/backup.sh

# Ou com caminho customizado
./scripts/backup.sh /path/to/backups
```

### Agendar via Cron (Linux/Mac)

```bash
# Editar crontab
crontab -e

# Adicionar linha (backup diário às 2h AM)
0 2 * * * cd /path/to/PCA && ./scripts/backup.sh /backups 2>&1 | logger -t pca-backup
```

### Agendar via Task Scheduler (Windows)

```powershell
# Criar task
schtasks /create /tn "PCA Backup" /tr "C:\path\to\PCA\scripts\backup.sh" /sc daily /st 02:00
```

### Agendar via GitHub Actions

```yaml
# .github/workflows/backup.yml
name: Database Backup
on:
  schedule:
    - cron: '0 2 * * *'  # 2h AM UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run backup
        env:
          SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
        run: |
          chmod +x scripts/backup.sh
          ./scripts/backup.sh
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: database-backup
          path: backup_*.sql
          retention-days: 30
```

---

## Verificação de Integridade

### Pós-Backup

```bash
# Verificar tamanho (deve ser > 10KB)
test -s backup.sql && echo "OK: Arquivo não está vazio"

# Verificar header SQL
head -n 5 backup.sql | grep -q "PostgreSQL database dump" && echo "OK: Header válido"

# Contar linhas (backup de ~500 demandas ≈ 5000+ linhas)
wc -l backup.sql
```

### Pós-Restore

```sql
-- Contar registros em todas as tabelas
SELECT 'unidades_gestoras' AS table_name, COUNT(*) AS count FROM unidades_gestoras
UNION ALL
SELECT 'demandas', COUNT(*) FROM demandas
UNION ALL
SELECT 'pca', COUNT(*) FROM pca
UNION ALL
SELECT 'pca_itens', COUNT(*) FROM pca_itens;

-- Verificar integridade referencial
SELECT
  d.id,
  d.unidade_id,
  u.nome
FROM demandas d
LEFT JOIN unidades_gestoras u ON d.unidade_id = u.id
WHERE u.id IS NULL;  -- Deve retornar 0 registros

-- Verificar triggers
SELECT tgname, tgrelid::regclass, tgenabled
FROM pg_trigger
WHERE tgname LIKE '%valor_total%';
```

---

## Armazenamento Externo

### AWS S3

```bash
# Upload para S3
aws s3 cp backup_pca_20250125.sql.gz s3://my-bucket/pca-backups/

# Download de S3
aws s3 cp s3://my-bucket/pca-backups/backup_pca_20250125.sql.gz ./
```

### Google Cloud Storage

```bash
# Upload para GCS
gsutil cp backup_pca_20250125.sql.gz gs://my-bucket/pca-backups/

# Download de GCS
gsutil cp gs://my-bucket/pca-backups/backup_pca_20250125.sql.gz ./
```

### Dropbox / Google Drive

```bash
# Usando rclone
rclone copy backup_pca_20250125.sql.gz dropbox:PCA-Backups/
rclone copy backup_pca_20250125.sql.gz gdrive:PCA-Backups/
```

---

## Checklist de Disaster Recovery

### Pré-DR (Preventivo)

- [ ] Backups automáticos configurados (Supabase Pro)
- [ ] Backups manuais semanais executados
- [ ] Script `backup.sh` testado
- [ ] Credenciais de conexão documentadas
- [ ] Equipe treinada em procedimento de restore
- [ ] Teste de restore realizado mensalmente

### Durante DR (Incidente)

- [ ] **Não entre em pânico** - Avalie o cenário
- [ ] Identifique o backup mais recente válido
- [ ] Crie novo projeto Supabase (se necessário)
- [ ] Execute restore em ambiente de teste primeiro
- [ ] Verifique integridade dos dados
- [ ] Execute restore em produção
- [ ] Reconfigure aplicação (atualizar `.env`)
- [ ] Teste funcionalidades críticas
- [ ] Documente o incidente (post-mortem)

### Pós-DR (Recuperação)

- [ ] Monitorar logs por 24-48h
- [ ] Verificar métricas de performance
- [ ] Atualizar procedimentos baseado em lições aprendidas
- [ ] Reforçar política de backup

---

## Troubleshooting

### Erro: "connection refused"

```bash
# Verificar conectividade
nc -zv db.xxxxx.supabase.co 5432

# Testar conexão
psql "$SUPABASE_DB_URL" -c "SELECT version();"
```

### Erro: "password authentication failed"

```bash
# Verificar senha no Supabase Dashboard
# Settings → Database → Database password → Reset

# Testar nova senha
psql "postgresql://postgres:NEW_PASSWORD@db.xxxxx.supabase.co:5432/postgres" -c "\l"
```

### Erro: "out of memory" durante restore

```bash
# Usar --single-transaction para reduzir overhead
psql "$SUPABASE_DB_URL" --single-transaction --file=backup.sql

# Ou dividir em partes
csplit -f backup_part backup.sql '/^COPY/' '{*}'
for file in backup_part*; do
  psql "$SUPABASE_DB_URL" --file="$file"
done
```

### Backup muito grande (> 1GB)

```bash
# Usar formato custom comprimido
pg_dump "$SUPABASE_DB_URL" \
  --format=custom \
  --compress=9 \
  --file=backup.dump

# Restore de formato custom
pg_restore \
  --dbname="$SUPABASE_DB_URL" \
  --clean \
  --if-exists \
  backup.dump
```

---

## Referências

- **Supabase Backups:** https://supabase.com/docs/guides/platform/backups
- **pg_dump Documentation:** https://www.postgresql.org/docs/current/app-pgdump.html
- **pg_restore Documentation:** https://www.postgresql.org/docs/current/app-pgrestore.html
- **PostgreSQL Backup Best Practices:** https://wiki.postgresql.org/wiki/Automated_Backup_on_Linux

---

**Última atualização:** 2025-11-25
**Responsável:** DevOps / DBA
**Revisão:** Trimestral
