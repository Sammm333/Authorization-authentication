const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

function showToast(message, type) {
    const icon = type === 'success' ? '✓' : '✕';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icon}</span>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// Auto refresh access token every 25 minutes
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
        } else {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    } catch {
        console.log('Could not refresh token');
    }
}

setInterval(refreshAccessToken, 25 * 60 * 1000);

// Google OAuth token
const urlParams = new URLSearchParams(window.location.search);
const googleToken = urlParams.get('token');
if (googleToken) {
    localStorage.setItem('token', googleToken);
    window.history.replaceState({}, document.title, '/');
    setTimeout(() => showToast('Signed in successfully!', 'success'), 500);
}

// LOGIN
document.querySelector('.form-box.login form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.querySelector('input[type="text"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('role', data.role);
            if (data.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                showToast('Signed in successfully!', 'success');
            }
        } else {
            showToast(data.detail || 'Invalid credentials', 'error');
        }
    } catch {
        showToast('Cannot connect to server', 'error');
    }
});

// REGISTER
document.querySelector('.form-box.register form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            showToast('Account created! Please sign in.', 'success');
            container.classList.remove('active');
        } else {
            showToast(data.detail || 'Registration failed', 'error');
        }
    } catch {
        showToast('Cannot connect to server', 'error');
    }
});