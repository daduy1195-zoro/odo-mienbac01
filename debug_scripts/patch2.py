import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the block
search_block = r"// Luôn luu d? li?u dã làm ODO \(k? c? chua t? d?ng ghép du?c mã NV\)\s*employeeData\.push\(entry\);\s*if \(!archivedOdoMap\.has\(entry\.id\)\) \{\s*const archiveEntry = \{ \.\.\.entry \};\s*delete archiveEntry\.dateObj;\s*newOdoToArchive\.push\(archiveEntry\);\s*\}\s*\}\s*// ?? B? sung d? li?u cu t? archive \(ch? nh?ng ngày KHÔNG có trong fresh data\)\s*const freshIds = new Set\(employeeData\.map\(e => e\.id\)\);\s*archivedOdo\.forEach\(arc => \{\s*if \(arc\.id && !freshIds\.has\(arc\.id\)\) \{\s*// Ph?c h?i dateObj\s*if \(arc\.dateStr\) \{\s*const dp = String\(arc\.dateStr\)\.match\(/\\(\\d\{1,2\}\\)\[\\\\/\\\\-\]\\(\\d\{1,2\}\\)\[\\\\/\\\\-\]\\(\\d\{4\}\\)/\);\s*if \(dp\) arc\.dateObj = new Date\(parseInt\(dp\[3\]\), parseInt\(dp\[2\]\) - 1, parseInt\(dp\[1\]\)\);\s*\}\s*employeeData\.push\(arc\);\s*\}\s*\}\);\s*if \(newOdoToArchive\.length > 0\) saveToArchive\('odo_data', newOdoToArchive\);"

replace_block = """// Luôn luu d? li?u dã làm ODO
            if (!dedupeSet.has(entry.id)) {
                dedupeSet.add(entry.id);
                employeeData.push(entry);
            }
        }"""

code = re.sub(search_block, replace_block, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patch done!")
