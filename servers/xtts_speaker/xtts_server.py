import os
import uuid
import torch
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from TTS.api import TTS

# Paths in the container
MODEL_DIR    = "/app/models/xtts_v2"
CONFIG_PATH  = os.path.join(MODEL_DIR, "config.json")
OUTPUT_DIR   = "/app/outputs"
SAMPLE_WAV   = "/app/voice_samples/default.wav"

# Ensure output dir exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

app = FastAPI()

# Initialize TTS (no trust_remote_code flag—removed in v0.22.0)
tts = TTS(
    model_path=MODEL_DIR,
    config_path=CONFIG_PATH,
    gpu=torch.cuda.is_available(),
    progress_bar=False
)

@app.get("/health")
def health():
    return {"status": "online"}

@app.post("/api/speak_local")
async def speak_local(request: Request):
    payload     = await request.json()
    text        = payload.get("text", "Hello, world.")
    speaker_wav = payload.get("speaker_wav", SAMPLE_WAV)
    lang        = payload.get("language", "en")
    out_path    = os.path.join(OUTPUT_DIR, f"{uuid.uuid4()}.wav")

    # multi-speaker models require speaker_wav
    tts.tts_to_file(
        text=text,
        speaker_wav=speaker_wav,
        language=lang,
        file_path=out_path,
        split_sentences=True,
        use_cuda=torch.cuda.is_available()
    )
    return FileResponse(out_path, media_type="audio/wav")
