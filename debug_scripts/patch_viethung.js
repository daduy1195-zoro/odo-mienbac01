const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /function normalizeSupplierName\(name\) \{[\s\S]*?return clean;\s*\}/;

const replacement = `function normalizeSupplierName(name) {
    if (!name) return '';
    let clean = String(name).replace(/^[\\s:;]+/, '').trim();
    if (!clean) return '';
    
    clean = clean.split(/\\s+/).map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    
    const noTones = typeof removeAccents === 'function' ? removeAccents(clean).toLowerCase() : clean.toLowerCase();
    
    if (noTones.includes('viet hung') || clean.toLowerCase().includes('việt hưng')) return 'Hoa Vinh';
    
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
    
    for (const key in standardNames) {
        if (noTones.includes(key)) {
            return standardNames[key];
        }
    }
    
    return clean;
}`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Supplier normalization updated via regex.');
} else {
    console.log('Function not found.');
}
