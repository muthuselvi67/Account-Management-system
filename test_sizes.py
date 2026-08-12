import base64
import re
from PIL import Image
import io

with open('frontend/src/utils/logoBase64.js', 'r') as f:
    content = f.read()

match = re.search(r'base64,(.*?)"', content)
b64 = match.group(1)
img = Image.open(io.BytesIO(base64.b64decode(b64)))
print(f"LOGO_BASE64 size: {img.size}")

try:
    with open('frontend/src/utils/iconBase64.js', 'r') as f:
        content = f.read()
    match = re.search(r'base64,(.*?)"', content)
    b64 = match.group(1)
    img = Image.open(io.BytesIO(base64.b64decode(b64)))
    print(f"ICON_BASE64 size: {img.size}")
except Exception as e:
    print(e)
