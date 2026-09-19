import re

with open("assets/css/style.css", "r", encoding="utf-8") as f:
    css_content = f.read()

# Find all @media queries
media_matches = re.finditer(r'@media[^{]+{', css_content)
print("=== MEDIA QUERIES FOUND IN style.css ===")
for m in media_matches:
    print(m.group(0))

# Find all negative insets / margins
print("\n=== NEGATIVE INSETS / MARGINS ===")
for line_no, line in enumerate(css_content.splitlines(), 1):
    if re.search(r'(-\d+(?:\.\d+)?(?:%|px|rem|em)|inset-inline.*-\d+|margin.*-\d+)', line):
        print(f"Line {line_no}: {line.strip()}")
