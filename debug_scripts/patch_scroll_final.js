const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    'renderNccTrip();\n}',
    'renderNccTrip(true);\n}'
);
code = code.replace(
    'renderNccTrip();\r\n}',
    'renderNccTrip(true);\r\n}'
);


fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Final patch applied');
