const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const targetLoop = `const allLocalKeys = new Set([...Object.keys(localOverrides), ...Object.keys(localNotes)]);
            for (let key of allLocalKeys) {
                const lCode = localOverrides[key];
                const cCode = cloudOverrides[key];
                const lNote = localNotes[key];
                const cNote = cloudNotes[key];

                if ((lCode && !cCode) || (lNote && !cNote)) {
                    syncToCloud(key, lCode, lNote, localLogs[key]);
                }
            }`;

const replacement = `// Removed auto-sync on load to prevent fetch flooding and freezing the browser
            // when localOverrides has thousands of items and cloud is wiped.`;

if (code.includes(targetLoop)) {
    code = code.replace(targetLoop, replacement);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Patched loadCloudData successfully');
} else {
    console.log('Could not find target loop');
}
