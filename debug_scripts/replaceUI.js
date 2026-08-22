const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const s1 = <button class="btn btn-secondary" style="padding: 2px 5px; font-size: 11px; height: 26px; background:#6366f1; color:#fff; border:none; border-radius:4px; cursor:pointer;" onclick="updateNccTripCode(\, 'GHN OFF')" title="Đánh dấu GHN OFF">GHN OFF</button>;
const s2 = <button class="btn btn-secondary" style="padding: 2px 5px; font-size: 11px; height: 26px; background:#475569; color:#fff; border:none; border-radius:4px; cursor:pointer;" onclick="updateNccTripCode(\, 'NCC OFF')" title="Đánh dấu NCC OFF">NCC OFF</button>;
const s3 = <button class="btn btn-secondary" style="padding: 2px 5px; font-size: 11px; height: 26px; background:#ef4444; color:#fff; border:none; border-radius:4px; cursor:pointer;" onclick="updateNccTripCode(\, 'Phạt')" title="Đánh dấu Phạt">Phạt</button>;

const rep = <select class="form-control" style="background:#1e293b; color:#cbd5e1; width:80px; font-size:11px; padding: 2px; height: 26px; border:1px solid #334155; border-radius:4px; cursor:pointer;" onchange="if(this.value) updateNccTripCode(\, this.value); this.value='';">
                      <option value="">Trạng thái</option>
                      <option value="GHN OFF">GHN OFF</option>
                      <option value="NCC OFF">NCC OFF</option>
                      <option value="Phạt">Phạt</option>
                  </select>;

let newCode = code.replace(s1 + '\n                  ' + s2 + '\n                  ' + s3, rep);
if (newCode === code) {
    // try removing just the buttons one by one?
    // Actually we can just regex it
    newCode = code.replace(/<button[^>]+>GHN OFF<\/button>\s*<button[^>]+>NCC OFF<\/button>\s*<button[^>]+>Phạt<\/button>/, rep);
}

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', newCode);
