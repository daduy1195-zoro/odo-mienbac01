const https = require('https');
https.get('https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/edit', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Use a simple match to find sheet names and GIDs
        const matches = data.match(/\[\"[^\"]+\",\d+\]/g) || [];
        console.log("Found tabs:");
        matches.forEach(m => console.log(m));
    });
});
