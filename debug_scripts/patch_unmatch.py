import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """              codes.forEach((c, idx) => {
                  ghnHtml += `<a href="https://nhanh.ghn.vn/lastmile/trip-detail/${c}" target="_blank" style="color:var(--success);text-decoration:underline;"><strong>${c}</strong></a>`;
                  if (idx < codes.length - 1) ghnHtml += `<span style="color:#64748b;">|</span>`;
              });"""

replace = """              codes.forEach((c, idx) => {
                  ghnHtml += `<div style="display:flex;align-items:center;gap:2px;"><a href="https://nhanh.ghn.vn/lastmile/trip-detail/${c}" target="_blank" style="color:var(--success);text-decoration:underline;"><strong>${c}</strong></a><button style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:12px;padding:0 2px;" onclick="unmatchFromLastmile(${r.originalIndex}, '${c}')" title="Gỡ mã chuyến này">✖</button></div>`;
                  if (idx < codes.length - 1) ghnHtml += `<span style="color:#64748b;">|</span>`;
              });"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched unmatch button successfully!")
else:
    print("Not found!")
