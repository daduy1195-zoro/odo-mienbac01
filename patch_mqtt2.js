const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace('"broker.emqx.io", 8084, "/mqtt", clientId', '"mqtt.eclipseprojects.io", 443, "/mqtt", clientId');
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Patched MQTT broker to Eclipse 443');
