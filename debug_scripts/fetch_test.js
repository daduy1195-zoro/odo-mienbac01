const https = require('https');
const url = 'https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/gviz/tq?tqx=out:json&tq=select%20*&gid=862199038&headers=1';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Length of response: " + data.length);
    console.log("Starts with: " + data.substring(0, 50));
    const jsonStr = data.substring(data.indexOf('(') + 1, data.lastIndexOf(')'));
    try {
      const obj = JSON.parse(jsonStr);
      console.log("Rows: " + (obj.table.rows ? obj.table.rows.length : 0));
    } catch (e) {
      console.log("Error parsing: " + e);
    }
  });
});
