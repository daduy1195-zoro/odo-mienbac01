const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /<table class="ranking-table" style="width:100%;">[\s\r\n]*<thead><tr>[\s\r\n]*<th style="width:40px;">#<\/th>[\s\r\n]*<th>Họ và tên<\/th>[\s\r\n]*<th style="width:80px;">Mã NV<\/th>[\s\r\n]*<th style="width:120px;">Biển số xe<\/th>[\s\r\n]*<th style="width:80px;">Số ngày ODO<\/th>[\s\r\n]*<th style="width:160px;">% Hoàn thành<\/th>[\s\r\n]*<th>Đi làm nhưng không báo cáo<\/th>[\s\r\n]*<th>Ngày nghỉ<\/th>[\s\r\n]*<th>Ghi chú<\/th>[\s\r\n]*<\/tr><\/thead>/m;

const newHtml = `<div style="overflow-x: auto; width: 100%;">
            <table class="ranking-table" style="width:100%; min-width: 1200px;">
            <thead><tr>
                <th style="width:40px;">#</th>
                <th style="width:160px;">Họ và tên</th>
                <th style="width:80px;">Mã NV</th>
                <th style="width:100px;">Biển số xe</th>
                <th style="width:100px;">Số ngày ODO</th>
                <th style="width:140px;">% Hoàn thành</th>
                <th style="min-width:300px;">Đi làm nhưng không báo cáo</th>
                <th style="min-width:200px;">Ngày nghỉ</th>
                <th style="width:120px;">Ghi chú</th>
            </tr></thead>`;

code = code.replace(regex, newHtml);

// And close the div
const endRegex = /<\/tbody><\/table>[\s\r\n]*<\/div>`/m;
const endNew = `</tbody></table></div>\n        </div>\``;
code = code.replace(endRegex, endNew);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fixed ranking table cols via regex');
