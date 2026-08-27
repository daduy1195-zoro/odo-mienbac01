const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. In window.unmatchFromLastmile
code = code.replace(
    'updateNccTripCode(nccIndex, newValue);\n        renderLastmile();',
    'updateNccTripCode(nccIndex, newValue);\n        renderLastmile(true);'
);
// Or handle CRLF
code = code.replace(
    /updateNccTripCode\(nccIndex, newValue\);\r?\n        renderLastmile\(\);/,
    'updateNccTripCode(nccIndex, newValue);\n        renderLastmile(true);'
);

// 2. In window.toggleVirtualTrip
code = code.replace(
    /if \(typeof renderLastmile === 'function'\) renderLastmile\(\);/g,
    'if (typeof renderLastmile === \'function\') renderLastmile(true);'
);

// 3. Make sure renderNccTrip uses true in its own actions!
// Wait, when you updateNccTripCode or updateNccTripNote, it calls renderNccTrip().
// Should renderNccTrip also preserve scroll?
// The user might want that later. 
// For now let's just do renderLastmile

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Scroll patch 2 applied');
