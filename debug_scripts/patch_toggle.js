const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const oldFunc = `window.toggleVirtualTrip = function(tripCode, isChecked) {
      if (!tripCode) return;
      try {
          var virtuals = JSON.parse(localStorage.getItem('GHN_VIRTUAL_TRIPS') || '{}');
          if (isChecked) virtuals[tripCode] = true;
          else delete virtuals[tripCode];
          localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(virtuals));
          showToast('success', (isChecked ? 'Đã đánh dấu chuyến ảo: ' : 'Đã bỏ chuyến ảo: ') + tripCode);
      } catch(e) {
          console.error('Error saving virtual trip:', e);
      }
  };`;

const newFunc = `window.toggleVirtualTrip = function(tripCode, isChecked) {
      if (!tripCode) return;
      try {
          var virtuals = JSON.parse(localStorage.getItem('GHN_VIRTUAL_TRIPS') || '{}');
          if (isChecked) virtuals[tripCode] = true;
          else delete virtuals[tripCode];
          localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(virtuals));
          showToast('success', (isChecked ? 'Đã đánh dấu chuyến ảo: ' : 'Đã bỏ chuyến ảo: ') + tripCode);
          if (typeof renderLastmile === 'function') renderLastmile();
      } catch(e) {
          console.error('Error saving virtual trip:', e);
      }
  };`;

let normalizedCode = code.replace(/\r\n/g, '\n');
let normalizedOld = oldFunc.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedOld)) {
    normalizedCode = normalizedCode.replace(normalizedOld, newFunc);
    console.log("toggleVirtualTrip patched successfully.");
} else {
    console.log("Could not find toggleVirtualTrip.");
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', normalizedCode);
