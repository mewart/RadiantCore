# Dockerfile — AI Gateway Service (Voice Handler + API Proxy)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json if available (ensures dependencies are installed correctly)
COPY package*.json ./

# Install dependencies listed in package.json
RUN npm install

# Copy all source code (application)
COPY . .

# Expose the gateway port
EXPOSE 3600

# Start the unified voice gateway server with memory limit
CMD ["node", "--max-old-space-size=4096", "server.js"]
