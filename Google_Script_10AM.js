/*
╔══════════════════════════════════════════════════════════════════╗
║     HƯỚNG DẪN CÀI ĐẶT BÁO CÁO TỰ ĐỘNG 10H SÁNG              ║
║     Gửi tóm tắt ODO vào Group Telegram mỗi ngày               ║
╚══════════════════════════════════════════════════════════════════╝

📌 CÁCH LÀM (Chỉ cần làm 1 lần duy nhất):

BƯỚC 1: Mở Google Sheet dữ liệu nhân viên điền ODO
         Link: https://docs.google.com/spreadsheets/d/1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo

BƯỚC 2: Trên thanh menu, chọn: Tiện ích mở rộng → Apps Script
         (Extensions → Apps Script)

BƯỚC 3: Xóa hết nội dung trong cửa sổ code hiện ra

BƯỚC 4: Copy TOÀN BỘ đoạn code bên dưới (từ dòng "function" đến hết)
         và DÁN vào ô code trống vừa xóa

BƯỚC 5: Bấm nút 💾 (Save) hoặc Ctrl+S

BƯỚC 6: Chạy thử:
         - Bấm vào menu thả xuống (cạnh nút ▶ Run), chọn hàm "sendDailyReport"
         - Bấm nút ▶ Run
         - Lần đầu tiên Google sẽ hỏi quyền truy cập → Bấm "Cho phép" (Allow)
         - Kiểm tra Group Telegram xem có tin nhắn chưa

BƯỚC 7: Hẹn giờ tự động chạy 10h sáng mỗi ngày:
         - Bấm vào biểu tượng ⏰ (Triggers / Trình kích hoạt) ở cột bên trái
         - Bấm "+ Thêm trình kích hoạt" (Add Trigger)
         - Cấu hình:
            • Chọn hàm: sendDailyReport
            • Loại sự kiện: Theo thời gian (Time-driven)
            • Kiểu: Theo ngày (Day timer)
            • Khung giờ: 9 giờ sáng đến 10 giờ sáng
         - Bấm "Lưu" (Save)

✅ XONG! Từ nay mỗi sáng Google sẽ tự động chạy và gửi báo cáo vào Telegram.
   Kể cả khi bạn tắt máy tính, nó vẫn chạy trên server Google.

═══════════════════════════════════════════════════════════════════
   COPY ĐOẠN CODE BÊN DƯỚI VÀ DÁN VÀO GOOGLE APPS SCRIPT
═══════════════════════════════════════════════════════════════════
*/

// ====== CẤU HÌNH - Chỉ cần thay đổi ở đây ======
var TELEGRAM_TOKEN = '8261927820:AAGQ5__xC6fdh6eegzmxWnA_EyFRneu6deQ';
var TELEGRAM_CHAT_ID = '-1002346875748';

// ID của file đối soát nhà cung cấp
var SUPPLIER_SHEET_ID = '14zXhTqxD7VsN_PE3OxNY7hLss8zxG4zUNT_cNN9QV90';

// ====== 4 KHO ANH QUẢN LÝ ======
var MY_WAREHOUSES = [
  'kho giao hàng nặng hải dương', 'kho gxt hải dương',
  'kho giao hàng nặng hải phòng', 'kho gxt hải phòng',
  'kho giao hàng nặng hưng yên',  'kho gxt hưng yên',
  'kho giao hàng nặng miền bắc',  'kho gxt miền bắc',
  'kho giao hàng nặng thái bình',  'kho gxt thái bình'
];

function isMyWarehouse(name) {
  if (!name) return false;
  var lower = name.toString().toLowerCase().trim();
  for (var i = 0; i < MY_WAREHOUSES.length; i++) {
    if (lower.indexOf(MY_WAREHOUSES[i]) >= 0 || MY_WAREHOUSES[i].indexOf(lower) >= 0) return true;
  }
  return false;
}

// ====== HÀM CHÍNH - GỬI BÁO CÁO HÀNG NGÀY ======
function sendDailyReport() {
  try {
    // Lấy sheet hiện tại (file NV điền ODO)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0]; // Lấy sheet đầu tiên
    var data = sheet.getDataRange().getValues();

    // Lấy sheet đối soát NCC
    var supSS = SpreadsheetApp.openById(SUPPLIER_SHEET_ID);
    var supSheet = supSS.getSheets()[0];
    var supData = supSheet.getDataRange().getValues();

    // Lấy ngày hôm nay
    var today = new Date();
    var todayStr = Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy');
    var monthStr = Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'MM/yyyy');

    // ---- PHẦN 1: Tìm NV đã báo cáo hôm nay ----
    var reportedToday = {};
    var allEmployees = {};

    // Duyệt qua dữ liệu NV (bỏ header dòng 0)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var name = (row[2] || '').toString().trim();
      if (!name) continue;

      // Chỉ lấy NV thuộc 4 kho mình quản lý
      var warehouse = (row[6] || '').toString().trim();
      if (!isMyWarehouse(warehouse)) continue;

      var dateVal = (row[4] || '').toString().trim();
      // Chuẩn hóa ngày
      if (dateVal instanceof Date) {
        dateVal = Utilities.formatDate(dateVal, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy');
      }

      // Lấy tháng từ ngày
      var dateParts = dateVal.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (!dateParts) continue;

      var entryMonth = dateParts[2] + '/' + dateParts[3];
      var currentMonth = Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'MM/yyyy');

      // Chỉ tính trong tháng hiện tại
      if (entryMonth === currentMonth) {
        if (!allEmployees[name]) {
          allEmployees[name] = { days: 0, dates: [] };
        }
        allEmployees[name].days++;
        allEmployees[name].dates.push(dateVal);
      }

      // Check hôm nay
      if (dateVal === todayStr) {
        reportedToday[name] = true;
      }
    }

    // ---- PHẦN 2: Kiểm tra đối soát NCC hôm nay ----
    var nccToday = 0;
    var nccTodayMatched = 0;
    var empKeys = {};

    // Tạo danh sách key NV đã báo
    for (var i = 1; i < data.length; i++) {
      var key = (data[i][15] || '').toString().trim(); // Column 16
      if (key) empKeys[key] = true;
    }

    // Check NCC hôm nay
    for (var j = 2; j < supData.length; j++) {
      var supRow = supData[j];
      var supDate = (supRow[2] || '').toString().trim();
      if (supDate instanceof Date) {
        supDate = Utilities.formatDate(supDate, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy');
      }
      if (supDate === todayStr) {
        nccToday++;
        var supKey = (supRow[13] || '').toString().trim();
        if (supKey && empKeys[supKey]) nccTodayMatched++;
      }
    }

    // ---- PHẦN 3: Tính ngày làm việc trong tháng (đến hôm nay) ----
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    var workDays = 0;
    for (var d = new Date(firstDay); d <= today; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0) workDays++; // Bỏ Chủ nhật
    }

    // ---- PHẦN 4: Xếp hạng ----
    var empList = [];
    for (var name in allEmployees) {
      var emp = allEmployees[name];
      var rate = workDays > 0 ? Math.round((emp.days / workDays) * 100) : 0;
      empList.push({ name: name, days: emp.days, rate: Math.min(rate, 100) });
    }

    // Sắp xếp
    empList.sort(function(a, b) { return b.rate - a.rate; });
    var topBest = empList.slice(0, 3);
    var topWorst = empList.slice(-3).reverse();

    // Danh sách NV chưa báo cáo hôm nay
    var notReported = [];
    for (var name in allEmployees) {
      if (!reportedToday[name]) {
        notReported.push(name);
      }
    }

    // ---- PHẦN 5: Soạn tin nhắn ----
    var msg = '📊 *BÁO CÁO ODO 10H SÁNG*\n';
    msg += '🏭 _4 Kho: Hải Dương, Hải Phòng, Hưng Yên, Thái Bình_\n';
    msg += '📅 _Ngày: ' + todayStr + '_\n';
    msg += '━━━━━━━━━━━━━━━━━━\n\n';

    msg += '✅ *ĐÃ BÁO CÁO HÔM NAY:* ' + Object.keys(reportedToday).length + ' người\n';
    msg += '❌ *CHƯA BÁO CÁO:* ' + notReported.length + ' người\n\n';

    if (notReported.length > 0) {
      msg += '🚨 *DANH SÁCH CHƯA LÀM:*\n';
      for (var k = 0; k < notReported.length; k++) {
        msg += '   • ' + notReported[k] + '\n';
      }
      msg += '\n';
    }

    msg += '━━━━━━━━━━━━━━━━━━\n';
    msg += '🏆 *TOP 3 XUẤT SẮC THÁNG ' + monthStr + ':*\n';
    var medals = ['🥇', '🥈', '🥉'];
    for (var t = 0; t < topBest.length; t++) {
      msg += medals[t] + ' ' + topBest[t].name + ' — ' + topBest[t].rate + '% (' + topBest[t].days + '/' + workDays + ' ngày)\n';
    }

    msg += '\n⚠️ *TOP 3 CẦN NHẮC NHỞ:*\n';
    var icons = ['🔴', '🟠', '🟡'];
    for (var w = 0; w < topWorst.length; w++) {
      msg += icons[w] + ' ' + topWorst[w].name + ' — ' + topWorst[w].rate + '% (' + topWorst[w].days + '/' + workDays + ' ngày)\n';
    }

    msg += '\n━━━━━━━━━━━━━━━━━━\n';
    msg += '🔍 *ĐỐI SOÁT NCC HÔM NAY:*\n';
    msg += '   Tổng chuyến NCC: ' + nccToday + '\n';
    msg += '   Có ODO của NV: ' + nccTodayMatched + '\n';
    msg += '   Thiếu ODO: ' + (nccToday - nccTodayMatched) + '\n';

    msg += '\n_Gửi tự động từ Google Apps Script_';

    // ---- PHẦN 6: Gửi Telegram ----
    var url = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage';
    var payload = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify({
        'chat_id': TELEGRAM_CHAT_ID,
        'text': msg,
        'parse_mode': 'Markdown'
      })
    };

    var response = UrlFetchApp.fetch(url, payload);
    Logger.log('Telegram response: ' + response.getContentText());

  } catch (e) {
    Logger.log('Lỗi: ' + e.toString());
    // Gửi thông báo lỗi vào Telegram
    try {
      var errorMsg = '❌ *LỖI BÁO CÁO ODO*\n' + e.toString();
      UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify({
          'chat_id': TELEGRAM_CHAT_ID,
          'text': errorMsg,
          'parse_mode': 'Markdown'
        })
      });
    } catch (e2) {}
  }
}

// ====== HÀM TEST - Chạy thử để kiểm tra kết nối ======
function testTelegram() {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage';
  var payload = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify({
      'chat_id': TELEGRAM_CHAT_ID,
      'text': '✅ *Test kết nối thành công!*\nHệ thống báo cáo ODO đã sẵn sàng hoạt động.',
      'parse_mode': 'Markdown'
    })
  };
  var response = UrlFetchApp.fetch(url, payload);
  Logger.log(response.getContentText());
}
