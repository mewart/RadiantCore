from TTS.api import TTS

# Load the model
model = TTS.load_model("path/to/your/model")  # Replace with the path to your model

# Use the model to speak
model.say("Hello, I am your local assistant!")
