# servers/vitalsigns/mainvitalsigns_server.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# ✅ Allow frontend to communicate cross-origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active service endpoints from your running Docker stack
SERVICES = {
    "ai_api": "http://ai_api:3300/health",
    "ai_gateway": "http://ai_gateway:3600/health",
    "ai_mindloop": "http://ai_mindloop:3400/health",
    "codex_api": "http://codex_api:3200/health",
    "stt_ws": "http://stt_ws:3100/health"
}

@app.get("/api/vitalsigns")
async def get_health():
    results = {}
    async with httpx.AsyncClient(timeout=2.0) as client:
        for name, url in SERVICES.items():
            try:
                r = await client.get(url)
                results[name] = r.json().get("status", "unknown")
            except Exception:
                results[name] = "down"
    return results
