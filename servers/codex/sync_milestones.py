import requests

url = "http://localhost:3300/api/codex/add"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "RadiantCoreRules!27x9"
}

entries = [
    {
        "title": "Port Allocation – Local Development Environment",
        "body": (
            "To avoid port conflicts, the following ports are reserved by convention:\n\n"
            "- 3000 → Reserved by other local UIs (default Next.js port)\n"
            "- 3100 → AI Voice Server (WebSocket + HTTP)\n"
            "- 3101 → Society of Light Web UI (Next.js frontend)\n"
            "- 8000 → Codex API (Node.js)\n"
            "- 8787 → Cloudflare tunnel default (Cloudflared)\n\n"
            "All team members and services should respect these port boundaries to prevent conflicts "
            "in development workflows."
        ),
        "tags": ["config", "ports", "infrastructure", "radiant-core", "milestone"],
        "system_component": "SystemConfig",
        "milestone_rank": 1,
        "emotional_state": "clear"
    },
    {
        "title": "Codex Source Priority Map for AI",
        "body": (
            "This entry defines the hierarchy of data sources that AI should reference when answering questions:\n\n"
            "1. The Codex – Primary Source\n"
            "2. Active System State / Runtime Context – Secondary\n"
            "3. Raw Files / Repos – Tertiary\n"
            "4. External APIs / AI Models – Optional\n\n"
            "AI should prefer Codex first, and only descend the stack when a suitable answer is not present in a higher tier."
        ),
        "tags": ["codex", "architecture", "priority", "ai", "milestone"],
        "system_component": "CodexEngine",
        "milestone_rank": 2,
        "emotional_state": "focused"
    },
    {
        "title": "Digital Temple Blueprint v1 – Pages, Schema, and API Layout",
        "body": (
            "// Society of Light – Digital Temple Starter\n"
            "// Stack: Next.js + Supabase + Vercel\n"
            "// Project Outline and file structure for full-stack deployment.\n"
            "(includes: schema.sql, codex.ts, program detail page, role-based routing, admin form, and index pages)"
        ),
        "tags": ["society-of-light", "next.js", "architecture", "starter", "milestone"],
        "system_component": "WebApp",
        "milestone_rank": 3,
        "emotional_state": "structured"
    },
    {
        "title": "Radiant Core Project Architecture v1",
        "body": (
            "Full directory layout for Radiant Core system including:\n"
            "- AI Voice Server (Express)\n"
            "- radiantcore_chat (Vite + React)\n"
            "- cloudflared (tunnel config)\n"
            "- utilities (startup + health scripts)\n\n"
            "Includes bat scripts, port assignments, and a complete README.md with launch instructions."
        ),
        "tags": ["radiant-core", "AI", "architecture", "system", "milestone"],
        "system_component": "RadiantCoreSystem",
        "milestone_rank": 3,
        "emotional_state": "stable"
    }
]

for entry in entries:
    res = requests.post(url, headers=headers, json=entry)
    print(f"{entry['title'][:40]} → {res.status_code}: {res.text}")
