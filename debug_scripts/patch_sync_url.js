const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    /const SYNC_API_URL = ''; \/\/ Sẽ điền sau khi có link Web App/,
    "const SYNC_API_URL = 'https://script.google.com/macros/s/AKfycbwJr2pgITDURfuT_H3zGUYXUEC2SzvM0V_JNSFPqLwexGLElVlGPSpzPXMXpmE4R25e4g/exec';"
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('SYNC URL patched.');
