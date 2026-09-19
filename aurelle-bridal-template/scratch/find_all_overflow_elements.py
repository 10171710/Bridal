import re

with open("assets/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

print("=== SEARCHING FOR POTENTIAL OVERFLOW IN style.css ===")

# Search for any negative insets / margins
for line_no, line in enumerate(css.splitlines(), 1):
    if re.search(r'(?:margin-inline|margin-left|margin-right|inset-inline|right|left)\s*:\s*-[^0]', line):
        print(f"Negative offset Line {line_no}: {line.strip()}")

# Search for 100vw
for line_no, line in enumerate(css.splitlines(), 1):
    if '100vw' in line:
        print(f"100vw Line {line_no}: {line.strip()}")

# Search for calc with negative
for line_no, line in enumerate(css.splitlines(), 1):
    if 'calc(' in line and '-' in line and any(k in line for k in ['width', 'margin', 'padding', 'left', 'right', 'inline']):
        print(f"Calc negative Line {line_no}: {line.strip()}")
