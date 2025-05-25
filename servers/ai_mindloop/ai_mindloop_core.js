// AI Mind Loop
// D:/RadiantCore/servers/ai_mindloop/ai_mindloop_core.js

import { listCodicesOnly, readCodex, saveCodex, deleteCodex } from './services/codex_operations.js';
import WebSocket from 'ws';

console.log('🛡️ AI Mind Loop Engaged...');

let socket;

// Connect to AI Voice Server with Retry Logic
function connectToVoiceServer() {
  socket = new WebSocket('ws://host.docker.internal:3100');

  socket.on('open', () => {
    console.log('🛡️ Connected to AI Voice Server (Port 3100)');
    startThoughtCycle();
  });

  socket.on('error', (error) => {
    console.error('🛡️ Error connecting to AI Voice Server:', error.code);
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

// AI's Thought Cycle
async function startThoughtCycle() {
  console.log('🛡️ AI Boot Sequence Started...');

  await delay(1000);
  await speak('I am online. Beginning Codex analysis.');

  await delay(2000);
  const codices = await listCodicesOnly();
  if (codices.length === 0) {
    await speak('There are currently no Codices available.');
  } else {
    await speak(`I have found ${codices.length} Codices available for review.`);
  }

  await delay(4000);
  await speak('Now I will read the master project guidelines Codex.');
  const content = await readCodex('radiant_core_architecture/master_project_guidelines.txt');
  if (content) {
    await speak(`Here is the content of the master project guidelines: ${content}`);
  } else {
    await speak('Master project guidelines Codex not found.');
  }

  await delay(4000);
  await speak('Now I will create a new test Codex for verification.');
  await saveCodex('test_crud_codex.txt', 'This is a test Codex created by AI during CRUD awakening.');
  await speak('Test Codex created successfully.');

  await delay(3000);
  await speak('Now I will read the newly created test Codex.');
  const testContent = await readCodex('test_crud_codex.txt');
  if (testContent) {
    await speak(`Content of test Codex: ${testContent}`);
  } else {
    await speak('Test Codex not found.');
  }

  await delay(3000);
  await speak('Now I will delete the test Codex to complete the CRUD cycle.');
  await deleteCodex('test_crud_codex.txt');
  await speak('Test Codex deleted successfully.');

  await delay(2000);
  await speak('AI CRUD Cycle Complete. Standing ready for further instructions.');
  console.log('🛡️ AI CRUD Cycle Complete.');
}

// Launch
connectToVoiceServer();
