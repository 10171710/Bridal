from PIL import Image

before_src = 'assets/images/hero/hero-before.jpg'
after_src = 'assets/images/hero/hero-after.png'

img_before = Image.open(before_src).convert('RGB')
img_after = Image.open(after_src).convert('RGB')

w, h = 704, 1024

# Let's test combinations of scale, rotation, and translation:
configs = [
    # (scale, rot_deg, shift_x, shift_y, name)
    (1.11, -0.5, 4, -14, 'v1'),
    (1.12, -0.8, 6, -18, 'v2'),
    (1.13, -0.8, 8, -20, 'v3'),
    (1.10, -0.4, 6, -12, 'v4'),
]

for scale, rot, sx, sy, name in configs:
    # Scale before
    new_w = int(round(w * scale))
    new_h = int(round(h * scale))
    scaled = img_before.resize((new_w, new_h), Image.Resampling.LANCZOS)
    if rot != 0:
        scaled = scaled.rotate(rot, resample=Image.Resampling.BICUBIC, expand=False)
    
    # Base eye center in before was ~ (357.5, 369)
    # Scaled eye center: (357.5 * scale, 369 * scale)
    # Target eye center in After: (350, 402.5)
    # Crop offset:
    crop_x = int(round(357.5 * scale - 350.0 + sx))
    crop_y = int(round(369.0 * scale - 402.5 + sy))
    
    aligned_before = scaled.crop((crop_x, crop_y, crop_x + w, crop_y + h))
    
    # Create split
    split = Image.new('RGB', (w, h))
    split.paste(img_after.crop((0, 0, w // 2, h)), (0, 0))
    split.paste(aligned_before.crop((w // 2, 0, w, h)), (w // 2, 0))
    
    # Line
    for y_idx in range(h):
        split.putpixel((w // 2, y_idx), (255, 255, 255))
        split.putpixel((w // 2 - 1, y_idx), (255, 255, 255))
        
    split.save(f'scratch/split_{name}.jpg', quality=95)

print("Saved fine tuned splits to scratch/split_v1..v4.jpg")
