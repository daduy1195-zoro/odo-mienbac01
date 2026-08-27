const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 2. updateNccTripCode -> actionLogs push
const updateCodePatch = `            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(overrides));
            saveActionLog(key, 'Chốt mã chuyến', value || 'Xóa mã');
            if (nccTripData[index]) {
                if (!nccTripData[index].actionLogs) nccTripData[index].actionLogs = [];
                nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Chốt mã chuyến', details: value || 'Xóa mã' });
            }
        } catch(e) {}`;
code = code.replace(/            localStorage\.setItem\('GHN_NCC_TRIP_OVERRIDES', JSON\.stringify\(overrides\)\);\n        \} catch\(e\) \{\}/g, updateCodePatch);

// 3. Call saveActionLog in updateNccTripNote
const updateNotePatch = `            localStorage.setItem("GHN_NCC_TRIP_NOTES", JSON.stringify(notes));
            saveActionLog(key, 'Sửa ghi chú', value || 'Xóa ghi chú');
            // update in current data array too so re-render shows it
            if (nccTripData[index]) {
                if (!nccTripData[index].actionLogs) nccTripData[index].actionLogs = [];
                nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Sửa ghi chú', details: value || 'Xóa ghi chú' });
            }
        } catch(e) {}`;
code = code.replace(/            localStorage\.setItem\("GHN_NCC_TRIP_NOTES", JSON\.stringify\(notes\)\);\n        \} catch\(e\) \{\}/g, updateNotePatch);


// 4. Attach actionLogs in parseNccTabData
const attachLogsPatch = `            const notes = JSON.parse(localStorage.getItem("GHN_NCC_TRIP_NOTES") || "{}");
            if (notes[finalKey] !== undefined) {
                tripNote = notes[finalKey];
            }
            let actionLogs = [];
            try {
                const logs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
                if (logs[finalKey]) actionLogs = logs[finalKey];
            } catch(e) {}
`;
code = code.replace(/            const notes = JSON\.parse\(localStorage\.getItem\("GHN_NCC_TRIP_NOTES"\) \|\| "\{\}"\);\n            if \(notes\[finalKey\] !== undefined\) \{\n                tripNote = notes\[finalKey\];\n            \}/g, attachLogsPatch);

const pushResultPatch = `            isManualMatch: isManualMatch,
            note: tripNote,
            actionLogs: actionLogs,
            sheetId: sheetId || '',`;
code = code.replace(/            isManualMatch: isManualMatch,\n            note: tripNote,\n            sheetId: sheetId \|\| '',/g, pushResultPatch);


// 5. Add table header
const thPatch = `    html += '</select>';
    html += '</th>';
    html += '<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    html += '<th style="min-width:150px">Ghi chú</th>';`;
code = code.replace(/    html \+= '<\/select>';\n    html \+= '<\/th>';\n    html \+= '<th style="min-width:150px">Ghi chú<\/th>';/g, thPatch);


// 6. Add table cell
const tdPatch = `                <td style="font-weight:bold;">\${statusHtml}</td>
                <td style="text-align:center; cursor:pointer;" title="\${r.actionLogs && r.actionLogs.length > 0 ? escapeHtml(r.actionLogs.map(l => l.time + ': ' + l.action + ' - ' + l.details).join('\\n')) : 'Chưa có thao tác nào'}">
                    \${r.actionLogs && r.actionLogs.length > 0 ? '🕒' : '<span style="opacity:0.2">🕒</span>'}
                </td>
                <td><input type="text"`;
code = code.replace(/                <td style="font-weight:bold;">\$\{statusHtml\}<\/td>\n                <td><input type="text"/g, tdPatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Action history patched again.');
