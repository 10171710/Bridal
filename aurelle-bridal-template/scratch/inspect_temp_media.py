import os, glob
from PIL import Image

temp_dir = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.tempmediaStorage'
all_imgs = glob.glob(os.path.join(temp_dir, '*.*'))

print(f"Total temp media files: {len(all_imgs)}")
# List files with sizes and aspect ratios
for img_path in sorted(all_imgs, key=os.path.getmtime, reverse=True)[:25]:
    try:
        with Image.open(img_path) as im:
            print(f"{os.path.basename(img_path)}: {im.size}, {im.format}, {os.path.getsize(img_path)} bytes")
    except Exception as e:
        pass
