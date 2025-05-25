# Base Python image
FROM python:3.11-slim

# Working directory
WORKDIR /app

# Copy project files
COPY ai_api_server.py .
COPY requirements.txt .
COPY .env .env

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (adjust if needed)
EXPOSE 3300

# Launch FastAPI server
CMD ["uvicorn", "ai_api_server:app", "--host", "0.0.0.0", "--port", "3300"]
