import sys
import base64
from io import BytesIO
import torch
from facenet_pytorch import InceptionResnetV1
from PIL import Image
import torchvision.transforms as transforms

# Set device to CPU or CUDA (if available)
device = 'cpu'

# Initialize the InceptionResnetV1 model for embeddings
identity_detector = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# Function to decode the base64 image
def decode_base64_image(base64_str):
    image_data = base64.b64decode(base64_str)
    image = Image.open(BytesIO(image_data)).convert("RGB")
    return image

# Function to preprocess the image
def preprocess_image(image):
    image = image.resize((160, 160))
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])  # Normalization expected by InceptionResnetV1
    ])
    img_tensor = transform(image).unsqueeze(0).to(device)  # Add batch dimension
    return img_tensor

# Base64 input string (received from the command line argument)
base64_input = sys.argv[1]

# Decode and preprocess the image
image = decode_base64_image(base64_input)
img_tensor = preprocess_image(image)

# Generate embeddings
identity_embeddings = identity_detector(img_tensor)
embedding_list = identity_embeddings.detach().cpu().numpy().tolist()
print(embedding_list)
