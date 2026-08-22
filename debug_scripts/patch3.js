const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const s3 = `      var matchedTripCodes = new Set();
      var manualTripCodes = new Set();
      var tripNccMap = new Map();
      if (typeof nccTripData !== 'undefined') {
          for (var n = 0; n < nccTripData.length; n++) {
              if (nccTripData[n].ghnTripCode) {
                  const cUp = String(nccTripData[n].ghnTripCode).toUpperCase();
                  if (!['OFF', 'GHN OFF', 'GHN_OFF', 'NCC OFF', 'NCC_OFF', 'PHẠT', 'PHAT'].includes(cUp)) {
                      const codes = String(nccTripData[n].ghnTripCode).split('|').map(x => x.trim()).filter(x => x);
                        codes.forEach(c => {
                            matchedTripCodes.add(c);
                            tripNccMap.set(c, nccTripData[n].ncc);
                            if (nccTripData[n].isManualMatch) manualTripCodes.add(c);
                        });
                  }
              }
          }
      }`;

const r3 = `      var matchedTripCodes = new Set();
      var manualTripCodes = new Set();
      var tripNccMap = new Map();
      var tripToNccIndex = new Map();
      if (typeof nccTripData !== 'undefined') {
          for (var n = 0; n < nccTripData.length; n++) {
              if (nccTripData[n].ghnTripCode) {
                  const cUp = String(nccTripData[n].ghnTripCode).toUpperCase();
                  if (!['OFF', 'GHN OFF', 'GHN_OFF', 'NCC OFF', 'NCC_OFF', 'PHẠT', 'PHAT'].includes(cUp)) {
                      const codes = String(nccTripData[n].ghnTripCode).split('|').map(x => x.trim()).filter(x => x);
                        codes.forEach(c => {
                            matchedTripCodes.add(c);
                            tripNccMap.set(c, nccTripData[n].ncc);
                            tripToNccIndex.set(c, n);
                            if (nccTripData[n].isManualMatch) manualTripCodes.add(c);
                        });
                  }
              }
          }
      }`;

code = code.replace(s3, r3);
fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
