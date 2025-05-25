@echo off
echo Starting Windows-side Damian services using shared .venv...

REM === Voice Server (Node.js on 3100) ===
start "3100 - Voice Server" cmd /k "cd /d D:\RadiantCore\Damian\DamianVoiceServer && node server.js"

REM === Vite Frontend (5173) ===
start "5173 - Vite UI" cmd /k "cd /d D:\RadiantCore\damian-voice-client && npm run dev"

echo Windows services launched.
