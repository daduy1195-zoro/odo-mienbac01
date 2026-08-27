import fetch from 'node-fetch';

const sheetId = '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA';
const gid = '1957064243';

async function main() {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}&headers=0`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    const rows = json.table.rows.map(r => r.c.map(c => c ? (c.f || c.v || '') : ''));
    
    // Find where each NCC starts 
    let prevNcc = '';
    for (let i = 3; i < rows.length; i++) {
        const ncc = rows[i][1] || '';
        if (ncc && ncc !== prevNcc) {
            console.log(`NCC "${ncc}" starts at row ${i}, date=${rows[i][2]}, plate=${rows[i][3]}`);
            prevNcc = ncc;
        }
    }
    
    // Count rows per date range
    let apr_may = 0, may_jun = 0, jun_jul = 0;
    for (let i = 3; i < rows.length; i++) {
        const raw = json.table.rows[i].c[2];
        if (!raw || !raw.v) continue;
        const dateStr = String(raw.v);
        // Date(2026,3,26) = Apr 26 (month is 0-indexed)
        const m = dateStr.match(/Date\((\d+),(\d+),(\d+)\)/);
        if (!m) continue;
        const month = parseInt(m[2]); // 0-indexed
        const day = parseInt(m[3]);
        
        // 26/4-25/5 = month 3 day 26 to month 4 day 25
        // 26/5-25/6 = month 4 day 26 to month 5 day 25
        // 26/6-25/7 = month 5 day 26 to month 6 day 25
        if ((month === 3 && day >= 26) || (month === 4 && day <= 25)) apr_may++;
        else if ((month === 4 && day >= 26) || (month === 5 && day <= 25)) may_jun++;
        else if ((month === 5 && day >= 26) || (month === 6 && day <= 25)) jun_jul++;
    }
    console.log(`\n26/4-25/5: ${apr_may} rows`);
    console.log(`26/5-25/6: ${may_jun} rows`);
    console.log(`26/6-25/7: ${jun_jul} rows`);
    
    // Column AC = index 28, check what's there
    console.log("\n=== COL AC (28) SAMPLE ===");
    for (let i = 3; i < Math.min(20, rows.length); i++) {
        if (rows[i][28]) console.log(`Row ${i}: AC="${rows[i][28]}"`);
    }
}

main();
