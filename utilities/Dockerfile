# Base image
FROM python:3.11-slim

LABEL maintainer="Mark Ewart"
LABEL service="health-server"
LABEL description="Monitors Radiant Core services and exposes unified health endpoints."

# Set workdir
WORKDIR /app

# Copy dependencies
COPY requirements.txt .

# Install with UTF-8 and performance boost
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    LC_ALL=C.UTF-8 \
    LANG=C.UTF-8

RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY health_server.py .

# Expose port for internal and external access
EXPOSE 3400

# Startup
CMD ["uvicorn", "health_server:app", "--host", "0.0.0.0", "--port", "3500"]
