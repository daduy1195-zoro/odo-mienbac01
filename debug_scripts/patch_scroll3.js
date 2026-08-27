const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

function patchRenderFunction(code, funcName) {
    const fnStartRegex = new RegExp(`function ${funcName}\\(\\) \\{`);
    code = code.replace(fnStartRegex, `function ${funcName}(preserveScroll = false) {`);
    
    // Find the container = document.getElementById line inside the function
    const containerRegex = new RegExp(`var container = document.getElementById\\([^)]+\\);`);
    let pos = code.indexOf(`function ${funcName}(preserveScroll`);
    let containerMatch = code.substring(pos).match(containerRegex);
    if(containerMatch) {
        let replacement = containerMatch[0] + `
    let scrollPos = 0;
    if (preserveScroll && container) {
        const existingScroll = container.querySelector('.table-scroll');
        if (existingScroll) scrollPos = existingScroll.scrollTop;
    }`;
        code = code.substring(0, pos) + code.substring(pos).replace(containerMatch[0], replacement);
    }
    
    // Find the container.innerHTML = html inside the function
    const htmlRegex = /container\.innerHTML = html;/;
    let htmlMatch = code.substring(pos).match(htmlRegex);
    if(htmlMatch) {
        let replacement = htmlMatch[0] + `
    if (preserveScroll && scrollPos > 0) {
        setTimeout(() => {
            const newScroll = container.querySelector('.table-scroll');
            if (newScroll) newScroll.scrollTop = scrollPos;
        }, 0);
    }`;
        code = code.substring(0, pos) + code.substring(pos).replace(htmlMatch[0], replacement);
    }
    
    return code;
}

code = patchRenderFunction(code, 'renderLastmile');
code = patchRenderFunction(code, 'renderNccTrip');

// Change calls inside toggleVirtualTrip and unmatchFromLastmile
code = code.replace(/if \(typeof renderLastmile === 'function'\) renderLastmile\(\);/g, "if (typeof renderLastmile === 'function') renderLastmile(true);");
code = code.replace(/updateNccTripCode\(nccIndex, newValue\);\s*renderLastmile\(\);/g, "updateNccTripCode(nccIndex, newValue);\n        renderLastmile(true);");

// And for updateNccTripNote and updateNccTripCode -> renderNccTrip()
code = code.replace(/if \(typeof renderNccTrip === 'function'\) renderNccTrip\(\);/g, "if (typeof renderNccTrip === 'function') renderNccTrip(true);");

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Scroll patch 3 applied');
