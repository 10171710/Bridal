from PIL import Image

before_src = 'assets/images/hero/hero-before.jpg'
after_src = 'assets/images/hero/hero-after.png'

img_before = Image.open(before_src).convert('RGB')
img_after = Image.open(after_src).convert('RGB')

w, h = 704, 1024

scale_before = 200.0 / 175.0
new_w_b = int(round(w * scale_before))
new_h_b = int(round(h * scale_before))
img_before_scaled = img_before.resize((new_w_b, new_h_b), Image.Resampling.LANCZOS)

crop_x = int(round(357.5 * scale_before - 350.0))
crop_y = int(round(369.0 * scale_before - 402.5))

img_before_aligned = img_before_scaled.crop((crop_x, crop_y, crop_x + w, crop_y + h))
img_after_aligned = img_after.copy()

# Generate split comparison image: left half After, right half Before
split_img = Image.new('RGB', (w, h))
split_img.paste(img_after_aligned.crop((0, 0, w // 2, h)), (0, 0))
split_img.paste(img_before_aligned.crop((w // 2, 0, w, h)), (w // 2, 0))

for y_idx in range(h):
    split_img.putpixel((w // 2, y_idx), (255, 255, 255))
    split_img.putpixel((w // 2 - 1, y_idx), (255, 255, 255))

split_img.save('scratch/split_preview.jpg', quality=95)
print("Split preview saved to scratch/split_preview.jpg")
