const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /if \(h\.includes\('thoi gian tang ca'\) \|\| h\.includes\('tg tang ca'\) \|\| h\.includes\('gio tang ca'\) \|\| h\.includes\('so gio tang ca'\) \|\| \(h\.includes\('tang ca'\) && h\.includes\('h'\)\)\) colOtHours = ci;/;

const replacement = `if (h.includes('thoi gian tang ca') || h.includes('tg tang ca') || h.includes('gio tang ca') || h.includes('so gio tang ca') || (h.includes('tang ca') && h.includes('(h)'))) colOtHours = ci;`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Regex fixed.');
} else {
    console.log('Regex not found');
}
