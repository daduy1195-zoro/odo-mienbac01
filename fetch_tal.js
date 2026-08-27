const fetch = require('node-fetch');
async function run() {
    const url = 'https://docs.google.com/spreadsheets/d/1T6Hj-tcabvxLARvF7YyUUI05SHpQmvcfjik_yPp4Mls/gviz/tq?tqx=out:json&gid=1012425134&headers=0';
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    if(json.table.rows && json.table.rows.length>0) {
        for(let i=0; i<15; i++) {
            if(!json.table.rows[i]) continue;
            console.log(`ROW ${i}: `, JSON.stringify(json.table.rows[i].c.map(c=>c? (c.f || c.v || '') : '')));
        }
    }
}
run();
