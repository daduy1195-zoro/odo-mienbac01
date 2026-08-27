import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# 1. Add filterNccTripCode input to tabNccTrip
search1 = """<div class="section-header">
            <div class="section-title">🚛 Ghép chuyến đi NCC</div>
            <div style="display:flex;gap:8px;align-items:center;">
                <select id="filterNccStatus" class="form-control" style="width: 160px; font-size: 13px;" onchange="renderNccTrip()">"""

replace1 = """<div class="section-header">
            <div class="section-title">🚛 Ghép chuyến đi NCC</div>
            <div style="display:flex;gap:8px;align-items:center;">
                <input type="text" id="filterNccTripCode" class="form-control" placeholder="Mã chuyến..." style="width: 110px; font-size: 13px;" oninput="renderNccTrip()">
                <select id="filterNccStatus" class="form-control" style="width: 160px; font-size: 13px;" onchange="renderNccTrip()">"""
content = content.replace(search1, replace1)


# 2. Add filterTripCode logic to renderNccTrip
search2 = """      const filterStatus = document.getElementById('filterNccStatus') ? document.getElementById('filterNccStatus').value : '';
      
      const filtered = [];"""

replace2 = """      const filterStatus = document.getElementById('filterNccStatus') ? document.getElementById('filterNccStatus').value : '';
      const filterTripCode = document.getElementById('filterNccTripCode') ? document.getElementById('filterNccTripCode').value.trim() : '';
      
      const filtered = [];"""
content = content.replace(search2, replace2)

search3 = """      nccTripData.forEach((row, idx) => {
          if (filterWh && row.warehouse !== filterWh) return;
          if (filterNcc && norm(row.ncc) !== norm(filterNcc)) return;
          if (filterPlate && !norm(row.plate).replace(/-/g, '').includes(norm(filterPlate).replace(/-/g, ''))) return;
          if (filterEmp && (!row.fullName || !norm(row.fullName).includes(norm(filterEmp)))) return;"""

replace3 = """      nccTripData.forEach((row, idx) => {
          if (filterWh && row.warehouse !== filterWh) return;
          if (filterNcc && norm(row.ncc) !== norm(filterNcc)) return;
          if (filterPlate && !norm(row.plate).replace(/-/g, '').includes(norm(filterPlate).replace(/-/g, ''))) return;
          if (filterEmp && (!row.fullName || !norm(row.fullName).includes(norm(filterEmp)))) return;
          if (filterTripCode && (!row.ghnTripCode || !String(row.ghnTripCode).includes(filterTripCode))) return;"""
content = content.replace(search3, replace3)


# 3. Add jumpToNccTrip function and make badges clickable in renderLastmile
search4 = """              if (isManual) {
                  statusHtml = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤝 Khớp tay</span>${unmatchBtn}</div>`;
              } else {
                  statusHtml = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span style="color:var(--success);">✅ Đã ĐS</span>${unmatchBtn}</div>`;
              }"""

replace4 = """              if (isManual) {
                  statusHtml = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);cursor:pointer;" onclick="jumpToNccTrip('${r.tripCode}')" title="Được khớp bằng tay - Nhấn để xem chuyến ghép">🤝 Khớp tay</span>${unmatchBtn}</div>`;
              } else {
                  statusHtml = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span style="color:var(--success);cursor:pointer;text-decoration:underline;" onclick="jumpToNccTrip('${r.tripCode}')" title="Nhấn để xem chuyến ghép">✅ Đã ĐS</span>${unmatchBtn}</div>`;
              }"""
content = content.replace(search4, replace4)


# Add the global jumpToNccTrip function
search5 = """function switchTab(tab, el) {"""
replace5 = """window.jumpToNccTrip = function(tripCode) {
    if (!tripCode) return;
    
    // Set the search box value
    const searchInput = document.getElementById('filterNccTripCode');
    if (searchInput) searchInput.value = tripCode;
    
    // Reset status filter so we don't accidentally hide it
    const statusFilter = document.getElementById('filterNccStatus');
    if (statusFilter) statusFilter.value = '';
    
    // Find the tab button to activate it visually
    const tabBtns = document.querySelectorAll('.tab-btn');
    let targetBtn = null;
    tabBtns.forEach(b => {
        if (b.getAttribute('onclick') && b.getAttribute('onclick').includes('nccTrip')) {
            targetBtn = b;
        }
    });
    
    switchTab('nccTrip', targetBtn);
    if (typeof renderNccTrip === 'function') renderNccTrip();
};

function switchTab(tab, el) {"""
content = content.replace(search5, replace5)


with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)

print("success")
