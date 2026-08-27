const fetch = require('node-fetch');
async function run() {
    const url = 'https://docs.google.com/spreadsheets/d/1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA/gviz/tq?tqx=out:json&gid=1620536867';
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    if(json.table.rows && json.table.rows.length>0) {
        for(let i=0; i<json.table.rows.length; i++) {
            const rowStr = JSON.stringify(json.table.rows[i].c.map(c=>c? (c.f || c.v || '') : ''));
            if(rowStr.includes('25/08/2026') || rowStr.includes('24/08/2026')) {
                console.log(`ROW ${i}: `, rowStr);
            }
        }
    }
}
run();
