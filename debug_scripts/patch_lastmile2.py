# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re
search = r"var isMatched = r\.tripCode && matchedTripCodes\.has\(r\.tripCode\);\s*html \+= '<td style=\"text-align:center;font-weight:bold;\">' \+ \(isMatched \? '<span style=\"color:var\(--success\);\">\\u2705 Đã ĐS</span>' : '<span style=\"color:var\(--warning\);\">\\u26A0\\uFE0F Chưa ĐS</span>'\) \+ '</td>';"

# The file actually uses ✅ and ⚠️
search = r"var isMatched = r\.tripCode && matchedTripCodes\.has\(r\.tripCode\);\s*html \+= '<td style=\"text-align:center;font-weight:bold;\">' \+ \(isMatched \? '<span style=\"color:var\(--success\);\">✅ Đã ĐS</span>' : '<span style=\"color:var\(--warning\);\">⚠️ Chưa ĐS</span>'\) \+ '</td>';"

start = code.find("var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);")
if start != -1:
    end = code.find("</td>';", start) + 8
    
    replace = '''var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);
        var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);
        
        let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
        if (isMatched) {
            if (isManual) {
                statusHtml = '<span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🖐️ Khớp tay</span>';
            } else {
                statusHtml = '<span style="color:var(--success);">✅ Đã ĐS</span>';
            }
        }
        html += '<td style="text-align:center;font-weight:bold;">' + statusHtml + '</td>';'''
        
    code = code[:start] + replace + code[end:]
    
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Replaced!")
else:
    print("Not found")

