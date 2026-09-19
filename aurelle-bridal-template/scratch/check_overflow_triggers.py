import glob
import re

print("--- Checking HTML inline styles for width > 300px ---")
for html in glob.glob("*.html"):
    with open(html, "r", encoding="utf-8") as f:
        content = f.read()
    widths = re.findall(r'style="[^"]*width:\s*(\d+)px', content)
    large = [w for w in widths if int(w) > 300]
    if large:
        print(f"{html}: {large}")

print("\n--- Checking CSS files for overflow triggers ---")
for css_file in glob.glob("assets/css/*.css"):
    with open(css_file, "r", encoding="utf-8") as f:
        css = f.read()
    print(f"\nFile: {css_file}")
    
    # Check width: 100vw
    for m in re.finditer(r'([^\n\{]+)\{[^\}]*100vw[^\}]*\}', css):
        print(f"  100vw: {m.group(1).strip()}")
        
    # Check negative margins > 15px
    for m in re.finditer(r'([^\n\{]+)\{[^\}]*margin-(?:inline|right|left)\s*:\s*-([2-9]\d|\d{3,})px[^\}]*\}', css):
        print(f"  Negative margin: {m.group(1).strip()} -> {m.group(0).strip()}")
