const https = require('https');
https.get('https://docs.google.com/spreadsheets/d/1bpahLTCIP7gUnEmn0zaQpKGxu7MS2NBVhCTxTVg_XAM/gviz/tq?gid=0&headers=1&tqx=out:json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const js = JSON.parse(data.substring(47, data.length - 2));
        const rawData = js.table.rows.map(row => row.c.map(cell => {
            if (!cell) return '';
            const sv = cell.v !== null && cell.v !== undefined ? String(cell.v).normalize('NFC') : '';
            const dateMatch = sv.match(/^Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+)\s*,\s*(\d+))?/);
            if (dateMatch && parseInt(dateMatch[1]) >= 1900) {
                const dd = String(parseInt(dateMatch[3])).padStart(2, '0');
                const mm = String(parseInt(dateMatch[2]) + 1).padStart(2, '0');
                return dd + '/' + mm + '/' + dateMatch[1];
            }
            if (cell.f) return String(cell.f).normalize('NFC');
            return sv;
        }));
        
        // Simulating parseNccTabData
        let validRows = 0;
        let filteredRows = 0;
        
        rawData.forEach(row => {
            const dateStr = (row[2] || '').toString().trim();
            if (!dateStr) return;
            validRows++;
            
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                const rowDateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                
                // Simulating isInCycle for "2026-06" (26/06 - 25/07/2026)
                const start = new Date(2026, 5, 26);
                const end = new Date(2026, 6, 25);
                
                if (rowDateObj >= start && rowDateObj <= end) {
                    filteredRows++;
                }
            }
        });
        
        console.log('Total valid rows:', validRows);
        console.log('Rows in 26/06 - 25/07:', filteredRows);
    });
});
