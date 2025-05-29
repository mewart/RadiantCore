# Codex API Service — Node.js (Express)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies early for cache optimization
COPY package*.json ./
RUN npm install

# Copy all app files
COPY . .

# Ensure codices directory exists
RUN mkdir -p /app/codices

# Expose Codex API port
EXPOSE 3200

# Start the Codex API server
CMD ["node", "codex_api.js"]
