const https = require('https');

const url = 'https://script.google.com/a/macros/ghn.vn/s/AKfycbzP3n4syyPtCXZgXf0jimHp9c37oRoTHHqUvBaQGMmj3Cde9t5KKoqB1miQkG5UEB8Y/exec?action=employee&callback=testCB';

https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
            let data = '';
            res2.on('data', chunk => data += chunk);
            res2.on('end', () => console.log('Length:', data.length, 'Data:', data.substring(0, 500)));
        });
    } else {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => console.log('Length:', data.length, 'Data:', data.substring(0, 500)));
    }
});
