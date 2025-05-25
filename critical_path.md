# 🧩 Radiant Core — Critical Path

_Last reviewed: 20250518_1444_

---

## 🎯 Purpose

This document defines the **non-negotiable components** required for Radiant Core to function in its current architecture. Everything outside of this list is either experimental, replaceable, or deprecated.

---

## 🔧 Core Execution Stack (Minimum Viable Loop)

### 1. 🎙️ Whisper STT
- **File:** `servers/stt_ws/stt_ws_server.py`
- **Role:** Converts mic input → text
- **Status:** ✅ CUDA-accelerated and running in WSL

### 2. 🧠 Damian Backend (Python)
- **File:** `servers/damian/damian_server.py`
- **Role:** Receives transcript, generates reply
- **Status:** ✅ Handles voice logic and ElevenLabs relay

### 3. 🌐 Damian Gateway Server (Node)
- **File:** `servers/damian_gateway/server.js`
- **Role:** REST + WebSocket router for UI, chat, and TTS
- **Status:** ✅ Hosts /api/chat and /health.json

### 4. 🗣️ ElevenLabs TTS + speakText.js
- **File:** `servers/damian_gateway/speakText.js`
- **Role:** Speaks Damian’s reply through Windows audio
- **Status:** ✅ Speaks response via POST or function call

### 5. 💬 Frontend UI (Vite + React)
- **Folder:** `damian-voice-client/`
- **Role:** Captures mic input, displays transcripts, visual feedback
- **Status:** ✅ WebSocket and API linked

---

## 🗃️ Secondary but Essential

### 6. 📓 Codex API
- **File:** `servers/codex/server.js`
- **Role:** Logs and retrieves Codex text entries
- **Status:** ✅ Used for long-term journaling

### 7. 🔐 .env Files
- **Root:** `.env` — `ELEVEN_API_KEY`, `DAMIAN_EXEC_KEY`
- **Damian:** `servers/damian/.env` — `OPENAI_API_KEY`

---

## 🚫 Off-Critical Path (Nonessential or Experimental)

| File/Folder                          | Status      | Notes                              |
|-------------------------------------|-------------|------------------------------------|
| servers/tts_sandbox                 | Deprecated  | Replaced by speakText.js           |
| codex_v2                            | Experimental| Concept stage                      |
| servers/legacy_speech_interface     | Deprecated  | No longer used                     |
| health_server.py (planned)          | Pending     | Not required for core function     |

---

## ✅ Success Criteria

If these **five components** are live, Radiant Core is operational:
- Whisper STT
- Damian Python backend
- Gateway Node server
- TTS handler
- Frontend UI

Everything else is additive, not required.

---

