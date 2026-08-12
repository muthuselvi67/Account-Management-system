import base64
import re
from PIL import Image
import io

with open('frontend/src/utils/logoBase64.js', 'r') as f:
    content = f.read()

match = re.search(r'base64,(.*?)"', content)
b64 = match.group(1)
with open('scratch/logo_check.png', 'wb') as out:
    out.write(base64.b64decode(b64))

print("Saved logo to scratch/logo_check.png")
