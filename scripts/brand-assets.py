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


def mark(size: int, radius: float = 0.28) -> Image.Image:
    """Cuadro amarillo con el volante (mismo dibujo que LogoMark en Nav.tsx, viewBox 24)."""
    S = size * SS
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=S * radius, fill=LANE)
    k, o = S * 0.72 / 24, S * 0.14
    p = lambda x, y: (o + x * k, o + y * k)
    w = round(2.4 * k)
    cx, cy = p(12, 12)
    d.ellipse([cx - 9 * k, cy - 9 * k, cx + 9 * k, cy + 9 * k], outline=ASPHALT, width=w)
    d.ellipse([cx - 2.6 * k, cy - 2.6 * k, cx + 2.6 * k, cy + 2.6 * k], fill=ASPHALT)
    for a, b in [((3.4, 11.2), (9.5, 12)), ((14.5, 12), (20.6, 11.2)), ((12, 14.6), (12, 21))]:
        d.line([p(*a), p(*b)], fill=ASPHALT, width=w)
        for pt in (p(*a), p(*b)):
            d.ellipse([pt[0] - w / 2, pt[1] - w / 2, pt[0] + w / 2, pt[1] + w / 2], fill=ASPHALT)
    return im.resize((size, size), Image.LANCZOS)


def on_bg(size: int, pad: float) -> Image.Image:
    bg = Image.new("RGB", (size, size), ASPHALT)
    m = mark(round(size * (1 - 2 * pad)), radius=0.24)
    bg.paste(m, (round(size * pad),) * 2, m)
    return bg


mark(32).save(OUT / "favicon-32.png")
on_bg(180, 0.12).save(OUT / "apple-touch-icon.png")
on_bg(192, 0.12).save(OUT / "icon-192.png")
on_bg(512, 0.12).save(OUT / "icon-512.png")
mark(512, radius=0.24).save(OUT / "logo-512.png")

# Imagen para compartir 1200x630
W, H = 1200, 630
og = Image.new("RGB", (W, H), ASPHALT)
d = ImageDraw.Draw(og)
m = mark(96)
og.paste(m, (72, 64), m)
d.text((190, 58), BRAND, font=font("NotoSans-ExtraCondensedExtraBold.ttf", 76), fill=BONE)
d.rectangle([192, 150, 214, 154], fill=LANE)
d.text((224, 140), " ".join(TAGLINE), font=font("NotoSans-SemiBold.ttf", 18), fill=STONE)
f = font("NotoSans-ExtraCondensedBold.ttf", 104)
d.text((68, 238), HEADLINE[0], font=f, fill=BONE)
d.text((68, 350), HEADLINE[1], font=f, fill=LANE)
for x in range(0, W, 52):  # línea de carril
    d.rectangle([x, 506, x + 28, 511], fill=LANE)
d.text((72, 548), FOOTER, font=font("NotoSans-SemiBold.ttf", 24), fill=STONE)
og.save(OUT / "og-image.jpg", quality=88)
print("Listo:", ", ".join(sorted(p.name for p in OUT.iterdir())))
