const fetch = require('node-fetch');

async function test() {
    // We can't easily execute JSONP from node without eval, but we can fetch it and extract JSON
    const url = 'https://script.google.com/macros/s/AKfycbw6T8LhI81Xb58hX94vB_cTz4m89_f29cO_L0X7uO_a004hVj4d_zZ7u8/exec?id=1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo&gid=1274066622&callback=cb';
    const res = await fetch(url);
    const text = await res.text();
    // output first 500 chars to see structure
    console.log(text.substring(0, 1000));
}
test();
