const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Add THCP sheet to NCC_TRIP_SHEETS config (before the existing ALL sheet)
const s1 = `        // PUT 'ALL' SHEET LAST SO IT OVERWRITES INDIVIDUAL SHEETS IN DEDUPLICATION
        { id: '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', gid: '1482895796', ncc: 'ALL' }`;

const r1 = `        // THCP Tổng hợp 3 kỳ Hưng Yên (26/4 - 25/7)
        { id: '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA', gid: '1957064243', ncc: 'ALL' },
        // PUT 'ALL' SHEET LAST SO IT OVERWRITES INDIVIDUAL SHEETS IN DEDUPLICATION
        { id: '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', gid: '1482895796', ncc: 'ALL' }`;

if (code.includes(s1)) {
    code = code.replace(s1, r1);
    console.log('1. Added THCP sheet to NCC_TRIP_SHEETS');
} else {
    console.log('1. FAILED: Could not find ALL sheet config');
}

// 2. Add THCP sheet ID to the hardcoded column mapping condition
const s2 = `        if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {`;
const r2 = `        if (tabGid === '1482895796' || tabGid === '1957064243' || (sheetId && (sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8') || sheetId.includes('1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA')))) {`;

if (code.includes(s2)) {
    code = code.replace(s2, r2);
    console.log('2. Added THCP to column mapping condition');
} else {
    console.log('2. FAILED: Could not find column mapping condition');
}

// 3. Add writeBackToTHCP function (after syncToCloud function, around line 1917)
const s3 = `    } catch(e) {}
    }
    
    async function loadCloudData() {`;
const r3 = `    } catch(e) {}
    }
    
    // ====== GHI NGƯỢC MÃ CHUYẾN VÀO GOOGLE SHEET (CỘT AC) ======
    const WRITEBACK_SHEETS = {
        '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA': { gid: '1957064243', col: 29, headerRows: 3 }
    };
    
    function writeBackToSheet(record, tripCode) {
        if (!record || !record.sheetId) return;
        const config = WRITEBACK_SHEETS[record.sheetId];
        if (!config) return;
        
        // sourceRow là index trong rawData (0-based), cần +1 cho 1-based Google Sheet row
        const sheetRow = record.sourceRow + 1;
        if (sheetRow < config.headerRows + 1) return; // Skip header rows
        
        const payload = {
            action: 'writeCell',
            sheetId: record.sheetId,
            gid: config.gid,
            row: sheetRow,
            col: config.col,
            value: tripCode || ''
        };
        
        console.log('📝 Ghi ngược mã chuyến vào sheet:', payload);
        
        // Gọi qua SYNC_API_URL (cùng endpoint SyncOdoToArchive)
        if (SYNC_API_URL) {
            fetch(SYNC_API_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            }).then(r => r.text()).then(t => {
                console.log('✅ Ghi ngược thành công:', t);
            }).catch(e => console.error('❌ Ghi ngược lỗi:', e));
        }
    }
    
    async function loadCloudData() {`;

if (code.includes(s3)) {
    code = code.replace(s3, r3);
    console.log('3. Added writeBackToSheet function');
} else {
    console.log('3. FAILED: Could not find loadCloudData insertion point');
}

// 4. Hook writeBackToSheet into updateNccTripCode (after syncToCloud call)
const s4 = `            syncToCloud(key, value, undefined, nccTripData[index]?.actionLogs);
        } catch(e) {}`;
const r4 = `            syncToCloud(key, value, undefined, nccTripData[index]?.actionLogs);
            // ★ Ghi ngược mã chuyến vào cột AC của sheet THCP
            writeBackToSheet(nccTripData[index], value);
        } catch(e) {}`;

if (code.includes(s4)) {
    code = code.replace(s4, r4);
    console.log('4. Hooked writeBackToSheet into updateNccTripCode');
} else {
    console.log('4. FAILED: Could not find syncToCloud hook point');
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('\nDONE - All patches applied to index.html');
