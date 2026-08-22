const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

code = code.replace("tripNccMap.set(c, nccTripData[n].ncc);", "tripNccMap.set(c, nccTripData[n].ncc);\n                            tripToNccIndex.set(c, n);");
code = code.replace("var tripNccMap = new Map();", "var tripNccMap = new Map();\n      var tripToNccIndex = new Map();");

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
