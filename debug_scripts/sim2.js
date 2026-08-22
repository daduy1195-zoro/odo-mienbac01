const https = require('https');

function fetchJSONP(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data+=c);
      res.on('end', () => {
         try {
             const jsonStr = data.substring(data.indexOf('(') + 1, data.lastIndexOf(')'));
             const obj = JSON.parse(jsonStr);
             resolve(obj.table.rows.map(r => r.c.map(c => c ? c.v : null)));
         } catch(e) { resolve([]); }
      });
    }).on('error', reject);
  });
}

async function run() {
    const odo1 = await fetchJSONP('https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/gviz/tq?tqx=out:json&tq=select%20*&gid=517652990&headers=1');
    const odo2 = await fetchJSONP('https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/gviz/tq?tqx=out:json&tq=select%20*&gid=862199038&headers=1');
    
    // Add gids
    odo1.forEach((r, idx) => { r._gid = '1274066622'; r._sheetRow = idx+2; });
    odo2.forEach((r, idx) => { r._gid = '409459817'; r._sheetRow = idx+2; });
    
    const empRows = [...odo1, ...odo2];
    
    const dedupeSet = new Set();
    const lamRecords = [];
    
    for (let i = 0; i < empRows.length; i++) {
        const r = empRows[i];
        if (!r || r.length < 5) continue;
        const fullName = (r[2] || '').trim();
        if (!fullName.includes('3074133')) continue; 
        
        const plate = (r[9] || '').trim();
        const normPlate = plate ? String(plate).toUpperCase().replace(/[\s\-\.]/g, '') : '';
        
        const codeMatch = fullName.match(/(\d{5,8})[^\w\d]*$/);
        const code = codeMatch ? codeMatch[1] : '';
        
        let dateStr = (r[4] || '').trim();
        
        // Normalize date just like index.html
        const m1 = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
        if (m1) dateStr = m1[3].padStart(2, '0') + '/' + m1[2].padStart(2, '0') + '/' + m1[1];
        else {
            const m2 = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
            if (m2) dateStr = m2[1].padStart(2, '0') + '/' + m2[2].padStart(2, '0') + '/' + m2[3];
        }

        const id = dateStr + '_' + code + '_' + normPlate;
        
        if (!dedupeSet.has(id)) {
            dedupeSet.add(id);
            lamRecords.push({ id: id, dateStr: dateStr, gid: r._gid });
        }
    }
    
    console.log("Total unique records for Lâm:", lamRecords.length);
    const inRange = lamRecords.filter(r => {
        const m = r.dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (m) {
           const d = new Date(m[3], m[2]-1, m[1]);
           const sd = new Date(2026, 6, 26); // 26/07
           const ed = new Date(2026, 7, 25); // 25/08
           return d >= sd && d <= ed;
        }
        return false;
    });
    console.log("Records in range 26/07 - 25/08:", inRange.length);
    console.log(inRange.map(r => r.dateStr + ' (' + r.gid + ')').join(', '));
}
run();
