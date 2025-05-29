# Dockerfile for XTTS Speaker Service
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy model files into the container
COPY models/xtts_v2 /app/models/xtts_v2

# Copy main server script
COPY xtts_server.py /app/xtts_server.py

# Install dependencies with cache disabled for slim image hygiene
RUN pip install --no-cache-dir TTS fastapi uvicorn

# Ensure output directory exists (for audio)
RUN mkdir -p /app/outputs

# Expose service port
EXPOSE 3700

# Start the XTTS FastAPI server
CMD ["uvicorn", "xtts_server:app", "--host", "0.0.0.0", "--port", "3700"]
