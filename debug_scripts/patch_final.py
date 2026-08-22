import re
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

search = r"\} else if \(hasMatch\) \{\s*const codes = r\.ghnTripCode\.split\('\|'\)\.map\(c => c\.trim\(\)\)\.filter\(c => c\);\s*ghnHtml = <div style=\"display:flex; gap: 6px; align-items:center; flex-wrap:wrap;\">;\s*codes\.forEach\(\(c, idx\) => \{\s*ghnHtml \+= <a href=\"https://nhanh\.ghn\.vn/lastmile/trip-detail/\$\{c\}\" target=\"_blank\" style=\"color:var\(--success\);text-decoration:underline;\"><strong>\$\{c\}</strong></a>;\s*if \(idx < codes\.length - 1\) ghnHtml \+= <span style=\"color:#64748b;\">\|</span>;\s*\}\);\s*if \(r\.isManualMatch\) \{"

if re.search(search, code, re.DOTALL):
    print("ALREADY PATCHED!")
else:
    search2 = r"\} else if \(hasMatch\) \{.*?(?=if \(r\.isManualMatch\))"
    replace2 = r"""} else if (hasMatch) {
              const codes = String(r.ghnTripCode).split('|').map(c => c.trim()).filter(c => c);
              ghnHtml = <div style="display:flex; gap: 6px; align-items:center; flex-wrap:wrap;">;
              codes.forEach((c, idx) => {
                  ghnHtml += <a href="https://nhanh.ghn.vn/lastmile/trip-detail/" target="_blank" style="color:var(--success);text-decoration:underline;"><strong></strong></a>;
                  if (idx < codes.length - 1) ghnHtml += <span style="color:#64748b;">|</span>;
              });
              """
    code, n = re.subn(search2, lambda m: replace2, code, flags=re.DOTALL)
    if n > 0:
        with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
            f.write(code)
        print("Patched successfully!")
    else:
        print("Still not found!")
