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
        const data1 = await fetchGviz('1iwCBlTN3fEspMvkKpeXRnhcUO8suWIyTj2SdkCNxx2k', 'SELECT D, MAX(M) WHERE D is not null GROUP BY D');
        console.log(`Sheet 1: ${data1.table.rows.length} unique trips`);
        
        const data2 = await fetchGviz('1nuYvpAKTgZoW50o9PcLLNmAI2K76eAU5w6AQgX1DBrc', 'SELECT D, MAX(M) WHERE D is not null GROUP BY D');
        console.log(`Sheet 2: ${data2.table.rows.length} unique trips`);
    } catch (e) {
        console.error(e);
    }
})();
