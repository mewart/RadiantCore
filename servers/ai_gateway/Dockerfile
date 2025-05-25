# Dockerfile — AI Gateway Service (Voice Handler + API Proxy)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose the gateway port
EXPOSE 3600

# Start the unified voice gateway server with memory limit
CMD ["node", "--max-old-space-size=4096", "server.js"]
