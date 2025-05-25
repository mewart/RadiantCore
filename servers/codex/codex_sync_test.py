import requests

url = "http://localhost:3300/api/codex/add"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "RadiantCoreRules!27x9"
}

entry = {
    "title": "Codex Sync Confirmed 🎯",
    "body": "This entry was synced from within WSL. All systems go.",
    "tags": ["wsl", "internal", "test"],
    "system_component": "CodexEngine",
    "milestone_rank": 1,
    "emotional_state": "relieved"
}

response = requests.post(url, json=entry, headers=headers)
print(response.status_code, response.text)

