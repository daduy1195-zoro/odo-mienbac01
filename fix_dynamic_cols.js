const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /\/\/ Tính dòng gốc thực tế trong Google Sheet: rawData\[i\] tương ứng dòng \(i \+ 1\)/;
const replace = `// Cập nhật column indices nếu dòng này là header của tab mới
        const rowStr = row.map(c => (c || '').toString().toLowerCase()).join(' ');
        if (rowStr.includes('tổng chi phí') || (rowStr.includes('biển số') && rowStr.includes('kho'))) {
            const hdr = row.map(c => (c || '').toString().toLowerCase().replace(/\s+/g, ' ').trim());
            for (let ci = 0; ci < hdr.length; ci++) {
                const h = hdr[ci];
                if (!h) continue;
                if (h.includes('km vào') || h.includes('km đi') || h.includes('km bắt đầu')) colKmStart = ci;
                if (h.includes('km ra') || h.includes('km về') || h.includes('km kết thúc')) colKmEnd = ci;
                if (h.includes('km chạy') || h.includes('km phát sinh') || h.includes('tổng km') || h.includes('số km') || h.includes('km chênh lệch') || h.includes('cự ly') || h.includes('quãng đường')) colKmDiff = ci;
                if (h === 'lộ trình' || h === 'tuyến đường' || h.includes('điểm giao') || h === 'tuyến') colRoute = ci;
                if ((h.includes('đơn giá') && (h.includes('tháng') || h.includes('thang'))) || h.includes('giá tháng') || h.includes('thuê/tháng') || h.includes('thue/thang')) colMonthlyRate = ci;
                if ((h.includes('đơn giá') && (h.includes('ngày') || h.includes('ngay'))) || h.includes('giá ngày') || h.includes('thuê/ngày') || h.includes('thue/ngay')) colDailyRate = ci;
                if (h.includes('cầu đường') || h.includes('giá cầu') || h.includes('phí cầu') || h.includes('cau duong')) colTollFee = ci;
                if (h.includes('ngày lễ') || h.includes('ngay le') || h.includes('lễ tết')) colHolidayFee = ci;
                if ((h.includes('tổng chi phí') || h.includes('tổng tiền') || h.includes('tong chi phi') || (h.includes('tổng') && h.includes('phí')) || h === 'tổng') && !h.includes('km')) colTotalCost = ci;
            }
            if (colKmEnd > -1 && colKmDiff === -1) colKmDiff = colKmEnd + 1;
            continue; // Bỏ qua dòng header này
        }

        // Tính dòng gốc thực tế trong Google Sheet: rawData[i] tương ứng dòng (i + 1)`;

if (content.match(regex)) {
    content = content.replace(regex, replace);
    console.log("Injected dynamic column updates");
} else {
    console.log("Could not find regex");
}

fs.writeFileSync('index.html', content, 'utf8');
