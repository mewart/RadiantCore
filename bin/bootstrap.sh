#!/usr/bin/env bash
set -e

YQ_BIN=/usr/local/bin/yq
NEED_YQ=true

# If yq is on PATH and already v4, we’re done
if command -v yq >/dev/null 2>&1; then
  if yq --version | grep -q 'version 4'; then
    NEED_YQ=false
  fi
fi

if $NEED_YQ; then
  echo "Installing yq v4 …"
  sudo wget -qO "$YQ_BIN" \
    https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
  sudo chmod +x "$YQ_BIN"
fi

echo "✅ $(yq --version) ready"
