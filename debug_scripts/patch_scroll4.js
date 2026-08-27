const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. function renderLastmile
code = code.replace(
    'function renderLastmile() {',
    'function renderLastmile(preserveScroll = false) {'
);
code = code.replace(
    `var container = document.getElementById('lastmileContainer');
    if (!container) { console.error('❌ container not found!'); return; }`,
    `var container = document.getElementById('lastmileContainer');
    let scrollPos = 0;
    if (preserveScroll && container) {
        const existingScroll = container.querySelector('.table-scroll');
        if (existingScroll) scrollPos = existingScroll.scrollTop;
    }
    if (!container) { console.error('❌ container not found!'); return; }`
);
code = code.replace(
    `    }
    html += '</tbody></table></div></div>';
    container.innerHTML = html;
}`,
    `    }
    html += '</tbody></table></div></div>';
    container.innerHTML = html;
    if (preserveScroll && scrollPos > 0) {
        setTimeout(() => {
            const newScroll = container.querySelector('.table-scroll');
            if (newScroll) newScroll.scrollTop = scrollPos;
        }, 0);
    }
}`
);

// 2. toggleVirtualTrip
code = code.replace(
    /if \(typeof renderLastmile === 'function'\) renderLastmile\(\);/g,
    'if (typeof renderLastmile === \'function\') renderLastmile(true);'
);

// 3. unmatchFromLastmile
code = code.replace(
    'updateNccTripCode(nccIndex, newValue);\r\n      renderLastmile();',
    'updateNccTripCode(nccIndex, newValue);\r\n      renderLastmile(true);'
);
code = code.replace(
    'updateNccTripCode(nccIndex, newValue);\n      renderLastmile();',
    'updateNccTripCode(nccIndex, newValue);\n      renderLastmile(true);'
);


fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Scroll patch 4 applied');
