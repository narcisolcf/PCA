# 🔐 Configurar Assinatura GPG para Commits Verificados

## Problema

A Vercel está rejeitando commits não verificados. Você precisa assinar seus commits com GPG.

## Solução Rápida (Recomendada)

### 1. Desabilitar verificação na Vercel

1. Acesse: <https://vercel.com/narcisoc/pca/settings/git>
2. Desabilite: **"Only deploy verified commits"**
3. Salve e faça redeploy

## Solução Completa (Configurar GPG)

### Passo 1: Instalar GPG (se não tiver)

**Windows:**

```powershell
# Usando Chocolatey
choco install gpg4win

# OU baixe manualmente:
# https://www.gpg4win.org/download.html
```

### Passo 2: Gerar chave GPG

```powershell
# Gerar nova chave
gpg --full-generate-key

# Escolha:
# - Tipo: (1) RSA and RSA
# - Tamanho: 4096
# - Validade: 0 (não expira) ou 1y (1 ano)
# - Nome: Seu nome
# - Email: MESMO email do GitHub
```

### Passo 3: Listar e copiar sua chave

```powershell
# Listar chaves
gpg --list-secret-keys --keyid-format=long

# Copiar chave pública (substitua KEY_ID)
gpg --armor --export KEY_ID
```

### Passo 4: Adicionar chave ao GitHub

1. Acesse: <https://github.com/settings/keys>
2. Clique em **"New GPG key"**
3. Cole a chave pública
4. Salve

### Passo 5: Configurar Git para assinar commits

```powershell
# Configurar GPG no Git (substitua KEY_ID)
git config --global user.signingkey KEY_ID

# Assinar commits automaticamente
git config --global commit.gpgsign true

# Configurar GPG program (Windows)
git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
```

### Passo 6: Testar

```powershell
# Fazer um commit de teste
git commit --allow-empty -S -m "test: Commit assinado com GPG"

# Verificar assinatura
git log --show-signature -1
```

### Passo 7: Push e verificar

```powershell
git push origin main
```

Agora seus commits aparecerão como "Verified" ✅ no GitHub e a Vercel aceitará os deploys!

## Troubleshooting

### Erro: "gpg failed to sign the data"

```powershell
# Configurar TTY
$env:GPG_TTY = (tty)

# OU adicione ao seu perfil do PowerShell
echo '$env:GPG_TTY = (tty)' >> $PROFILE
```

### Erro: "No secret key"

```powershell
# Verifique se a chave existe
gpg --list-secret-keys --keyid-format=long

# Se não existir, gere uma nova (Passo 2)
```

## Verificar Status

```powershell
# Ver configuração atual
git config --global --get user.signingkey
git config --global --get commit.gpgsign

# Ver último commit
git log --show-signature -1
```
