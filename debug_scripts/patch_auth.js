const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const CLIENT_ID = '854267293470-9pka8g6k8ksvft2n83o83vmh3qnbeu87.apps.googleusercontent.com';

// 1. Chèn thư viện Google Identity Services vào head
if (!code.includes('accounts.google.com/gsi/client')) {
    code = code.replace('</head>', '    <script src="https://accounts.google.com/gsi/client" async defer></script>\n</head>');
}

// 2. Chèn CSS và HTML cho màn hình đăng nhập
const authHtml = `
    <!-- ========== MÀN HÌNH ĐĂNG NHẬP ========== -->
    <div id="authOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-primary); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.3s ease;">
        <div style="background: var(--bg-card); padding: 40px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.5); text-align: center; max-width: 400px; width: 90%;">
            <div style="font-size: 32px; font-weight: 900; margin-bottom: 10px; color: var(--text-primary);">Odo Dashboard</div>
            <p style="color: var(--text-secondary); margin-bottom: 30px; font-size: 14px;">Vui lòng đăng nhập bằng tài khoản Google (Gmail) để tiếp tục sử dụng hệ thống và định danh thao tác.</p>
            <div id="g_id_onload"
                 data-client_id="${CLIENT_ID}"
                 data-context="signin"
                 data-ux_mode="popup"
                 data-callback="handleGoogleLogin"
                 data-auto_prompt="false">
            </div>
            <div class="g_id_signin"
                 data-type="standard"
                 data-shape="rectangular"
                 data-theme="filled_black"
                 data-text="signin_with"
                 data-size="large"
                 data-logo_alignment="left">
            </div>
        </div>
    </div>
`;

if (!code.includes('id="authOverlay"')) {
    code = code.replace('<div class="container">', authHtml + '\n<div class="container">');
}

// 3. Chèn Logic xử lý đăng nhập vào cuối thẻ <script>
const authScript = `
// ==================== GOOGLE AUTHENTICATION ====================
let currentUser = null;

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function handleGoogleLogin(response) {
    const payload = parseJwt(response.credential);
    if (payload && payload.email) {
        currentUser = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        };
        localStorage.setItem('GHN_USER_INFO', JSON.stringify(currentUser));
        
        // Ẩn màn hình đăng nhập
        const overlay = document.getElementById('authOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 300);
        }
        
        showToast('✅', 'Đăng nhập thành công: ' + currentUser.name);
        
        // Thêm tên người dùng vào header nếu chưa có
        renderUserInfo();
    }
}

function renderUserInfo() {
    let userInfoEl = document.getElementById('userInfoDisplay');
    if (!userInfoEl) {
        userInfoEl = document.createElement('div');
        userInfoEl.id = 'userInfoDisplay';
        userInfoEl.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text-secondary);';
        
        const rightPanel = document.querySelector('.header-right');
        if (rightPanel) {
            rightPanel.insertBefore(userInfoEl, rightPanel.firstChild);
        }
    }
    if (currentUser) {
        userInfoEl.innerHTML = '<img src="' + currentUser.picture + '" style="width:24px;height:24px;border-radius:50%;" referrerpolicy="no-referrer"> <span>' + escapeHtml(currentUser.name) + '</span>';
    }
}

function checkAuthOnLoad() {
    try {
        const saved = localStorage.getItem('GHN_USER_INFO');
        if (saved) {
            currentUser = JSON.parse(saved);
            const overlay = document.getElementById('authOverlay');
            if (overlay) overlay.style.display = 'none';
            renderUserInfo();
        }
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', checkAuthOnLoad);
`;

if (!code.includes('function handleGoogleLogin')) {
    code = code.replace('</script>\n</body>', authScript + '\n</script>\n</body>');
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Auth HTML/JS added.');
