const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    /onclick="unmatchFromLastmile\(\$\{nccIdx\}, '\$\{r\.tripCode\}'\)"/g,
    'onclick="unmatchFromLastmile(${nccIdx}, \\\'${r.tripCode}\\\', this)"'
);

code = code.replace(
    'window.unmatchFromLastmile = function(nccIndex, tripCode) {',
    'window.unmatchFromLastmile = function(nccIndex, tripCode, btnEl) {'
);

const oldUnmatch = `      updateNccTripCode(nccIndex, newValue);
      renderLastmile(true);`;
      
const newUnmatch = `      updateNccTripCode(nccIndex, newValue);
      
      if (btnEl) {
          const tr = btnEl.closest('tr');
          if (tr && tr.children.length >= 17) {
              const statusCell = tr.children[15];
              statusCell.innerHTML = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
              
              // We also might want to clear the history if there are no more logs. But it's fine, next render will fix it.
          }
      } else {
          renderLastmile(true);
      }`;

code = code.replace(oldUnmatch, newUnmatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Unmatch fast patch applied');
