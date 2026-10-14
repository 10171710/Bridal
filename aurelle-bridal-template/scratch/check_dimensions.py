import re

with open("assets/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Check fixed widths (e.g. px values > 300px)
print("=== FIXED WIDTHS > 300px ===")
for line_no, line in enumerate(css.splitlines(), 1):
    m = re.search(r'(?<!max-)(?<!min-)width:\s*(\d+)px', line)
    if m and int(m.group(1)) > 300:
        print(f"Line {line_no}: {line.strip()}")

print("\n=== ABSOLUTE / FIXED POSITIONING ===")
for line_no, line in enumerate(css.splitlines(), 1):
    if re.search(r'position:\s*(?:absolute|fixed)', line):
        print(f"Line {line_no}: {line.strip()}")

print("\n=== GRID TEMPLATE COLUMNS WITH FIXED PIXELS ===")
for line_no, line in enumerate(css.splitlines(), 1):
    if 'grid-template-columns' in line and 'px' in line:
        print(f"Line {line_no}: {line.strip()}")
