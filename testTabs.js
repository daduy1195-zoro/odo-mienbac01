const fetch = require('node-fetch');
async function test() {
    const res = await fetch('https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/htmlview');
    const text = await res.text();
    const matches = text.matchAll(/items\.push\(\{name:\s*"([^"]+)"[^}]*gid:\s*"(\d+)"/g);
    for (const m of matches) console.log(m[1], m[2]);
}
test();
