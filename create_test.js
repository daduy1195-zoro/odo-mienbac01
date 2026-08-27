const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');
const start = code.indexOf('function parseNccTabData');
const end = code.indexOf('function generateTripCode');
code = code.substring(start, end);
code += `
const rawData = [
    [ "", "", "Biển số xe", "Xe", "Lộ trình", "", "Hình thức tính giá" ],
    [ "31", "25/08/2026", "34H-06211", "Xe 161", "Kho...", "1900", "Cost/tháng", "07:00:00", "19:00:00", "0", "35000", "0", "129.03", "43.135", "43.297", "162,00", "0,00", "4.000", "0", "19.642.216 đ", "1.149.749 đ" ]
];
const res = parseNccTabData(rawData, "Đạo Trường An", new Map(), "fake_id", "Đạo Trường An", "2147444878");
console.log(JSON.stringify(res, null, 2));
`;
code = 'const localStorage = { getItem: () => "{}" };\nlet overridesCache={}, notesCache={}, logsCache={};\nfunction formatPlate(p) { return p; }\n' + code;
fs.writeFileSync('test_parse3.js', code);
