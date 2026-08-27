const https = require('https');
https.get('https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/gviz/tq?sheet=database&headers=1', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const jsonStr = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
            const json = JSON.parse(jsonStr);
            console.log('Success! Rows:', json.table.rows.length);
        } catch(e) {
            console.log('Failed:', data.substring(0, 100));
        }
    });
});
