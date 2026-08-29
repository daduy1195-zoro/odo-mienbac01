import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    '<button class="btn btn-primary" onclick="copyThcpAC()" style="padding:6px 14px;font-size:13px;background:#10b981;border-color:#10b981;" title="Copy toàn bộ mã chuyến đi và ghi chú để dán thẳng vào cột AC, AD của file THCP">📋 Copy cột AC, AD (THCP)</button>',
    '<button class="btn btn-primary" onclick="copyThcpAC(\'1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA\', \'THCP\')" style="padding:6px 14px;font-size:13px;background:#10b981;border-color:#10b981;" title="Copy mã chuyến đi và ghi chú của file THCP">📋 Copy AC, AD (THCP)</button>\n                <button class="btn btn-primary" onclick="copyThcpAC(\'1uzpRdyDq-ayFgpos6rWXDcJDC7OL3r5fzct_E4mMYgo\', \'Tháng 8\')" style="padding:6px 14px;font-size:13px;background:#3b82f6;border-color:#3b82f6;" title="Copy mã chuyến đi và ghi chú của file Tháng 8">📋 Copy AC, AD (Tháng 8)</button>'
)

c = re.sub(
    r"window\.copyThcpAC = function\(\) \{[\s\S]*?const thcpTrips = nccTripData\.filter\(r => r\.isAllSheet\);[\s\S]*?if\s*\(typeof showToast === 'function'\) showToast\('error',\s*'Không tìm thấy dữ liệu của file THCP!'\);",
    """window.copyThcpAC = function(sheetId, label) {
    if (typeof nccTripData === 'undefined' || !nccTripData || nccTripData.length === 0) {
        if(typeof showToast === 'function') showToast('error', 'Chưa có dữ liệu, vui lòng đợi tải xong!');
        return;
    }

    // Lọc các dòng thuộc file truyền vào
    const thcpTrips = nccTripData.filter(r => String(r.sheetId || '') === sheetId);
    if (thcpTrips.length === 0) {
        if(typeof showToast === 'function') showToast('error', 'Không tìm thấy dữ liệu của file ' + label + '!');""",
    c
)

c = re.sub(
    r"alert\('✅ Đã copy ' \+ copyArr\.length \+ ' dòng!\\n\\nBây giờ hãy:\\n1\. Mở file THCP\\n",
    "alert('✅ Đã copy ' + copyArr.length + ' dòng!\\n\\nBây giờ hãy:\\n1. Mở file ' + label + '\\n",
    c
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('Patched')
