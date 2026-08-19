const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /if\s*\(isTrackedInTrips\)\s*\{\s*allDatesInCycle\.forEach\(\(d,\s*idx\)\s*=>\s*\{\s*\/\/[^\n]*\n\s*if\s*\(syncedDates\.has\(d\)\s*&&\s*!e\.workedDays\.has\(d\)\)\s*\{\s*myExpectedDays--;\s*\}\s*\}\);\s*\}/;

const newBlock = `if (isTrackedInTrips) {
                allDatesInCycle.forEach((d, idx) => {
                    // Nếu ngày này trước khi NV bắt đầu làm việc, trừ khỏi expected days
                    if (firstActiveIndex !== -1 && idx < firstActiveIndex) {
                        myExpectedDays--;
                        return;
                    }
                    // Nếu hệ thống có GHN trips, nhưng NV không có -> NV nghỉ
                    if (syncedDates.has(d) && !e.workedDays.has(d)) {
                        myExpectedDays--;
                    }
                });
            }`;

if (regex.test(content)) {
    content = content.replace(regex, newBlock);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Fixed myExpectedDays logic!');
} else {
    console.log('Regex did not match for myExpectedDays block.');
}
