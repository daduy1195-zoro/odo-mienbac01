const cycle = { start: new Date("2026-07-26T00:00:00+07:00"), end: new Date("2026-08-25T23:59:59+07:00") };
const todayDate = new Date("2026-08-25T23:59:59+07:00");
const allDatesInCycle = [];
for (let dt = new Date(cycle.start); dt <= cycle.end; dt.setDate(dt.getDate() + 1)) {
    if (dt > todayDate) break;
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    allDatesInCycle.push(`${dd}/${mm}/${yyyy}`);
}
console.log(allDatesInCycle);
