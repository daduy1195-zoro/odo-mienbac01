with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'r', encoding='utf-8') as f: html = f.read()
import re
html = html.replace('\'Đại Minh\' },\n  \n    // Telegram', '\'Đại Minh\' }\n    ],\n  \n    // Telegram')
with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'w', encoding='utf-8') as f: f.write(html)
