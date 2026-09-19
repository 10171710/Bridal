import os, re, glob

used_images = set()
for html_file in glob.glob('*.html'):
    with open(html_file, 'r', encoding='utf8') as f:
        content = f.read()
        for m in re.finditer(r'src=["\']([^"\']+\.(jpg|jpeg|png|webp|svg))["\']', content, re.IGNORECASE):
            used_images.add(m.group(1))
        for m in re.finditer(r'data-lb-img=["\']([^"\']+\.(jpg|jpeg|png|webp|svg))["\']', content, re.IGNORECASE):
            used_images.add(m.group(1))

print(f"Total used images: {len(used_images)}")
for u in sorted(used_images):
    print(" ", u)
