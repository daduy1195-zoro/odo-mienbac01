import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """            if (e.startDate) {
                const sIdx = allDatesInCycle.indexOf(e.startDate);
                if (sIdx !== -1) {
                    // Nếu có ngày bắt đầu, nhưng thực tế họ làm trước đó thì dùng ngày thực tế
                    firstActiveIndex = actualFirstIdx !== -1 ? Math.min(sIdx, actualFirstIdx) : sIdx;
                }
            } else {"""

replace = """            if (e.startDate) {
                const sIdx = allDatesInCycle.indexOf(e.startDate);
                if (sIdx !== -1) {
                    // Ưu tiên sử dụng startDate (ngày vào làm) để không tính quá khứ
                    firstActiveIndex = sIdx;
                }
            } else {"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched startDate logic successfully!")
else:
    print("search string not found")
