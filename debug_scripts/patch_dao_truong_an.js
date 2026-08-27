const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /'dao truong an': 'Đào Trọng An'/g;
if (code.match(regex)) {
    code = code.replace(regex, "'dao truong an': 'Đạo Trường An'");
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Fixed to Đạo Trường An');
} else {
    console.log('Regex not found');
}
