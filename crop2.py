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

# Find the bounding box
bbox = img.getbbox()
left, upper, right, lower = bbox

# Find the first column of transparent pixels after the purple box
# We scan from 'left' towards 'right'
purple_box_right = left
pixels = img.load()

for x in range(left, right):
    # Check if this column is entirely transparent (or close to it)
    is_transparent_column = True
    for y in range(upper, lower):
        r, g, b, a = pixels[x, y]
        if a > 10: # not transparent
            is_transparent_column = False
            break
    
    if is_transparent_column:
        # We found the gap between the purple box and the text!
        purple_box_right = x
        break

print(f"Purple box width: {purple_box_right - left}, Height: {lower - upper}")

# Crop the purple box exactly
icon_img = img.crop((left, upper, purple_box_right, lower))

# Save to base64
out_buffer = io.BytesIO()
icon_img.save(out_buffer, format='PNG')
icon_b64 = base64.b64encode(out_buffer.getvalue()).decode('utf-8')

# Write to iconBase64.js
with open('frontend/src/utils/iconBase64.js', 'w') as f:
    f.write('export const ICON_BASE64 = "data:image/png;base64,' + icon_b64 + '";')

print("Created iconBase64.js successfully!")
