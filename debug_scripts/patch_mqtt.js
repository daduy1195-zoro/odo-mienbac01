const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');
code = code.replace(
    'new Paho.MQTT.Client("broker.emqx.io", 8084, clientId)',
    'new Paho.MQTT.Client("test.mosquitto.org", 8081, clientId)'
);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('MQTT patched');
