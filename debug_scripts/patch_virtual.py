import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update filter logic
search1 = "if (filterStatus === 'thieu' && isMatched) continue;"
replace1 = "if (filterStatus === 'thieu' && (isMatched || isVirtualTrip)) continue;"
if search1 in content:
    content = content.replace(search1, replace1)
    print("Filter logic patched.")
else:
    print("Could not find search1")

# 2. Update statusHtml
search2 = """        let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
        if (isMatched) {
            const nccIdx = typeof tripToNccIndex !== 'undefined' ? tripToNccIndex.get(r.tripCode) : null;
            let unmatchBtn = '';
            if (nccIdx !== null && nccIdx !== undefined) {
                unmatchBtn = ` <span style="color:var(--danger); cursor:pointer; padding:0 4px; font-weight:bold; user-select:none;" onclick="unmatchFromLastmile(${nccIdx}, '${r.tripCode}')" title="Gỡ đối soát">✖ </span>`;
            }
            if (isManual) {
                statusHtml = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤝 Khớp tay</span>${unmatchBtn}</div>`;
            } else {
                statusHtml = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span style="color:var(--success);">✅ Đã ĐS</span>${unmatchBtn}</div>`;
            }
        }"""
replace2 = """        let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
        if (isMatched) {
            const nccIdx = typeof tripToNccIndex !== 'undefined' ? tripToNccIndex.get(r.tripCode) : null;
            let unmatchBtn = '';
            if (nccIdx !== null && nccIdx !== undefined) {
                unmatchBtn = ` <span style="color:var(--danger); cursor:pointer; padding:0 4px; font-weight:bold; user-select:none;" onclick="unmatchFromLastmile(${nccIdx}, '${r.tripCode}')" title="Gỡ đối soát">✖ </span>`;
            }
            if (isManual) {
                statusHtml = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤝 Khớp tay</span>${unmatchBtn}</div>`;
            } else {
                statusHtml = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span style="color:var(--success);">✅ Đã ĐS</span>${unmatchBtn}</div>`;
            }
        } else if (isVirtualTrip) {
            statusHtml = '<span style="color:#a78bfa; font-weight:700;">👻 Chuyến ảo</span>';
        }"""

if search2 in content:
    content = content.replace(search2, replace2)
    print("Status HTML patched.")
else:
    print("Could not find search2")
    # Try regex fallback for search2
    import re
    match = re.search(r"let statusHtml = '<span style=\"color:var\(--warning\);\">⚠️ Chưa ĐS</span>';\s*if \(isMatched\) \{[\s\S]*?\}\s*\}", content)
    if match:
        old_block = match.group(0)
        new_block = old_block + """ else if (isVirtualTrip) {
            statusHtml = '<span style="color:#a78bfa; font-weight:700;">👻 Chuyến ảo</span>';
        }"""
        content = content.replace(old_block, new_block)
        print("Status HTML patched via regex.")
    else:
        print("Regex fallback also failed.")

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
