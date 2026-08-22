import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# 1. Add paho-mqtt script to head
head_search = "</head>"
head_replace = '    <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.min.js"></script>\n</head>'
if head_search in content and 'paho-mqtt' not in content:
    content = content.replace(head_search, head_replace)

# 2. Add css keyframes
css_search = ".countdown { font-size: 11px; color: var(--text-muted); font-weight: 500; }"
css_replace = """.countdown { font-size: 11px; color: var(--text-muted); font-weight: 500; }
        @keyframes pulse-green {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }"""
if css_search in content and 'pulse-green' not in content:
    content = content.replace(css_search, css_replace)

# 3. Add UI element
html_search = """<div class="header-right">
            <div class="status-badge">"""
html_replace = """<div class="header-right">
            <div id="onlineCounter" style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 20px; font-size: 11px; font-weight: 600; color: #10b981; cursor: help; margin-bottom: 4px;" title="Số người đang mở trang web này">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; animation: pulse-green 2s infinite;"></span>
                <span id="onlineCountText">Đang truy cập: 1</span>
            </div>
            <div class="status-badge">"""
if html_search in content and 'onlineCounter' not in content:
    content = content.replace(html_search, html_replace)

# 4. Add initOnlineTracker JS
js_search = "startAutoRefresh();\n});"
js_replace = """startAutoRefresh();
    initOnlineTracker();
});

// ====== ONLINE TRACKER ======
function initOnlineTracker() {
    try {
        const clientId = "odo_" + Math.random().toString(16).substr(2, 8);
        const client = new Paho.MQTT.Client("broker.emqx.io", 8084, clientId);
        let onlineUsers = new Map();
        const topic = "ghn_odo_mienbac01_presence";

        client.onMessageArrived = function(message) {
            if (message.destinationName === topic) {
                try {
                    const data = JSON.parse(message.payloadString);
                    if (data.action === 'ping') {
                        onlineUsers.set(data.clientId, Date.now());
                        updateOnlineCount();
                    } else if (data.action === 'offline') {
                        onlineUsers.delete(data.clientId);
                        updateOnlineCount();
                    }
                } catch(e) {}
            }
        };

        const willMsg = new Paho.MQTT.Message(JSON.stringify({ action: 'offline', clientId: clientId }));
        willMsg.destinationName = topic;
        
        client.connect({
            useSSL: true,
            mqttVersion: 4,
            willMessage: willMsg,
            onSuccess: function() {
                client.subscribe(topic);
                
                setInterval(() => {
                    try {
                        const msg = new Paho.MQTT.Message(JSON.stringify({ action: 'ping', clientId: clientId }));
                        msg.destinationName = topic;
                        client.send(msg);
                        
                        const now = Date.now();
                        for (let [id, time] of onlineUsers.entries()) {
                            if (now - time > 15000) {
                                onlineUsers.delete(id);
                            }
                        }
                        updateOnlineCount();
                    } catch(e){}
                }, 10000);
                
                const msg = new Paho.MQTT.Message(JSON.stringify({ action: 'ping', clientId: clientId }));
                msg.destinationName = topic;
                client.send(msg);
            }
        });

        function updateOnlineCount() {
            const count = Math.max(1, onlineUsers.size);
            const el = document.getElementById('onlineCountText');
            if (el) el.innerHTML = `Đang truy cập: ${count}`;
        }
    } catch(err) {
        console.log("Online tracker disabled:", err);
    }
}"""
if js_search in content and 'initOnlineTracker' not in content:
    content = content.replace(js_search, js_replace)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)
print("Patched completely!")
