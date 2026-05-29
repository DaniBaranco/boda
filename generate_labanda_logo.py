from PIL import Image, ImageDraw

size = (512, 256)
img = Image.new('RGBA', size, (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# Ring styling
ring_color = (196, 145, 40, 255)
shadow_color = (125, 80, 20, 128)
stroke = 28

# Ring positions
left_ring = [(80, 80), (260, 220)]
right_ring = [(190, 60), (410, 200)]

# Draw shadows
shadow_offset = (10, 10)
shadow_left = [(left_ring[0][0] + shadow_offset[0], left_ring[0][1] + shadow_offset[1]), (left_ring[1][0] + shadow_offset[0], left_ring[1][1] + shadow_offset[1])]
shadow_right = [(right_ring[0][0] + shadow_offset[0], right_ring[0][1] + shadow_offset[1]), (right_ring[1][0] + shadow_offset[0], right_ring[1][1] + shadow_offset[1])]
d.ellipse(shadow_left, outline=shadow_color, width=stroke)
d.ellipse(shadow_right, outline=shadow_color, width=stroke)

# Draw rings

d.ellipse(left_ring, outline=ring_color, width=stroke)
d.ellipse(right_ring, outline=ring_color, width=stroke)

# Overlay center highlights
highlight_color = (255, 231, 163, 180)
for offset in [(10, -8), (0, -12), (-6, -4)]:
    d.arc([left_ring[0][0]+offset[0], left_ring[0][1]+offset[1], left_ring[1][0]+offset[0], left_ring[1][1]+offset[1]], start=20, end=60, fill=highlight_color, width=12)
    d.arc([right_ring[0][0]+offset[0], right_ring[0][1]+offset[1], right_ring[1][0]+offset[0], right_ring[1][1]+offset[1]], start=20, end=60, fill=highlight_color, width=12)

img.save('images/labanda.png')
