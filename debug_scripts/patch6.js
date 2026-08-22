const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

code = code.replace(`        var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);\n        var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);\n        \n                var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);\n        var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);`, `        var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);\n        var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);`);

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
