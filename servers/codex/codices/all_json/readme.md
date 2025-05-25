Sure thing! Here’s the **full clean folder structure** for your Radiant Core setup:

---

# 🔹 Project Root Folder Layout

RadiantCore/
├── DamianVoiceServer/            # ✨ Damian’s Voice API Server
│   ├── .env                       # API keys and secrets
│   ├── package.json               # npm dependencies (express, ws, cors, dotenv, etc)
│   ├── server.js                  # Damian backend (listening on port 3100)
│   ├── public/                    # (Optional) Static assets if needed
│
├── radiantcore_chat/            # 💡 Vite + React Frontend Portal
│   ├── package.json               # npm dependencies (vite, react, axios, etc)
│   ├── vite.config.js             # 🔧 Vite config
│   ├── index.html                # React mounting point
│   ├── src/
│   │   ├── App.jsx               # Chat UI (calls /api/chat)
│   │   ├── main.jsx              # React entrypoint
│   │   ├── styles/               # (Optional) CSS/Styling
│
├── cloudflared/                 # ☁️ Cloudflare tunnel config (optional)
│   ├── config.yml                # Cloudflared settings
│
├── utilities/                   # 🛠 Batch Utilities
│   ├── start-all.bat             # Full project launcher
│   ├── reset-all.bat             # Kill Node and Cloudflared
│   ├── master-launch.bat         # Full sequence launcher (backend + frontend + tunnel + open browser, with readiness checks)
│   ├── diagnostics.bat           # Auto-check environment health
│   ├── README.txt                # Startup Instructions
│
└── README.md                  # Project instructions or notes

---

# 📊 Ports and Flow

| Service                | Port | Purpose |
|:----------------------|:----:|:--------|
| Vite Frontend          | 5173 | React App |
| DamianVoiceServer API  | 3100 | /api/chat Endpoint |
| Cloudflare Tunnel      | 443  | Secure Public Access to radiant-core.com |

---

# 🌐 DNS and URLs
- `https://radiant-core.com` ➔ Points to your **Vite Dev Server** (which proxies to Damian on `/api`) 
- Internal routing:
  - `/`  ➔ React Portal
  - `/api/chat` ➔ Damian backend

---

# 🔹 Things you run separately:

**Terminal Tab 1:** (inside `DamianVoiceServer/`)
```bash
cd DamianVoiceServer
npm install
npm run start
```

**Terminal Tab 2:** (inside `radiantcore_chat/`)
```bash
cd radiantcore_chat
npm install
npm run dev
```

**Terminal Tab 3:** (Cloudflare Tunnel)
```bash
cd cloudflared
cloudflared tunnel run radiant-core-tunnel
```

---

# 🚀 One-Line Full Launch Command (Ultimate Mode)

**master-launch.bat** now with readiness checks:

```batch
@echo off
setlocal ENABLEEXTENSIONS

:: Start Damian backend
start cmd /k "cd /d D:\RadiantCore\DamianVoiceServer && npm install && npm run start"

:: Wait a moment
timeout /t 2

:: Start Portal frontend
start cmd /k "cd /d D:\RadiantCore\radiantcore_chat && npm install && npm run dev"

:: Wait until port 5173 is open
:waitforvite
powershell -command "try { $tcp = New-Object Net.Sockets.TcpClient; $tcp.Connect('localhost',5173) } catch { Start-Sleep -Seconds 2; exit 1 }"
if %ERRORLEVEL% neq 0 goto waitforvite

:: Start Cloudflare Tunnel
start cmd /k "cd /d D:\RadiantCore\cloudflared && cloudflared tunnel run radiant-core-tunnel"

:: Open browser
start https://radiant-core.com

exit
```

---

# 🧹 Full Reset and Clean Ports (Reset Script)

**reset-all.bat**

```batch
@echo off
echo Killing Node.js and Cloudflared processes...
taskkill /IM node.exe /F
taskkill /IM cloudflared.exe /F
echo Done.
pause
```

---

# 🛠 Diagnostics Script (NEW!)

**diagnostics.bat**

```batch
@echo off
setlocal

:: Check DamianVoiceServer
netstat -ano | findstr ":3100" >nul
if %errorlevel% equ 0 (
    echo DamianVoiceServer: ✅ Running
) else (
    echo DamianVoiceServer: ❌ NOT running
)

:: Check Vite Dev Server
netstat -ano | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo RadiantCore Portal: ✅ Running
) else (
    echo RadiantCore Portal: ❌ NOT running
)

:: Check Cloudflared
tasklist | findstr "cloudflared.exe" >nul
if %errorlevel% equ 0 (
    echo Cloudflared Tunnel: ✅ Running
) else (
    echo Cloudflared Tunnel: ❌ NOT running
)

pause
exit /b
```

---

# ✨ Future Enhancements
- Add **secure HTTPS** certificates later for production.
- Move DamianVoiceServer behind its own subdomain (`api.radiant-core.com`) if you want!
- Add auth layer (JWT, basic auth) if you want user permissions.
- Cloudflare Zero Trust settings for super strong API protection!

---

# 📖 Starter README.md

# Radiant Core

Radiant Core is a powerful system combining a React Frontend with an Express + WebSocket Backend, securely exposed to the world via Cloudflare Tunnels.

## 📦 Project Structure

- `DamianVoiceServer/` – Express server for AI responses.
- `radiantcore_chat/` – Vite + React front-end for real-time chat.
- `cloudflared/` – Configuration for secure public access.
- `utilities/` – Handy batch scripts for launching/resetting system.

## 🚀 Running the Project

### Backend (Damian)
```bash
cd DamianVoiceServer
npm install
npm run start
```

### Frontend (Portal)
```bash
cd radiantcore_chat
npm install
npm run dev
```

### Tunnel (Public Access)
```bash
cd cloudflared
cloudflared tunnel run radiant-core-tunnel
```

### One-Click Launch
```bash
cd utilities
master-launch.bat
```

### Quick Health Check
```bash
cd utilities
diagnostics.bat
```

## 🌐 Access
Visit `https://radiant-core.com` to chat with Damian!

## ⚡ Tech Stack
- Express.js
- WebSocket (ws)
- React.js
- Vite
- Cloudflare Tunnels

## ✨ Future Plans
- Production hardening (HTTPS certificates, auth)
- Cloudflare Zero Trust integration
- Subdomain separation (`api.radiant-core.com`)

---

> Designed for speed, simplicity, and security. 
> Welcome to the Radiant Core Project.

---
