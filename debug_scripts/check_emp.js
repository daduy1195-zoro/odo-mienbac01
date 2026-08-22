const fs = require('fs');
const https = require('https');

https.get('https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/gviz/tq?gid=517652990&headers=1', (res) => {
  let data = ''; res.on('data', c => data += c); res.on('end', () => {
      const match = data.match(/setResponse\((.*)\);/);
      if (match) {
          const json = JSON.parse(match[1]);
          const rows = json.table.rows;
          const namRows = rows.filter(r => {
              const name = r.c[4] ? r.c[4].v : '';
              const date = r.c[1] ? r.c[1].f || r.c[1].v : '';
              return name && name.includes('Nam') && date && date.includes('19/08/2026');
          });
          namRows.forEach(r => {
              console.log('ODO Report for Nam on 19/08/2026:');
              console.log('Name:', r.c[4] ? r.c[4].v : '');
              console.log('ID:', r.c[3] ? r.c[3].v : '');
              console.log('Plate:', r.c[5] ? r.c[5].v : '');
          });
      }
  });
});
