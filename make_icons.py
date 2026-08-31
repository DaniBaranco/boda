#!/usr/bin/env python3
"""Genera los iconos de la PWA a partir del logo de la marca
(images/labanda-lavanda.png: rama de lavanda sobre mancha lila, fondo transparente).

- icon-192 / icon-512: el logo tal cual (con transparencia).
- maskable-512: logo centrado sobre fondo crema con zona segura (~72%).
- apple-touch-180: logo sobre fondo crema opaco (iOS no admite transparencia).
- favicon-32: logo reducido.

Requiere: pip install pillow
Uso: python make_icons.py
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Instala Pillow: pip install pillow")
    sys.exit(1)

SRC = os.path.join(os.path.dirname(__file__), "images", "labanda-lavanda.png")
ICONS_DIR = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

BG = (248, 244, 235, 255)  # crema de la paleta de la web (--bg-cream)


def load_logo():
    return Image.open(SRC).convert("RGBA")


def transparent(out, size):
    logo = load_logo().resize((size, size), Image.LANCZOS)
    logo.save(out)
    print("->", out)


def on_background(out, size, safe=0.80, opaque=False):
    """Coloca el logo centrado sobre fondo crema.
    safe = proporcion del lienzo que ocupa el logo (deja margen de seguridad)."""
    canvas = Image.new("RGBA", (size, size), BG)
    inner = int(size * safe)
    logo = load_logo().resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.alpha_composite(logo, (off, off))
    if opaque:
        canvas = canvas.convert("RGB")
    canvas.save(out)
    print("->", out)


transparent(os.path.join(ICONS_DIR, "icon-192.png"), 192)
transparent(os.path.join(ICONS_DIR, "icon-512.png"), 512)
on_background(os.path.join(ICONS_DIR, "maskable-512.png"), 512, safe=0.72)
on_background(os.path.join(ICONS_DIR, "apple-touch-180.png"), 180, safe=0.82, opaque=True)
transparent(os.path.join(ICONS_DIR, "favicon-32.png"), 32)

print("\n¡Listo! Iconos guardados en /icons")
