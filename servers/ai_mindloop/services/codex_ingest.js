// codex_ingest.js — Scan codices folder and attempt save+disposition

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveCodex } from '../../services/codex_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CODEX_IMPORT_DIR = path.resolve(__dirname, '../servers/codex/codices');

console.log(`📥 Scanning Codices in: ${CODEX_IMPORT_DIR}`);

async function processCodices() {
  const files = fs.readdirSync(CODEX_IMPORT_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.log('📭 No new codices found.');
    return;
  }

  for (const file of files) {
    const fullPath = path.join(CODEX_IMPORT_DIR, file);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const data = JSON.parse(content);
      const title = data.title || file;

      console.log(`🧠 Ingesting Codex: ${title}`);
      const result = await saveCodex(title, data.body || JSON.stringify(data, null, 2));

      console.log(`✅ Result: ${result.status}`);
    } catch (err) {
      console.error(`❌ Failed to process ${file}: ${err.message}`);
      // Let saveCodex() handle error folder placement
    }
  }
}

processCodices();
