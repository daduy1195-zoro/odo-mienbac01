const fetch = require('node-fetch'); // wait, built in fetch in Node 20

async function go() {
    const res = await fetch('https://docs.google.com/spreadsheets/d/16jiK-hQ-xOrs9kxmJF6CXQ1HANy0zAlDyQM2q7mOtOg/gviz/tq?gid=73639881&headers=0');
    const text = await res.text();
    const jsonStr = text.substring(47, text.length - 2);
    const data = JSON.parse(jsonStr);
    
    // Header rows are usually around row 11 (index 10) or 12 (index 11)
    console.log("--- ROW 11 (Headers?) ---");
    data.table.rows[11].c.forEach((col, i) => { console.log(i + ': ' + (col ? col.v : 'null')); });
    
    console.log("--- ROW 12 (Data?) ---");
    data.table.rows[12].c.forEach((col, i) => { console.log(i + ': ' + (col ? col.v : 'null')); });
}
go();
