const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const targetRegex = /const mergedMapping = \{ \.\.\.localMapping, \.\.\.parsedCloud \};\s*localStorage\.setItem\('GHN_PLATE_MAPPING', JSON\.stringify\(mergedMapping\)\);/;
const replacement = `const mergedMapping = { ...localMapping, ...parsedCloud };
                    localStorage.setItem('GHN_PLATE_MAPPING', JSON.stringify(mergedMapping));
                    
                    // Nếu từ điển nội bộ của user này nhiều hơn trên Cloud (do học từ phiên bản trước),
                    // tự động đẩy nó lên Cloud để mọi người cùng nhận được
                    if (Object.keys(localMapping).length > Object.keys(parsedCloud || {}).length) {
                        if (typeof syncToCloud === 'function') {
                            syncToCloud('__PLATE_MAPPING__', JSON.stringify(mergedMapping), undefined, undefined);
                        }
                    }`;

if (code.match(targetRegex)) {
    code = code.replace(targetRegex, replacement);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Patched reverse plate mapping sync successfully');
} else {
    console.log('Target not found');
}
