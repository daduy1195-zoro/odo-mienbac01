const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const rep = `<select class="form-control" style="background:#1e293b; color:#cbd5e1; width:80px; font-size:11px; padding: 2px; height: 26px; border:1px solid #334155; border-radius:4px; cursor:pointer;" onchange="if(this.value) updateNccTripCode(${r.originalIndex}, this.value); this.value='';">
                      <option value="">Trạng thái</option>
                      <option value="GHN OFF">GHN OFF</option>
                      <option value="NCC OFF">NCC OFF</option>
                      <option value="Phạt">Phạt</option>
                  </select>`;

let newCode = code.replace(/<button[^>]+>GHN OFF<\/button>\s*<button[^>]+>NCC OFF<\/button>\s*<button[^>]+>Phạt<\/button>/, rep);

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', newCode);
