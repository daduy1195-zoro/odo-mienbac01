const https = require('https');
const url = 'https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/htmlview';
https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    let match;
    const re = /name:\s*\"odo_data_2\",\s*pageUrl:\s*\"[^\"]+gid=(\d+)/g;
    while((match = re.exec(data)) !== null) {
      console.log('FOUND GID: ' + match[1]);
    }
  });
});
