FROM python:3.10-slim
WORKDIR /app

# Install OS deps
RUN apt update && apt install -y \
    git ffmpeg libsndfile1 build-essential cmake curl \
 && rm -rf /var/lib/apt/lists/*

# Install Coqui TTS and FastAPI/UVicorn
RUN pip install --upgrade pip \
 && pip install --no-cache-dir \
      git+https://github.com/coqui-ai/TTS.git@dev \
      fastapi==0.110.0 uvicorn==0.27.1

# Copy server & leave model/voice_samples as volumes
COPY xtts_server.py .

CMD ["uvicorn", "xtts_server:app", "--host", "0.0.0.0", "--port", "3300"]
