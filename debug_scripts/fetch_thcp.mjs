import fetch from 'node-fetch';

const sheetId = '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA';
const gid = '1957064243';

async function main() {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}&headers=0`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    const cols = json.table.cols;
    console.log("=== COLUMNS ===");
    cols.forEach((c, i) => console.log(`Col ${i} (${String.fromCharCode(65 + (i < 26 ? i : -1))}): label="${c.label}", type="${c.type}"`));
    
    const rows = json.table.rows.map(r => r.c.map(c => c ? (c.f || c.v || '') : ''));
    
    console.log("\n=== FIRST 5 ROWS ===");
    for (let i = 0; i < Math.min(5, rows.length); i++) {
        console.log(`Row ${i}: ${JSON.stringify(rows[i])}`);
    }
    
    console.log("\n=== TOTAL ROWS ===", rows.length);
    
    // Check what tabs exist
    const tabUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const tabRes = await fetch(tabUrl);
    const tabText = await tabRes.text();
    const tabJson = JSON.parse(tabText.substring(47, tabText.length - 2));
    console.log("\n=== DEFAULT TAB COLS ===", tabJson.table.cols.length);
    console.log("DEFAULT TAB ROWS:", tabJson.table.rows.length);
}

main();
