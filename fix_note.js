const fs = require("fs");
let content = fs.readFileSync("index.html", "utf8");

const parseTarget = `                matchedTripCode = overrides[finalKey];
            }
        } catch(e) {}`;
const parseRep = `                matchedTripCode = overrides[finalKey];
            }
            const notes = JSON.parse(localStorage.getItem("GHN_NCC_TRIP_NOTES") || "{}");
            if (notes[finalKey] !== undefined) {
                tripNote = notes[finalKey];
            }
        } catch(e) {}`;

content = content.replace(parseTarget, parseRep);
content = content.replace("let matchedTripCode = '';", "let matchedTripCode = '';\n        let tripNote = '';");
content = content.replace("ghnTripCode: matchedTripCode,", "ghnTripCode: matchedTripCode,\n            note: tripNote,");

const funcTarget = `function updateNccTripCode(index, value) {`;
const funcRep = `function updateNccTripNote(index, value) {
    if (nccTripData[index]) {
        nccTripData[index].note = value;
        try {
            const notes = JSON.parse(localStorage.getItem("GHN_NCC_TRIP_NOTES") || "{}");
            const r = nccTripData[index];
            const key = \`\${r.ncc}_\${r.plate}_\${r.dateStr}_\${r.sourceRow}\`;
            if (value) {
                notes[key] = value;
            } else {
                delete notes[key];
            }
            localStorage.setItem("GHN_NCC_TRIP_NOTES", JSON.stringify(notes));
        } catch(e) {}
    }
}

function updateNccTripCode(index, value) {`;
content = content.replace(funcTarget, funcRep);

const tdTarget = `                <td style="font-weight:bold;">\${statusHtml}</td>
            </tr>`;
const tdRep = `                <td style="font-weight:bold;">\${statusHtml}</td>
                <td><input type="text" class="form-control" style="font-size:12px; height:26px; padding:2px 6px; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); width:150px;" placeholder="Ghi chú..." onchange="updateNccTripNote(\${r.originalIndex}, this.value)" value="\${escapeHtml(r.note || '')}"></td>
            </tr>`;
content = content.replace(tdTarget, tdRep);

fs.writeFileSync("index.html", content);
console.log("Notes feature added.");
