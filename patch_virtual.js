const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex1 = /\/\/ Đồng bộ Plate Mapping \(Học biển số\)/;
const newStr1 = `// Đồng bộ Chuyến Ảo (Virtual Trips)
            if (cloudOverrides['__VIRTUAL_TRIPS__']) {
                try {
                    const localVirtuals = JSON.parse(localStorage.getItem('GHN_VIRTUAL_TRIPS') || '{}');
                    let parsedCloudVirtuals = cloudOverrides['__VIRTUAL_TRIPS__'];
                    if (typeof parsedCloudVirtuals === 'string') parsedCloudVirtuals = JSON.parse(parsedCloudVirtuals);
                    const mergedVirtuals = { ...localVirtuals, ...parsedCloudVirtuals };
                    localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(mergedVirtuals));
                } catch(e) {}
            }
            
            // Đồng bộ Plate Mapping (Học biển số)`;

code = code.replace(regex1, newStr1);

const regex2 = /localStorage\.setItem\('GHN_VIRTUAL_TRIPS', JSON\.stringify\(virtuals\)\);/;
const newStr2 = `localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(virtuals));
        if (typeof syncToCloud === 'function') {
            syncToCloud('__VIRTUAL_TRIPS__', JSON.stringify(virtuals), undefined, undefined);
        }`;

code = code.replace(regex2, newStr2);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Patched virtual trips sync successfully!');
