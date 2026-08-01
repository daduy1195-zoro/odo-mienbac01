const https = require('https');
https.get('https://docs.google.com/spreadsheets/d/1RMe38TNV-EoIAradnynYmk8mt7l9pNWqJELM9O84Wxc/edit', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const matches = [...data.matchAll(/\["([^"]+)",(\d+),(\d+)/g)];
        if (matches.length > 0) {
            matches.forEach(m => console.log(m[1], m[2], m[3]));
        }
        
        // Alternatively search for the specific array structure
        const re = /\[\d+,\d+,"([^"]+)",1,(\d+)/g;
        const m2 = [...data.matchAll(re)];
        m2.forEach(m => console.log('Found sheet:', m[1], 'GID:', m[2]));
        
        const i = data.indexOf('NVPH');
        if (i !== -1) {
            console.log("Context around NVPH:", data.substring(i - 100, i + 100));
        }
    });
});
