# Student Management - Combined Project

This is one full-stack project combining:
1. Student Pagination
2. Create Student Form
3. Search & Filter Students

## Stack
- Backend: NestJS + TypeORM + PostgreSQL
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Toasts: Sonner
- Icons: Lucide React

## Folder structure
student-management/
  backend/
  frontend/

## Database
Use an existing PostgreSQL database with a `students` table, or let TypeORM create/update it by setting `synchronize=true` in `backend/src/app.module.ts` for local development.

Recommended `.env` in backend:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_DATABASE=postgres
PORT=3000

Do not commit a real database password.

## Run backend
cd backend
npm install
npm run start:dev

Backend: http://localhost:3000

## Run frontend
Open a second terminal:
cd frontend
npm install
npm run dev

Frontend: http://localhost:5173

## API
GET  /api/students?page=1&limit=8
GET  /api/students?search=Arun&cgpa_min=7.5&page=1&limit=8
POST /api/students

POST requires header:
x-role: admin

Example JSON:
{
  "name": "Kavin Aravind",
  "email": "kavin.aravind@example.com",
  "department": "CSE",
  "cgpa": 8.5
}
