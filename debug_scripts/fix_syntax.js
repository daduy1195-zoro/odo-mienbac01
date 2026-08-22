const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

code = code.replace(/container\.innerHTML = <div(.*?)<\/div>;/g, 'container.innerHTML = `<div$1</div>`;');

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
console.log("Fixed");
