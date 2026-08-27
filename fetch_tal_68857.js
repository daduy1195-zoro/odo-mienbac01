const fetch = require('node-fetch');
async function run() {
    const url = 'https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/gviz/tq?tqx=out:json&gid=1482895796&headers=0';
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    if(json.table.rows && json.table.rows.length>0) {
        for(let i=0; i<json.table.rows.length; i++) {
            if(!json.table.rows[i]) continue;
            const rowStr = JSON.stringify(json.table.rows[i].c.map(c=>c? (c.f || c.v || '') : ''));
            if (rowStr.includes('68857')) {
                console.log(`ROW ${i}: `, rowStr);
            }
        }
    }
}
run();
