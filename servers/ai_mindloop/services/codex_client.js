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

// ✅ FIXED: Corrected relative path to actual codices folder
const CODEX_IMPORT_DIR = path.resolve(__dirname, '../../codex/codices');
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

  // 🧠 Attempt to find the actual codex file by matching .title field
  const files = fs.readdirSync(CODEX_IMPORT_DIR).filter(f => f.endsWith('.json'));
  let actualFilename = null;

  for (const f of files) {
    try {
      const filePath = path.join(CODEX_IMPORT_DIR, f);
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (fileData.title?.trim().toLowerCase() === name.trim().toLowerCase()) {
        actualFilename = f;
        break;
      }
    } catch (err) {
      console.warn(`⚠️ Could not parse ${f}:`, err.message);
    }
  }

  if (!actualFilename) {
    console.warn(`⚠️ No matching file found in codices/ for title "${name}". Disposition may be skipped.`);
  }

  // 🔍 Check if this codex already exists in the DB
  const existing = codices.find(c => c.title.trim().toLowerCase() === name.trim().toLowerCase());

  if (existing) {
    const similarity = stringSimilarity.compareTwoStrings(content.trim(), existing.body?.trim() || '');
    const status = similarity >= 0.9 ? 'skipped_similarity_90+' : 'existing_title';

    if (actualFilename) {
      await moveCodexFile(actualFilename, status);
    }

    return {
      status,
      similarity,
      existing,
      proposed: { title: name, body: content }
    };
  }

  // 🚀 New codex - submit to API
  const entry = {
    title: name,
    body: content,
    tags: ['default'],
    version: 1,
    codex_id: 0
  };

  const response = await request('/add', 'POST', entry);

  if (actualFilename) {
    await moveCodexFile(actualFilename, 'saved');
  }

  return { ...response, status: 'saved' };
}

async function moveCodexFile(filename, disposition) {
  const srcPath = path.join(CODEX_IMPORT_DIR, filename);
  const destDir = path.join(CODEX_DONE_DIR, disposition);
  const destPath = path.join(destDir, filename);

  try {
    console.log(`🔁 Attempting to move file: ${filename}`);
    console.log(`   From: ${srcPath}`);
    console.log(`   To:   ${destPath}`);

    // Ensure destination folder exists
    fs.mkdirSync(destDir, { recursive: true });

    if (!fs.existsSync(srcPath)) {
      console.warn(`❌ Source file not found: ${srcPath}`);
      return;
    }

    try {
      fs.renameSync(srcPath, destPath);
      console.log(`✅ File moved to: ${destPath}`);
    } catch (renameErr) {
      console.warn(`⚠️ Rename failed. Attempting fallback copy/delete...`, renameErr.message);
      fs.copyFileSync(srcPath, destPath);
      fs.unlinkSync(srcPath);
      console.log(`✅ File copied and deleted as fallback: ${destPath}`);
    }
  } catch (err) {
    console.error(`❌ moveCodexFile() failed:`, err.message);
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
