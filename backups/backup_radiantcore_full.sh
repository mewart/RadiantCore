#!/bin/bash

# Radiant Core Full-Snapshot Script (Paranoid-Proof Edition)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SNAPSHOT_NAME="radiantcore_full_backup_$TIMESTAMP"
BACKUP_DIR="/mnt/d/RadiantCore/backups"
TARGET_ZIP="$BACKUP_DIR/$SNAPSHOT_NAME.zip"
SOURCE_DIR="/mnt/d/RadiantCore"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Creating paranoid full-backup at $TARGET_ZIP..."

# Zip everything, excluding common junk folders
zip -r "$TARGET_ZIP" "$SOURCE_DIR"   -x "*.log"   -x "*__pycache__*"   -x "*node_modules*"   -x "*.cache*"   -x "*.DS_Store*"   -x "*.git*"   -x "*venv/Lib/*"   -x "*.zip" > /dev/null

echo "✅ Snapshot complete: $SNAPSHOT_NAME.zip"
