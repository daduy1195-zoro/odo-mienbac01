const fetch = require('node-fetch');
async function run() {
    const url = 'https://docs.google.com/spreadsheets/d/1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA/gviz/tq?tqx=out:json&gid=1620536867&headers=1';
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    if(json.table.cols) console.log("HEADER ROW 0: ", JSON.stringify(json.table.cols.map(c=>c?.label||'')));
    if(json.table.rows && json.table.rows.length>0) {
        console.log("HEADER ROW 1: ", JSON.stringify(json.table.rows[0].c.map(c=>c? (c.f || c.v || '') : '')));
        console.log("HEADER ROW 2: ", JSON.stringify(json.table.rows[1].c.map(c=>c? (c.f || c.v || '') : '')));
        console.log("DATA ROW 3: ", JSON.stringify(json.table.rows[2].c.map(c=>c? (c.f || c.v || '') : '')));
    }
}
run();
