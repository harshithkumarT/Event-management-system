# 🎫 EventFlow — Event Management System

A full-stack **Event Management System** built with the **PERN stack** (PostgreSQL, Express.js, React, Node.js). It allows users to browse events, book tickets, and manage their bookings — while admins can create events, manage users, and view analytics from a dedicated dashboard.

🚀 **Live Demo:** [https://event-management-system-frontend-gupi.onrender.com](https://event-management-system-frontend-gupi.onrender.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

### 👤 User Features
- **User Registration & Login** — Secure authentication with JWT (access + refresh tokens)
- **Browse Events** — View upcoming events with search and category filters
- **Event Details** — See full event info including venue, date, price, and availability
- **Book Tickets** — Reserve seats for events with real-time availability updates
- **My Bookings** — View, track, and manage all your bookings
- **Notifications** — Receive real-time notifications for booking updates
- **Profile Management** — Update your name and profile image

### 🔧 Admin Features
- **Admin Dashboard** — Overview with total events, bookings, revenue, and pending actions
- **Manage Events** — Create, edit, and delete events with image uploads
- **Manage Users** — View all users, change roles, and toggle active status
- **Manage Bookings** — View and update booking statuses (confirm, cancel, reject)
- **Analytics** — Visual charts for revenue trends and event category distribution
- **Revenue Reports** — Generate and download PDF revenue reports

### 🔒 Security
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Helmet security headers
- Role-based access control (user / admin)
- Input validation with express-validator

---

## 🛠 Tech Stack

| Layer      | Technology                                                  |
| ---------- | ----------------------------------------------------------- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Recharts     |
| **Backend**  | Node.js, Express.js, Socket.IO                            |
| **Database** | PostgreSQL (hosted on Supabase)                            |
| **Auth**     | JWT (access + refresh tokens), bcrypt                      |
| **Other**    | Multer (file uploads), PDFKit (reports), Nodemailer, QRCode |

---

## 📁 Project Structure

```
event-management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Socket.IO configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/       # Auth, validation, rate limiter, error handling
│   │   ├── models/           # Database queries (SQL)
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic layer
│   │   ├── utils/            # JWT helpers, async handler, API response
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Server entry point
│   ├── sql/
│   │   └── schema.sql        # Database schema
│   ├── .env.example           # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios HTTP client configuration
│   │   ├── components/       # Reusable UI components & layouts
│   │   ├── context/          # React Context (Auth state management)
│   │   ├── pages/
│   │   │   ├── public/       # Home, Events, Login, Register, About, Contact
│   │   │   ├── user/         # Profile, Bookings, Notifications, Settings
│   │   │   └── admin/        # Dashboard, Events, Users, Bookings, Analytics
│   │   ├── services/         # API service functions
│   │   ├── utils/            # Helper utilities
│   │   ├── App.jsx           # Root component with routing
│   │   └── main.jsx          # Application entry point
│   ├── .env.example           # Environment variable template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📦 Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)
- A **Supabase** account (free tier works) — [Sign up](https://supabase.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/harshithkumar-dev/Event-management-system.git
cd Event-management-system
```

### 2. Install Dependencies

Install packages for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside the `backend/` folder by copying the example:

```bash
cp backend/.env.example backend/.env
```

Then fill in the values:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://event-management-system-frontend-gupi.onrender.com
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_SALT_ROUNDS=12
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="Event Management System <no-reply@example.com>"
SUPABASE_DB_SSL=true
```

> **How to get the DATABASE_URL:**  
> Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → **Settings** → **Database** → **Connection string** → Copy the **URI** and replace `[YOUR-PASSWORD]` with your database password.

### Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend/` folder:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=https://event-management-system-backend-02.onrender.com/api
VITE_SOCKET_URL=https://event-management-system-backend-02.onrender.com
```

---

## 🗄 Database Setup

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open the **SQL Editor**
3. Copy the contents of `backend/sql/schema.sql`
4. Paste and click **Run**

### Option 2: Using Command Line

```bash
cd backend
node -e "
import pg from 'pg';
import fs from 'fs';
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const schema = fs.readFileSync('sql/schema.sql', 'utf8');
await pool.query(schema);
console.log('Database tables created!');
await pool.end();
"
```

### Database Tables

| Table           | Description                             |
| --------------- | --------------------------------------- |
| `users`         | User accounts (name, email, role, etc.) |
| `events`        | Event listings with details & seats     |
| `bookings`      | User ticket bookings for events         |
| `payments`      | Payment transaction records             |
| `notifications` | User notification messages              |

---

## ▶️ Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start at **https://event-management-system-backend-02.onrender.com**

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will start at **https://event-management-system-frontend-gupi.onrender.com**

> 💡 **Admin Setup:** Register via `/admin/register` to create an admin account.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description               | Auth Required |
| ------ | -------------------- | ------------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user       | No            |
| POST   | `/api/auth/login`    | Login and receive tokens  | No            |
| POST   | `/api/auth/logout`   | Logout and clear cookies  | No            |
| POST   | `/api/auth/refresh`  | Refresh the access token  | No            |
| GET    | `/api/auth/me`       | Get current user profile  | Yes           |
| PUT    | `/api/auth/me`       | Update profile            | Yes           |

### Events

| Method | Endpoint            | Description             | Auth Required |
| ------ | ------------------- | ----------------------- | ------------- |
| GET    | `/api/events`       | List all events         | No            |
| GET    | `/api/events/:id`   | Get event details       | No            |
| POST   | `/api/events`       | Create a new event      | Admin         |
| PUT    | `/api/events/:id`   | Update an event         | Admin         |
| DELETE | `/api/events/:id`   | Delete an event         | Admin         |

### Bookings

| Method | Endpoint              | Description               | Auth Required |
| ------ | --------------------- | ------------------------- | ------------- |
| GET    | `/api/bookings`       | Get user's bookings       | Yes           |
| POST   | `/api/bookings`       | Create a new booking      | Yes           |
| PATCH  | `/api/bookings/:id`   | Update booking status     | Admin         |

### Admin

| Method | Endpoint                     | Description             | Auth Required |
| ------ | ---------------------------- | ----------------------- | ------------- |
| GET    | `/api/admin/analytics`       | Dashboard analytics     | Admin         |
| GET    | `/api/admin/users`           | List all users          | Admin         |
| PATCH  | `/api/admin/users/:id/role`  | Change user role        | Admin         |
| PATCH  | `/api/admin/users/:id/status`| Toggle user active status | Admin       |
| GET    | `/api/admin/revenue-report`  | Download revenue PDF    | Admin         |

### Other

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| GET    | `/api/notifications` | Get user notifications  | Yes           |
| POST   | `/api/uploads/image` | Upload an image         | Yes           |
| GET    | `/api/health`        | API health check        | No            |

---

## 📸 Screenshots

### Home Page
> The landing page showcasing featured events and hero section

### Events Listing
> Browse all available events with search and category filters

### Admin Dashboard
> Comprehensive admin panel with analytics, event management, and user management

---

## 🧑‍💻 Author

**Harshithkumar T**

- GitHub: [@harshithkumar-dev](https://github.com/harshithkumar-dev)

---

## 📄 License

This project is built for educational and portfolio purposes.
