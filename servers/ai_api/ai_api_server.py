from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from fastapi.responses import JSONResponse, StreamingResponse
from dotenv import load_dotenv
from io import BytesIO

# Load environment variables from the .env file
load_dotenv()

# Retrieve the API key
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # Replace with your ElevenLabs voice ID

headers = {
    "xi-api-key": ELEVENLABS_API_KEY,
    "Content-Type": "application/json"
}

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        response = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
            headers=headers,
            json={
                "text": text,
                "voice_settings": {
                    "stability": 0.4,
                    "similarity_boost": 0.75
                }
            }
        )

        if response.status_code != 200:
            return JSONResponse(status_code=500, content={
                "error": "ElevenLabs request failed",
                "status_code": response.status_code,
                "details": response.text
            })

        # Stream audio to client
        audio_stream = BytesIO(response.content)
        return StreamingResponse(audio_stream, media_type="audio/mpeg")

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
