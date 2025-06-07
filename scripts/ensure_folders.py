import os

# Define base path (you can customize this if you move to another root)
BASE_DIR = os.path.expanduser("~/RadiantCore")

# Define the directory structure
FOLDERS = [
    "audio/input",
    "audio/processed",
    "audio/output",
    "logs/whisper",
    "logs/gptj",
    "logs/errors",
    "models/gptj",
    "models/whisper",
    "scripts",
    "tmp",
]

def ensure_directories():
    for folder in FOLDERS:
        path = os.path.join(BASE_DIR, folder)
        os.makedirs(path, exist_ok=True)
        print(f"✅ Ensured: {path}")

if __name__ == "__main__":
    ensure_directories()
