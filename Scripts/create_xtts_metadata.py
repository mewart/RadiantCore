import os

# Paths
dataset_dir = "/home/mewart/RadiantCore/data/xtts_gabbie_training/"
wavs_dir = os.path.join(dataset_dir, "wavs")
metadata_path = os.path.join(dataset_dir, "metadata.csv")

# Create the necessary directories
os.makedirs(wavs_dir, exist_ok=True)

# Create a sample metadata.csv file with placeholder entries
metadata_lines = []
for idx in range(1, 11):  # Change the range if you want more lines
    metadata_lines.append(f"{str(idx).zfill(4)}.wav|")  # Empty transcription

# Write the metadata file
with open(metadata_path, "w") as f:
    f.write("\n".join(metadata_lines))

print(f"Metadata file created at {metadata_path}")
