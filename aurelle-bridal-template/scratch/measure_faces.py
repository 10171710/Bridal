from PIL import Image
import numpy as np

img_before = Image.open('assets/images/hero/hero-before.jpg')
img_after = Image.open('assets/images/hero/hero-after.png')

print("Before size:", img_before.size)
print("After size:", img_after.size)

# Let's save a visual side-by-side or split test
# In Before image:
# Left eye pupil center, Right eye pupil center, Nose tip, Mouth center / lips line, Chin bottom
# Let's write a helper to crop/align precisely
