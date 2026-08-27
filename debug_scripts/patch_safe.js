const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');
let lines = code.split(/\r?\n/);

for (let i = 0; i < lines.length; i++) {
    // 1. renderLastmile signature
    if (lines[i] === '  function renderLastmile() {') {
        lines[i] = '  function renderLastmile(preserveScroll = false) {';
    }
    
    // 2. renderLastmile save scroll
    if (lines[i] === "    var container = document.getElementById('lastmileContainer');" && lines[i+1] === "    if (!container) { console.error('❌ container not found!'); return; }") {
        lines[i] = `    var container = document.getElementById('lastmileContainer');
    let scrollPos = 0;
    if (preserveScroll && container) {
        const existingScroll = container.querySelector('.table-scroll');
        if (existingScroll) scrollPos = existingScroll.scrollTop;
    }`;
    }
    
    // 3. renderLastmile restore scroll
    if (lines[i] === "    html += '</tbody></table></div></div>';" && lines[i+1] === "    container.innerHTML = html;") {
        lines[i+1] = `    container.innerHTML = html;
    if (preserveScroll && scrollPos > 0) {
        setTimeout(() => {
            const newScroll = container.querySelector('.table-scroll');
            if (newScroll) newScroll.scrollTop = scrollPos;
        }, 0);
    }`;
    }
    
    // 4. toggleVirtualTrip
    if (lines[i].includes("if (typeof renderLastmile === 'function') renderLastmile();")) {
        lines[i] = lines[i].replace("if (typeof renderLastmile === 'function') renderLastmile();", "if (typeof renderLastmile === 'function') renderLastmile(true);");
    }
    
    // 5. unmatchFromLastmile
    if (lines[i].includes("renderLastmile();") && lines[i-1] && lines[i-1].includes("updateNccTripCode(nccIndex, newValue);")) {
        lines[i] = lines[i].replace("renderLastmile();", "renderLastmile(true);");
    }
    
    // 6. Same for renderNccTrip signature
    if (lines[i] === "function renderNccTrip() {") {
        lines[i] = "function renderNccTrip(preserveScroll = false) {";
    }
    
    // 7. renderNccTrip save scroll
    if (lines[i] === "    const container = document.getElementById('nccTripContainer');" && lines[i+1].includes("if (!isNccTripLoaded) {")) {
        lines[i] = `    const container = document.getElementById('nccTripContainer');
    let scrollPos = 0;
    if (preserveScroll && container) {
        const existingScroll = container.querySelector('.table-scroll');
        if (existingScroll) scrollPos = existingScroll.scrollTop;
    }`;
    }
    
    // 8. renderNccTrip restore scroll
    if (lines[i] === "    html += '</tbody></table></div></div>';" && lines[i+1] === "    container.innerHTML = html;") {
        // Make sure we only do it in renderNccTrip! Wait, is there another?
        // Let's just do it for both if they match. Wait, renderLastmile and renderNccTrip both have this exact sequence!
        // We already handled renderLastmile above. Wait, if it matches again, it will apply it again? Yes, and it's correct for renderNccTrip too!
        lines[i+1] = `    container.innerHTML = html;
    if (preserveScroll && scrollPos > 0) {
        setTimeout(() => {
            const newScroll = container.querySelector('.table-scroll');
            if (newScroll) newScroll.scrollTop = scrollPos;
        }, 0);
    }`;
    }
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', lines.join('\n'));
console.log('Safe patch applied');
