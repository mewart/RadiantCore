FROM node:20-alpine

WORKDIR /app

# Copy dependency manifest first for cache
COPY ./package*.json ./
RUN npm install
RUN npm install string-similarity

# Copy app logic
COPY ./ai_mindloop_core.js ./
COPY ./services ./services

EXPOSE 3400
CMD ["node", "ai_mindloop_core.js"]
