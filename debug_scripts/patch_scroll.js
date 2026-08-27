const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Update toggleVirtualTrip
code = code.replace(
    'if (typeof renderLastmile === \'function\') renderLastmile();',
    'if (typeof renderLastmile === \'function\') renderLastmile(true);'
);

// 2. Update renderLastmile signature
code = code.replace(
    'function renderLastmile() {',
    'function renderLastmile(preserveScroll = false) {'
);

// 3. Save scroll position in renderLastmile
const saveScrollStr = `    var container = document.getElementById('lastmileContainer');
    let scrollPos = 0;
    if (preserveScroll && container) {
        const existingScroll = container.querySelector('.table-scroll');
        if (existingScroll) scrollPos = existingScroll.scrollTop;
    }`;
code = code.replace(
    'var container = document.getElementById(\'lastmileContainer\');',
    saveScrollStr
);

// 4. Restore scroll position in renderLastmile
const restoreScrollStr = `    container.innerHTML = html;
    if (preserveScroll && scrollPos > 0) {
        setTimeout(() => {
            const newScroll = container.querySelector('.table-scroll');
            if (newScroll) newScroll.scrollTop = scrollPos;
        }, 0);
    }`;
code = code.replace(
    'container.innerHTML = html;',
    restoreScrollStr
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Scroll patch applied');
