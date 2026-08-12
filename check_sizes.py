import os
from PIL import Image

media_dir = r"C:\Users\91638\.gemini\antigravity-ide\brain\6d7db0b9-2749-4239-882a-69f0cd924fca\.tempmediaStorage"

for filename in os.listdir(media_dir):
    if filename.endswith(".png") or filename.endswith(".jpg"):
        filepath = os.path.join(media_dir, filename)
        try:
            with Image.open(filepath) as img:
                print(f"{filename}: {img.size}")
        except Exception as e:
            print(f"{filename}: Error {e}")
