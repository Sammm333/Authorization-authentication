# 🔐 Auth Portal

> ⚠️ **This project is currently under active development. Some features may be incomplete or subject to change.**

A production-ready authentication system built with FastAPI, featuring JWT tokens, Google OAuth2, role-based access control, and a full admin panel.

---

## ✨ Features

- **JWT Authentication** — Secure login and registration with access + refresh tokens
- **Google OAuth2** — One-click sign in with Google
- **Role-Based Access Control** — User and Admin roles
- **Admin Panel** — Ban/unban users, change roles, delete accounts
- **Brute Force Protection** — Rate limiting (5 attempts/minute per IP)
- **Refresh Tokens** — Auto token renewal (7-day expiry)
- **SQLite Database** — Easy to switch to PostgreSQL for production

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy, Alembic |
| Auth | JWT (python-jose), Bcrypt, Authlib |
| Security | SlowAPI (rate limiting) |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |

---

## 📁 Project Structure

```
auth-portal/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── admin.py
│   │       └── google_auth.py
│   ├── alembic/
│   ├── alembic.ini
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── admin.html
    ├── admin.css
    └── admin.js
```

---

## 🚀 Getting Started

### Requirements
- Python 3.10+
- pip

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/auth-portal.git
cd auth-portal/backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

### Environment Variables

Create `.env` file in `/backend` (use `.env.example` as template):

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_secret_key
```

### Database Setup

```bash
alembic upgrade head
```

### Run Backend

```bash
cd backend
uvicorn app.main:app --reload
```

### Run Frontend

```bash
cd frontend
python -m http.server 3000
```

### API Docs

```
http://localhost:8000/docs
```

---

## 📋 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Register user | No |
| POST | `/api/v1/auth/login` | Login | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| GET | `/api/v1/auth/google` | Google OAuth2 | No |
| GET | `/api/v1/users/me` | Get current user | Yes |
| GET | `/api/v1/admin/dashboard` | Admin dashboard | Admin |
| GET | `/api/v1/admin/users` | Get all users | Admin |
| DELETE | `/api/v1/admin/users/{id}` | Delete user | Admin |
| PATCH | `/api/v1/admin/users/{id}/ban` | Ban user | Admin |
| PATCH | `/api/v1/admin/users/{id}/unban` | Unban user | Admin |
| PATCH | `/api/v1/admin/users/{id}/role` | Change role | Admin |

---

## 🗺 Roadmap

- [ ] Docker + docker-compose
- [ ] PostgreSQL support
- [ ] CI/CD with GitHub Actions
- [ ] AWS deployment
- [ ] User dashboard page
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Samvel Khachatryan**

---

*Built with ❤️ using FastAPI*