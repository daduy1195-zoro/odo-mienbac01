const fs = require("fs");
let content = fs.readFileSync("index.html", "utf8");

const target = `            const note = (r[9] || '').trim();
            const backupStr = (r[10] || '').trim().toUpperCase(); // C?t K = Bi?n s? xe tang cu?ng
            const backupPlates = backupStr ? backupStr.split(/[\\n,;]+/).map(p => String(p).replace(/[\\s\\-\\.]/g, '')).filter(Boolean) : [];
            if (!code || !name) return;
            
            let startDate = null;
            const dateMatch = note.match(/(\\d{1,2})\\/(\\d{1,2})(?:\\/(\\d{2,4}))?/);
            if (dateMatch) {
                const dd = dateMatch[1].padStart(2, '0');
                const mm = dateMatch[2].padStart(2, '0');
                const yy = dateMatch[3] ? (dateMatch[3].length === 2 ? '20' + dateMatch[3] : dateMatch[3]) : new Date().getFullYear();
                startDate = \`\${dd}/\${mm}/\${yy}\`;
            }`;

const replacement = `            // C?t J (r[9]) = Ngày b?t d?u làm vi?c
            const startDateRaw = String(r[9] || '').trim();
            // C?t K (r[10]) = Bi?n s? tang cu?ng
            const backupStr = String(r[10] || '').trim().toUpperCase(); 
            // C?t L (r[11]) = Ghi chú (n?u có)
            let note = String(r[11] || '').trim(); 
            
            // N?u ngu?i dùng l? vi?t Ghi chú vào c?t J (cu), ta chuy?n nó sang note n?u không ph?i là ngày
            if (startDateRaw && !startDateRaw.match(/^\\d{1,2}[\\/\\-]\\d{1,2}/) && (startDateRaw.toLowerCase().includes('ho tro') || startDateRaw.toLowerCase().includes('nghi'))) {
                note = note ? note + " " + startDateRaw : startDateRaw;
            }

            const backupPlates = backupStr ? backupStr.split(/[\\n,;]+/).map(p => String(p).replace(/[\\s\\-\\.]/g, '')).filter(Boolean) : [];
            if (!code || !name) return;
            
            let startDate = null;
            // Parse startDateRaw for DD/MM/YYYY
            const dateMatch = startDateRaw.match(/(\\d{1,2})[\\/\\-](\\d{1,2})(?:[\\/\\-](\\d{2,4}))?/);
            if (dateMatch) {
                const dd = dateMatch[1].padStart(2, '0');
                const mm = dateMatch[2].padStart(2, '0');
                const yy = dateMatch[3] ? (dateMatch[3].length === 2 ? '20' + dateMatch[3] : dateMatch[3]) : new Date().getFullYear();
                startDate = \`\${dd}/\${mm}/\${yy}\`;
            } else if (startDateRaw.includes("Date(")) {
                // Handle raw gviz Date(YYYY, M, D) if leaked
                const dMatch = startDateRaw.match(/Date\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
                if (dMatch) {
                    const yy = dMatch[1];
                    const mm = String(parseInt(dMatch[2]) + 1).padStart(2, '0'); // JS months are 0-indexed
                    const dd = dMatch[3].padStart(2, '0');
                    startDate = \`\${dd}/\${mm}/\${yy}\`;
                }
            }`;

content = content.replace(target, replacement);
fs.writeFileSync("index.html", content);
console.log("Updated columns mapping.");
