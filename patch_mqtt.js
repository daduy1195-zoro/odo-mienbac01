const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

if (code.includes('"test.mosquitto.org", 8081')) {
    code = code.replace('"test.mosquitto.org", 8081, clientId', '"broker.emqx.io", 8084, "/mqtt", clientId');
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Patched MQTT broker');
} else {
    console.log('Broker not found');
}
