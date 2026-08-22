# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# Remove backslashes
code = code.replace(r'value=\"da_chuyen\"', r'value="da_chuyen"')

# Remove duplicate lines
search_dup = r'<option value="da_chuyen">🔄 Đa chuyến</option>\s*<option value="da_chuyen">🔄 Đa chuyến</option>'
replace_dup = r'<option value="da_chuyen">🔄 Đa chuyến</option>'
code = re.sub(search_dup, replace_dup, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
