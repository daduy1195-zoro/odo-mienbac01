const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const targetStr = `                const mergedOverrides = { ...localOverrides, ...cloudOverrides };
                const mergedNotes = { ...localNotes, ...cloudNotes };
                const mergedLogs = { ...localLogs, ...cloudLogs };`;

const newStr = `                const mergedOverrides = { ...localOverrides, ...cloudOverrides };
                const mergedNotes = { ...localNotes, ...cloudNotes };
                const mergedLogs = { ...localLogs, ...cloudLogs };
                
                // Đồng bộ Plate Mapping (Học biển số)
                if (cloudOverrides['__PLATE_MAPPING__']) {
                    try {
                        const localMapping = JSON.parse(localStorage.getItem('GHN_PLATE_MAPPING') || '{}');
                        let parsedCloud = cloudOverrides['__PLATE_MAPPING__'];
                        if (typeof parsedCloud === 'string') parsedCloud = JSON.parse(parsedCloud);
                        const mergedMapping = { ...localMapping, ...parsedCloud };
                        localStorage.setItem('GHN_PLATE_MAPPING', JSON.stringify(mergedMapping));
                    } catch(e) {}
                }`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, newStr);
    
    // Also we need to sync it to cloud when it's updated!
    const targetStr2 = `                    localStorage.setItem('GHN_PLATE_MAPPING', JSON.stringify(mapping));
                    console.log(\`🧠 Đã học mapping biển số: \${nccPlate} → \${realPlate}\`);`;
    const newStr2 = `                    localStorage.setItem('GHN_PLATE_MAPPING', JSON.stringify(mapping));
                    if (typeof syncToCloud === 'function') {
                        syncToCloud('__PLATE_MAPPING__', JSON.stringify(mapping), undefined, undefined);
                    }
                    console.log(\`🧠 Đã học mapping biển số: \${nccPlate} → \${realPlate}\`);`;
                    
    if (code.includes(targetStr2)) {
        code = code.replace(targetStr2, newStr2);
        fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
        console.log('Patched index.html successfully!');
    } else {
        console.log('Failed to find targetStr2');
    }
} else {
    console.log('Failed to find targetStr');
}
