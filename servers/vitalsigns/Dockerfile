FROM python:3.11-slim

WORKDIR /app
COPY vitalsigns_server.py .

# ✅ Add curl here
RUN apt-get update && apt-get install -y curl && \
    pip install fastapi uvicorn httpx

CMD ["uvicorn", "vitalsigns_server:app", "--host", "0.0.0.0", "--port", "3600"]
