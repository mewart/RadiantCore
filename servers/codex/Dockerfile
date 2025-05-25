# Dockerfile for Codex API — /servers/codex/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/codices

EXPOSE 3200

CMD ["node", "codex_api.js"]
