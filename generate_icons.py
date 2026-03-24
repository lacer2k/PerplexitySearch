#!/usr/bin/env python3
"""Genera icone PNG per l'estensione Safari (colore Perplexity teal)."""
import struct
import zlib


def create_png(width, height, bg=(32, 178, 170), fg=(255, 255, 255)):
    """Crea un PNG con sfondo colorato e una 'P' stilizzata al centro."""

    def pixel(x, y):
        # Margine arrotondato
        cx, cy = width / 2, height / 2
        r = width * 0.42
        dx, dy = abs(x - cx), abs(y - cy)
        if dx > r or dy > r:
            return (26, 26, 46)  # sfondo scuro fuori dal cerchio

        # Disegna una "P" semplificata
        u = width  # unità
        left = int(u * 0.32)
        right = int(u * 0.68)
        top = int(u * 0.22)
        bot = int(u * 0.78)
        mid = int(u * 0.52)
        stem_w = int(u * 0.13)
        arc_top = int(u * 0.22)
        arc_bot = int(u * 0.52)
        arc_right = int(u * 0.65)

        # Gambo verticale
        if left <= x < left + stem_w and top <= y <= bot:
            return fg

        # Barra superiore orizzontale
        if left <= x <= arc_right and top <= y < top + stem_w:
            return fg

        # Barra orizzontale di mezzo
        if left <= x <= arc_right and mid <= y < mid + stem_w:
            return fg

        # Lato destro dell'arco
        if arc_right - stem_w <= x <= arc_right and arc_top <= y <= arc_bot + stem_w:
            return fg

        return bg

    # PNG header
    signature = b"\x89PNG\r\n\x1a\n"

    # IHDR
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    ihdr = _chunk(b"IHDR", ihdr_data)

    # IDAT
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter: None
        for x in range(width):
            c = pixel(x, y)
            raw.extend(c)

    idat = _chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    iend = _chunk(b"IEND", b"")

    return signature + ihdr + idat + iend


def _chunk(ctype, data):
    body = ctype + data
    return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)


if __name__ == "__main__":
    sizes = [48, 96, 128, 256, 512, 1024]
    for s in sizes:
        png = create_png(s, s)
        path = f"icons/icon-{s}.png"
        with open(path, "wb") as f:
            f.write(png)
        print(f"  ✓ {path} ({s}x{s})")
    print("Icone generate!")
