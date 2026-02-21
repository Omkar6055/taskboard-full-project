# TaskBoard — Full-Stack Web App with Authentication & Dashboard

A production-grade full-stack task management app built with **Next.js 14** (App Router) + **Express.js**, featuring JWT authentication, bcrypt password hashing, and full CRUD for tasks.

---

## Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | Next.js 14, React 18, TypeScript, TailwindCSS       |
| Backend   | Node.js, Express.js                                 |
| Database  | MongoDB (Mongoose ODM)                              |
| Auth      | JWT (jsonwebtoken) + bcryptjs                       |
| Validation| express-validator (server), react-hook-form + Zod (client) |

---

## Project Structure

```
project/
├── backend/
│   └── src/
│       ├── server.js           # Entry point, Express app
│       ├── models/
│       │   ├── User.js         # Mongoose User schema + bcrypt hooks
│       │   └── Task.js         # Mongoose Task schema
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── profileController.js
│       │   └── taskController.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── profile.js
│       │   └── tasks.js
│       └── middleware/
│           ├── auth.js         # JWT protect middleware
│           ├── validate.js     # express-validator helper
│           └── errorHandler.js # Global error handler
└── frontend/
    └── src/
        ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx        # Redirects to /auth/login
│       │   ├── auth/
│       │   │   ├── login/page.tsx
│       │   │   └── register/page.tsx
│       │   └── dashboard/
│       │       ├── layout.tsx  # ProtectedRoute wrapper
│       │       ├── page.tsx    # Overview / stats
│       │       ├── tasks/page.tsx
│       │       └── profile/page.tsx
│       ├── components/
│       │   ├── auth/
│       │   │   ├── AuthProvider.tsx
│       │   │   └── ProtectedRoute.tsx
│       │   ├── layout/Sidebar.tsx
│       │   └── dashboard/TaskModal.tsx
│       ├── hooks/useAuth.ts
│       ├── lib/
│       │   ├── axios.ts        # Axios instance with JWT interceptor
│       │   ├── auth.ts
│       │   ├── tasks.ts
│       │   └── profile.ts
│       └── types/index.ts
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas URI)

### Backend Setup

```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on :5000
```

**`.env` variables:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskboard
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev            # starts on :3000
```

**Register** `POST /api/auth/register`
```json
// Request
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }

// Response 201
{ "message": "Account created successfully.", "token": "<jwt>", "user": { "_id": "...", "name": "Jane Doe", ... } }
```

**Login** `POST /api/auth/login`
```json
// Request
{ "email": "jane@example.com", "password": "secret123" }

// Response 200
{ "message": "Logged in successfully.", "token": "<jwt>", "user": { ... } }
```

---

**Update Profile** `PUT /api/profile`
```json
// Request (all fields optional)
{ "name": "Jane Smith", "bio": "Developer", "avatar": "https://..." }

// Response 200
{ "message": "Profile updated.", "user": { ... } }
```

**Change Password** `PUT /api/profile/password`
```json
// Request
{ "currentPassword": "secret123", "newPassword": "newSecret456" }

// Response 200
{ "message": "Password changed successfully." }
```

---

### Tasks (CRUD)

All routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (with search/filter/pagination) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

---

## Security Practices

- **Passwords** hashed with `bcryptjs` (salt rounds: 12) — never stored in plain text
- **JWT** signed with a secret key; validated on every protected request via middleware
- **`password` field excluded** from all User queries by default (`select: false`)
- **Input validation** on both server (express-validator) and client (Zod)
- **HTTP 401** automatically returned for missing/expired/invalid tokens
- **MongoDB injection** prevented by Mongoose schema typing
- **CORS** configured to only allow the frontend origin

---

## Scaling Notes for Production

### Frontend → Backend Integration

1. **API Gateway / Load Balancer** — Place Nginx or an AWS ALB in front of N Express instances. The Next.js frontend points to the gateway URL, not a single server.

2. **Stateless JWT** — Because tokens carry all auth state, any backend pod can verify them without shared session storage.

3. **Next.js API Routes / BFF pattern** — For production, move sensitive API calls behind Next.js Route Handlers (`app/api/*`) so the JWT secret never leaves the server and the browser only holds a `HttpOnly` cookie instead of a cookie accessible to JavaScript.

4. **Environment-driven config** — All secrets in environment variables (`.env` / secrets manager). Zero hardcoded values.

5. **Database scaling** — MongoDB Atlas with replica sets + read scaling. Add Mongoose connection pooling options (`maxPoolSize`). For relational data, swap to Postgres with Prisma using the same controller pattern.

6. **Caching** — Add Redis in front of the `/api/tasks` listing endpoint with per-user cache keys; invalidate on write.

7. **Rate limiting** — Add `express-rate-limit` on auth routes to prevent brute-force attacks.

9. **CI/CD** — Docker-compose for local dev; separate Dockerfiles for frontend and backend. Deploy to Kubernetes or Railway/Render for production.

10. **Monitoring** — Integrate Sentry for error tracking; Prometheus + Grafana for metrics.

11. **Token rotation** — Implement refresh tokens stored in `HttpOnly` cookies to reduce access token lifetime to 15 minutes while keeping UX seamless.

---

## Screenshots

<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/d05ccada-11f4-41aa-8d57-f7a18be0b9dd" />
<img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/952517d3-4bd7-4546-81c1-53de119c3123" />
<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/8f30eb7e-9915-4165-a858-a489998363e8" />
<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/a6fdd0ea-fa5f-4025-9ebe-660791374064" />
<img width="1919" height="931" alt="image" src="https://github.com/user-attachments/assets/3ba09078-4702-438f-a343-959295d467cb" />





