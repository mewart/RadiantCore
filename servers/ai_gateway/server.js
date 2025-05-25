// server.js — AI Voice Gateway + WebSocket Handler

import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { speakText } from './speakText.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = 3600;

// CORS config
const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-api-key'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check route for vitalsigns service
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Root route
app.get('/', (req, res) => {
  res.send('🌑 AI Voice Server is running. POST to /api/chat or GET /health');
});

// POST /api/chat → Unified Core Chat Server
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided.' });
  }

  console.log(`📨 Incoming voice message: ${message}`);

  try {
    const response = await fetch("http://localhost:3300/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    const reply = data.response || "I'm having trouble accessing the core chat server.";

    console.log(`💬 AI replies: ${reply}`);
    res.json({ reply });

    speakText(reply); // Trigger TTS output

  } catch (err) {
    console.error("❌ Error communicating with core chat server:", err);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

// 🧠 WebSocket Connection Handling
wss.on('connection', (socket, req) => {
  console.log('🔌 WebSocket client connected:', req.socket.remoteAddress);

  socket.on('message', (data) => {
    console.log(`📩 WS message received: ${data}`);
    socket.send(`🧠 Echo: ${data}`);
  });

  socket.on('close', () => {
    console.log('❎ WebSocket client disconnected');
  });

  socket.on('error', (err) => {
    console.error('⚠️ WebSocket error:', err);
  });
});

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`🌑 AI Voice Server running at http://0.0.0.0:${port}`);
});
