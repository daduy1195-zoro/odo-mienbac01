with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove Buttons
import re
html = re.sub(r'<button class="btn btn-primary" onclick="copyThcpAC[^>]+>.*?Copy AC, AD.*?<\/button>\s*', '', html)

# 2. Remove function
html = re.sub(r'window\.copyThcpAC = function\(sheetId, label\) \{.*?\n\}\n', '', html, flags=re.DOTALL)

with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
