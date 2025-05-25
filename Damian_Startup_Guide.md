# Damian Voice Project — Port & Startup Guide

## ✅ Current Port Assignments

| Component                    | Port   | Description |
|-----------------------------|--------|-------------|
| 🔁 **Frontend (Vite)**       | 5173   | React UI — chat interface |
| 🧠 **Core Chat API**         | 3001   | Handles GPT-J / LM text generation |
| 🎤 **Damian Voice Server**   | 3400   | Handles `/api/chat` + `/api/speak` endpoints (Node) |
| 🗣️ **STT WebSocket Server**  | 3100   | Whisper + VAD WebSocket listener |
| 🧞 **Codex API**             | 3002   | Local JSON + milestone Codex server |
| 🎛️ **Uvicorn FastAPI (alt)** | 8000   | Alternate Python API server — can overlap with above |

---

## 🛠️ Startup Checklist

### 1. Start STT WebSocket Server (Silero + Whisper)
```bash
cd /mnt/d/RadiantCore/servers/stt_ws
python3 stt_ws_server.py
```

### 2. Start Core Chat Server (GPT-J API on 3001)
Ensure your backend (like text-generation-webui or LM Studio) is serving at:
```
http://localhost:3001/api/chat
```

### 3. Start Damian Voice Server (Node on 3400)
```bash
cd D:\RadiantCore\Damian\DamianVoiceServer
.\venv\Scripts\activate
uvicorn damian_server:app --reload
```

### 4. Start Frontend (Vite/React Chat UI)
```bash
cd D:\RadiantCore\damian-voice-client
npm run dev
```
Access the UI at: [http://localhost:5173](http://localhost:5173)

### 5. Start Codex API
```bash
cd D:\RadiantCore\codex_server
node codex_api.js
```

---

## 🔐 .env Setup
Ensure the following variables are present:
```env
ELEVENLABS_API_KEY=sk-xxxxxx
DAMIAN_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

---

## ✅ Health & Test Endpoints

- `http://localhost:3400/health.json` – Verify Voice Server health
- `http://localhost:5173` – Chat Interface
- `POST http://localhost:3400/api/chat` – Round-trip input → AI → speech output

---

## 🚀 Optional Enhancements

Would you like a `.bat` or shell script to launch all of these in one go?
