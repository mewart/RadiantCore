// codex_client.js — Local Codex Operations with Error Debugging and UUID resolution

import fetch from 'node-fetch';
import stringSimilarity from 'string-similarity';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API_URL = "http://codex_api:3200/api/codex";
const API_KEY = process.env.CODEX_API_KEY || 'RadiantCoreRules!27x9';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CODEX_IMPORT_DIR = path.resolve(__dirname, '../servers/codex/codices');
const CODEX_DONE_DIR = path.join(CODEX_IMPORT_DIR, '_done');

try {
  fs.mkdirSync(CODEX_DONE_DIR, { recursive: true });
  const dispositionFolders = ['saved', 'skipped_similarity_90+', 'existing_title', 'invalid_format', 'errored'];
  dispositionFolders.forEach(folder => fs.mkdirSync(path.join(CODEX_DONE_DIR, folder), { recursive: true }));
  console.log(`📁 Ensured archive folders exist in: ${CODEX_DONE_DIR}`);
} catch (err) {
  console.error(`❌ Failed to create _done archive folders: ${err.message}`);
}

async function request(endpoint, method = 'GET', body) {
  try {
    if (body) {
      if (typeof body === 'string') {
        console.warn('⚠️ Body appears to be a string. Likely already stringified:', body.slice(0, 100));
      } else {
        console.log('📦 Sending JSON body:', JSON.stringify(body, null, 2));
      }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Codex API [${res.status}]: ${errText}`);
      throw new Error('Failed Codex API call');
    }

    return await res.json();
  } catch (err) {
    console.error(`🔥 Codex API exception: ${err.message}`);
    throw err;
  }
}

export async function listCodices() {
  console.log(`🌐 Fetching codices from ${API_URL}/list`);
  return await request('/list');
}

export async function readCodex(uuid) {
  return await request(`/db?uuid=${uuid}`);
}

export async function saveCodex(name, content, promptIfExists = false) {
  const codices = await listCodices();
  const exists = codices.find(c => c.title.trim().toLowerCase() === name.trim().toLowerCase());

  if (exists) {
    const similarity = stringSimilarity.compareTwoStrings(content.trim(), exists.body?.trim() || '');
    console.log(`🧮 Content similarity to existing codex: ${(similarity * 100).toFixed(2)}%`);

    const disposition = similarity >= 0.9
      ? 'skipped_similarity_90+'
      : 'existing_title';

    await moveCodexFile(name, disposition);

    if (similarity >= 0.9) {
      console.warn(`⚠️ Codex titled "${name}" has highly similar content. Skipping save.`);
      return { message: 'Codex content is very similar to existing entry', similarity, existing: exists, status: 'duplicate' };
    }

    if (promptIfExists) {
      console.warn(`⚠️ Codex titled "${name}" already exists (UUID: ${exists.uuid}). Prompt user for overwrite confirmation in UI.`);
      return { message: 'Codex already exists', similarity, existing: exists, status: 'exists' };
    } else {
      console.warn(`⚠️ Codex titled "${name}" already exists. Skipping save.`);
      return { message: 'Codex already exists', existing: exists, status: 'exists' };
    }
  }

  const entry = {
    title: name,
    body: content,
    tags: ['default'],
    version: 1,
    codex_id: 0
  };

  const response = await request('/add', 'POST', entry);
  await moveCodexFile(name, 'saved');
  return { ...response, status: 'saved' };
}

async function moveCodexFile(filename, disposition) {
  const srcPath = path.join(CODEX_IMPORT_DIR, filename);
  const destDir = path.join(CODEX_DONE_DIR, disposition);
  const destPath = path.join(destDir, filename);

  try {
    fs.mkdirSync(destDir, { recursive: true });
    if (fs.existsSync(srcPath)) {
      fs.renameSync(srcPath, destPath);
      console.log(`📂 Moved processed codex to: ${destPath}`);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to move ${filename} to disposition folder:`, err.message);
  }
}

export async function deleteCodex(identifier) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  let uuid = identifier;

  if (!uuidRegex.test(identifier)) {
    console.log(`🔍 Resolving title to UUID: ${identifier}`);
    const codices = await listCodices();
    const match = codices.find(c => c.title.trim().toLowerCase() === identifier.trim().toLowerCase());
    if (!match) {
      console.warn(`⚠️ No codex found with title "${identifier}", skipping delete.`);
      return { status: 'not_found' };
    }
    uuid = match.uuid;
  }

  return await request(`/delete/${uuid}`, 'DELETE');
}
