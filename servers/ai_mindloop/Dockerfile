FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ai_mindloop_core.js ./
COPY services ./services

EXPOSE 3400

CMD ["node", "ai_mindloop_core.js"]
