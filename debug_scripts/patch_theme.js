const fs = require('fs');
let html = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const lightModeCss = `
        :root.light-mode {
            --bg-primary: #f0f4f4;
            --bg-secondary: #e0e8e8;
            --bg-card: #ffffff;
            --bg-card-hover: #f8fafa;
            --border: #d0dcdc;
            --text-primary: #1a2b2b;
            --text-secondary: #4a6666;
            --text-muted: #88a3a3;
            --accent: #0f8f81;
            --accent-glow: rgba(15, 143, 129, 0.2);
            --shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
`;

if (!html.includes(':root.light-mode')) {
    html = html.replace('</style>', lightModeCss + '</style>');
}

const oldHeaderRight = `<div class="header-right">
            <div id="onlineCounter" style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 20px; font-size: 11px; font-weight: 600; color: #10b981; cursor: help; margin-bottom: 4px;" title="Số người đang mở trang web này">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; animation: pulse-green 2s infinite;"></span>
                <span id="onlineCountText">Đang truy cập: 1</span>
            </div>
            <div class="status-badge">
                <span class="status-dot"></span>
                <span id="lastRefresh">Đang tải...</span>
            </div>
            <span class="countdown" id="countdown"></span>
        </div>`;

const newHeaderRight = `<div class="header-right" style="flex-direction: row; gap: 16px;">
            <button id="themeToggleBtn" onclick="toggleTheme()" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 50%; width: 44px; height: 44px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-primary); transition: 0.3s; box-shadow: var(--shadow);">
                <span id="themeIcon" style="font-size: 20px;">🌙</span>
            </button>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                <div id="onlineCounter" style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 20px; font-size: 11px; font-weight: 600; color: #10b981; cursor: help; margin-bottom: 4px;" title="Số người đang mở trang web này">
                    <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; animation: pulse-green 2s infinite;"></span>
                    <span id="onlineCountText">Đang truy cập: 1</span>
                </div>
                <div class="status-badge">
                    <span class="status-dot"></span>
                    <span id="lastRefresh">Đang tải...</span>
                </div>
                <span class="countdown" id="countdown"></span>
            </div>
        </div>`;

// Use replace with a fallback
let normalizedHtml = html.replace(/\r\n/g, '\n');
let normalizedOldHeaderRight = oldHeaderRight.replace(/\r\n/g, '\n');

if (normalizedHtml.includes(normalizedOldHeaderRight)) {
    html = normalizedHtml.replace(normalizedOldHeaderRight, newHeaderRight);
    console.log("Replaced header right!");
} else {
    console.log("Could not find old header right!");
}

const themeScript = `
function toggleTheme() {
    const root = document.documentElement;
    const isLight = root.classList.toggle('light-mode');
    const icon = document.getElementById('themeIcon');
    if (isLight) {
        icon.textContent = '☀️';
        localStorage.setItem('odoTheme', 'light');
    } else {
        icon.textContent = '🌙';
        localStorage.setItem('odoTheme', 'dark');
    }
}
// Load theme on startup
(function() {
    if (localStorage.getItem('odoTheme') === 'light') {
        document.documentElement.classList.add('light-mode');
        window.addEventListener('DOMContentLoaded', () => {
            const icon = document.getElementById('themeIcon');
            if(icon) icon.textContent = '☀️';
        });
    }
})();
`;

if (!html.includes('function toggleTheme()')) {
    html = html.replace('<script>', '<script>\n' + themeScript);
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', html);
console.log("Patch completed");
