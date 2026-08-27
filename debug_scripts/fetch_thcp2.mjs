import fetch from 'node-fetch';

const sheetId = '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA';
const gid = '1957064243';

async function main() {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}&headers=0`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    const rows = json.table.rows.map(r => r.c.map(c => c ? (c.f || c.v || '') : ''));
    
    // Show header rows (0-2)
    console.log("=== HEADER ROW 0 ===");
    console.log(JSON.stringify(rows[0]));
    console.log("\n=== HEADER ROW 1 ===");
    console.log(JSON.stringify(rows[1]));
    console.log("\n=== HEADER ROW 2 ===");
    console.log(JSON.stringify(rows[2]));
    
    // Show first data row with raw values
    console.log("\n=== DATA ROW 3 (raw v) ===");
    const rawRow3 = json.table.rows[3].c.map(c => c ? { v: c.v, f: c.f } : null);
    console.log(JSON.stringify(rawRow3));
    
    // Show a data row from further down (past the first NCC)
    console.log("\n=== ROW 100 ===");
    console.log(JSON.stringify(rows[100]));
    
    // Check row 700+ to see different NCC data
    console.log("\n=== ROW 700 ===");
    if (rows[700]) console.log(JSON.stringify(rows[700]));
    
    // Last few rows
    console.log("\n=== LAST 3 ROWS ===");
    for (let i = rows.length - 3; i < rows.length; i++) {
        console.log(`Row ${i}: ${JSON.stringify(rows[i])}`);
    }
    
    // Count NCC names
    const nccNames = new Set();
    rows.forEach((r, i) => {
        if (i >= 3 && r[1]) nccNames.add(r[1]);
    });
    console.log("\n=== UNIQUE NCC NAMES ===");
    nccNames.forEach(n => console.log(n));
}

main();
