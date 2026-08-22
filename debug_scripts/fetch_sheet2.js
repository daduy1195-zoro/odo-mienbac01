const https = require('https');

https.get('https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/gviz/tq?gid=1482895796&headers=0', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const match = data.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
      if (match) {
        const json = JSON.parse(match[1]);
        const rows = json.table.rows;
        
        for (let i = 0; i < 3; i++) {
            console.log(Row :, rows[i].c.map(c => c ? (c.f || c.v) : 'null'));
        }
      }
    } catch (e) {
      console.log('Error parsing:', e);
    }
  });
});
