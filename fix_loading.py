# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

search = r"if \(typeof nccTripData === 'undefined' \|\| nccTripData\.length === 0\) \{\s*container\.innerHTML = <div class=\"empty-state\"><div class=\"icon\">📫</div><p>Chưa có dữ liệu chuyến đi NCC cho kỳ này</p></div>;\s*document\.getElementById\('nccTotalCost'\)\.innerText = '0 đ';\s*return;\s*\}"
replace = r"""if (!isNccTripLoaded) {
        container.innerHTML = <div style="padding:40px;text-align:center;color:var(--text-muted)"><div class="spinner" style="margin:0 auto 10px"></div>Đang tải dữ liệu chuyến đi NCC... Vui lòng đợi!</div>;
        document.getElementById('nccTotalCost').innerText = '0 đ';
        return;
    }
    
    if (typeof nccTripData === 'undefined' || nccTripData.length === 0) {
        container.innerHTML = <div class="empty-state"><div class="icon">📫</div><p>Chưa có dữ liệu chuyến đi NCC</p></div>;
        document.getElementById('nccTotalCost').innerText = '0 đ';
        return;
    }"""
code = re.sub(search, replace, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)
