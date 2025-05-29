#!/bin/bash

# Output file for the analysis report
OUTPUT="/mnt/d/RadiantCore/server_py_inventory.md"
echo "# 🧾 server.py Files Index" > "$OUTPUT"
echo "" >> "$OUTPUT"

# Find all server.py files
find /mnt/d -type f -iname "server.py" | while read filepath; do
    echo "## $filepath" >> "$OUTPUT"

    # Get last modified date
    MODIFIED=$(stat -c %y "$filepath" | cut -d'.' -f1)
    echo "- 🕒 Last modified: $MODIFIED" >> "$OUTPUT"

    # Check for port usage
    PORTS=$(grep -oE "port\s*=\s*[0-9]+" "$filepath" | awk -F= '{print $2}' | xargs)
    if [ -n "$PORTS" ]; then
        echo "- 🌐 Binds to port(s): $PORTS" >> "$OUTPUT"
    fi

    # Scan for known server frameworks
    FRAMEWORKS=""
    grep -qi "fastapi" "$filepath" && FRAMEWORKS="$FRAMEWORKS FastAPI"
    grep -qi "flask" "$filepath" && FRAMEWORKS="$FRAMEWORKS Flask"
    grep -qi "express" "$filepath" && FRAMEWORKS="$FRAMEWORKS Express"
    grep -qi "uvicorn.run" "$filepath" && FRAMEWORKS="$FRAMEWORKS Uvicorn"
    grep -qi "websockets" "$filepath" && FRAMEWORKS="$FRAMEWORKS Websockets"
    grep -qi "serve(" "$filepath" && FRAMEWORKS="$FRAMEWORKS serve()"

    if [ -n "$FRAMEWORKS" ]; then
        echo "- 🧠 Frameworks detected:$FRAMEWORKS" >> "$OUTPUT"
    else
        echo "- ❓ No common framework detected" >> "$OUTPUT"
    fi

    echo "" >> "$OUTPUT"
done

echo "✅ Inventory complete. Output saved to $OUTPUT"
