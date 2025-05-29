#!/bin/bash

# Source and destination directories
SRC="/mnt/c/Projects/RadiantCore"
DST="/mnt/d/RadiantCore"

# Output file
OUTFILE="$HOME/filtered_diff_results.txt"
> "$OUTFILE"

# Ignore patterns
IGNORE_PATTERNS=(
  ".git"
  ".venv"
  "node_modules"
  "__pycache__"
  ".DS_Store"
  ".idea"
  ".vscode"
  ".mypy_cache"
  ".pytest_cache"
)

echo "🧠 Starting filtered diff..."
echo "Comparing: $SRC ↔ $DST"
echo "Output will be saved to: $OUTFILE"

# Use diff -rq and filter output
diff -rq "$SRC" "$DST" | while read -r line; do
  skip=false
  for ignore in "${IGNORE_PATTERNS[@]}"; do
    if [[ "$line" == *"$ignore"* ]]; then
      skip=true
      break
    fi
  done
  if ! $skip; then
    echo "$line" >> "$OUTFILE"
  fi
done

echo "✅ Filtered diff complete. Output file: $OUTFILE"
