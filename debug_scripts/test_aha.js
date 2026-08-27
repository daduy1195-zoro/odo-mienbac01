const fetch = require('node-fetch');
async function run() {
    const fd = '01/05/2026';
    const td = '10/05/2026';
    const url = `https://script.google.com/macros/s/AKfycbyTqQW63lK9n-kI50E63cR231wHkM8FIfqE9j4X_2-c9H5j8X_bW82tH3D3d231G3kM/exec?action=proxyAhamove&fromDate=${fd}&toDate=${td}`;
    console.log("Fetching...");
    const res = await fetch(url);
    const json = await res.json();
    console.log("Got:", json.data ? json.data.length : 'error');
}
run();
