const https = require('https');
const url = 'https://script.google.com/a/macros/ghn.vn/s/AKfycbzP3n4syyPtCXZgXf0jimHp9c37oRoTHHqUvBaQGMmj3Cde9t5KKoqB1miQkG5UEB8Y/exec?action=getMultipleSheets&ids=1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo&gids=409459817,1274066622&callback=testCB';

https.get(url, (res) => {
    console.log(res.statusCode);
});
