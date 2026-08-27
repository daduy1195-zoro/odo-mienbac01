import fetch from 'node-fetch';

const sheetId = '1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA';

async function fetchJSONP() {
    // We can fetch by gid since it's in the user's URL: 536151443
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=536151443&headers=0`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ''));
    
    console.log("Headers:");
    console.log(JSON.stringify(rows[1])); // Row 2
    console.log(JSON.stringify(rows[2])); // Row 3
    
    console.log("\nData row:");
    console.log(JSON.stringify(rows[5]));
}

fetchJSONP();
