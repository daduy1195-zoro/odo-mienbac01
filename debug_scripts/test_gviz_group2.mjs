import fetch from 'node-fetch';

async function fetchGviz(sheetId, query) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tq=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const text = await res.text();
    const jsonStr = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1];
    return JSON.parse(jsonStr);
}

(async () => {
    try {
        const data1 = await fetchGviz('1iwCBlTN3fEspMvkKpeXRnhcUO8suWIyTj2SdkCNxx2k', 'SELECT D, M WHERE D is not null AND M is not null GROUP BY D, M');
        console.log('Data1:', JSON.stringify(data1).substring(0, 200));
    } catch (e) {
        console.error(e);
    }
})();
