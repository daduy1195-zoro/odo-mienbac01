const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    'text-shadow: 1px 1px 2px rgba(0,0,0,0.5); color: #fff;',
    'text-shadow: 1px 1px 2px rgba(0,0,0,0.1); color: var(--text-primary);'
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Loading screen text patched');
