const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].toLowerCase().includes('chi phí') || lines[i].toLowerCase().includes('chi ph')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
  }
}
