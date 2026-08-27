const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const updateCodePatch = `            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(overrides));
            saveActionLog(key, 'Chốt mã chuyến', value || 'Xóa mã');
            if (nccTripData[index]) {
                if (!nccTripData[index].actionLogs) nccTripData[index].actionLogs = [];
                nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Chốt mã chuyến', details: value || 'Xóa mã' });
            }
        } catch(e) {}`;
code = code.replace(/            localStorage\.setItem\('GHN_NCC_TRIP_OVERRIDES', JSON\.stringify\(overrides\)\);\r?\n        \} catch\(e\) \{\}/g, updateCodePatch);

const updateNotePatch = `            localStorage.setItem("GHN_NCC_TRIP_NOTES", JSON.stringify(notes));
            saveActionLog(key, 'Sửa ghi chú', value || 'Xóa ghi chú');
            if (nccTripData[index]) {
                if (!nccTripData[index].actionLogs) nccTripData[index].actionLogs = [];
                nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Sửa ghi chú', details: value || 'Xóa ghi chú' });
            }
        } catch(e) {}`;
code = code.replace(/            localStorage\.setItem\("GHN_NCC_TRIP_NOTES", JSON\.stringify\(notes\)\);\r?\n        \} catch\(e\) \{\}/g, updateNotePatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Done');
