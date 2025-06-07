#!/bin/bash

echo "🛠  RadiantCore Cloudflared Tunnel Diagnostic Tool"
echo "==============================================="

TUNNEL_ID="63836ec8-7813-4234-9858-69ae70a1c5e7"
CREDENTIALS="/home/mewart/.cloudflared/$TUNNEL_ID.json"
CONFIG="/home/mewart/.cloudflared/config.yml"
DOCKER_CONTAINER="cloudflared"
CONTAINER_CREDENTIALS="/etc/cloudflared/$TUNNEL_ID.json"
CONTAINER_CONFIG="/etc/cloudflared/config.yml"

echo ""
echo "🔍 Checking existence of credentials and config on host..."
if [ -f "$CREDENTIALS" ]; then
  echo "✅ Credentials file found: $CREDENTIALS"
  ls -l "$CREDENTIALS"
else
  echo "❌ Credentials file missing: $CREDENTIALS"
fi

if [ -f "$CONFIG" ]; then
  echo "✅ Config file found: $CONFIG"
  ls -l "$CONFIG"
else
  echo "❌ Config file missing: $CONFIG"
fi

echo ""
echo "🔐 Checking file permissions..."
stat -c "  %A %n" "$CREDENTIALS" "$CONFIG" 2>/dev/null

echo ""
echo "📦 Checking container status..."
docker ps --filter "name=$DOCKER_CONTAINER"

echo ""
echo "🔍 Verifying mounted files inside container..."
docker exec "$DOCKER_CONTAINER" ls -l "$CONTAINER_CREDENTIALS" "$CONTAINER_CONFIG" 2>/dev/null || echo "❌ Cannot access one or more files inside the container."

echo ""
echo "🚀 Log preview (last 10 lines):"
docker logs --tail 10 "$DOCKER_CONTAINER"
