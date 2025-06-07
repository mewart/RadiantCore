from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import requests
from io import BytesIO
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Default XTTS endpoint inside Docker network
XTTS_API_URL = os.getenv("XTTS_API_URL", "http://xtts_speaker:3600/speak")

app = FastAPI()

# === Enable CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ai_api online"}

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "Hello.")
    return {"reply": f"You said: {user_input}"}

@app.post("/api/speak")
async def speak(request: Request):
    data = await request.json()
    text = data.get("text", "")

    if not text:
        return JSONResponse(status_code=400, content={"error": "No text provided"})

    try:
        response = requests.post(XTTS_API_URL, json={"text": text}, timeout=30)

        if response.status_code != 200:
            return JSONResponse(status_code=500, content={
                "error": "XTTS request failed",
                "status_code": response.status_code,
                "details": response.text
            })

        audio_stream = BytesIO(response.content)
        return StreamingResponse(audio_stream, media_type="audio/wav")

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
