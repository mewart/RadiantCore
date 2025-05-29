import torch

# Replace with the actual path to your model
model_path = "D:/RadiantCore/models/xtts/xtts_v2/model.pth"

# Load the model
model = torch.load(model_path, map_location=torch.device('cpu'))

# Print out the model structure (or type)
print(model)
