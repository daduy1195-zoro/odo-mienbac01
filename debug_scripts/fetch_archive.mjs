import fetch from 'node-fetch';

const ARCHIVE_SHEET_ID = '174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU';

async function fetchJSONP() {
    const url = `https://docs.google.com/spreadsheets/d/${ARCHIVE_SHEET_ID}/gviz/tq?tqx=out:json&sheet=ncc_trips_raw`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ''));
    
    // Find Hoa Vinh rows
    const hoaVinhRows = rows.filter(r => r[r.length - 3] === 'Hoa Vinh' || r[r.length - 4] === 'Hoa Vinh');
    console.log("Hoa Vinh rows found:", hoaVinhRows.length);
    if (hoaVinhRows.length > 0) {
        console.log("Header/first row of Hoa Vinh:");
        console.log(JSON.stringify(hoaVinhRows[0]));
        console.log("Data row of Hoa Vinh:");
        console.log(JSON.stringify(hoaVinhRows[5]));
    }
}

fetchJSONP();
