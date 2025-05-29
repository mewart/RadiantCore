# Dockerfile for stt_ws — Whisper + Silero VAD (GPU-enabled)
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# Avoid prompts during package install
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    ffmpeg \
    libsndfile1 \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy source code
COPY server.py ./server.py
COPY custom_silero_vad ./custom_silero_vad

# Install Python dependencies
RUN pip3 install --upgrade pip && \
    pip3 install numpy==1.24.4 soundfile websockets && \
    pip3 install torch==2.1.0+cu121 torchaudio==2.1.0+cu121 \
      -f https://download.pytorch.org/whl/torch_stable.html && \
    pip3 install faster-whisper git+https://github.com/snakers4/silero-vad.git && \
    pip3 install fastapi uvicorn

# Expose STT WebSocket server port
EXPOSE 3100

# Start server
CMD ["python3", "server.py"]
