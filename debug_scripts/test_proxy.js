const https = require('https');
https.get('https://script.google.com/a/macros/ghn.vn/s/AKfycbzP3n4syyPtCXZgXf0jimHp9c37oRoTHHqUvBaQGMmj3Cde9t5KKoqB1miQkG5UEB8Y/exec?action=employee&callback=test', res => {
    console.log("Status:", res.statusCode);
});
