const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /let offDays = allDatesInCycle\.filter\(\(d, index\) => \{\s*return isTrackedInTrips && syncedDates\.has\(d\) && !e\.workedDays\.has\(d\);\s*\}\);/;
const newStr = `let offDays = allDatesInCycle.filter((d, index) => {
                if (firstActiveIndex !== -1 && index < firstActiveIndex) return false;
                return isTrackedInTrips && syncedDates.has(d) && !e.workedDays.has(d);
            });`;

if (regex.test(content)) {
    content = content.replace(regex, newStr);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Fixed offDays successfully.');
} else {
    console.log('Regex did not match!');
}
