# 📘 Radiant Core Codex API – Manual Testing Guide

This guide outlines how to test and interact with the Radiant Core Codex API using [Postman](https://www.postman.com/) or similar REST clients.

---

## 🔧 Prerequisites

- Codex API server must be running on:  
  `http://localhost:3300`
- Your API key (default):  
  `RadiantCoreRules!27x9`
- Postman or similar REST client installed
- PostgreSQL database accessible at the configured IP

---

## 📦 Importing the Postman Collection

1. Download this file:  
   [`Codex_API_Collection.postman_collection.json`](sandbox:/mnt/data/Codex_API_Collection.postman_collection.json)

2. Open Postman → Import → Upload the file

3. The collection will appear as **Radiant Core Codex API** with the following requests configured.

---

## 📚 API Reference

All endpoints require this header:

```
x-api-key: RadiantCoreRules!27x9
```

---

### ➕ Create Codex Entry

**POST** `/api/codex/add`

```json
{
  "title": "Test Entry",
  "body": "This is a test codex entry body.",
  "tags": ["test", "milestone"],
  "version": 1,
  "codex_id": 0
}
```

**Response:**

```json
{
  "message": "Codex entry saved and inserted.",
  "id": "e4c2f3d9-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

---

### ✏️ Update Codex Entry

**PUT** `/api/codex/update/:uuid_id`

```json
{
  "title": "Updated Title",
  "body": "Updated codex entry body content.",
  "tags": ["updated", "core"],
  "version": 2
}
```

---

### ❌ Delete Codex Entry

**DELETE** `/api/codex/delete/:uuid_id`

No body required.

---

### 📥 Get All Entries

**GET** `/api/codex/db`

Optional query params:
- `since=2024-01-01`
- `tag=test`
- `codex_id=0`

---

### 🏁 Get Milestone Entries

**GET** `/api/codex/milestones/db`

Optional query param:
- `since=2024-01-01`

---

### 🧪 Health Check

**GET** `/ping`

**Response:**

```json
{
  "success": true,
  "time": {
    "now": "2025-05-15T20:48:02.214Z"
  }
}
```

---

## 🗃️ Local Codex JSON Files

Every POST also saves a `.json` copy to:

```
/codex_server/codices/
```

These are your text archive backups.

---

## ✅ Verification

To verify all API routes are operational:

- `GET /ping` returns success
- Create, update, and delete calls return 200 OK
- PostgreSQL `radiant_core.codex_entry` shows your data