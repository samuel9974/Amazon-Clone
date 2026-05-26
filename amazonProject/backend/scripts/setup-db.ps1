# Creates amazon_clone database from schema + seed.
# Usage (from amazonProject/backend):
#   .\scripts\setup-db.ps1
#   .\scripts\setup-db.ps1 -DbUser root -DbPassword yourpass

param(
  [string] $DbHost = 'localhost',
  [int]    $DbPort = 3306,
  [string] $DbUser = 'root',
  [string] $DbPassword = '',
  [string] $MysqlBin = 'mysql'
)

$ErrorActionPreference = 'Stop'
$backendRoot = Split-Path -Parent $PSScriptRoot
$schemaPath  = Join-Path $backendRoot 'src\db\schema.sql'
$seedPath    = Join-Path $backendRoot 'src\db\seed.sql'

if (-not (Test-Path $schemaPath)) { throw "schema.sql not found at $schemaPath" }
if (-not (Test-Path $seedPath))   { throw "seed.sql not found at $seedPath" }

function Invoke-MysqlFile {
  param([string] $FilePath, [string] $Database)
  $args = @('-h', $DbHost, '-P', $DbPort, '-u', $DbUser)
  if ($DbPassword) { $args += @("-p$DbPassword") }
  if ($Database)   { $args += $Database }
  $args += @('--default-character-set=utf8mb4', '-e', "source $($FilePath -replace '\\','/')")
  & $MysqlBin @args
  if ($LASTEXITCODE -ne 0) { throw "mysql failed for $FilePath (exit $LASTEXITCODE)" }
}

Write-Host ''
Write-Host 'Amazon Clone — database setup (Step 1)' -ForegroundColor Cyan
Write-Host "Host: $DbHost`:$DbPort  User: $DbUser"
Write-Host ''

Write-Host '[1/2] Applying schema.sql (drops & recreates amazon_clone)...' -ForegroundColor Yellow
Get-Content $schemaPath -Raw | & $MysqlBin -h $DbHost -P $DbPort -u $DbUser $(if ($DbPassword) { "-p$DbPassword" }) --default-character-set=utf8mb4
if ($LASTEXITCODE -ne 0) { throw 'schema.sql failed' }
Write-Host '      Schema applied.' -ForegroundColor Green

Write-Host '[2/2] Applying seed.sql...' -ForegroundColor Yellow
Get-Content $seedPath -Raw | & $MysqlBin -h $DbHost -P $DbPort -u $DbUser $(if ($DbPassword) { "-p$DbPassword" }) --default-character-set=utf8mb4
if ($LASTEXITCODE -ne 0) { throw 'seed.sql failed' }
Write-Host '      Seed data loaded.' -ForegroundColor Green

Write-Host ''
Write-Host 'Verification:' -ForegroundColor Cyan
$verifySql = @"
USE amazon_clone;
SELECT 'users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews;
"@
$verifySql | & $MysqlBin -h $DbHost -P $DbPort -u $DbUser $(if ($DbPassword) { "-p$DbPassword" }) --table
if ($LASTEXITCODE -ne 0) { throw 'verification query failed' }

Write-Host ''
Write-Host 'Done. Catalog data lives in MySQL — not Fake Store API.' -ForegroundColor Green
Write-Host 'Demo login (for later auth steps): user@amazon.local / user123' -ForegroundColor DarkGray
Write-Host ''
