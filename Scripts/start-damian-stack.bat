@echo off
echo Starting Damian Stack using shared .venv...

REM === Shared Virtual Environment Check ===
IF NOT EXIST "D:\RadiantCore\.venv\Scripts\activate.bat" (
    echo [ERROR] Shared virtual environment not found at D:\RadiantCore\.venv\
    pause
    exit /b 1
)

REM === Damian Chat API (FastAPI - 3400) ===
start "3400 - Chat API" cmd /k "cd /d D:\RadiantCore\servers\damian && call ..\..\venv\Scripts\activate.bat && python damian_server.py"

REM === Node Voice Server (3100) ===
start "3100 - Voice Server" cmd /k "cd /d D:\RadiantCore\Damian\DamianVoiceServer && node server.js"

REM === Whisper STT WebSocket ===
start "STT WebSocket" cmd /k "cd /d D:\RadiantCore\servers\stt_ws && call ..\..\venv\Scripts\activate.bat && python stt_ws_server.py"

REM === Codex API Backend (3002) ===
start "3002 - Codex API" cmd /k "cd /d D:\RadiantCore\codex_server && call ..\venv\Scripts\activate.bat && python codex_api.py"

REM === Health Server (8000) ===
start "8000 - Health Server" cmd /k "cd /d D:\RadiantCore && call .venv\Scripts\activate.bat && uvicorn utilities.health_server:app --host 0.0.0.0 --port 8000 --reload"

REM === Vite Frontend (5173) ===
start "5173 - Vite UI" cmd /k "cd /d D:\RadiantCore\damian-voice-client && npm run dev"

echo All Damian services are launching...
