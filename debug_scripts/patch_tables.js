const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. renderTable (Bảng theo dõi NV)
code = code.replace(
    '<th style="width:60px;">Sửa</th>\n</tr>',
    '<th style="width:60px;">Sửa</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);
code = code.replace(
    '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>\n</tr>`;',
    '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>\n</tr>`;'
);

// 2. renderUnreported (Danh sách NV chưa báo cáo)
code = code.replace(
    '<th style="text-align:center;">Số ngày đi làm theo DS gốc</th>\n<th>Chi tiết ngày chưa báo cáo</th>\n</tr>',
    '<th style="text-align:center;">Số ngày đi làm theo DS gốc</th>\n<th>Chi tiết ngày chưa báo cáo</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);
code = code.replace(
    '</div>\n                            </td>\n                        </tr>`;',
    '</div>\n                            </td>\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>\n                        </tr>`;'
);

// 3. renderLastmile (Chuyến đi Lastmile)
code = code.replace(
    '<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>\n</tr>',
    '<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);
code = code.replace(
    '<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>\n            </tr>`;',
    '<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>\n            </tr>`;'
);

// 4. renderWarning (Cảnh báo gian lận)
code = code.replace(
    '<th>Kho</th>\n<th>Lộ trình báo cáo</th>\n<th>Lỗi phát hiện</th>\n<th style="width:60px;">Sửa</th>\n</tr>',
    '<th>Kho</th>\n<th>Lộ trình báo cáo</th>\n<th>Lỗi phát hiện</th>\n<th style="width:60px;">Sửa</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);
code = code.replace(
    '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>\n            </tr>`;',
    '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>\n            </tr>`;'
);

// 5. renderWarningKm (Cảnh báo gõ sai)
code = code.replace(
    '<th>Mã chuyến đi</th>\n<th>Ảnh ODO Đi</th>\n<th>Ảnh ODO Về</th>\n<th style="width:60px;">Sửa</th>\n</tr>',
    '<th>Mã chuyến đi</th>\n<th>Ảnh ODO Đi</th>\n<th>Ảnh ODO Về</th>\n<th style="width:60px;">Sửa</th>\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>\n</tr>'
);
code = code.replace(
    '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>\n            </tr>`;',
    '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>\n            </tr>`;'
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Done');
