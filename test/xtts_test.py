from TTS.api import TTS

# Load XTTS model
tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

# Test basic generation
tts.tts_to_file(
    text="Testing complete. XTTS is running locally.",
    file_path="xtts_test.wav"
)
