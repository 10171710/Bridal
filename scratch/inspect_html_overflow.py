import html.parser
import glob
import re

html_files = sorted(glob.glob('*.html'))
print("=== CHECKING HTML STRUCTURES FOR OVERFLOW RISK ===")

for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    # Check inline styles with width or min-width > 300px or positive/negative fixed px
    inline_styles = re.findall(r'style="([^"]*)"', c)
    for s in inline_styles:
        if any(k in s for k in ['width', 'margin', 'padding', 'position', 'transform']):
            print(f"[{hf}] Inline style: {s}")

    # Check for elements with min-width or fixed width in inline styles or specific IDs
    # Also check for table or pre or code without responsive wrapper
