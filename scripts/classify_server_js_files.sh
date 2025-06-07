#!/bin/bash

# Output file for the JS server analysis
OUTPUT="/mnt/d/RadiantCore/server_js_inventory.md"
echo "# 🧾 server.js Files Index" > "$OUTPUT"
echo "" >> "$OUTPUT"

# Find all server.js files
find /mnt/d -type f -iname "server.js" | while read filepath; do
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
    grep -qi "express" "$filepath" && FRAMEWORKS="$FRAMEWORKS Express"
    grep -qi "ws" "$filepath" && FRAMEWORKS="$FRAMEWORKS WebSocket"
    grep -qi "http.createServer" "$filepath" && FRAMEWORKS="$FRAMEWORKS HTTP"
    grep -qi "cors" "$filepath" && FRAMEWORKS="$FRAMEWORKS CORS"

    if [ -n "$FRAMEWORKS" ]; then
        echo "- 🧠 Frameworks detected:$FRAMEWORKS" >> "$OUTPUT"
    else
        echo "- ❓ No common framework detected" >> "$OUTPUT"
    fi

    echo "" >> "$OUTPUT"
done

echo "✅ JavaScript server inventory complete. Output saved to $OUTPUT"
