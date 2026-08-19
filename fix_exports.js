const fs = require("fs");
let content = fs.readFileSync("index.html", "utf8");

// Fix exportNccTripExcel
content = content.replace(/function exportNccTripExcel\(\) \{[\s\S]*?XLSX\.writeFile\(wb, `Ghep_Chuyen_NCC_.*\.xlsx`\);\n\}/, `function exportNccTripExcel() {
    const data = window.currentNccTripFiltered || [];
    if (data.length === 0) { showToast("?", "Chua có d? li?u d? xu?t!"); return; }
    if (typeof XLSX === "undefined") { showToast("?", "Thu vi?n Excel chua du?c t?i xong!"); return; }
    
    const exportData = data.map(r => ({
        "Ngày": r.dateStr,
        "Tên NCC": r.ncc,
        "Bi?n s? xe": r.plate,
        "Kho": r.warehouse,
        "L? trình": r.route,
        "KM phát sinh": r.kmDiff || "",
        "Phí vu?t KM": r.kmOverFee || "",
        "Gi? di - v?": (r.hourStart && r.hourEnd) ? (r.hourStart + " - " + r.hourEnd) : "",
        "TG tang ca": r.otHours || "",
        "Phí tang ca": r.otFee || "",
        "Ðon giá tháng": r.monthlyRate || "",
        "Ðon giá ngày": r.dailyRate || "",
        "Phí c?u du?ng": r.tollFee || "",
        "Phí ngày l?": r.holidayFee || "",
        "T?ng chi phí": r.totalCost || "",
        "Mã chuy?n di GHN": r.ghnTripCode || "",
        "Tr?ng thái": (r.ghnTripCode === "GHN OFF" || r.ghnTripCode === "GHN_OFF") ? "GHN OFF" : ((r.ghnTripCode === "Ph?t" || r.ghnTripCode === "PH?T") ? "Ph?t" : ((r.ghnTripCode === "NCC OFF" || r.ghnTripCode === "NCC_OFF" || r.ghnTripCode === "OFF") ? "NCC OFF" : (r.ghnTripCode ? "Ðã kh?p" : "Thi?u mã"))),
        "Ghi chú": r.note || ""
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ghep Chuyen");
    XLSX.writeFile(wb, "Ghep_Chuyen_NCC.xlsx");
}`);

// Fix exportLastmileExcel
content = content.replace(/function exportLastmileExcel\(\) \{[\s\S]*?showToast\(.*\);\n\}/, `function exportLastmileExcel() {
    const data = window.currentLastmileFiltered || [];
    if (data.length === 0) { showToast("?", "Chua có d? li?u d? xu?t!"); return; }
    if (typeof XLSX === "undefined") { showToast("?", "Thu vi?n Excel chua t?i!"); return; }
    var rows = data.map(function(r,i) { return [i+1, r.dateStr, r.hubName, r.tripCode, r.plate, r.createdTime, r.startTime, r.endTime, r.createdById, r.createdByName, r.pickCount||0, r.deliverCount||0, r.returnCount||0, r.orderCount||0, r.driverId, r.driverName, _phoneUnlocked ? (r.driverPhone || "") : "******", r.servicePartner]; });
    rows.unshift(["STT","Ngày","Hub","Mã chuy?n di","Bi?n s? xe","T?o","B?t d?u","K?t thúc","Ngu?i t?o (Mã)","Ngu?i t?o (Tên)","L?y","Giao","Tr?","T?ng ÐH","Tài x? (Mã)","Tài x? (Tên)","SÐT","Ð?i tác"]);
    var ws = XLSX.utils.aoa_to_sheet(rows);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lastmile");
    XLSX.writeFile(wb, "lastmile_trips_" + new Date().toISOString().slice(0,10) + ".xlsx");
    showToast("?", "Ðã xu?t Excel!");
}`);

// Fix exportRecon3WayExcel
content = content.replace(/window\.exportRecon3WayExcel = function\(\) \{[\s\S]*?showToast\(.*\);\n\};/, `window.exportRecon3WayExcel = function() {
    const data = window.currentRecon3WayFiltered || [];
    if (data.length === 0) { showToast("?", "Không có d? li?u!"); return; }
    var calcSupKm = function(supArr) {
        var total = 0;
        supArr.forEach(function(s) {
            if (s.kmDiff) {
                var d = parseFloat(String(s.kmDiff).replace(/[^\\d.]/g, ""));
                if (!isNaN(d) && d > 0) { total += d; return; }
            }
            var ks = parseFloat(String(s.kmStart || "0").replace(/[^\\d.]/g, "")) || 0;
            var ke = parseFloat(String(s.kmEnd || "0").replace(/[^\\d.]/g, "")) || 0;
            if (ke >= ks && ke > 0) { total += (ke - ks); }
        });
        return total;
    };
    var exportData = data.map(function(d, i) {
        var ncc = (d.emp[0] ? d.emp[0].supplier : "") || (d.sup[0] ? d.sup[0].ncc : "") || "";
        var wh = d.hub || "";
        var lmCount = d.lm.length;
        var tripStr = d.tripCodes.join(", ");
        var odo = 0;
        if (d.emp.length > 0) { d.emp.forEach(function(e) { odo += (e.kmEnd - e.kmStart) || 0; }); }
        var supKm = 0;
        if (d.sup.length > 0) { supKm = calcSupKm(d.sup); }
        var diff = Math.abs(odo - supKm);
        
        var status = "";
        if (d.sup.length===0 && d.emp.length===0 && d.lm.length>0) status = "Ch? có GHN";
        else if (d.sup.length===0) status = "Thi?u NCC";
        else if (d.emp.length===0) status = "Thi?u NV";
        else if (diff > 5) status = "L?ch KM (" + diff + "km)";
        else status = "Kh?p";
        
        return {
            "STT": i + 1,
            "Ngày": d.dateStr,
            "Bi?n s?": d.plate,
            "NCC": ncc,
            "Kho": wh,
            "Mã chuy?n GHN": tripStr,
            "S? chuy?n LM": lmCount,
            "NV Báo (Km)": (d.emp.length > 0 ? odo : ""),
            "NCC Ch?t (Km)": (d.sup.length > 0 ? supKm : ""),
            "Tr?ng thái": status
        };
    });
    var ws = XLSX.utils.json_to_sheet(exportData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doi_Soat_3_Chieu");
    XLSX.writeFile(wb, "doi_soat_3_chieu_" + new Date().toISOString().slice(0,10) + ".xlsx");
    showToast("?", "Ðã xu?t Excel!");
};`);

fs.writeFileSync("index.html", content);
console.log("Exports fixed.");
