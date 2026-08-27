const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/App_tai_xe/odo_script/SyncOdoToArchive.gs', 'utf8');

const s1 = `    { id: '1T6Hj-tcabvxLARvF7YyUUI05SHpQmvcfjik_yPp4Mls', gid: '1012425134', ncc: 'TAL' },
    { id: '1aa_3Nwi0Z-SlGi-jZs1cNkU0v3Yt6p_9Fc4lr_oA5vY', gid: '942983334', ncc: 'Đại Minh' }`;
    
const r1 = `    { id: '1T6Hj-tcabvxLARvF7YyUUI05SHpQmvcfjik_yPp4Mls', gid: '1012425134', ncc: 'TAL' },
    { id: '1aa_3Nwi0Z-SlGi-jZs1cNkU0v3Yt6p_9Fc4lr_oA5vY', gid: '942983334', ncc: 'Đại Minh' },
    { id: '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA', gid: '1957064243', ncc: 'THCP' }`;

if (code.includes(s1)) {
    code = code.replace(s1, r1);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/App_tai_xe/odo_script/SyncOdoToArchive.gs', code);
    console.log('Added THCP to SyncOdoToArchive.gs config');
} else {
    console.log('Failed to find config block in SyncOdoToArchive.gs');
}
