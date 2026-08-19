const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /function exportNccTripExcel\(\) \{[\s\S]*?XLSX\.writeFile\(wb, "Ghep_Chuyen_NCC\.xlsx"\);\s*\}/;

const replace = `function exportNccTripExcel() {
      const data = window.currentNccTripFiltered || [];
      if (data.length === 0) { showToast("?", "Chua có dữ liệu để xuất!"); return; }
      if (typeof XLSX === "undefined") { showToast("?", "Thư viện Excel chưa được tải xong!"); return; }
      
      const formatEmpty = (val) => {
          if (val === undefined || val === null || val === "" || String(val).trim() === "0" || String(val).trim() === "0 đ") return "-";
          return val;
      };

      const exportData = data.map(r => ({
          "Ngày": r.dateStr,
          "Tên NCC": r.ncc,
          "Biển số xe": r.plate,
          "Kho": r.warehouse,
          "Lộ trình": r.route,
          "KM phát sinh": formatEmpty(r.kmDiff),
          "Phí vượt KM": formatEmpty(r.kmOverFee),
          "Giờ đi - về": (r.hourStart && r.hourEnd) ? (r.hourStart + " - " + r.hourEnd) : "-",
          "TG tăng ca": formatEmpty(r.otHours),
          "Phí tăng ca": formatEmpty(r.otFee),
          "Đơn giá tháng": formatEmpty(r.monthlyRate),
          "Đơn giá ngày": formatEmpty(r.dailyRate),
          "Phí cầu đường": formatEmpty(r.tollFee),
          "Phí ngày lễ": formatEmpty(r.holidayFee),
          "Tổng chi phí": formatEmpty(r.totalCost),
          "Mã chuyến đi GHN": r.ghnTripCode || "-",
          "Trạng thái": (r.ghnTripCode === "GHN OFF" || r.ghnTripCode === "GHN_OFF") ? "GHN OFF" : ((r.ghnTripCode === "Phạt" || r.ghnTripCode === "PHẠT") ? "Phạt" : ((r.ghnTripCode === "NCC OFF" || r.ghnTripCode === "NCC_OFF" || r.ghnTripCode === "OFF") ? "NCC OFF" : (r.ghnTripCode ? "Đã khớp" : "Thiếu mã"))),
          "Ghi chú": r.note || ""
      }));
      
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Ghep Chuyen");
      
      // Lay ky doi soat
      let kyDoiSoat = "TatCa";
      const filterFrom = document.getElementById("filterNccFromDate").value;
      const filterTo = document.getElementById("filterNccToDate").value;
      if (filterFrom && filterTo) {
          kyDoiSoat = filterFrom.replace(/\\//g, "") + "_" + filterTo.replace(/\\//g, "");
      } else {
          const predefined = document.getElementById("filterNccReconCycle").value;
          if (predefined) {
              const matches = predefined.match(/\\d{2}\\/\\d{2}\\/\\d{4}/g);
              if (matches && matches.length === 2) {
                  kyDoiSoat = matches[0].replace(/\\//g, "") + "_" + matches[1].replace(/\\//g, "");
              }
          }
      }
      
      XLSX.writeFile(wb, "Ghep_Chuyen_NCC_Ky_" + kyDoiSoat + ".xlsx");
  }`;

if (content.match(regex)) {
    content = content.replace(regex, replace);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Successfully updated exportNccTripExcel.");
} else {
    console.log("Regex not found.");
}
