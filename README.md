# Event Management System

A production-oriented event management platform with a React/Tailwind frontend, an Express/PostgreSQL backend, JWT authentication, realtime notifications, booking workflows, admin analytics, and deployment targets for Vercel, Render, and Supabase PostgreSQL.

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios, React Hook Form, Framer Motion, Socket.IO client
- Backend: Node.js, Express.js ES modules, JWT, bcrypt, Multer, Socket.IO, PDFKit, Nodemailer
- Database: PostgreSQL
- Deployment: Vercel frontend, Render backend, Supabase PostgreSQL

## Folder Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    server.js
    app.js
  sql/
    schema.sql
frontend/
  src/
    api/
    components/
    context/
    pages/
    services/
    utils/
```

## Local Setup

### 1. Database

Create a PostgreSQL database named `event-management-system` and use password `password` for the local development user if you are following the sample connection string.

Set the backend connection string in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/event-management-system
```

For Supabase, replace the connection string with the Supabase PostgreSQL URL and keep `SUPABASE_DB_SSL=true`.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### Backend

- `PORT`
- `CLIENT_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `SUPABASE_DB_SSL`

### Frontend

- `VITE_API_URL`
- `VITE_SOCKET_URL`

## PostgreSQL Schema

The schema is defined in `backend/sql/schema.sql` and includes:

- `users`
- `events`
- `bookings`
- `payments`
- `notifications`

### Relationship Summary

- One user can create many events as an organizer.
- One user can create many bookings.
- One event can have many bookings.
- One booking can have one payment record.
- One user can have many notifications.

### Important Constraints

- `users.email` is unique.
- `bookings` and `payments` use foreign keys for referential integrity.
- Seat counts are managed transactionally during booking and cancellation.

## Authentication Flow

1. User registers or logs in through `/api/auth/register` or `/api/auth/login`.
2. Backend returns an access token and refresh token.
3. Access token is stored in the frontend state/localStorage for API calls.
4. Refresh token is stored in an HTTP-only cookie.
5. On access-token expiry, the frontend calls `/api/auth/refresh` to obtain a new token.
6. Protected routes check the authenticated user role before rendering dashboard pages.

## API Documentation

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `PUT /api/auth/me`

### Events

- `GET /api/events`
- `GET /api/events/featured`
- `GET /api/events/:id`
- `POST /api/events` admin only
- `PUT /api/events/:id` admin only
- `DELETE /api/events/:id` admin only

Query parameters for `GET /api/events`:

- `search`
- `category`
- `date`
- `sort`
- `page`
- `limit`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings/me/history`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id/cancel`
- `GET /api/bookings/admin` admin only
- `PATCH /api/bookings/:id/decision` admin only

### Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

### Admin

- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/status`
- `GET /api/admin/reports/revenue`

### Uploads

- `POST /api/uploads/image`

## Deployment

### Frontend on Vercel

1. Connect the repository in Vercel.
2. Set the root directory to `frontend`.
3. Configure `VITE_API_URL` and `VITE_SOCKET_URL` for the deployed backend.
4. Build command: `npm run build`.
5. Output directory: `dist`.

### Backend on Render

1. Create a new Web Service.
2. Set the root directory to `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add all backend environment variables.
6. Point `CLIENT_URL` to the Vercel deployment URL.

### Database on Supabase

1. Create a Supabase PostgreSQL database.
2. Run the SQL from `backend/sql/schema.sql`.
3. Copy the connection string into `DATABASE_URL`.
4. Ensure SSL is enabled for the production connection.

## Bonus Features Included

- Realtime notifications via Socket.IO
- QR code ticket generation
- Email notification hook
- PDF revenue report export
- Dark/light theme support
- Responsive SaaS-style layouts
- Protected user and admin dashboards

## Notes

- The backend follows a controller/service/model split.
- The frontend uses lazy-loaded routes and reusable UI components.
- The sample code is structured to be production-ready and deployment-friendly, but you should still run dependency installation and end-to-end verification in your target environment before launch.
