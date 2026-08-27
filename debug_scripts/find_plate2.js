const https = require('https');

const NCC_TRIP_SHEETS = [
    { id: '1ZT_OPLSxOEWiy96YE-snqE-t3tX2T3EhkjDbk9Oll90', gid: '45442280', ncc: 'NAK' },
    { id: '1ZT_OPLSxOEWiy96YE-snqE-t3tX2T3EhkjDbk9Oll90', gid: '1620536867', ncc: 'NAK' },
    { id: '16jiK-hQ-xOrs9kxmJF6CXQ1HANy0zAlDyQM2q7mOtOg', gid: '73639881', ncc: 'Thiên Phú' },
    { id: '1aMz8LLOo9wm2KrDgEXk6xOKMN8wUrfCDco7pOM6t2Qs', gid: '679483124', ncc: 'Duy Phát' },
    { id: '1E8T_mJBy14qmTPT4k64zxVThjDNNoxEfzuynbuONCBg', gid: '679483124', ncc: 'Hoàng Minh' },
    { id: '1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA', gid: '1620536867', ncc: 'Hoa Vinh' },
    { id: '1Q0idCOo-S-8XzmNWsw-4r51Kjsxsj0OxgP9D2ApCwxc', gid: '1290293725', ncc: 'Long Thành' },
    { id: '1Q0idCOo-S-8XzmNWsw-4r51Kjsxsj0OxgP9D2ApCwxc', gid: '1620536867', ncc: 'Long Thành' },
    { id: '1yqf8Bg6Tmq4v-qOzdpY9G4Y1OEnhQ5e7OURq017SiZI', gid: '2147444878', ncc: 'Đào Trọng An' },
    { id: '1T6Hj-tcabvxLARvF7YyUUI05SHpQmvcfjik_yPp4Mls', gid: '1012425134', ncc: 'TAL' },
    { id: '1aa_3Nwi0Z-SlGi-jZs1cNkU0v3Yt6p_9Fc4lr_oA5vY', gid: '942983334', ncc: 'Đại Minh' },
    { id: '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', gid: '1482895796', ncc: 'ALL' }
];

async function fetchSheet(sheet) {
    return new Promise((resolve) => {
        https.get(`https://docs.google.com/spreadsheets/d/${sheet.id}/gviz/tq?tqx=out:json&gid=${sheet.gid}&headers=${sheet.ncc==='ALL'?0:1}`, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const match = data.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
                    if (!match) return resolve(null);
                    const json = JSON.parse(match[1]);
                    json.table.rows.forEach(row => {
                        const rowStr = row.c.map(cell => cell ? (cell.f || cell.v || '') : '').join(' | ');
                        if (rowStr.includes('29K-07561')) {
                            console.log(`[${sheet.ncc}] Found:`, rowStr);
                        }
                    });
                    resolve(true);
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    for (const sheet of NCC_TRIP_SHEETS) {
        await fetchSheet(sheet);
    }
}
run();
