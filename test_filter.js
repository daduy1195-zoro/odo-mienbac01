const rows = [
  ["STT", "NCC", "Ngày", "Biển số", "Xe", "Ghi chú", "Khu vực", "Kho", "Tuyển", "Giờ đi"],
  ["1", "Đại Minh", "18/08/2026", "29H-12345", "Xe", "", "GXT-MB", "Kho Giao Hàng Hải Phòng", "", "08:00"],
  ["2", "Đại Minh", "18/08/2026", "29H-12345", "Xe", "", "GXT-MB", "21084000 Kho giao hàng nặng Hải Phòng", "", "08:00"],
  ["3", "Đại Minh", "18/08/2026", "29H-12345", "Xe", "", "GXT-MB", "Kho Giao Hàng Hưng Yên", "", "08:00"],
  ["4", "Đại Minh", "18/08/2026", "29H-12345", "Xe", "", "GXT-MB", "Kho Giao Hàng Lạng Sơn", "", "08:00"]
];

var MANAGED_WH = ['hải dương', 'hai duong', 'hải phòng', 'hai phong', 'hưng yên', 'hung yen', 'thái bình', 'thai binh'];
var allRows = rows.filter(function(row) {
  var kho = String(row[7] || '').toLowerCase();
  for (var i = 0; i < MANAGED_WH.length; i++) {
    if (kho.indexOf(MANAGED_WH[i]) >= 0) return true;
  }
  return false;
});

console.log(allRows);
