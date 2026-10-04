# RecordHub — Digital Record System for NGOs

A secure, centralized digital record and operations management system engineered specifically for non-governmental organizations (NGOs), non-profits, and educational initiatives. RecordHub streamlines beneficiary record keeping, dynamic program scheduling, and role-based operational coordination.

---

## 1. Project Overview

NGOs often manage operations across disparate spreadsheets, paper files, and informal groups. **RecordHub** provides an unified, audit-ready platform with:
- **Centralized Authentication & RBAC**: Granular permissions across 4 distinct roles (`admin`, `staff`, `volunteer`, `student`).
- **User Account Management**: Admin-controlled lifecycle for staff, volunteers, and student user accounts.
- **Beneficiary & Student Management**: Complete profile records, educational details, guardian contacts, and enrollment status tracking.
- **Dynamic Program Management**: Flexible creation and management of diverse NGO initiatives (school classes, vocational workshops, awareness drives, camps).
- **Responsive Light-Theme Interface**: A clean, accessible interface designed for daily NGO administration on desktop, tablet, and mobile.
- **Production-Ready Architecture**: Decoupled React SPA frontend and Node.js/Express REST API backend ready for modern cloud hosting.

---

## 2. Tech Stack

- **Frontend**:
  - React 19 + Vite 6
  - React Router v7 (Client-side SPA routing)
  - Axios (HTTP client with JWT interceptors)
  - Lucide React (Clean icon set)
  - Pure Vanilla CSS (Light-theme design system)
- **Backend**:
  - Node.js (v18+) + Express 5
  - MongoDB + Mongoose 9 (Document database)
  - JSON Web Tokens (`jsonwebtoken`) + `bcrypt` password hashing
  - Helmet + Express Rate Limit (API protection)
  - Zod (Strict schema validation)
- **Testing**:
  - Automated Regression Test Suites (96/96 passing tests across Auth, RBAC, Users, Students, Programs)

---

## 3. Folder Structure

```
Digital Record System For NGO's/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets (favicons, SVG icons)
│   ├── src/
│   │   ├── assets/             # Brand logos and images
│   │   ├── components/         # Shared UI (AppShell, Header, Sidebar, AccessDenied)
│   │   ├── context/            # AuthContext (JWT auth state & session management)
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/           # Login, ChangePasswordModal
│   │   │   ├── dashboard/      # Role-specific dashboards (Admin, Staff, Volunteer, Student)
│   │   │   ├── programs/       # Dynamic program creation, editing, filtering & status management
│   │   │   ├── students/       # Beneficiary profiles, forms, details modal & status dialogs
│   │   │   └── users/          # Admin user management, creation & activation controls
│   │   ├── routes/             # AppRoutes, ProtectedRoute, RoleGuard
│   │   ├── services/           # Axios instance (`api.js`) & API service modules
│   │   ├── index.css           # Global design system & component styles (Light mode)
│   │   └── main.jsx            # Application entrypoint
│   ├── .env.example            # Client environment template
│   ├── vercel.json             # Vercel SPA rewrite configuration
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies & build scripts
├── server/                     # Backend API Server (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Database connection (`db.js`) & Environment parser (`env.js`)
│   │   ├── controllers/        # Route controllers (auth, user, student, program)
│   │   ├── middlewares/        # JWT auth, RBAC authorization, error handler, rate limiters
│   │   ├── models/             # Mongoose schemas (User, Student, Program)
│   │   ├── routes/             # Express API routes (`/api/v1/...`)
│   │   ├── scripts/            # Admin seed script & 96-test automated regression runner
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # Password hashing, JWT helpers, API response formatters, logger
│   │   ├── validations/        # Zod validation schemas
│   │   ├── app.js              # Express app setup, CORS, Helmet, middleware mounting
│   │   └── server.js           # Server bootstrap & listener (`0.0.0.0` host binding)
│   ├── uploads/                # Local uploads directory (`.gitkeep` tracked)
│   ├── .env.example            # Backend environment template
│   └── package.json            # Backend dependencies, test scripts & start command
├── .gitignore                  # Git ignore rules for root, client, and server
├── package.json                # Root package runner scripts
└── README.md                   # Project documentation
```

---

## 4. Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` OR a MongoDB Atlas cluster URI.

### Step 1: Clone Repository
```bash
git clone <your-github-repo-url>
cd "Digital Record System For NGO's"
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root
cd ..
```

---

## 5. Environment Variables

Create `.env` files in both `server/` and `client/` using their respective `.env.example` templates.

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ngo_records_db
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE_MB=10
ADMIN_EMAIL=admin@ngo.org
ADMIN_PASSWORD=AdminPass123!
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 6. How to Run Backend

From the repository root:
```bash
npm run dev:server
```
Or directly from the `server` directory:
```bash
cd server
npm run dev     # Starts with nodemon live reload
npm start       # Production start mode (node src/server.js)
```

The backend server will start on `http://localhost:5000`.
- **Health check endpoint**: `http://localhost:5000/api/v1/health`
- **API Root**: `http://localhost:5000/api/v1`

### Seeding Initial Admin
If running against a fresh database, seed the initial administrator:
```bash
cd server
npm run seed:admin
```

---

## 7. How to Run Frontend

From the repository root:
```bash
npm run dev:client
```
Or directly from the `client` directory:
```bash
cd client
npm run dev
```

The Vite dev server will start at `http://localhost:5173`. Open this URL in your web browser.

---

## 8. How to Run Tests

The project includes 96 comprehensive automated regression tests covering:
- **Phase 2**: Authentication, JWT token verification, password hashing, and RBAC endpoint guards (17 tests)
- **Phase 3A**: Admin User Management, creation of staff/volunteers/students, email deduplication, and deactivation (23 tests)
- **Phase 3B**: Student Management, registration numbering, profiles, role-scoped access (24 tests)
- **Phase 3C**: Dynamic Program Management, custom activities, scheduling, and role assignments (32 tests)

Run all 96 tests from the root or server directory:
```bash
# From root:
npm test

# Or from server:
cd server
npm test
```

Individual test suites can also be run separately:
```bash
npm run test:auth       # Phase 2 (17 tests)
npm run test:users      # Phase 3A (23 tests)
npm run test:students   # Phase 3B (24 tests)
npm run test:programs   # Phase 3C (32 tests)
```

---

## 9. Deployment Architecture

```
GitHub (Source Repository)
   │
   ├──▶ Render (Web Service: Node.js / Express Backend)
   │       ├── Listens on 0.0.0.0:$PORT
   │       ├── Connects to MongoDB Atlas via MONGODB_URI
   │       └── Enforces CORS via CLIENT_URL
   │               │
   │               ▼
   │       MongoDB Atlas (Cloud Database Cluster)
   │
   └──▶ Vercel (Static / SPA: React + Vite Frontend)
           ├── Connects to Render Backend via VITE_API_URL
           └── Handles SPA Client-Side Routing via vercel.json
```

### Production Deployment Instructions

#### 1. Database (MongoDB Atlas)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a Database User with read/write privileges.
3. In Network Access, allow access from anywhere (`0.0.0.0/0`) or configure Render's egress IP addresses.
4. Copy the connection string: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ngo_records_db?retryWrites=true&w=majority`.

#### 2. Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com) linked to your GitHub repository.
2. Configure settings:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
   - `JWT_SECRET`: `<generated-random-32+-character-string>`
   - `CLIENT_URL`: `https://<your-vercel-app-name>.vercel.app` (update once Vercel domain is created)
   - `MAX_FILE_SIZE_MB`: `10`
4. Deploy the service and note your Render URL (e.g. `https://ngo-backend.onrender.com`).

#### 3. Frontend (Vercel)
1. Create a new **Project** on [Vercel](https://vercel.com) imported from your GitHub repository.
2. Configure settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: `https://<your-render-backend-name>.onrender.com/api/v1`
4. Deploy the project. The provided [`client/vercel.json`](file:///c:/Users/Vipul%20Mishra/OneDrive/Desktop/Digital%20Record%20System%20For%20NGO's/client/vercel.json) ensures all client-side routes (`/admin/dashboard`, `/students`, etc.) resolve properly without 404 errors.
5. Copy your live Vercel URL and update `CLIENT_URL` in the Render dashboard.

---

## 10. Security & Verification Checklist

- [x] No secrets, passwords, or connection strings committed to Git
- [x] `.env` and local cache directories excluded via comprehensive `.gitignore`
- [x] `server/src/server.js` binds to `0.0.0.0` for cloud container hosting
- [x] Health check route active at `GET /api/v1/health`
- [x] CORS dynamically accepts production frontend domain from `CLIENT_URL`
- [x] Production check blocks `localhost`/`127.0.0.1` MongoDB connection strings in production
- [x] Frontend dynamically routes API traffic via `VITE_API_URL`
- [x] Vercel SPA routing configured via `vercel.json`
- [x] 96/96 Automated Backend Regression Tests Passing
- [x] Frontend production bundle built with 0 errors
