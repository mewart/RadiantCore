# Dockerfile for stt_ws (Whisper + Silero VAD WebSocket Server)
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# System setup
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    ffmpeg \
    libsndfile1 \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy only required files to avoid context bloat
COPY server.py /app/server.py
COPY custom_silero_vad /app/custom_silero_vad

# Install Python deps
RUN pip3 install --upgrade pip && \
    pip3 install numpy==1.24.4 soundfile websockets \
    torch==2.1.0+cu121 torchaudio==2.1.0+cu121 \
    -f https://download.pytorch.org/whl/torch_stable.html && \
    pip3 install faster-whisper git+https://github.com/snakers4/silero-vad.git && \
    pip3 install fastapi uvicorn
    
# Expose the WebSocket port
EXPOSE 3100

# Run the server
CMD ["python3", "server.py"]

