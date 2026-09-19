import glob

for f in ['assets/css/style.css', 'assets/css/dashboard.css', 'assets/css/rtl.css']:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    open_braces = content.count('{')
    close_braces = content.count('}')
    print(f"{f}: open_braces={open_braces}, close_braces={close_braces} -> {'MATCH' if open_braces == close_braces else 'MISMATCH!'}")
