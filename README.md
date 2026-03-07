# 🔐 Auth Portal

> ⚠️ **This project is currently under active development. Some features may be incomplete or subject to change.**

A production-ready authentication system built with FastAPI, featuring JWT tokens, Google OAuth2, role-based access control, and a full admin panel — served through a single Nginx reverse proxy.

---

## ✨ Features

- **JWT Authentication** — Secure login and registration with access + refresh tokens
- **Google OAuth2** — One-click sign in with Google
- **Role-Based Access Control** — User and Admin roles
- **Admin Panel** — Ban/unban users, change roles, delete accounts
- **Brute Force Protection** — Rate limiting (5 attempts/minute per IP)
- **Refresh Tokens** — Auto token renewal (7-day expiry)
- **SQLite Database** — Easy to switch to PostgreSQL for production
- **Docker Support** — Run everything with a single command
- **Nginx Reverse Proxy** — Single port entry point for frontend and backend

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy, Alembic |
| Auth | JWT (python-jose), Bcrypt, Authlib |
| Security | SlowAPI (rate limiting) |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |
| DevOps | Docker, Docker Compose, Nginx |

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
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
├── docker-compose.yml
├── nginx.conf
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Option 1 — Docker (Recommended)

The easiest way to run the project.

**Requirements:**
- Docker
- Docker Compose

**Steps:**

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/auth-portal.git
cd auth-portal

# 2. Create .env file in /backend
cp backend/.env.example backend/.env
# Fill in your values in .env

# 3. Run everything
docker compose up --build
```

- **Frontend + Backend:** `http://localhost`
- **API Docs:** `http://localhost/docs`

**Stop:**
```bash
docker compose down
```

---

### Option 2 — Manual Setup

**Requirements:**
- Python 3.10+
- pip

**Steps:**

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/auth-portal.git
cd auth-portal/backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env
# Fill in your values

# 5. Run database migrations
alembic upgrade head

# 6. Start backend
uvicorn app.main:app --reload

# 7. Start frontend (new terminal)
cd ../frontend
python -m http.server 3000
```

---

## 🔑 Environment Variables

Create `.env` file in `/backend` using `.env.example` as template:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_secret_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
BACKEND_URL=http://localhost
FRONTEND_URL=http://localhost
```

### Getting Google OAuth2 Credentials:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable Google OAuth2 API
4. Create OAuth2 credentials
5. Add `http://localhost/api/v1/auth/google/callback` to **Authorized redirect URIs**
6. Add `http://localhost` to **Authorized JavaScript origins**

---

## 🌐 Nginx Architecture

All traffic goes through a single Nginx reverse proxy on port 80:

```
Browser → localhost
              ↓
           Nginx :80
          /        \
    frontend      /api/ → backend:8000
```

| URL | Description |
|---|---|
| `http://localhost/` | Frontend |
| `http://localhost/api/` | Backend API |
| `http://localhost/docs` | Swagger UI |

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

## 👑 Admin Setup

Admin credentials are set via `.env` file:

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

Register with these exact credentials to get admin role automatically.

---

## 🗺 Roadmap

- [ ] PostgreSQL support
- [ ] AWS deployment guide
- [ ] CI/CD with GitHub Actions
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