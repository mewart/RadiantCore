#!/bin/bash
echo "🧠 Starting WSL-side Damian services in current shell..."

PROJECT_ROOT=~/RadiantCore
VENV="$PROJECT_ROOT/.venv/bin/activate"

if [ ! -f "$VENV" ]; then
    echo "❌ Shared virtual environment not found at $VENV"
    exit 1
fi

source "$VENV"

# Start each service in background
cd "$PROJECT_ROOT/servers/damian" && python damian_server.py &
cd "$PROJECT_ROOT/codex_server" && python codex_api.py &
cd "$PROJECT_ROOT" && uvicorn utilities.health_server:app --host 0.0.0.0 --port 8000 --reload &
cd "$PROJECT_ROOT/servers/stt_ws" && python stt_ws_server.py &

echo "✅ All WSL-side services launched."
