from PIL import Image, ImageDraw

img_before = Image.open('assets/images/hero/hero-before.jpg').convert('RGB')
img_after = Image.open('assets/images/hero/hero-after.png').convert('RGB')

# Let's inspect eye positions by creating grid markings or finding darkest pupil pixels in eye regions:
# Eye regions in before: x around 250..450, y around 320..420
# Left eye (viewer's left) ~ (270..300, 360..380), Right eye ~ (430..460, 360..380)

# Let's write a script that draws horizontal guide lines every 50px so we can see the exact coordinates
def draw_guides(img, name):
    d = img.copy()
    draw = ImageDraw.Draw(d)
    w, h = d.size
    for y in range(0, h, 25):
        color = 'red' if y % 100 == 0 else ('yellow' if y % 50 == 0 else 'gray')
        draw.line([(0, y), (w, y)], fill=color, width=1)
        if y % 50 == 0:
            draw.text((10, y + 2), str(y), fill='white')
    for x in range(0, w, 25):
        color = 'red' if x % 100 == 0 else ('yellow' if x % 50 == 0 else 'gray')
        draw.line([(x, 0), (x, h)], fill=color, width=1)
        if x % 50 == 0:
            draw.text((x + 2, 10), str(x), fill='white')
    d.save(f'scratch/grid_{name}.jpg')

draw_guides(img_before, 'before')
draw_guides(img_after, 'after')
print("Grids saved to scratch/grid_before.jpg and scratch/grid_after.jpg")
