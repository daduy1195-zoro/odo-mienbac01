const fs=require('fs');
let c=fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html','utf8');
c = c.replace(
    "3. ?n Ctrl+V d? dán toàn b? d? li?u.');",
    "3. ?n Ctrl+V d? dán toàn b? d? li?u AC và AD.');"
);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
console.log('Patched');
