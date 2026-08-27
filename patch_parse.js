const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const s1 = `function parseVietnameseNumber(str) {
    if (!str) return 0;
    let s = String(str).trim().replace(/\\s*đ$/i, '').trim();
    if (!s || s === '-' || s === '—') return 0;

    if (/^-?\\d{1,3}(\\.\\d{3})+/.test(s)) {
        s = s.replace(/\\./g, '').replace(',', '.');
    } else if (s.includes(',') && !s.includes('.')) {
        s = s.replace(',', '.');
    } else if (/^-?\\d{1,3}\\.\\d{3}$/.test(s)) {
        s = s.replace('.', '');
    } else {
        s = s.replace(/[^\\d.-]/g, '');
    }
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
}`;

const r1 = `function parseVietnameseNumber(str) {
    if (!str) return 0;
    let s = String(str).trim().replace(/\\s*(đ|vnđ|vnd)$/i, '').trim();
    if (!s || s === '-' || s === '—') return 0;

    // Nếu chứa cả phẩy và chấm: VD "35,147.27" (kiểu Mỹ) hoặc "35.147,27" (kiểu Việt)
    if (s.includes(',') && s.includes('.')) {
        const lastComma = s.lastIndexOf(',');
        const lastDot = s.lastIndexOf('.');
        if (lastComma > lastDot) {
            // Dấu phẩy ở cuối -> phẩy là thập phân: "35.147,27"
            s = s.replace(/\\./g, '').replace(',', '.');
        } else {
            // Dấu chấm ở cuối -> chấm là thập phân: "35,147.27"
            s = s.replace(/,/g, '');
        }
    } else if (s.includes(',')) {
        // Chỉ có phẩy: "35,147,271" hoặc "35,14"
        // Nếu có nhiều dấu phẩy HOẶC 3 số sau dấu phẩy cuối cùng -> phẩy là phần ngàn
        const parts = s.split(',');
        if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
            s = s.replace(/,/g, '');
        } else {
            // "35,14" -> phẩy là thập phân
            s = s.replace(/,/g, '.');
        }
    } else if (s.includes('.')) {
        // Chỉ có chấm: "35.147.271" hoặc "35.14"
        const parts = s.split('.');
        if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
            s = s.replace(/\\./g, '');
        }
        // Giữ nguyên chấm nếu là "35.14"
    } else {
        s = s.replace(/[^\\d.-]/g, '');
    }
    
    // Xóa các ký tự không hợp lệ còn sót lại (chỉ giữ số, dấu trừ, dấu chấm)
    s = s.replace(/[^\\d.-]/g, '');
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
}`;

if (code.includes('if (s.includes(\',\') && !s.includes(\'.\')) {')) {
    const startIndex = code.indexOf('function parseVietnameseNumber(str) {');
    const endIndex = code.indexOf('}', code.indexOf('return isNaN(num) ? 0 : num;')) + 1;
    if (startIndex > -1 && endIndex > -1) {
        code = code.substring(0, startIndex) + r1 + code.substring(endIndex);
        fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
        console.log('Patched parseVietnameseNumber');
    }
} else {
    console.log('Could not find parseVietnameseNumber to patch');
}
