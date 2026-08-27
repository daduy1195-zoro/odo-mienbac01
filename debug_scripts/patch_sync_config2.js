const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/App_tai_xe/odo_script/SyncOdoToArchive.gs', 'utf8');

const s1 = `    { id: '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA', gid: '1957064243', ncc: 'THCP' }`;
const r1 = `    { id: '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA', gid: '1957064243', ncc: 'ALL' }`;

if (code.includes(s1)) {
    code = code.replace(s1, r1);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/App_tai_xe/odo_script/SyncOdoToArchive.gs', code);
    console.log('Fixed ncc to ALL in SyncOdoToArchive.gs');
}
