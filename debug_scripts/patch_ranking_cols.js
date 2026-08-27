const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const oldHtml = `<table class="ranking-table" style="width:100%;">
            <thead><tr>
                <th style="width:40px;">#</th>
                <th>Họ và tên</th>
                <th style="width:80px;">Mã NV</th>
                <th style="width:120px;">Biển số xe</th>
                <th style="width:80px;">Số ngày ODO</th>
                <th style="width:160px;">% Hoàn thành</th>
                <th>Đi làm nhưng không báo cáo</th>
                <th>Ngày nghỉ</th>
                <th>Ghi chú</th>
            </tr></thead>`;

const oldHtmlCRLF = `<table class="ranking-table" style="width:100%;">\r
            <thead><tr>\r
                <th style="width:40px;">#</th>\r
                <th>Họ và tên</th>\r
                <th style="width:80px;">Mã NV</th>\r
                <th style="width:120px;">Biển số xe</th>\r
                <th style="width:80px;">Số ngày ODO</th>\r
                <th style="width:160px;">% Hoàn thành</th>\r
                <th>Đi làm nhưng không báo cáo</th>\r
                <th>Ngày nghỉ</th>\r
                <th>Ghi chú</th>\r
            </tr></thead>`;

const newHtml = `<div style="overflow-x: auto; width: 100%;">
            <table class="ranking-table" style="width:100%; min-width: 1100px;">
            <thead><tr>
                <th style="width:40px;">#</th>
                <th style="width:150px;">Họ và tên</th>
                <th style="width:80px;">Mã NV</th>
                <th style="width:100px;">Biển số xe</th>
                <th style="width:100px;">Số ngày ODO</th>
                <th style="width:120px;">% Hoàn thành</th>
                <th style="min-width:250px;">Đi làm nhưng không báo cáo</th>
                <th style="min-width:200px;">Ngày nghỉ</th>
                <th style="width:100px;">Ghi chú</th>
            </tr></thead>`;

if (code.includes(oldHtmlCRLF)) {
    code = code.replace(oldHtmlCRLF, newHtml);
} else {
    code = code.replace(oldHtml, newHtml);
}

const oldEnd = `</tbody></table>
        </div>`;
const oldEndCRLF = `</tbody></table>\r\n        </div>`;

const newEnd = `</tbody></table>
        </div></div>`;

if (code.includes(oldEndCRLF)) {
    code = code.replace(oldEndCRLF, newEnd);
} else {
    code = code.replace(oldEnd, newEnd);
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fixed ranking table cols');
