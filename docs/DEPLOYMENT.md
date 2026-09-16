# Ansoyal AI Recruiter Platform — Deployment Guide

## 1. Prerequisites

- Node.js >= 18.0.0 (or Docker)
- MongoDB instance (MongoDB Atlas or standalone container)
- Access to Ansoyal Student Platform API

---

## 2. Environment Variables

Create `.env` inside `backend/`:

```env
PORT=5002
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ANSOYAL_RECRUITER_DB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
ANSOYAL_STUDENT_API_URL=https://api.ansoyal.com/api/v1/recruiter
ANSOYAL_STUDENT_SERVICE_KEY=your_secure_server_to_server_key
FRONTEND_URL=https://recruiter.ansoyal.com
```

Create `.env` inside `frontend/`:

```env
VITE_API_BASE_URL=https://recruiter-api.ansoyal.com/api
```

---

## 3. Running with Docker Compose

Run the entire recruiter ecosystem with a single command:

```bash
docker-compose up --build -d
```

Services started:
- `recruiter-backend` on port `5002`
- `recruiter-frontend` on port `5174` (Nginx reverse proxy)

---

## 4. Manual Deployment

### Backend:
```bash
cd backend
npm install
npm run build
npm start
```

### Frontend:
```bash
cd frontend
npm install
npm run build
# Serve dist/ using Nginx, Vercel, or static web server
```
