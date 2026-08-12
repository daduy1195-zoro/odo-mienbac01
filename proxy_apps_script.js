/**
 * ============================================
 * PROXY GOOGLE APPS SCRIPT - ĐỌC DỮ LIỆU SHEET NV ODO
 * ============================================
 * 
 * HƯỚNG DẪN DEPLOY:
 * 
 * 1. Mở trình duyệt, đăng nhập tài khoản GHN công ty (tài khoản có quyền truy cập sheet)
 * 2. Truy cập https://script.google.com → Tạo dự án mới
 * 3. Dán toàn bộ nội dung file này vào phần Code.gs
 * 4. Nhấn "Deploy" → "New deployment"
 *    - Type: Web app
 *    - Execute as: Me (tài khoản GHN)
 *    - Who has access: Anyone (Bất kỳ ai — để dashboard gọi được)
 * 5. Nhấn "Deploy" → Copy URL web app
 * 6. Dán URL vào CONFIG.PROXY_API_URL trong file index.html
 * 
 * LƯU Ý:
 * - Mỗi lần sửa code cần re-deploy (Deploy → Manage deployments → Edit → New version)
 * - Script này chạy dưới quyền tài khoản GHN, nên có thể đọc sheet nội bộ
 * - Response trả về JSON, dashboard gọi bình thường qua fetch()
 */

// ═══════════════════════════════════════
// CẤU HÌNH - KHÔNG CẦN SỬA NẾU DÙNG ĐÚNG SHEET
// ═══════════════════════════════════════
const SHEETS_CONFIG = {
  // Sheet nhân viên điền ODO (2 tab)
  EMPLOYEE: {
    id: '1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo',
    gids: ['409459817', '1274066622']
  },
  // Sheet đối soát nhà cung cấp xe
  SUPPLIER: {
    id: '14zXhTqxD7VsN_PE3OxNY7hLss8zxG4zUNT_cNN9QV90',
    gid: '0'
  },
  // Sheet danh sách NV chuẩn (master list)
  MASTER: {
    id: '1RMe38TNV-EoIAradnynYmk8mt7l9pNWqJELM9O84Wxc',
    gid: '1254809645'
  }
};

// ═══════════════════════════════════════
// XỬ LÝ REQUEST
// ═══════════════════════════════════════
function doGet(e) {
  const action = (e.parameter.action || 'employee').toLowerCase();
  const gid = e.parameter.gid || '';
  
  let result;
  
  try {
    switch (action) {
      case 'employee':
        // Trả về tất cả dữ liệu nhân viên từ cả 2 tab
        result = getAllEmployeeData();
        break;
      case 'employee_gid':
        // Trả về dữ liệu nhân viên từ 1 tab cụ thể
        result = getSheetDataByGid(SHEETS_CONFIG.EMPLOYEE.id, gid);
        break;
      case 'supplier':
        result = getSheetDataByGid(SHEETS_CONFIG.SUPPLIER.id, SHEETS_CONFIG.SUPPLIER.gid);
        break;
      case 'master':
        result = getSheetDataByGid(SHEETS_CONFIG.MASTER.id, SHEETS_CONFIG.MASTER.gid);
        break;
      case 'master_nvph':
        result = getSheetDataByName(SHEETS_CONFIG.MASTER.id, 'NVPH');
        break;
      case 'master_ctv':
        result = getSheetDataByName(SHEETS_CONFIG.MASTER.id, 'CTV');
        break;
      case 'ping':
        result = { status: 'ok', timestamp: new Date().toISOString() };
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.message, stack: err.stack };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════
// ĐỌC DỮ LIỆU TỪ SHEET
// ═══════════════════════════════════════

/**
 * Đọc tất cả dữ liệu nhân viên từ cả 2 tab, kèm metadata gid và sheetRow
 */
function getAllEmployeeData() {
  const allRows = [];
  
  SHEETS_CONFIG.EMPLOYEE.gids.forEach(function(gid) {
    const ss = SpreadsheetApp.openById(SHEETS_CONFIG.EMPLOYEE.id);
    const sheets = ss.getSheets();
    
    // Tìm sheet theo gid
    let targetSheet = null;
    for (let i = 0; i < sheets.length; i++) {
      if (String(sheets[i].getSheetId()) === String(gid)) {
        targetSheet = sheets[i];
        break;
      }
    }
    
    if (!targetSheet) return;
    
    const data = targetSheet.getDataRange().getValues();
    if (data.length <= 1) return; // Chỉ có header
    
    // Bỏ header row (row 0), data bắt đầu từ row 1
    for (let i = 1; i < data.length; i++) {
      const row = data[i].map(function(cell) {
        if (cell instanceof Date) {
          // Format Date → DD/MM/YYYY
          var dd = String(cell.getDate()).padStart(2, '0');
          var mm = String(cell.getMonth() + 1).padStart(2, '0');
          var yyyy = cell.getFullYear();
          return dd + '/' + mm + '/' + yyyy;
        }
        return cell !== null && cell !== undefined ? String(cell) : '';
      });
      
      // Kèm metadata
      row.push(gid);        // Cột cuối cùng: gid
      row.push(i + 1);      // Cột cuối cùng + 1: sheetRow (1-indexed, row 1 = header)
      
      allRows.push(row);
    }
  });
  
  return {
    status: 'ok',
    count: allRows.length,
    metaCols: ['_gid', '_sheetRow'], // 2 cột cuối là metadata
    rows: allRows
  };
}

/**
 * Đọc dữ liệu từ sheet theo Sheet ID + GID
 */
function getSheetDataByGid(sheetId, gid) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheets = ss.getSheets();
  
  let targetSheet = null;
  for (let i = 0; i < sheets.length; i++) {
    if (String(sheets[i].getSheetId()) === String(gid)) {
      targetSheet = sheets[i];
      break;
    }
  }
  
  if (!targetSheet) {
    return { status: 'error', error: 'Sheet not found: gid=' + gid };
  }
  
  return getSheetRows(targetSheet);
}

/**
 * Đọc dữ liệu từ sheet theo Sheet ID + tên tab
 */
function getSheetDataByName(sheetId, tabName) {
  const ss = SpreadsheetApp.openById(sheetId);
  const targetSheet = ss.getSheetByName(tabName);
  
  if (!targetSheet) {
    return { status: 'ok', count: 0, rows: [] }; // Tab chưa tồn tại → trả rỗng
  }
  
  return getSheetRows(targetSheet);
}

/**
 * Helper: đọc tất cả rows từ một Sheet object (bỏ header)
 */
function getSheetRows(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { status: 'ok', count: 0, rows: [] };
  
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i].map(function(cell) {
      if (cell instanceof Date) {
        var dd = String(cell.getDate()).padStart(2, '0');
        var mm = String(cell.getMonth() + 1).padStart(2, '0');
        var yyyy = cell.getFullYear();
        return dd + '/' + mm + '/' + yyyy;
      }
      return cell !== null && cell !== undefined ? String(cell) : '';
    });
    rows.push(row);
  }
  
  return {
    status: 'ok',
    count: rows.length,
    rows: rows
  };
}
