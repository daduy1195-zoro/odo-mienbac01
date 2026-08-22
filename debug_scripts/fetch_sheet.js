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
        console.log('Total rows:', rows.length);
        
        // Print first 5 dates
        const dates = rows.slice(0, 5).map(r => r.c[3] ? r.c[3].v || r.c[3].f : 'null');
        console.log('First 5 dates (col 3):', dates);
        
        // Let's find dates for 06 and 07
        const allDates = rows.map(r => r.c[3] ? (r.c[3].f || String(r.c[3].v)) : '').filter(d => d);
        const julyDates = allDates.filter(d => d.includes('/07/') || d.includes('Date(2026,6,'));
        const juneDates = allDates.filter(d => d.includes('/06/') || d.includes('Date(2026,5,'));
        
        console.log('July dates count:', julyDates.length);
        console.log('June dates count:', juneDates.length);
        
        // Let's check headers
        const headers = rows[0].c.map(c => c ? c.v : '');
        console.log('Headers:', headers.join(', '));
      }
    } catch (e) {
      console.log('Error parsing:', e);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
