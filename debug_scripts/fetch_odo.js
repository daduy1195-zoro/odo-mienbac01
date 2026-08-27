const https = require('https');

const url = 'https://docs.google.com/spreadsheets/d/1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo/gviz/tq?tqx=out:json&gid=409459817';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(data.substring(0, 500));
    });
});
