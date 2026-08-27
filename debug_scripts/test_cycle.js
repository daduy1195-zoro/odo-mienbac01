function test(monthName, now) {
    let cycleYear = now.getFullYear();
    let cycleMonth = now.getMonth() - 1;
    if (cycleMonth < 0) { cycleMonth = 11; cycleYear -= 1; }
    
    let m = cycleMonth;
    let y = cycleYear;
    const val = `${y}-${String(m + 1).padStart(2, '0')}`;
    
    const [ry, rm] = val.split('-').map(Number);
    const start = new Date(ry, rm - 1, 26);
    const end = new Date(ry, rm, 25);
    
    const startStr = `${String(start.getDate()).padStart(2,'0')}/${String(start.getMonth()+1).padStart(2,'0')}`;
    const endStr = `${String(end.getDate()).padStart(2,'0')}/${String(end.getMonth()+1).padStart(2,'0')}`;
    
    console.log(`${monthName} (${now.toISOString().slice(0,10)}): cycle=${val} => ${startStr} - ${endStr}`);
}

test('August 1st', new Date(2026, 7, 1));
test('August 25th', new Date(2026, 7, 25));
test('August 26th', new Date(2026, 7, 26));
test('August 31st', new Date(2026, 7, 31));
test('September 1st', new Date(2026, 8, 1));
test('September 26th', new Date(2026, 8, 26));
test('January 1st', new Date(2027, 0, 1));
test('January 26th', new Date(2027, 0, 26));
