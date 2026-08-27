const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const bad = `            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(mergedOverrides));
            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(mergedNotes));
            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(mergedOverrides));
            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(mergedNotes));`;
const good = `            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(mergedOverrides));
            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(mergedNotes));`;

code = code.replace(bad, good);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
