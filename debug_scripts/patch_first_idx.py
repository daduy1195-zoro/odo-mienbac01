import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# Currently:
#             let actualFirstIdx = -1;
#             for (let i = 0; i < allDatesInCycle.length; i++) {
#                 const d = allDatesInCycle[i];
#                 if (e.days.has(d) || (e.workedDays && e.workedDays.has(d))) {
#                     actualFirstIdx = i;
#                     break;
#                 }
#             }

search = """            let actualFirstIdx = -1;
            for (let i = 0; i < allDatesInCycle.length; i++) {
                const d = allDatesInCycle[i];
                if (e.days.has(d) || (e.workedDays && e.workedDays.has(d))) {"""

replace = """            let actualFirstIdx = -1;
            for (let i = 0; i < allDatesInCycle.length; i++) {
                const d = allDatesInCycle[i];
                // Chỉ lấy ngày đầu tiên có trong Lastmile, không lấy ngày báo ODO sớm (theo yêu cầu user)
                if (e.workedDays && e.workedDays.has(d)) {"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched actualFirstIdx successfully!")
else:
    print("search string not found")
