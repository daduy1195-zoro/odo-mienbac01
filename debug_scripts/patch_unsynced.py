import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """            if (isTrackedInTrips) {
                allDatesInCycle.forEach((d, idx) => {
                    if (firstActiveIndex !== -1 && idx < firstActiveIndex) {
                        myExpectedDays--;
                        return;
                    }
                    if (syncedDates.has(d) && !e.workedDays.has(d)) {
                        myExpectedDays--;
                    }
                });"""

replace = """            if (isTrackedInTrips) {
                allDatesInCycle.forEach((d, idx) => {
                    if (firstActiveIndex !== -1 && idx < firstActiveIndex) {
                        myExpectedDays--;
                        return;
                    }
                    if (!syncedDates.has(d)) {
                        // Chưa có dữ liệu hệ thống (vd: ngày hôm nay), không tính vào ngày kỳ vọng
                        myExpectedDays--;
                    } else if (!e.workedDays.has(d)) {
                        // Ngày nghỉ (có dữ liệu hệ thống nhưng không có chuyến đi)
                        myExpectedDays--;
                    }
                });"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched myExpectedDays logic successfully!")
else:
    print("search string not found")
