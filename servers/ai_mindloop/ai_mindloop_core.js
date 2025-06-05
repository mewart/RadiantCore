// AI Mind Loop
// D:/RadiantCore/servers/ai_mindloop/ai_mindloop_core.js

import {
  listCodices,
  readCodex,
  saveCodex,
  deleteCodex
} from './services/codex_client.js';

import WebSocket from 'ws';

console.log('🛡️ AI Mind Loop Engaged...');

let socket;

// List 
async function logAndListCodices() {
  const codices = await listCodices();
  console.log('Codices:', JSON.stringify(codices, null, 2));
  return codices;
}

// Connect to AI Voice Server with Retry Logic
function connectToVoiceServer() {
  // 🔥 CHANGED: Use Docker service name for WebSocket connection!
  socket = new WebSocket('ws://stt_ws:3100/ws/stt');

  socket.on('open', () => {
    console.log('🛡️ Connected to AI Voice Server (Port 3100)');
    // startThoughtCycle(); // Removed because it's not defined
    console.log('🛡️ Ready for commands.');
  });

  socket.on('error', (error) => {
    console.error('🛡️ Error connecting to AI Voice Server:', error);
    console.log('🛡️ Retrying connection to Voice Server in 3 seconds...');
    setTimeout(connectToVoiceServer, 3000);
  });


  socket.on('close', () => {
    console.log('🛡️ Voice Server connection closed. Retrying...');
    setTimeout(connectToVoiceServer, 3000);
  });
}

// Speak Helper Function
function speak(text) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(text.toString());
  } else {
    console.error('🛡️ Voice Server not connected. Cannot speak.');
  }
}

// Delay Helper Function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Launch
connectToVoiceServer();
