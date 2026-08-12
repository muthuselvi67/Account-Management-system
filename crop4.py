import base64
import re
from PIL import Image
import io

# Read logoBase64.js
with open('frontend/src/utils/logoBase64.js', 'r') as f:
    content = f.read()

# Extract base64
match = re.search(r'base64,(.*?)"', content)
b64_data = match.group(1)
img_data = base64.b64decode(b64_data)

img = Image.open(io.BytesIO(img_data)).convert('RGBA')

# Find the left-most non-transparent pixel
width, height = img.size
pixels = img.load()

# Find the bounding box of the solid purple box
left = width
upper = height
lower = 0

# scan to find true solid pixels (alpha > 200)
for x in range(width):
    for y in range(height):
        if pixels[x, y][3] > 200:
            left = min(left, x)
            upper = min(upper, y)
            lower = max(lower, y)

box_height = lower - upper
right = left + box_height

print(f"Purple box bounding box: {left}, {upper}, {right}, {lower}")

# Crop the purple box exactly
icon_img = img.crop((left, upper, right, lower))

# Save to base64
out_buffer = io.BytesIO()
icon_img.save(out_buffer, format='PNG')
icon_b64 = base64.b64encode(out_buffer.getvalue()).decode('utf-8')

# Write to iconBase64.js
with open('frontend/src/utils/iconBase64.js', 'w') as f:
    f.write('export const ICON_BASE64 = "data:image/png;base64,' + icon_b64 + '";')

print("Created iconBase64.js successfully!")
