import re
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

search = r"ghnHtml \+= `<a href=\"https://nhanh\.ghn\.vn/lastmile/trip-detail/\" target=\"_blank\" style=\"color:var\(--success\);text-decoration:underline;\"><strong></strong></a>`;"
replace = r"ghnHtml += `<a href=\"https://nhanh.ghn.vn/lastmile/trip-detail/${c}\" target=\"_blank\" style=\"color:var(--success);text-decoration:underline;\"><strong>${c}</strong></a>`;"

code = code.replace(r'ghnHtml += <a href="https://nhanh.ghn.vn/lastmile/trip-detail/" target="_blank" style="color:var(--success);text-decoration:underline;"><strong></strong></a>;', r'ghnHtml += `<a href="https://nhanh.ghn.vn/lastmile/trip-detail/${c}" target="_blank" style="color:var(--success);text-decoration:underline;"><strong>${c}</strong></a>`;')
code = code.replace(r'<div style="display:flex; gap: 6px; align-items:center; flex-wrap:wrap;">;', r'`<div style="display:flex; gap: 6px; align-items:center; flex-wrap:wrap;">`;')
code = code.replace(r'<span style="color:#64748b;">|</span>;', r'`<span style="color:#64748b;">|</span>`;')


with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)
