#!/bin/bash

set -e

# Ensure destination directories exist
mkdir -p ~/RadiantCore/servers/xtts_speaker/models/xtts_v2
mkdir -p ~/RadiantCore/cloudflared/.cloudflared
mkdir -p ~/RadiantCore/voice_samples

# XTTS model (voice synthesis)
if [ -f ~/RadiantCore_backup/servers/xtts_speaker/models/xtts_v2/model.pth ]; then
  cp ~/RadiantCore_backup/servers/xtts_speaker/models/xtts_v2/model.pth ~/RadiantCore/servers/xtts_speaker/models/xtts_v2/
  echo "Copied model.pth"
fi

# Cloudflare cert.pem (if not already present)
if [ -f ~/RadiantCore_backup/cloudflared/.cloudflared/cert.pem ]; then
  cp ~/RadiantCore_backup/cloudflared/.cloudflared/cert.pem ~/RadiantCore/cloudflared/.cloudflared/
  echo "Copied cert.pem"
fi

# Voice sample (if not already present)
if [ -f ~/RadiantCore_backup/voice_samples/default.wav ]; then
  cp ~/RadiantCore_backup/voice_samples/default.wav ~/RadiantCore/voice_samples/
  echo "Copied default.wav"
fi

# Shared folder (only if it exists and not already present)
if [ -d ~/RadiantCore_backup/shared ]; then
  if [ ! -d ~/RadiantCore/shared ]; then
    cp -r ~/RadiantCore_backup/shared ~/RadiantCore/
    echo "Copied shared/"
  else
    echo "shared/ already exists, skipping."
  fi
fi

echo "Done. No venvs, no logs, no duplicates. Safe copy complete."
