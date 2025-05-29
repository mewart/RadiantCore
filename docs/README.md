# 🌟 RadiantCore

**RadiantCore** is the master architecture for an AI-augmented life management system — integrating self-documenting automation, AI agents (Gabbie + Damian), and structured PostgreSQL-backed codices to support peace, freedom, and happiness.

## 📌 Project Purpose

RadiantCore serves as the foundational platform for:

- ✍️ Codex management (life documentation, milestones, decisions)
- 🤖 AI assistant integration (Gabbie + Damian)
- 🧠 Self-awareness tooling (task reflection, journaling, emotional state tracking)
- 🔌 API interface for automation, UI, and voice agents

## 🧱 Tech Stack

- **Node.js + Express** — REST API
- **PostgreSQL** — primary data store
- **Python** — voice agents + Whisper + STT pipelines
- **Custom Local Codex Files** — JSON backup and legacy support

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mewart/RadiantCore.git
cd RadiantCore
```

### 2. Install dependencies

```bash
cd codex_server
npm install
```

### 3. Set environment variable (or use `.env`)

```bash
export CODEX_API_KEY=RadiantCoreRules!27x9
```

### 4. Start the Codex API

```bash
node codex_api.js
```

Visit: [http://localhost:3300](http://localhost:3300)

## 🧪 Available Endpoints

| Method | Endpoint                   | Description                         |
|--------|----------------------------|-------------------------------------|
| GET    | `/api/codex/db`           | Get all codex entries (Postgres)    |
| POST   | `/api/codex/add`          | Add a codex entry                   |
| PUT    | `/api/codex/update/:uuid` | Update codex entry by UUID          |
| DELETE | `/api/codex/delete/:uuid` | Delete codex entry by UUID          |

All requests must include the header:
```
x-api-key: RadiantCoreRules!27x9
```

## 📂 Directory Structure

```
RadiantCore/
├── codex_server/           # Node.js + PostgreSQL API server
│   ├── codices/            # JSON backup of codex files
│   ├── codex_api.js        # Express API entry point
│   └── import_codices.py   # One-time JSON/TXT DB importer
├── Damian/                 # AI voice client and Whisper pipeline
├── README.md
└── .gitignore
```

## 🛡️ Security Notice

Never commit your `.env` or API keys in version control.

---

### 📜 License

Custom project — see Mark Ewart for terms of use.
