# Sets DATABASE_URL on Vercel Production and redeploys.
# Usage: .\scripts\set-database-url.ps1 "postgresql://user:pass@host/db?sslmode=require"
param(
  [Parameter(Mandatory = $true)]
  [string]$Uri
)

$ErrorActionPreference = "Stop"
if ($Uri -notmatch "^postgres(ql)?://") {
  throw "URI must start with postgresql:// or postgres://"
}

# stdin pipe for non-interactive vercel env add
$Uri | npx vercel env add DATABASE_URL production --force
if ($LASTEXITCODE -ne 0) { throw "vercel env add failed" }

npx vercel --yes --prod
if ($LASTEXITCODE -ne 0) { throw "vercel deploy failed" }

Write-Host "Done. Check https://alex-nekasim.vercel.app/api/health for mode=server"
