const fs = require('fs');
const lines = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8').split('\n');
const code = lines.slice(4048, 4507).join('\n') + `
const rawData = [
    [ "", "", "Biển số xe", "Xe", "Lộ trình", "", "Hình thức tính giá" ],
    [ "31", "25/08/2026", "34H-06211", "Xe 161", "Kho...", "1900", "Cost/tháng", "07:00:00", "19:00:00", "0", "35000", "0", "129.03", "43.135", "43.297", "162,00", "0,00", "4.000", "0", "19.642.216 đ", "1.149.749 đ" ]
];
const res = parseNccTabData(rawData, 'Đạo Trường An', new Map(), 'fake_id', 'Đạo Trường An', '2147444878');
console.log(JSON.stringify(res, null, 2));
`;
fs.writeFileSync('test_parse4.js', 'const localStorage = { getItem: () => "{}" };\nlet overridesCache={}, notesCache={}, logsCache={};\nfunction formatPlate(p) { return p; }\nfunction cleanTripCode(c){return c;}\nfunction normalizeSupplierName(c){return c;}\nfunction parseVietnameseNumber(v){return parseFloat((v||"").toString().replace(/[^\\d.-]/g, ""));}\nlet currentUser={};\n' + code);
