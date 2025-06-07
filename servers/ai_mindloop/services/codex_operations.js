// codex_operations.js

import { listCodices, readCodex as rawReadCodex, saveCodex as rawSaveCodex, deleteCodex as rawDeleteCodex } from './codex_client.js';

console.log('🛡️ Codex Operations Module Online...');

// List Codices (no speaking inside service layer)
export async function listCodicesOnly() {
  const codices = await listCodices();
  if (!codices.length) {
    console.log('No Codices found.');
  } else {
    // Log the serialized objects for clarity
    console.log('Codices:', JSON.stringify(codices, null, 2));
  }
  return codices;
}
// Read a Codex
export async function readCodex(uuid) {
  console.log(`🔍 Resolving Codex by UUID: ${uuid}`);
  const response = await rawReadCodex(uuid);
  console.log('Response from Codex API:', JSON.stringify(response, null, 2));
  return response;
}
// Save a Codex
export async function saveCodex(name, content) {
  return await rawSaveCodex(name, content);
}

// Delete a Codex
export async function deleteCodex(uuid) {
  const response = await fetch(`http://codex_api:3200/api/codex/${uuid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'RadiantCoreRules!27x9'
    }
  });

  if (!response.ok) {
    throw new Error('Failed Codex API call');
  }

  return true;
}

