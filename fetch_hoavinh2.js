const fetch = require('node-fetch');
async function run() {
    const url = 'https://docs.google.com/spreadsheets/d/1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA/gviz/tq?tqx=out:json&gid=1620536867';
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    if(json.table.rows && json.table.rows.length>0) {
        for(let i=0; i<6; i++) {
            console.log(`ROW ${i}: `, JSON.stringify(json.table.rows[i].c.map(c=>c? (c.f || c.v || '') : '')));
        }
    }
}
run();
