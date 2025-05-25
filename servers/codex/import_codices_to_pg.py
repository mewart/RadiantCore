# import_codices_to_pg.py — UUID-based Codex Importer

import os
import json
import psycopg2
from psycopg2.extras import execute_values
from uuid import uuid4

# CONFIG
CODEX_DIR = "/mnt/d/RadiantCore/codex_server/codices/all_json"
DB_CONFIG = {
    "host": "192.168.208.1",
    "port": 5432,
    "database": "radiant_core",
    "user": "postgres",
    "password": "RadiantCoreMaster2025!"
}

entries = []
detected_files = []
skipped_files = []

print("🔍 Scanning directory for codices:", CODEX_DIR)
all_files = os.listdir(CODEX_DIR)
print(f"📦 Found {len(all_files)} total files: {all_files}")

for filename in all_files:
    path = os.path.join(CODEX_DIR, filename)
    if not os.path.isfile(path):
        continue

    codex_key = os.path.splitext(filename)[0]
    ext = os.path.splitext(filename)[1].lower()

    print(f"🔎 Found file: {filename} (.{ext})")

    if ext == ".json":
        try:
            with open(path, "r", encoding="utf-8") as file:
                data = json.load(file)
                tags = data.get("tags", [])
                if not isinstance(tags, list):
                    tags = [str(tags)]

                entries.append({
                    "uuid_id": str(uuid4()),
                    "title": data.get("title", codex_key),
                    "body": data.get("body", ""),
                    "tags": tags,
                    "version": 1
                })
                detected_files.append(filename)
        except Exception as e:
            print(f"❌ Failed to parse JSON: {filename} → {e}")
            skipped_files.append((filename, str(e)))

    elif ext == ".txt":
        try:
            with open(path, "r", encoding="utf-8") as file:
                lines = file.readlines()
                title = lines[0].strip() if lines else codex_key
                body = "".join(lines[1:]).strip() if len(lines) > 1 else ""

                entries.append({
                    "uuid_id": str(uuid4()),
                    "title": title,
                    "body": body,
                    "tags": [],
                    "version": 1
                })
                detected_files.append(filename)
        except Exception as e:
            print(f"❌ Failed to parse TXT: {filename} → {e}")
            skipped_files.append((filename, str(e)))

    else:
        print(f"⚠️ Unsupported file extension: {filename}")
        skipped_files.append((filename, "Unsupported file extension"))

print(f"📊 Prepared {len(entries)} valid entries for DB import")

if not entries:
    print("⚠️ No valid codex entries found to import.")
else:
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    entry_tuples = [
    (
        str(uuid4()),
        0,
        e["title"],
        e["body"],     # ← ✅ CORRECT
        e["tags"],
        1
    ) for e in entries
]

    execute_values(cursor, """
    INSERT INTO codex_entry (
        uuid_id, codex_id, entry_title, entry_body, tags, version
    )
    VALUES %s
    ON CONFLICT (uuid_id) DO NOTHING
""", entry_tuples)

    conn.commit()
    cursor.close()
    conn.close()

print(f"✅ Imported {len(entries)} codices into PostgreSQL.")
print(f"📁 Detected and imported files: {detected_files}")
if skipped_files:
    print("⚠️ Skipped files:")
    for name, reason in skipped_files:
        print(f"  - {name}: {reason}")
