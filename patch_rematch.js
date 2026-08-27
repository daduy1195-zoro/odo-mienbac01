const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const target1 = `    nccTripData.forEach(r => {
        const routeLower = String(r.route || '').toLowerCase();
        if (routeLower.includes('ghn off')) {`;

const replace1 = `    nccTripData.forEach(r => {
        // Ưu tiên trạng thái OFF/Phạt đã được lưu hoặc detect từ parseNccTabData
        const currCode = String(r.ghnTripCode || '').toUpperCase();
        if (['GHN OFF', 'GHN_OFF', 'NCC OFF', 'NCC_OFF', 'OFF', 'PHẠT', 'PHAT'].includes(currCode)) {
            return;
        }

        const routeLower = String(r.route || '').toLowerCase();
        if (routeLower.includes('ghn off')) {`;

if (code.includes(target1)) {
    code = code.replace(target1, replace1);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Patched rematchNccTrips');
} else {
    console.log('Could not find target1');
}
