import asyncio
import websockets
import numpy as np
import soundfile as sf
import tempfile
import os
import json
import torch
import socket

from faster_whisper import WhisperModel
from custom_silero_vad import SileroVad
from websockets.server import serve
from websockets.exceptions import ConnectionClosed

# === CONFIGURATION ===
PORT = 3100
SAMPLE_RATE = 16000
VAD_CHUNK_MS = 500

# === DEVICE SAFETY LOGIC ===
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
DEVICE_INDEX = 0  # Always set to 0 — CTranslate2 requires int, even for CPU

print(f"\U0001f9e0 Loading Whisper on {DEVICE.upper()} device {DEVICE_INDEX if DEVICE_INDEX is not None else ''}...")
whisper_model = WhisperModel("base.en", device=DEVICE, device_index=DEVICE_INDEX)

print("\U0001f3a7 Initializing Silero VAD...")
vad = SileroVad()
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# === CONNECTION HANDLER ===
async def handle_connection(websocket, path):
    print(f"\U0001f50c Client connected: {path}")
    audio_buffer = bytearray()
    vad_window = bytearray()
    silence_count = 0
    speaking = False

    try:
        async for message in websocket:
            print(f"\U0001f3a7 Received {len(message)} bytes")

            if not isinstance(message, bytes):
                print(f"\u26a0\ufe0f Unexpected message type: {type(message)}")
                continue

            audio_buffer.extend(message)
            vad_window.extend(message)

            min_chunk_size = int(SAMPLE_RATE * 4 * (VAD_CHUNK_MS / 1000))  # 4 bytes per float32
            if len(vad_window) >= min_chunk_size:
                print(f"\U0001f9ea VAD chunk ready: {len(vad_window)} bytes")
                try:
                    float_audio = np.frombuffer(vad_window, dtype=np.float32)
                    vad_window = bytearray()

                    if len(float_audio) >= 512:
                        trimmed_audio = float_audio[-512:]
                        with torch.no_grad():
                            audio_tensor = torch.from_numpy(trimmed_audio).unsqueeze(0)
                            vad_result = vad(audio_tensor, SAMPLE_RATE)
                    else:
                        vad_result = False

                    print(f"\U0001f9ea VAD result: {vad_result}")
                except Exception as e:
                    print(f"\U0001f525 VAD error: {e}")
                    vad_result = False

                if vad_result:
                    print("\U0001f7e2 Voice detected")
                    speaking = True
                    silence_count = 0
                elif speaking:
                    silence_count += 1
                    print(f"\U0001f534 Silence detected (#{silence_count})")

                if speaking and silence_count > 3:
                    print("✂️ Finalizing buffer and transcribing...")

                    if len(audio_buffer) == 0:
                        print("\u26a0\ufe0f Audio buffer empty — skipping")
                        speaking = False
                        audio_buffer = bytearray()
                        continue

                    if len(audio_buffer) % 4 != 0:
                        print(f"\u26a0\ufe0f Buffer size {len(audio_buffer)} not divisible by 4 — skipping")
                        speaking = False
                        audio_buffer = bytearray()
                        continue

                    try:
                        float_audio = np.frombuffer(audio_buffer, dtype=np.float32)

                        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
                            sf.write(tmp_file, float_audio, SAMPLE_RATE, format="WAV")
                            tmp_path = tmp_file.name

                        segments, _ = whisper_model.transcribe(tmp_path)
                        transcript = " ".join([seg.text for seg in segments]).strip()
                        os.remove(tmp_path)

                        print(f"\u2705 Transcript: {transcript}")

                        if transcript:
                            await websocket.send(json.dumps({
                                "type": "transcript",
                                "text": transcript
                            }))
                        else:
                            print("\u26a0\ufe0f No transcript detected")

                    except Exception as e:
                        print(f"\U0001f525 Transcription error: {e}")

                    audio_buffer = bytearray()
                    silence_count = 0
                    speaking = False

    except ConnectionClosed:
        print("❌ Client disconnected")
    except Exception as e:
        print(f"\U0001f525 Exception in connection: {e}")

# === SERVER LAUNCH ===
async def main():
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"\U0001f4e1 Listening from: {local_ip}:{PORT}")
    print(f"🚀 Whisper STT server listening on ws://0.0.0.0:{PORT}/ws/stt")

    async with serve(handle_connection, "0.0.0.0", PORT):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    print("✅ Running stt_ws_server.py directly")
    asyncio.run(main())
