param(
    [Parameter(Mandatory=$true)][string]$Project,
    [ValidateSet('all','antigravity','codex','cursor','claude')][string]$Platform = 'all',
    [switch]$Update
)
$ErrorActionPreference = 'Stop'
$name = 'criar-produto-guiado'
$source = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$versionFile = Join-Path $source 'assets/versao.json'
$version = if (Test-Path -LiteralPath $versionFile) { (Get-Content -LiteralPath $versionFile -Raw | ConvertFrom-Json).version } else { 'anterior' }
$projectPath = (Resolve-Path -Path $Project -ErrorAction Stop).Path
if (-not (Test-Path -LiteralPath $projectPath -PathType Container)) { throw 'A pasta do projeto não existe.' }
if ($projectPath.StartsWith($source, [StringComparison]::OrdinalIgnoreCase)) { throw 'Escolha um projeto fora da pasta da skill.' }

if ($Platform -eq 'all') {
    $items = @(
        @{ Target = Join-Path $projectPath '.agents/skills/criar-produto-guiado'; Plugin = $false; Label = 'Antigravity · Codex · Cursor' },
        @{ Target = Join-Path $projectPath '.claude/skills/criar-produto-guiado'; Plugin = $false; Label = 'Claude Code' }
    )
} elseif ($Platform -eq 'antigravity') {
    $items = @(@{ Target = Join-Path $projectPath '.agents/plugins/criar-produto-guiado'; Plugin = $true; Label = 'Antigravity' })
} else {
    $base = if ($Platform -eq 'claude') { '.claude' } elseif ($Platform -eq 'cursor') { '.cursor' } else { '.agents' }
    $items = @(@{ Target = Join-Path $projectPath "$base/skills/criar-produto-guiado"; Plugin = $false; Label = $Platform })
}

$stamp = Get-Date -Format yyyyMMdd-HHmmss
$backups = @()
foreach ($item in $items) {
    if (Test-Path -LiteralPath $item.Target) {
        if (-not $Update) { throw "Já existe em $($item.Target). Execute novamente com -Update." }
        $backup = "$($item.Target).backup-$stamp"
        if (Test-Path -LiteralPath $backup) { throw "Já existe uma cópia de segurança: $backup" }
        $backups += @{ Target = $item.Target; Backup = $backup }
    }
}
foreach ($entry in $backups) { Move-Item -LiteralPath $entry.Target -Destination $entry.Backup }
$created = @()
try {
    foreach ($item in $items) {
        $skill = if ($item.Plugin) { Join-Path $item.Target 'skills/criar-produto-guiado' } else { $item.Target }
        New-Item -ItemType Directory -Path (Split-Path -Parent $skill) -Force | Out-Null
        Copy-Item -LiteralPath $source -Destination $skill -Recurse -Force
        if ($item.Plugin) {
            $manifest = [ordered]@{
                '$schema' = 'https://antigravity.google/schemas/v1/plugin.json'
                name = $name
                description = 'Jornada privada da ideia ao PRD, construção e lançamento para alunos.'
            }
            [System.IO.File]::WriteAllText((Join-Path $item.Target 'plugin.json'), ($manifest | ConvertTo-Json -Depth 3), [System.Text.UTF8Encoding]::new($false))
        }
        if (-not (Test-Path -LiteralPath (Join-Path $skill 'SKILL.md'))) { throw "A instalação de $($item.Label) falhou na verificação." }
        $created += $item.Target
    }
} catch {
    foreach ($target in $created) { if (Test-Path -LiteralPath $target) { Remove-Item -LiteralPath $target -Recurse -Force } }
    foreach ($entry in $backups) { if (Test-Path -LiteralPath $entry.Backup) { Move-Item -LiteralPath $entry.Backup -Destination $entry.Target } }
    throw
}

$gitDir = Join-Path $projectPath '.git'
if (Test-Path -LiteralPath $gitDir -PathType Container) {
    $exclude = Join-Path $gitDir 'info/exclude'
    [System.IO.Directory]::CreateDirectory((Split-Path -Parent $exclude)) | Out-Null
    $old = if (Test-Path -LiteralPath $exclude) { [System.IO.File]::ReadAllText($exclude) } else { '' }
    foreach ($item in $items) {
        $relative = $item.Target.Substring($projectPath.Length).TrimStart([char[]]@('\','/')).Replace('\','/') + '*/'
        if (-not (($old -split "`r?`n") -contains $relative)) {
            [System.IO.File]::AppendAllText($exclude, "`n$relative`n", [System.Text.UTF8Encoding]::new($false))
            $old += "`n$relative`n"
        }
    }
}
foreach ($item in $items) { Write-Host "Instalado · v$version · $($item.Label): $($item.Target)" }
foreach ($entry in $backups) { Write-Host "Versão anterior guardada: $($entry.Backup)" }
$python = @('py','python3','python') | Where-Object { Get-Command $_ -ErrorAction SilentlyContinue } | Select-Object -First 1
if (-not $python) { Write-Warning 'Para gerar o mapa e validar etapas, instale Python 3.' }
Write-Host 'Abra o projeto e peça: Use criar-produto-guiado para começar meu projeto.'
if ($Platform -eq 'all') { Write-Host 'No Antigravity, procure a skill nas personalizações do projeto.' }
if ($Platform -eq 'antigravity') { Write-Host 'Plugin local do projeto; ele não entra no Marketplace público.' }
