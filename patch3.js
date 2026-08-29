const fs=require('fs');
let c=fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html','utf8');
const search = \lert('? Ðã copy ' + copyArr.length + ' dòng!\\n\\nBây gi? hãy:\\n1. M? file ' + label + '\\n2. Click chu?t vào ô d?u tiên c?a c?t AC (ô AC4)\\\\n3. ?n Ctrl+V d? dán toàn b? d? li?u.');\;
const replacement = "alert('? Ðã copy ' + copyArr.length + ' dòng!\\\\n\\\\nBây gi? hãy:\\\\n1. M? file ' + label + '\\\\n2. Click chu?t vào ô d?u tiên c?a c?t AC (ô AC4)\\\\n3. ?n Ctrl+V d? dán toàn b? d? li?u AC và AD.');";
c = c.replace(search, replacement);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
console.log('Patched string literal');
