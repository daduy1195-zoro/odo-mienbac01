// ============================================================
// GOOGLE APPS SCRIPT - BÁO CÁO TỰ ĐỘNG + TELEGRAM PROXY
// ============================================================
// HƯỚNG DẪN CÀI ĐẶT:
// 1. Vào https://script.google.com → Mở dự án đã tạo
// 2. Copy toàn bộ code này THAY THẾ code cũ
// 3. Bấm Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Copy URL web app → dán vào CONFIG.TELEGRAM_PROXY_URL trong index.html
// 5. Vào Triggers → thêm trigger sendDailyReport (10am-11am)
// ============================================================

const CONFIG = {
  EMPLOYEE_SHEET_ID: '1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo',
  EMPLOYEE_GID: '409459817',
  SUPPLIER_SHEET_ID: '14zXhTqxD7VsN_PE3OxNY7hLss8zxG4zUNT_cNN9QV90',
  SUPPLIER_GID: '0',
  MASTER_SHEET_ID: '1RMe38TNV-EoIAradnynYmk8mt7l9pNWqJELM9O84Wxc',
  MASTER_GID: '1254809645',
  TELEGRAM_TOKEN: '8261927820:AAEuN92GJ5kALTBwIKXi7hu7NKJnXFX0EdU',
  TELEGRAM_CHAT_ID: '-1002346875748',
};

const WH_KEYWORDS = {
  'Hải Dương': ['hai duong'],
  'Hải Phòng': ['hai phong'],
  'Hưng Yên':  ['hung yen', 'mien bac', 'mien bang'],
  'Thái Bình': ['thai binh'],
};

// ============================================================
// TELEGRAM PROXY — Nhận request từ client, forward tới Telegram
// Client gửi ảnh dưới dạng base64, proxy chuyển thành blob rồi gửi
// ============================================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'sendPhoto') {
      // Gửi ảnh: nhận base64 image + caption
      const imageData = data.image; // base64 string (không có prefix data:image/png;base64,)
      const caption = data.caption || '';
      const imageBlob = Utilities.newBlob(Utilities.base64Decode(imageData), 'image/png', 'report.png');

      const url = 'https://api.telegram.org/bot' + CONFIG.TELEGRAM_TOKEN + '/sendPhoto';
      const formData = {
        'chat_id': CONFIG.TELEGRAM_CHAT_ID,
        'photo': imageBlob,
        'caption': caption,
      };

      const options = {
        method: 'post',
        payload: formData,
        muteHttpExceptions: true,
      };

      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());

      return ContentService.createTextOutput(JSON.stringify({
        ok: result.ok,
        message: result.ok ? 'Sent' : (result.description || 'Error'),
      })).setMimeType(ContentService.MimeType.JSON);

    } else if (action === 'sendMessage') {
      // Gửi text message
      const text = data.text || '';
      sendTelegram_(text);

      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        message: 'Sent',
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        message: 'Unknown action',
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      message: 'Server error',
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Cho phép CORS preflight
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    message: 'Telegram Proxy is running',
  })).setMimeType(ContentService.MimeType.JSON);
}

// ====== HÀM CHÍNH: BÁO CÁO TỰ ĐỘNG ======
function sendDailyReport() {
  try {
    const empData = getSheetData_(CONFIG.EMPLOYEE_SHEET_ID, CONFIG.EMPLOYEE_GID);
    const masterData = getSheetData_(CONFIG.MASTER_SHEET_ID, CONFIG.MASTER_GID);

    const masterList = [];
    masterData.forEach(r => {
      if (!r || r.length < 3) return;
      const code = String(r[0] || '').replace(/[^0-9]/g, '').trim();
      const name = String(r[1] || '').trim().toUpperCase();
      const plate = String(r[2] || '').trim().toUpperCase().replace(/[\s\-\.]/g, '');
      const warehouse = String(r[6] || '').trim();
      if (!code || !name) return;
      masterList.push({ code, name, plate, warehouse });
    });

    const today = new Date();
    const cycle = getCycleRange_(today);

    const employees = [];
    empData.forEach((r, idx) => {
      if (!r || r.length < 10) return;
      const fullName = String(r[2] || '').trim();
      if (!fullName) return;
      const warehouse = String(r[6] || '').trim();
      const shortWH = getShortWH_(warehouse);
      if (!shortWH) return;

      const dateStr = String(r[4] || '').trim();
      const dateObj = parseDate_(dateStr);
      if (!dateObj || !isInCycle_(dateObj, cycle)) return;

      const parts = fullName.match(/^(.+?)\s+(\d{5,})$/);
      const name = parts ? parts[1].trim().toUpperCase() : fullName.toUpperCase();
      const code = parts ? parts[2].trim() : '';
      const plate = String(r[9] || '').trim();
      const kmStart = String(r[7] || '').trim();
      const kmEnd = String(r[12] || '').trim();
      const hourEnd = String(r[13] || '').trim();

      employees.push({ name, code, plate, shortWH, dateStr, kmStart, kmEnd, hourEnd });
    });

    const daysElapsed = countDays_(cycle, today);
    const allDates = getAllDates_(cycle, today);

    const whMap = {};
    employees.forEach(e => {
      const key = e.name + '|' + e.code;
      if (!whMap[e.shortWH]) whMap[e.shortWH] = {};
      if (!whMap[e.shortWH][key]) {
        const m = masterList.find(x => x.code === e.code);
        whMap[e.shortWH][key] = { name: e.name, code: e.code, plate: m ? fmtPlate_(m.plate) : e.plate, days: {} };
      }
      whMap[e.shortWH][key].days[e.dateStr] = true;
    });

    masterList.forEach(m => {
      const wh = getShortWH_(m.warehouse);
      if (!wh) return;
      const key = m.name + '|' + m.code;
      if (!whMap[wh]) whMap[wh] = {};
      if (!whMap[wh][key]) {
        whMap[wh][key] = { name: m.name, code: m.code, plate: fmtPlate_(m.plate), days: {} };
      }
    });

    let msg1 = '📊 *BÁO CÁO ODO HÀNG NGÀY*\n';
    msg1 += '📅 Kỳ: ' + fmt_(cycle.start, 'dd/MM') + ' → ' + fmt_(cycle.end, 'dd/MM/yyyy') + '\n';
    msg1 += '🕐 ' + fmt_(today, 'HH:mm dd/MM/yyyy') + '\n';
    msg1 += '━━━━━━━━━━━━━━━━━━━━\n';

    ['Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình'].forEach(wh => {
      const empObj = whMap[wh];
      if (!empObj) return;

      const list = Object.values(empObj).map(e => {
        const ud = Object.keys(e.days).length;
        const rate = daysElapsed > 0 ? Math.round((ud / daysElapsed) * 100) : 0;
        const missing = allDates.filter(d => !e.days[d]);
        return { ...e, ud, rate, missing };
      });
      list.sort((a, b) => b.rate - a.rate);

      msg1 += '\n🏢 *Kho ' + wh + '* (' + list.length + ' NV · ' + daysElapsed + ' ngày)\n';
      list.forEach((e, i) => {
        const icon = e.rate >= 80 ? '🟢' : e.rate >= 50 ? '🟡' : '🔴';
        msg1 += (i + 1) + '. ' + e.name + ' (' + e.code + ') ' + icon + ' ' + e.ud + '/' + daysElapsed + ' = ' + Math.min(e.rate, 100) + '%\n';
        if (e.rate < 100 && e.missing.length > 0) {
          const short = e.missing.map(d => { const p = d.match(/(\d{1,2})\/(\d{1,2})/); return p ? parseInt(p[1]) + '/' + parseInt(p[2]) : d; });
          msg1 += '   ❌ Thiếu: ' + short.join(', ') + '\n';
        }
      });
    });

    sendTelegram_(msg1);

    // Cảnh báo gian lận
    const fraud = [];
    employees.forEach(e => {
      const km = parseInt(e.kmEnd) - parseInt(e.kmStart);
      const reasons = [];
      if (!isNaN(km) && km > 200) reasons.push('Km: ' + km);
      if (!isNaN(km) && km < 0) reasons.push('Km âm: ' + km + ' (gõ sai)');

      const ot = calcOT_(e.hourEnd);
      if (ot > 180) {
        const h = Math.floor(ot / 60), m = ot % 60;
        reasons.push('TC: ' + h + 'h' + (m > 0 ? String(m).padStart(2, '0') : ''));
      }

      if (reasons.length > 0) fraud.push({ ...e, km: isNaN(km) ? 0 : km, ot, reasons });
    });

    if (fraud.length > 0) {
      let msg2 = '🚨 *CẢNH BÁO GIAN LẬN*\n';
      msg2 += '⚠️ ' + fraud.length + ' trường hợp cần kiểm tra\n';
      msg2 += '🔴 Km > 200, Km âm, hoặc TC > 3 tiếng\n';
      msg2 += '━━━━━━━━━━━━━━━━━━━━\n\n';

      fraud.forEach((e, i) => {
        const otStr = e.ot > 0 ? Math.floor(e.ot / 60) + 'h' + (e.ot % 60 > 0 ? String(e.ot % 60).padStart(2, '0') : '') : '—';
        msg2 += (i + 1) + '. *' + e.name + '* (' + e.code + ')\n';
        msg2 += '   📅 ' + e.dateStr + ' | 🏢 ' + e.shortWH + '\n';
        msg2 += '   🚗 ' + e.plate + ' | Km: *' + e.km + '* | TC: *' + otStr + '*\n';
        msg2 += '   ⚠️ ' + e.reasons.join(' | ') + '\n\n';
      });

      sendTelegram_(msg2);
    }

    Logger.log('✅ Đã gửi báo cáo thành công!');
  } catch (err) {
    Logger.log('❌ Lỗi: ' + err.message);
    sendTelegram_('❌ Lỗi báo cáo tự động:\n' + err.message);
  }
}

// ====== ĐỌC GOOGLE SHEET ======
function getSheetData_(id, gid) {
  const url = 'https://docs.google.com/spreadsheets/d/' + id + '/gviz/tq?tqx=out:json&gid=' + gid + '&headers=1';
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const text = res.getContentText();
  const jsonStr = text.replace(/^[^(]*\(/, '').replace(/\);?$/, '');
  const json = JSON.parse(jsonStr);
  const rows = [];
  if (json.table && json.table.rows) {
    json.table.rows.forEach(row => {
      rows.push(row.c ? row.c.map(c => c ? (c.v != null ? String(c.v) : '') : '') : []);
    });
  }
  return rows;
}

// ====== GỬI TELEGRAM ======
function sendTelegram_(text) {
  const url = 'https://api.telegram.org/bot' + CONFIG.TELEGRAM_TOKEN + '/sendMessage';
  const chunks = [];
  let rem = text;
  while (rem.length > 0) {
    if (rem.length <= 4000) { chunks.push(rem); break; }
    let cut = rem.lastIndexOf('\n', 4000);
    if (cut <= 0) cut = 4000;
    chunks.push(rem.substring(0, cut));
    rem = rem.substring(cut);
  }
  chunks.forEach(chunk => {
    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text: chunk, parse_mode: 'Markdown' }),
      muteHttpExceptions: true,
    });
    Utilities.sleep(500);
  });
}

// ====== TIỆN ÍCH ======
function getCycleRange_(date) {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  return d >= 26
    ? { start: new Date(y, m, 26), end: new Date(y, m + 1, 25) }
    : { start: new Date(y, m - 1, 26), end: new Date(y, m, 25) };
}

function isInCycle_(date, cycle) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return d >= new Date(cycle.start.getFullYear(), cycle.start.getMonth(), cycle.start.getDate())
      && d <= new Date(cycle.end.getFullYear(), cycle.end.getMonth(), cycle.end.getDate());
}

function parseDate_(str) {
  if (!str) return null;
  const p = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return p ? new Date(parseInt(p[3]), parseInt(p[2]) - 1, parseInt(p[1])) : null;
}

function countDays_(cycle, today) {
  let c = 0;
  const end = today < cycle.end ? today : cycle.end;
  for (let dt = new Date(cycle.start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    if (dt.getDay() !== 0) c++;
  }
  return c;
}

function getAllDates_(cycle, today) {
  const dates = [];
  const end = today < cycle.end ? today : cycle.end;
  for (let dt = new Date(cycle.start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    if (dt.getDay() !== 0) dates.push(fmt_(new Date(dt), 'dd/MM/yyyy'));
  }
  return dates;
}

function getShortWH_(wh) {
  if (!wh) return null;
  const lower = rmDia_(wh);
  for (const [short, kws] of Object.entries(WH_KEYWORDS)) {
    for (const kw of kws) { if (lower.includes(kw)) return short; }
  }
  return null;
}

function rmDia_(s) {
  return s ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().trim() : '';
}

function fmtPlate_(p) {
  if (!p) return '';
  const s = p.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const m = s.match(/^(\d{2}[A-Z]{1,2})(\d{4,5})$/);
  return m ? m[1] + '-' + m[2] : s;
}

function calcOT_(hourEnd) {
  if (!hourEnd) return 0;
  const ts = String(hourEnd).replace(/h/gi, ':');
  const p = ts.match(/(\d{1,2}):(\d{2})/);
  if (!p) return 0;
  let h = parseInt(p[1]);
  const m = parseInt(p[2]);
  if (/PM/i.test(ts) && h < 12) h += 12;
  if (/AM/i.test(ts) && h === 12) h = 0;
  const total = h * 60 + m;
  return total > 1140 ? total - 1140 : 0;
}

function fmt_(date, pattern) {
  return Utilities.formatDate(date, 'Asia/Ho_Chi_Minh', pattern);
}
