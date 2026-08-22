# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = code.replace("ARCHIVE_API_URL: 'https://script.google.com/a/macros/ghn.vn/s/AKfycbzP3n4syyPtCXZgXf0jimHp9c37oRoTHHqUvBaQGMmj3Cde9t5KKoqB1miQkG5UEB8Y/exec'", "ARCHIVE_API_URL: '' // Tạm tắt do API đang bị chặn quyền 401 (domain ghn.vn)")

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)
