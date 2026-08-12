import base64
import re
from PIL import Image
import io

# Read logoBase64.js
with open('frontend/src/utils/logoBase64.js', 'r') as f:
    content = f.read()

# Extract base64
match = re.search(r'base64,(.*?)"', content)
if not match:
    print("Could not find base64")
    exit(1)

b64_data = match.group(1)
img_data = base64.b64decode(b64_data)

img = Image.open(io.BytesIO(img_data)).convert('RGBA')

# Find the bounding box of the non-transparent pixels
bbox = img.getbbox()

# The purple box should be on the left.
# Let's crop a square starting from the left edge of the bounding box.
# The height of the bounding box is the height of the square.
left, upper, right, lower = bbox
height = lower - upper

# Crop the square
icon_img = img.crop((left, upper, left + height, lower))

# Save to base64
out_buffer = io.BytesIO()
icon_img.save(out_buffer, format='PNG')
icon_b64 = base64.b64encode(out_buffer.getvalue()).decode('utf-8')

# Write to iconBase64.js
with open('frontend/src/utils/iconBase64.js', 'w') as f:
    f.write('export const ICON_BASE64 = "data:image/png;base64,' + icon_b64 + '";')

print("Created iconBase64.js successfully!")
