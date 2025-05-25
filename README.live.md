# 🧠 Radiant Core — System Live Manifest

_Last updated: 20250518_1441_

---

## ✅ Actively Running Components

| Component              | File Path                                      | Port  | Status   |
|------------------------|------------------------------------------------|-------|----------|
| Whisper STT            | servers/stt_ws/stt_ws_server.py               | 3100  | Confirmed |
| Damian Backend (Python)| servers/damian/damian_server.py               | —     | Confirmed |
| Damian Voice Gateway   | servers/damian_gateway/server.js              | 3100  | Confirmed |
| Codex API              | servers/codex/server.js                       | 3001  | Confirmed |
| Frontend (Vite)        | damian-voice-client (npm run dev)             | 5173  | Confirmed |

---

## 🔐 Environment Files & Keys

| File Path                          | Known Keys                      |
|-----------------------------------|----------------------------------|
| .env (project root)               | ELEVEN_API_KEY, DAMIAN_EXEC_KEY |
| servers/damian/.env               | OPENAI_API_KEY                  |

---

## 🌐 Port Bindings

| Port | Usage                    | Component             |
|------|--------------------------|------------------------|
| 3100 | STT + Gateway Server     | Whisper & Voice API    |
| 5173 | Frontend UI              | Vite React Interface   |
| 3001 | Codex API                | Codex File Server      |
| 8000 | [Reserved]               | Health API placeholder |

---

## ⛔ Do Not Touch / Inactive

| Path                              | Reason              |
|----------------------------------|---------------------|
| servers/tts_sandbox              | Deprecated TTS test |
| codex_v2                         | Experimental Codex  |
| servers/legacy_speech_interface | Replaced by gateway |

---

## 📌 Notes

- If you’re unsure about a file, check if it’s referenced in any of the above components.
- Backups are saved to: `D:/RadiantCore/backups/`
- Current backup: `radiantcore_full_backup_20250518_1441.zip`

---

To update this manifest, rerun the recon or ping Gabbie to refresh system state.
