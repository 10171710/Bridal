# assets/images

This template renders every photograph with a **pure-CSS placeholder system**
instead of binary image files, so the download stays small, nothing 404s, and
there are no licensing questions about bundled photography.

## How placeholders work

    <div class="ph ph-bride ph-3x4" role="img"
         aria-label="Bride in ivory lehenga with soft-glam bridal makeup">
      <i class="bi bi-flower1" aria-hidden="true"></i>
    </div>

- `.ph` — base: gradient ground, soft highlight, motif overlay
- `.ph-bride` `.ph-makeup` `.ph-hair` `.ph-mehendi` `.ph-venue` `.ph-team`
  `.ph-blog` `.ph-jewel` `.ph-flowers` — subject tint, so each category reads
  distinctly
- `.ph-1x1` `.ph-4x3` `.ph-3x2` `.ph-3x4` `.ph-2x3` `.ph-16x9` `.ph-21x9`
  — aspect ratio
- `role="img"` + `aria-label` carry the alt text for screen readers

## Swapping in real photography

**Option 1 — keep the markup, add a background image.** Drop your file in this
folder and set one custom property:

    <div class="ph ph-bride ph-3x4 has-img"
         style="--ph-img: url('assets/images/bride-01.jpg')"
         role="img" aria-label="Bride in ivory lehenga"></div>

`.has-img` hides the gradient, motif and icon layers automatically.

**Option 2 — replace with a real `<img>`.** Keep the ratio + radius classes:

    <img src="assets/images/bride-01.jpg" alt="Bride in ivory lehenga"
         class="ph ph-3x4" style="object-fit: cover" width="900" height="1200">

## Suggested royalty-free sources

All permit commercial use without attribution:

- Unsplash — https://unsplash.com/s/photos/bridal-makeup
- Pexels — https://www.pexels.com/search/wedding-makeup/
- Pixabay — https://pixabay.com/images/search/bride/

## Recommended dimensions

| Slot | Ratio | Export at |
|---|---|---|
| Hero collage (tall) | 3:4 | 900 x 1200 |
| Hero collage (square) | 1:1 | 700 x 700 |
| Service / blog card | 4:3 | 800 x 600 |
| Portfolio tile | 3:4 | 800 x 1066 |
| Before / after | 4:3 | 1200 x 900 |
| Instagram tile | 1:1 | 600 x 600 |
| Team | 3:4 | 600 x 800 |
| Wide band | 21:9 | 1800 x 771 |

Export as WebP (quality ~78) with a JPEG fallback, and add
`loading="lazy" decoding="async"` to anything below the fold.
