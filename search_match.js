const fs = require('fs');
const lines = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8').split('\n');
for (let i = 1734; i <= 1750; i++) {
    console.log(i + ': ' + lines[i].trim());
}
