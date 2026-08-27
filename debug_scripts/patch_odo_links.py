import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# Replace in main table and fraud table
search1 = """<td style="font-family:Calibri, sans-serif;">${(e.imgStart && e.imgStart.startsWith('http')) ? `<a href="${e.imgStart}" target="_blank" style="color:var(--text);text-decoration:underline;" title="Xem ảnh ODO đi">${escapeHtml(String(e.kmStart))}</a>` : escapeHtml(String(e.kmStart))}</td>
            <td style="font-family:Calibri, sans-serif;">${(e.imgEnd && e.imgEnd.startsWith('http')) ? `<a href="${e.imgEnd}" target="_blank" style="color:var(--text);text-decoration:underline;" title="Xem ảnh ODO về">${escapeHtml(String(e.kmEnd))}</a>` : escapeHtml(String(e.kmEnd))}</td>"""

replace1 = """<td style="font-family:Calibri, sans-serif; text-align:center;">${(e.imgStart && e.imgStart.startsWith('http')) ? `<a href="${e.imgStart}" target="_blank" onclick="this.style.opacity='0.5'" style="color:var(--text);text-decoration:underline;cursor:pointer;" title="Xem ảnh ODO đi">${escapeHtml(String(e.kmStart))}</a>` : escapeHtml(String(e.kmStart))}</td>
            <td style="font-family:Calibri, sans-serif; text-align:center;">${(e.imgEnd && e.imgEnd.startsWith('http')) ? `<a href="${e.imgEnd}" target="_blank" onclick="this.style.opacity='0.5'" style="color:var(--text);text-decoration:underline;cursor:pointer;" title="Xem ảnh ODO về">${escapeHtml(String(e.kmEnd))}</a>` : escapeHtml(String(e.kmEnd))}</td>"""

content = content.replace(search1, replace1)

# Replace in odoErrors table
search2 = """<td style="font-family:Calibri, sans-serif;">${e.kmStart}</td>
                <td style="font-family:Calibri, sans-serif;">${e.kmEnd}</td>"""

replace2 = """<td style="font-family:Calibri, sans-serif; text-align:center;">${(e.imgStart && e.imgStart.startsWith('http')) ? `<a href="${e.imgStart}" target="_blank" onclick="this.style.opacity='0.5'" style="color:var(--text);text-decoration:underline;cursor:pointer;" title="Xem ảnh ODO đi">${escapeHtml(String(e.kmStart))}</a>` : escapeHtml(String(e.kmStart))}</td>
                <td style="font-family:Calibri, sans-serif; text-align:center;">${(e.imgEnd && e.imgEnd.startsWith('http')) ? `<a href="${e.imgEnd}" target="_blank" onclick="this.style.opacity='0.5'" style="color:var(--text);text-decoration:underline;cursor:pointer;" title="Xem ảnh ODO về">${escapeHtml(String(e.kmEnd))}</a>` : escapeHtml(String(e.kmEnd))}</td>"""

content = content.replace(search2, replace2)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)

print("Patched ODO links successfully!")
