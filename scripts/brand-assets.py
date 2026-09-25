"""Genera favicon, íconos, logo y la imagen para compartir (og-image.jpg) en public/.
Uso: python3 scripts/brand-assets.py   (requiere Pillow). Cambia los textos de abajo para otro cliente."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BRAND = "MASTER"
TAGLINE = "SERVICE QUALITY"
HEADLINE = ["RENTA DE CAMIONETAS", "EN BARRANCABERMEJA"]
FOOTER = "Póliza · Mantenimiento · GPS · SOAT      WhatsApp +57 323 201 5887"

ASPHALT, BONE, STONE, LANE = "#131514", "#ece7dc", "#9d9a90", "#e0a93b"
FONTS = Path("/usr/share/fonts/truetype/noto")
font = lambda name, size: ImageFont.truetype(str(FONTS / name), size)
OUT = Path(__file__).resolve().parent.parent / "public"
SS = 4  # supermuestreo para bordes suaves


PLATE = "MSQ·01"  # Placa del logo (igual que PLATE_CODE en Nav.tsx)
CITY = "BARRANCABERMEJA"


def plate(w: int, code: str = PLATE, city: bool = True) -> Image.Image:
    """Placa amarilla de carro particular (mismo dibujo que LogoMark en Nav.tsx, viewBox 112x56)."""
    W, H = w * SS, w * SS // 2
    k = W / 112
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([1.5 * k, 1.5 * k, 110.5 * k, 54.5 * k], radius=8 * k, fill=LANE, outline=ASPHALT, width=round(3 * k))
    d.rounded_rectangle([6 * k, 6 * k, 106 * k, 50 * k], radius=4.5 * k, outline=ASPHALT, width=max(1, round(1.6 * k)))
    f = font("NotoSans-ExtraCondensedBold.ttf", round((27 if city else 36) * k))
    d.text((56 * k, (24.5 if city else 29) * k), code, font=f, fill=ASPHALT, anchor="mm")
    if city:
        d.text((56 * k, 44.5 * k), " ".join(CITY), font=font("NotoSans-Bold.ttf", round(4.6 * k)), fill=ASPHALT, anchor="mm")
    return im.resize((w, w // 2), Image.LANCZOS)


def mark(size: int) -> Image.Image:
    """Ícono cuadrado transparente: la placa centrada. En tamaños chicos solo dice MSQ."""
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    small = size <= 64
    pl = plate(round(size * 0.98), "MSQ" if small else PLATE, city=not small)
    im.paste(pl, ((size - pl.width) // 2, (size - pl.height) // 2), pl)
    return im


def on_bg(size: int, pad: float) -> Image.Image:
    bg = Image.new("RGB", (size, size), ASPHALT)
    pl = plate(round(size * (1 - 2 * pad)))
    bg.paste(pl, ((size - pl.width) // 2, (size - pl.height) // 2), pl)
    return bg


mark(32).save(OUT / "favicon-32.png")
on_bg(180, 0.08).save(OUT / "apple-touch-icon.png")
on_bg(192, 0.08).save(OUT / "icon-192.png")
on_bg(512, 0.08).save(OUT / "icon-512.png")
mark(512).save(OUT / "logo-512.png")

# Imagen para compartir 1200x630
W, H = 1200, 630
og = Image.new("RGB", (W, H), ASPHALT)
d = ImageDraw.Draw(og)
m = plate(200)
og.paste(m, (68, 52), m)
d.text((290, 58), BRAND, font=font("NotoSans-ExtraCondensedExtraBold.ttf", 76), fill=BONE)
d.rectangle([292, 150, 314, 154], fill=LANE)
d.text((324, 140), " ".join(TAGLINE), font=font("NotoSans-SemiBold.ttf", 18), fill=STONE)
f = font("NotoSans-ExtraCondensedBold.ttf", 104)
d.text((68, 238), HEADLINE[0], font=f, fill=BONE)
d.text((68, 350), HEADLINE[1], font=f, fill=LANE)
for x in range(0, W, 52):  # línea de carril
    d.rectangle([x, 506, x + 28, 511], fill=LANE)
d.text((72, 548), FOOTER, font=font("NotoSans-SemiBold.ttf", 24), fill=STONE)
og.save(OUT / "og-image.jpg", quality=88)
print("Listo:", ", ".join(sorted(p.name for p in OUT.iterdir())))
