#!/usr/bin/env python3
import base64, io, qrcode
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask

DIR = "/private/tmp/claude-501/-Users-ahmadsharaf/196ae78f-4d4e-489c-992e-36f3b6c703a0/scratchpad/forceai-card"

# --- vCard (public brand info only; email/phone to be added when provided) ---
vcard_lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Sharaf;Ahmad;;;",
    "FN:Ahmad Sharaf",
    "ORG:Force AI",
    "TITLE:Founder & AI Builder",
    "TEL;TYPE=CELL,VOICE:+96541169141",
    "EMAIL;TYPE=WORK:a.sharaf@force-ai.co",
    "URL:https://force-ai.co",
    "URL;TYPE=Instagram:https://instagram.com/mypovonai",
    "NOTE:mypovonai — AI FROM MY POV",
    "END:VCARD",
]
vcard = "\r\n".join(vcard_lines) + "\r\n"

# --- Branded QR: rounded near-black modules on white + center orange-F badge (H = 30% recovery) ---
qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_H, box_size=14, border=3)
qr.add_data(vcard)
qr.make(fit=True)
img = qr.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(radius_ratio=1.0),
    color_mask=SolidFillColorMask(front_color=(11, 10, 10), back_color=(244, 241, 234)),
    embeded_image_path=f"{DIR}/badge-circle.png",
)
buf = io.BytesIO(); img.save(buf, format="PNG")
qr_b64 = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

# --- card image ---
with open(f"{DIR}/ahmad-sharaf-card.png", "rb") as f:
    card_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode()

# --- vCard for JS string literal (escape) ---
vcard_js = vcard.replace("\\", "\\\\").replace('"', '\\"').replace("\r\n", "\\r\\n")

with open(f"{DIR}/template.html", encoding="utf-8") as f:
    html = f.read()

html = html.replace("__CARD_IMG__", card_b64).replace("__QR_IMG__", qr_b64).replace("__VCARD__", vcard_js)

out = f"{DIR}/ahmad-sharaf-card-page.html"
with open(out, "w", encoding="utf-8") as f:
    f.write(html)

print("QR modules:", qr.version, "| output:", out, "| size KB:", round(len(html)/1024))
