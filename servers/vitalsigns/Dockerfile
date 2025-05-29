# Dockerfile for vitalsigns — Health Monitoring Service
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# System utilities (e.g. for internal service checks)
RUN apt-get update && apt-get install -y curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy service code
COPY vitalsigns_server.py .

# Install required Python packages
RUN pip install --no-cache-dir fastapi uvicorn httpx

# Expose the internal health monitoring port
EXPOSE 3500

# Start the server
CMD ["uvicorn", "vitalsigns_server:app", "--host", "0.0.0.0", "--port", "3500"]
