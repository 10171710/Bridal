import re

with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    text = f.read()

print('=== 100vw usages ===')
for m in re.finditer(r'[^\n]*100vw[^\n]*', text):
    print(m.group(0).strip())

print('\n=== translateX positive usages ===')
for m in re.finditer(r'[^\n]*translateX\(\s*[\d\.]+[a-z%]+[^\n]*', text):
    print(m.group(0).strip())

print('\n=== right: - or inset-inline-end: - ===')
for m in re.finditer(r'[^\n]*(?:right|inset-inline-end)\s*:\s*-[^\n]*', text):
    print(m.group(0).strip())

print('\n=== min-width > 300px ===')
for m in re.finditer(r'[^\n]*min-width\s*:\s*(?:[4-9]\d\d|3[2-9]\d|\d{4,})px[^\n]*', text):
    print(m.group(0).strip())
