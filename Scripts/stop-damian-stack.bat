@echo off
title 💀 Damian Stack Shutdown
color 0C

echo Shutting down Damian's entire ecosystem...
echo --------------------------------------------------

REM === Kill Damian Voice Server ===
echo [1/4] Killing Damian Voice Server...
taskkill /IM node.exe /F >nul 2>&1

REM === Kill GPT-J Backend ===
echo [2/4] Killing GPT-J backend (text-generation-webui)...
taskkill /IM python.exe /F >nul 2>&1

REM === Kill Radiant Core Frontend ===
echo [3/4] Killing Radiant Core frontend...
taskkill /IM node.exe /F >nul 2>&1

REM === Kill Cloudflare Tunnel ===
echo [4/4] Killing Cloudflare Tunnel...
taskkill /IM cloudflared.exe /F >nul 2>&1

REM === Close any stack CMDs (optional, force-kill open CMDs launched by stack)
for /f "tokens=2 delims=," %%a in ('tasklist /v /fi "WindowTitle eq GPT-J" /fo csv') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=2 delims=," %%a in ('tasklist /v /fi "WindowTitle eq Damian Voice" /fo csv') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=2 delims=," %%a in ('tasklist /v /fi "WindowTitle eq RadiantCore Chat" /fo csv') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=2 delims=," %%a in ('tasklist /v /fi "WindowTitle eq Cloudflare Tunnel" /fo csv') do taskkill /PID %%a /F >nul 2>&1

echo --------------------------------------------------
echo 💀 All systems terminated. Damian has returned to the shadows.
pause
