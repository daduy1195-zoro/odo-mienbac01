const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const targetFuncStart = 'function normalizeSupplierName(name) {';
const targetFuncEnd = 'return clean;\n}';

const startIndex = code.indexOf(targetFuncStart);
const endIndex = code.indexOf(targetFuncEnd, startIndex) + targetFuncEnd.length;

if (startIndex > -1 && endIndex > startIndex) {
    const replacementFunc = `function normalizeSupplierName(name) {
    if (!name) return '';
    let clean = String(name).replace(/^[\\s:;]+/, '').trim();
    if (!clean) return '';
    
    // Capitalize first letter of every word
    clean = clean.split(/\\s+/).map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    
    const noTones = typeof removeAccents === 'function' ? removeAccents(clean).toLowerCase() : norm(clean);
    const standardNames = {
        'thien phu': 'Thiên Phú',
        'duy phat': 'Duy Phát',
        'hoang minh': 'Hoàng Minh',
        'hoa vinh': 'Hoa Vinh',
        'dao truong an': 'Đào Trọng An',
        'dai minh': 'Đại Minh',
        'tal': 'TAL',
        'nak': 'NAK',
        'long thanh': 'Long Thành',
        'gach htc': 'Gạch HTC',
        'tien phat': 'Tiên Phát'
    };
    
    if (noTones.includes('viet hung')) return 'Hoa Vinh';
    if (noTones.includes('phuong anhttt')) return 'Đào Trọng An'; // sometimes they do this

    for (const key in standardNames) {
        if (noTones.includes(key)) {
            return standardNames[key];
        }
    }
    
    return clean;
}`;
    
    code = code.substring(0, startIndex) + replacementFunc + code.substring(endIndex);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Supplier normalization updated.');
} else {
    console.log('Function not found.');
}
