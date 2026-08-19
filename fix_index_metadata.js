const fs = require("fs");
let content = fs.readFileSync("index.html", "utf8");

const target = `                const tabGroups = {};
                archiveNccRaw.forEach(r => {
                    const ncc = (r[r.length - 3] || "").toString().trim();
                    const tabName = (r[r.length - 2] || "").toString().trim();
                    const tabGid = (r[r.length - 1] || "").toString().trim();
                    if (!ncc) return;
                    const key = ncc + "|" + tabName;
                    if (!tabGroups[key]) tabGroups[key] = { ncc, tabName, tabGid, rows: [] };
                    // B? 3 c?t metadata cu?i, gi? raw data
                    tabGroups[key].rows.push(r.slice(0, r.length - 3));
                });`;

const replacement = `                const headers = archiveNccRaw[0] || [];
                const nccIdx = headers.indexOf("_ncc");
                const tabIdx = headers.indexOf("_tab_name");
                const gidIdx = headers.indexOf("_tab_gid");
                const numMetadataCols = nccIdx !== -1 ? (headers.length - nccIdx) : 3;

                const tabGroups = {};
                archiveNccRaw.forEach((r, idx) => {
                    if (idx === 0 && r[0] === "Col1") return; // B? qua dòng header
                    const ncc = (nccIdx !== -1 ? r[nccIdx] : r[r.length - 3] || "").toString().trim();
                    const tabName = (tabIdx !== -1 ? r[tabIdx] : r[r.length - 2] || "").toString().trim();
                    const tabGid = (gidIdx !== -1 ? r[gidIdx] : r[r.length - 1] || "").toString().trim();
                    if (!ncc) return;
                    const key = ncc + "|" + tabName;
                    if (!tabGroups[key]) tabGroups[key] = { ncc, tabName, tabGid, rows: [] };
                    // B? các c?t metadata ? cu?i, gi? nguyên raw data
                    tabGroups[key].rows.push(r.slice(0, r.length - numMetadataCols));
                });`;

content = content.replace(target, replacement);
fs.writeFileSync("index.html", content);
console.log("Replaced metadata logic in index.html");
