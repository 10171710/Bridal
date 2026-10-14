import glob
import re

html_files = sorted(glob.glob('*.html'))
print(f"Total HTML files: {len(html_files)}")
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    # Check navbar structure
    has_nav = 'navbar' in c
    # Check hero
    has_hero = 'hero' in c
    # Check grids / rows
    rows = re.findall(r'<div[^>]*class="[^"]*row[^"]*"', c)
    print(f"{hf:<20}: size={len(c):<6} | nav={has_nav} | hero={has_hero} | rows={len(rows)}")
