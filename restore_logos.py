import base64
import os
from PIL import Image
import io

img_path = r"C:\Users\91638\.gemini\antigravity-ide\brain\6d7db0b9-2749-4239-882a-69f0cd924fca\.tempmediaStorage\media_6d7db0b9-2749-4239-882a-69f0cd924fca_1786080635034.png"
img = Image.open(img_path).convert('RGBA')

# Save LOGO_BASE64
out_buffer_logo = io.BytesIO()
img.save(out_buffer_logo, format='PNG')
logo_b64 = base64.b64encode(out_buffer_logo.getvalue()).decode('utf-8')
with open('frontend/src/utils/logoBase64.js', 'w') as f:
    f.write('export const LOGO_BASE64 = "data:image/png;base64,' + logo_b64 + '";')

# Crop and save ICON_BASE64
# The purple box is a perfect square on the left, so width = height
height = img.size[1]
icon_img = img.crop((0, 0, height, height))
out_buffer_icon = io.BytesIO()
icon_img.save(out_buffer_icon, format='PNG')
icon_b64 = base64.b64encode(out_buffer_icon.getvalue()).decode('utf-8')
with open('frontend/src/utils/iconBase64.js', 'w') as f:
    f.write('export const ICON_BASE64 = "data:image/png;base64,' + icon_b64 + '";')

print("Successfully restored LOGO_BASE64 and ICON_BASE64 from original 3D logo!")
