import re
with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'r', encoding='utf-8') as f: html = f.read()
html = re.sub(r'(ncc: \'Đại Minh\' \},)\s*// Telegram', r'\1\n    ],\n\n    // Telegram', html)
with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'w', encoding='utf-8') as f: f.write(html)
