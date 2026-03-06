const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// Защита — если не админ редирект на главную
if (!token || role !== 'admin') {
    window.location.href = 'index.html';
}

const API = 'http://127.0.0.1:8000/api/v1';

// Загрузить данные админа
async function loadDashboard() {
    const res = await fetch(`${API}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    document.getElementById('admin-name').innerText = data.username;
}

// Загрузить всех пользователей
async function loadUsers() {
    const res = await fetch(`${API}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await res.json();

    const total = users.length;
    const active = users.filter(u => u.is_active).length;
    const banned = users.filter(u => !u.is_active).length;

    document.getElementById('total-users').innerText = total;
    document.getElementById('active-users').innerText = active;
    document.getElementById('banned-users').innerText = banned;

    const tbody = document.getElementById('users-table');
    tbody.innerHTML = '';

    users.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td><span class="badge ${u.role}">${u.role}</span></td>
                <td><span class="badge ${u.is_active ? 'active' : 'banned'}">${u.is_active ? 'Active' : 'Banned'}</span></td>
                <td>
                    <button class="action-btn delete" onclick="deleteUser(${u.id})">🗑 Delete</button>
                    <button class="action-btn ban" onclick="banUser(${u.id})">⛔ Ban</button>
                    <button class="action-btn unban" onclick="unbanUser(${u.id})">✅ Unban</button>
                    <button class="action-btn role" onclick="changeRole(${u.id})">👑 Make Admin</button>
                </td>
            </tr>
        `;
    });
}

async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    await fetch(`${API}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadUsers();
}

async function banUser(id) {
    await fetch(`${API}/admin/users/${id}/ban`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadUsers();
}

async function unbanUser(id) {
    await fetch(`${API}/admin/users/${id}/unban`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadUsers();
}

async function changeRole(id) {
    await fetch(`${API}/admin/users/${id}/role?role=admin`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadUsers();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

loadDashboard();
loadUsers();