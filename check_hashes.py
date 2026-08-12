import os
import hashlib

media_dir = r"C:\Users\91638\.gemini\antigravity-ide\brain\6d7db0b9-2749-4239-882a-69f0cd924fca\.tempmediaStorage"

for filename in os.listdir(media_dir):
    if filename.endswith(".png"):
        filepath = os.path.join(media_dir, filename)
        with open(filepath, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
        print(f"{filename}: {file_hash}")
