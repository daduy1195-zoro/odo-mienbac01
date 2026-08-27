const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. renderTable
code = code.replace(
    /<th style="width:60px;">Sửa<\/th>\r?\n<\/tr>/g,
    '<th style="width:60px;">Sửa</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);
code = code.replace(
    /<td><a href="\${sheetUrl}" target="_blank" style="color:var\(--primary\);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng \${e\.sheetRow}<\/a><\/td>\r?\n<\/tr>`;/g,
    '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>\n</tr>`;'
);

// 2. renderUnreported
code = code.replace(
    /<th style="text-align:center;">Số ngày đi làm theo DS gốc<\/th>\r?\n<th>Chi tiết ngày chưa báo cáo<\/th>\r?\n<\/tr>/g,
    '<th style="text-align:center;">Số ngày đi làm theo DS gốc</th>\n<th>Chi tiết ngày chưa báo cáo</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);
code = code.replace(
    /<\/div>\r?\n                            <\/td>\r?\n                        <\/tr>`;/g,
    '</div>\n                            </td>\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>\n                        </tr>`;'
);

// 3. renderLastmile
code = code.replace(
    /<th style="min-width:150px">Tuyến đường \(Từ - Đến\)<\/th>\r?\n<\/tr>/g,
    '<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);
code = code.replace(
    /<td>\${escapeHtml\(String\(e\["Tuyến đường \(Từ - Đến\)"\] \|\| ""\)\)}<\/td>\r?\n            <\/tr>`;/g,
    '<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>\n            </tr>`;'
);

// 4. renderWarning
code = code.replace(
    /<th>Kho<\/th>\r?\n<th>Lộ trình báo cáo<\/th>\r?\n<th>Lỗi phát hiện<\/th>\r?\n<th style="width:60px;">Sửa<\/th>\r?\n<\/tr>/g,
    '<th>Kho</th>\n<th>Lộ trình báo cáo</th>\n<th>Lỗi phát hiện</th>\n<th style="width:60px;">Sửa</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);

// 5. renderWarningKm
code = code.replace(
    /<th>Mã chuyến đi<\/th>\r?\n<th>Ảnh ODO Đi<\/th>\r?\n<th>Ảnh ODO Về<\/th>\r?\n<th style="width:60px;">Sửa<\/th>\r?\n<\/tr>/g,
    '<th>Mã chuyến đi</th>\n<th>Ảnh ODO Đi</th>\n<th>Ảnh ODO Về</th>\n<th style="width:60px;">Sửa</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);


fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Done2');
