const fs = require('fs');
let code = fs.readFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', 'utf8');

const search = "          } else if (hasMatch) {\n              ghnHtml = <div style=\"display:flex; gap: 6px; align-items:center;\">\n                <a href=\"https://nhanh.ghn.vn/lastmile/trip-detail/\\" target=\"_blank\" style=\"color:var(--success);text-decoration:underline;\"><strong>\</strong></a>;\n              if (r.isManualMatch) {";

const replace =           } else if (hasMatch) {
              const codes = String(r.ghnTripCode).split('|').map(c => c.trim()).filter(c => c);
              ghnHtml = \<div style="display:flex; gap: 6px; align-items:center; flex-wrap:wrap;">\;
              codes.forEach((c, idx) => {
                  ghnHtml += \<a href="https://nhanh.ghn.vn/lastmile/trip-detail/\" target="_blank" style="color:var(--success);text-decoration:underline;"><strong>\</strong></a>\;
                  if (idx < codes.length - 1) ghnHtml += \<span style="color:#64748b;">|</span>\;
              });
              if (r.isManualMatch) {;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', code);
    console.log("Success");
} else {
    console.log("Not found, trying regex...");
    const regex = /\} else if \(hasMatch\) \{\s*ghnHtml = <div style="display:flex; gap: 6px; align-items:center;">\s*<a href="https:\/\/nhanh\.ghn\.vn\/lastmile\/trip-detail\/\$\{r\.ghnTripCode\}" target="_blank" style="color:var\(--success\);text-decoration:underline;"><strong>\$\{r\.ghnTripCode\}<\/strong><\/a>;\s*if \(r\.isManualMatch\) \{/s;
    if (regex.test(code)) {
        code = code.replace(regex, replace.trim());
        fs.writeFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', code);
        console.log("Success with regex");
    } else {
        console.log("Still not found");
    }
}
