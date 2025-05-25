from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from TTS.api import TTS
import uuid
import os

# ✅ Register all required classes to prevent pickle unpickling errors
from torch.serialization import add_safe_globals
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsAudioConfig, XttsArgs
from TTS.config.shared_configs import BaseDatasetConfig

add_safe_globals([XttsConfig, XttsAudioConfig, XttsArgs, BaseDatasetConfig])

MODEL_DIR = "/app/models/xtts_v2"
CONFIG_PATH = os.path.join(MODEL_DIR, "config.json")
OUTPUT_DIR = "/app/outputs"

os.makedirs(OUTPUT_DIR, exist_ok=True)

app = FastAPI()
tts = TTS(model_path=MODEL_DIR, config_path=CONFIG_PATH, gpu=False)

@app.get("/health")
def health():
    return { "status": "healthy" }

@app.post("/api/speak_local")
async def speak_local(request: Request):
    body = await request.json()
    text = body.get("text", "Hello, world.")
    output_path = os.path.join(OUTPUT_DIR, f"{uuid.uuid4()}.wav")

    tts.tts_to_file(
        text=text,
        speaker_wav="D:/RadiantCore/voice_samples/default.wav",  # Use the ElevenLabs voice sample
        language="en",
        file_path=output_path,
        split_sentences=True,
        use_cuda=False
    )

    return FileResponse(output_path, media_type="audio/wav")
