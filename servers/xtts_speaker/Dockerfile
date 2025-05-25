FROM python:3.10-slim

WORKDIR /app

# Copy local model files (now inside build context)
COPY models/xtts_v2 /app/models/xtts_v2

# Copy server file
COPY xtts_server.py /app/xtts_server.py

# Install Python dependencies
RUN pip install --no-cache-dir TTS fastapi uvicorn

# Make sure output folder exists
RUN mkdir -p /app/outputs

# Expose port for local API access
EXPOSE 3700

# Start the FastAPI XTTS service
CMD ["uvicorn", "xtts_server:app", "--host", "0.0.0.0", "--port", "3700"]
