param (
    [string]$ProjectRoot = "D:\RadiantCore"
)

function Start-ServiceWithTitle {
    param (
        [string]$Title,
        [string]$Command
    )
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '[$Title] Starting...'; $Command" -WindowStyle Normal -WorkingDirectory $ProjectRoot -Verb RunAs
}

Write-Host "Launching Damian Stack from $ProjectRoot..." -ForegroundColor Cyan

# Check virtual environment
$VenvActivate = Join-Path $ProjectRoot ".venv\Scripts\Activate.ps1"
if (-Not (Test-Path $VenvActivate)) {
    Write-Host "ERROR: Virtual environment not found at $VenvActivate" -ForegroundColor Red
    Exit 1
}

# Services (port first in window title)
Start-ServiceWithTitle "3400 - Chat API" "cd '$ProjectRoot\servers\damian'; . '$VenvActivate'; python damian_server.py"
Start-ServiceWithTitle "3100 - Voice Server" "cd '$ProjectRoot\Damian\DamianVoiceServer'; node server.js"
Start-ServiceWithTitle "STT WebSocket" "cd '$ProjectRoot\servers\stt_ws'; . '$VenvActivate'; python stt_ws_server.py"
Start-ServiceWithTitle "3002 - Codex API" "cd '$ProjectRoot\codex_server'; . '$VenvActivate'; python codex_api.py"
Start-ServiceWithTitle "8000 - Health Server" "cd '$ProjectRoot'; . '$VenvActivate'; uvicorn utilities.health_server:app --host 0.0.0.0 --port 8000 --reload"
Start-ServiceWithTitle "5173 - Vite UI" "cd '$ProjectRoot\damian-voice-client'; npm run dev"

Write-Host "All Damian services launched." -ForegroundColor Green
