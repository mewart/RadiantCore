// Reprocess all codices in codices/ using saveCodex()

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveCodex } from '../services/codex_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to your codices folder
const CODEX_IMPORT_DIR = path.resolve(__dirname, '../../codex/codices');

(async () => {
  const files = fs
    .readdirSync(CODEX_IMPORT_DIR)
    .filter(f => f.endsWith('.json') && f !== '_done' && !fs.statSync(path.join(CODEX_IMPORT_DIR, f)).isDirectory());

  console.log(`🔁 Reprocessing ${files.length} codices...`);

  for (const file of files) {
    try {
      const fullPath = path.join(CODEX_IMPORT_DIR, file);
      const json = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      const title = json.title;
      const body = json.body;
      const result = await saveCodex(title, body);
      console.log(`✅ Processed ${file}: ${result.status}`);
    } catch (err) {
      console.error(`❌ Failed to process ${file}: ${err.message}`);
    }
  }

  console.log('🏁 Reprocessing complete.');
})();
