const fs = require('fs');
let code = fs.readFileSync('test_parse12.js', 'utf8');
code = code.replace('let currentUser={};', 'let currentUser={};\nfunction detectWH(s) { if(s.includes("hải phòng")) return "Hải Phòng"; if(s.includes("hải dương")) return "Hải Dương"; return ""; } function normalizeStr(s){return s;}');
fs.writeFileSync('test_parse13.js', code);
