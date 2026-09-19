from PIL import Image, ImageOps

before_src = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789796726468.jpg'
after_src = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789796730510.png'

img_before = Image.open(before_src).convert('RGB')
img_after = Image.open(after_src).convert('RGB')

w, h = 704, 1024

# Let's pad img_before by 100px on all sides using edge extension so rotation never produces black pixels
pad = 100
padded_before = ImageOps.expand(img_before, border=pad, fill=0)
# Fill padding by repeating border pixels
# Or simpler:
padded = Image.new('RGB', (w + 2 * pad, h + 2 * pad))
# paste original
padded.paste(img_before, (pad, pad))
# replicate borders
top_slice = img_before.crop((0, 0, w, 1)).resize((w, pad))
padded.paste(top_slice, (pad, 0))
bottom_slice = img_before.crop((0, h - 1, w, h)).resize((w, pad))
padded.paste(bottom_slice, (pad, h + pad))
left_slice = padded.crop((pad, 0, pad + 1, h + 2 * pad)).resize((pad, h + 2 * pad))
padded.paste(left_slice, (0, 0))
right_slice = padded.crop((pad + w - 1, 0, pad + w, h + 2 * pad)).resize((pad, h + 2 * pad))
padded.paste(right_slice, (pad + w, 0))

scale = 1.12
rot = -0.8
sx = 6
sy = -18

new_pw = int(round((w + 2 * pad) * scale))
new_ph = int(round((h + 2 * pad) * scale))
scaled_padded = padded.resize((new_pw, new_ph), Image.Resampling.LANCZOS)
rotated_padded = scaled_padded.rotate(rot, resample=Image.Resampling.BICUBIC, expand=False)

# Center crop to get the exact aligned 704x1024
orig_pad_scaled_x = pad * scale
orig_pad_scaled_y = pad * scale

base_crop_x = int(round(orig_pad_scaled_x + (357.5 * scale - 350.0 + sx)))
base_crop_y = int(round(orig_pad_scaled_y + (369.0 * scale - 402.5 + sy)))

aligned_before = rotated_padded.crop((base_crop_x, base_crop_y, base_crop_x + w, base_crop_y + h))
aligned_after = img_after.copy()

# Save final images
aligned_before.save('assets/images/hero/hero-before.jpg', quality=95)
aligned_after.save('assets/images/hero/hero-after.png')

# Save split for verification
split = Image.new('RGB', (w, h))
split.paste(aligned_after.crop((0, 0, w // 2, h)), (0, 0))
split.paste(aligned_before.crop((w // 2, 0, w, h)), (w // 2, 0))

for y_idx in range(h):
    split.putpixel((w // 2, y_idx), (255, 255, 255))
    split.putpixel((w // 2 - 1, y_idx), (255, 255, 255))

split.save('scratch/split_final_aligned.jpg', quality=95)
print("Saved final aligned images and scratch/split_final_aligned.jpg")
