# AI Mindloop Service - Main Mind Loop (Node.js)
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies (including string-similarity and ws)
COPY package*.json ./
RUN npm install && npm install string-similarity ws

# Copy remaining app files
COPY ai_mindloop_core.js ./
COPY services ./services

# Expose service port
EXPOSE 3400

# Run the mindloop service
CMD ["node", "ai_mindloop_core.js"]
