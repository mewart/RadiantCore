# RadiantCore Voice Chat System

This project sets up a multi-service AI voice assistant named Damian, with components for transcription (STT), text processing, and text-to-speech (TTS).

---

## 🧠 Components and Their Ports

| Component              | Description                         | Port  |
|------------------------|-------------------------------------|--------|
| `damian_server.py`     | Handles chat requests and ElevenLabs TTS | 8000   |
| `server.js`            | Node.js voice control API gateway   | 3400   |
| `stt_ws_server.py`     | Whisper + Silero VAD over WebSocket | 3100   |

---

## 🚀 Startup Instructions (Windows PowerShell)

1. **Start `damian_server.py`**

```powershell
cd D:\RadiantCore\servers\damian
.env\Scripts\Activate
python damian_server.py
```

2. **Start `server.js` (Node.js Voice Server)**

```powershell
cd D:\RadiantCore\servers\damian
node server.js
```

3. **Start `stt_ws_server.py`**

```powershell
cd D:\RadiantCore\servers\stt_ws
.env\Scripts\Activate
python stt_ws_server.py
```

---

## ✅ Verify Services

- Visit `http://localhost:8000/health.json` to verify FastAPI server.
- Send POST to `http://localhost:3400/api/chat` to test Node + Python interop.
- Speak into mic with client open (port 3100 active) to test STT -> Chat -> TTS loop.
