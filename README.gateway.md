# 🌐 Damian Voice Gateway — API + TTS Router

_Last updated: 2025-05-18 14:52_

---

## 📋 Overview

This server acts as the central gateway between the **frontend voice UI**, the **AI backend**, and the **speech engine**. It handles REST and WebSocket traffic, relays messages to your core chat model, and triggers voice output using ElevenLabs.

---

## 🔌 Core Responsibilities

- `POST /api/chat`: Receives transcribed voice input, relays it to the core AI backend, and sends the response to the TTS engine.
- `GET /health.json`: Reports basic system status for the dashboard.
- `GET /`: Confirms that the server is alive.
- WebSocket: Initialized (pending full implementation) to allow live audio/text sync with UI.
- `speakText(reply)`: Plays Damian's response via ElevenLabs.

---

## 🛠️ File Structure

```
servers/
  damian_gateway/
    server.js           # Main gateway server
    speakText.js        # ElevenLabs TTS function
    .env                # Contains ELEVEN_API_KEY and configs
```

---

## 🌐 Port Usage

- **Port:** `3100`
- Bound to: Express HTTP + WebSocket server

---

## 🔐 Environment Variables (.env)

```
ELEVEN_API_KEY=your_elevenlabs_key_here
CORE_CHAT_URL=http://localhost:3001/api/chat
```

These are loaded at runtime via `dotenv.config()`.

---

## 🚀 Startup

```bash
cd /mnt/d/RadiantCore/servers/damian_gateway
node server.js
```

---

## 🔁 Dependencies

Install required Node modules:

```bash
npm install express cors ws dotenv node-fetch
```

---

## ⚠️ Known Issues

- WebSocket support is initialized but not fully implemented.
- The `/api/chat` route assumes a live core chat server on port `3001`.
- Errors from ElevenLabs are not yet gracefully handled (WIP).

---

## 🧭 Future Enhancements

- Refactor TTS logic into its own `tts_server.js`
- Add retry logic and status checks for TTS
- Implement `/api/speak` as a separate endpoint
- Route all Codex-eligible messages to `http://localhost:3300/api/codex/add`

---

## ❤️ Author's Note

This is the glue layer. Don’t let it rot.  
If you touch it, update this file. If you break it, restore from backup.  
If you improve it—document it.

---

