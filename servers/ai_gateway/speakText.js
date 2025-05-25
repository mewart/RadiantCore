// speakText.js — Uses ElevenLabs API to synthesize and play speech from a text string
import fetch from 'node-fetch';
import fs from 'fs';
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

export async function speakText(text) {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // default if needed
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.error("❌ ELEVENLABS_API_KEY not set in .env");
    return;
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.9
        }
      })
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const outputPath = './output.mp3';
    fs.writeFileSync(outputPath, buffer);
    exec(`start ${outputPath}`); // Windows-specific playback

  } catch (err) {
    console.error("🧨 TTS failed:", err);
  }
}
