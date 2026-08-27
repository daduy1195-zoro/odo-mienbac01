const https = require('https');

const url = 'https://script.google.com/a/macros/ghn.vn/s/AKfycbzP3n4syyPtCXZgXf0jimHp9c37oRoTHHqUvBaQGMmj3Cde9t5KKoqB1miQkG5UEB8Y/exec?action=getMultipleSheets&ids=1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo&gids=409459817';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // It's a redirect, we need to follow it
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            https.get(res.headers.location, (res2) => {
                let data2 = '';
                res2.on('data', chunk => data2 += chunk);
                res2.on('end', () => {
                    console.log(data2.substring(0, 500));
                });
            });
        } else {
            console.log(data.substring(0, 500));
        }
    });
});
