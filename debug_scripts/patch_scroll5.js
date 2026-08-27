const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

let idx = code.indexOf('function renderLastmile(preserveScroll = false) {');
if (idx > -1) {
    let sub = code.substring(idx);
    let match1 = sub.match(/var container = document\.getElementById\('lastmileContainer'\);[\s\S]*?if \(\!container\) \{ console\.error\('❌ container not found!'\); return; \}/);
    if (match1) {
        let rep1 = `var container = document.getElementById('lastmileContainer');
    let scrollPos = 0;
    if (preserveScroll && container) {
        const existingScroll = container.querySelector('.table-scroll');
        if (existingScroll) scrollPos = existingScroll.scrollTop;
    }
    if (!container) { console.error('❌ container not found!'); return; }`;
        code = code.substring(0, idx) + sub.replace(match1[0], rep1);
    }
    
    sub = code.substring(idx);
    let match2 = sub.match(/html \+= '<\/tbody><\/table><\/div><\/div>';[\s\S]*?container\.innerHTML = html;[\s\S]*?\}/);
    if (match2) {
        let rep2 = `html += '</tbody></table></div></div>';
    container.innerHTML = html;
    if (preserveScroll && scrollPos > 0) {
        setTimeout(() => {
            const newScroll = container.querySelector('.table-scroll');
            if (newScroll) newScroll.scrollTop = scrollPos;
        }, 0);
    }
}`;
        code = code.substring(0, idx) + sub.replace(match2[0], rep2);
    }
}
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Scroll patch 5 applied');
