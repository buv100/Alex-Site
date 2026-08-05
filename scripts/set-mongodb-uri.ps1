# Sets MONGODB_URI on Vercel Production and redeploys.
# Usage: .\scripts\set-mongodb-uri.ps1 "mongodb://user:pass@host:27017/alex-nekasim"
param(
  [Parameter(Mandatory = $true)]
  [string]$Uri
)

$ErrorActionPreference = "Stop"
if ($Uri -notmatch "^mongodb(\+srv)?://") {
  throw "URI must start with mongodb:// or mongodb+srv://"
}

# stdin pipe for non-interactive vercel env add
$Uri | npx vercel env add MONGODB_URI production --force
if ($LASTEXITCODE -ne 0) { throw "vercel env add failed" }

npx vercel --yes --prod
if ($LASTEXITCODE -ne 0) { throw "vercel deploy failed" }

Write-Host "Done. Check https://alex-nekasim.vercel.app/api/health for mode=server"
