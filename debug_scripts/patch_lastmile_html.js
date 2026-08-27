const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    `    container.innerHTML = '<div class="ranking-grid" style="grid-template-columns:1fr">' + html + '</div>';\r\n    console.log('✅ renderLastmile done!');`,
    `    container.innerHTML = '<div class="ranking-grid" style="grid-template-columns:1fr">' + html + '</div>';
    if (preserveScroll && scrollPos > 0) {
        setTimeout(() => {
            const newScroll = container.querySelector('.table-scroll');
            if (newScroll) newScroll.scrollTop = scrollPos;
        }, 0);
    }
    console.log('✅ renderLastmile done!');`
);

code = code.replace(
    `    container.innerHTML = '<div class="ranking-grid" style="grid-template-columns:1fr">' + html + '</div>';\n    console.log('✅ renderLastmile done!');`,
    `    container.innerHTML = '<div class="ranking-grid" style="grid-template-columns:1fr">' + html + '</div>';
    if (preserveScroll && scrollPos > 0) {
        setTimeout(() => {
            const newScroll = container.querySelector('.table-scroll');
            if (newScroll) newScroll.scrollTop = scrollPos;
        }, 0);
    }
    console.log('✅ renderLastmile done!');`
);


fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Patch HTML applied');
