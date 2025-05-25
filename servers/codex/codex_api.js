// codex_api.js — PostgreSQL-Integrated Codex API with file fallback and full CRUD

console.log("🚨 Codex API server is starting up...");

import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();
const PORT = 3200;
const API_KEY = process.env.CODEX_API_KEY || 'RadiantCoreRules!27x9';

const pool = new Pool({
  host: '192.168.208.1',
  port: 5432,
  user: 'postgres',
  password: 'RadiantCoreMaster2025!',
  database: 'radiant_core'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CODEX_DIR = path.join(__dirname, 'codices');

app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync(CODEX_DIR)) {
  fs.mkdirSync(CODEX_DIR, { recursive: true });
  console.log('[INIT] Created codices directory at', CODEX_DIR);
} else {
  console.log('[INIT] Codices directory exists at', CODEX_DIR);
}

const codexRouter = express.Router();

codexRouter.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    console.warn('[AUTH] Unauthorized request.');
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
});

codexRouter.get('/list', async (req, res) => {
  try {
    const files = fs.readdirSync(CODEX_DIR).filter(file => file.endsWith('.json'));
    const entries = files.map(file => {
      const content = fs.readFileSync(path.join(CODEX_DIR, file), 'utf8');
      const json = JSON.parse(content);
      return { uuid: file.replace('.json', ''), ...json };
    });
    res.json(entries);
  } catch (err) {
    console.error('❌ Failed to list Codices:', err.message);
    res.status(500).json({ error: 'Failed to list codices' });
  }
});

codexRouter.post('/add', async (req, res) => {
  const entry = req.body;
  if (!entry.title || !entry.body) {
    return res.status(400).json({ error: 'Title and body are required.' });
  }
  const uuid = uuidv4();
  const filePath = path.join(CODEX_DIR, `${uuid}.json`);

  try {
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf8');
    console.log(`[SAVE] Codex saved as ${uuid}.json`);
  } catch (err) {
    return res.status(500).json({ error: 'Internal File Save Error' });
  }

  try {
    const { title, body, tags = [], version = 1, codex_id = 0 } = entry;
    await pool.query(
      `INSERT INTO codex_entry (uuid_id, codex_id, entry_title, entry_body, tags, version)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (uuid_id) DO NOTHING`,
      [uuid, codex_id, title, body, tags, version]
    );
    res.json({ message: 'Codex entry saved and inserted.', id: uuid });
  } catch (err) {
    console.error('[DB INSERT ERROR]', err.message);
    res.status(500).json({ error: 'PostgreSQL Insert Error' });
  }
});

codexRouter.put('/update/:uuid_id', async (req, res) => {
  const { uuid_id } = req.params;
  const { title, body, tags, version } = req.body;

  try {
    const result = await pool.query(
      `UPDATE codex_entry
       SET entry_title = $1,
           entry_body = $2,
           tags = $3,
           version = $4,
           updated_at = NOW()
       WHERE uuid_id = $5`,
      [title, body, tags || [], version || 1, uuid_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Codex entry not found.' });
    }

    res.json({ message: 'Codex entry updated.' });
  } catch (err) {
    console.error('[DB UPDATE ERROR]', err.message);
    res.status(500).json({ error: 'Failed to update codex entry' });
  }
});

codexRouter.delete('/delete/:uuid_id', async (req, res) => {
  const { uuid_id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM codex_entry WHERE uuid_id = $1`, [uuid_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Codex entry not found.' });
    }
    res.json({ message: 'Codex entry deleted.' });
  } catch (err) {
    console.error('[DB DELETE ERROR]', err.message);
    res.status(500).json({ error: 'Failed to delete codex entry' });
  }
});

codexRouter.get('/db', async (req, res) => {
  const { since, tag, codex_id } = req.query;
  let query = `SELECT uuid_id, codex_id, entry_title, entry_body, tags, version, created_at, updated_at FROM codex_entry`;
  const conditions = [];
  const values = [];

  if (since) {
    values.push(since);
    conditions.push(`updated_at >= $${values.length}`);
  }
  if (tag) {
    values.push(tag);
    conditions.push(`$${values.length} = ANY(tags)`);
  }
  if (codex_id) {
    values.push(parseInt(codex_id));
    conditions.push(`codex_id = $${values.length}`);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY updated_at DESC';

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('[DB QUERY ERROR]', err.message);
    res.status(500).json({ error: 'DB query failed' });
  }
});

codexRouter.get('/milestones/db', async (req, res) => {
  const { since } = req.query;
  const values = ['milestone'];
  let query = `
    SELECT uuid_id, codex_id, entry_title, entry_body, tags, version, created_at, updated_at
    FROM codex_entry
    WHERE ($1 = ANY(tags) OR entry_title ILIKE '%milestone%')`;

  if (since) {
    query += ` AND updated_at >= $2`;
    values.push(since);
  }

  query += ` ORDER BY updated_at DESC`;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('[DB MILESTONE ERROR]', err.message);
    res.status(500).json({ error: 'Failed to fetch milestone entries from DB.' });
  }
});

app.get('/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error('[PING ERROR]', err.message);
    res.status(500).json({ error: 'Database unreachable' });
  }
});

app.use('/api/codex', codexRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📘 Codex API w/ PostgreSQL running at http://localhost:${PORT}`);
});
