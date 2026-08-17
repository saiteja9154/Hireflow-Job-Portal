# HireFlow

## Overview
HireFlow is a clean, modern, and professional full-stack job portal designed to connect talented candidates with employers. It simplifies the hiring lifecycle by offering a responsive, recruiter-friendly, and candidate-friendly experience, powered by a React.js client and a Python FastAPI backend.

## Real-World Problem
Finding a job or hiring the right talent often involves navigating clunky interfaces, complex multi-step forms, and slow platforms. Candidates want a straightforward path to browse openings, upload resumes, and track their application statuses without noise. Recruiters need a clear panel to post job details and manage applicants efficiently, without high subscription costs or over-engineered features.

## Solution
HireFlow offers a calm, intentional hiring platform. Candidates can register, log in, search for jobs, filter by location or employment type, upload a PDF resume, and instantly track application updates. Recruiters have access to an administrative workspace where they can publish job openings, view active applicant counts, download resumes, and transition applicants through various stages of the review lifecycle.

## Features

### Candidate Lifecycle
* **Registration & Login**: Secure registration and password hashing.
* **Job Search & Filters**: Search jobs by keywords, locations, or employment type.
* **Job Details**: View comprehensive job requirements and salaries.
* **Direct Application**: Apply directly by uploading a PDF resume.
* **Application Tracking**: View application status updates (e.g. Under Review, Interview Scheduled, Offer Received) in a candidate dashboard.

### Recruiter Lifecycle
* **Job Postings**: Create, edit, and delete job openings with specific salary ranges and criteria.
* **Dashboard Stats**: View metrics on active jobs and total applications.
* **Applicant Review**: Review applicant profiles, download PDF resumes, and update application statuses dynamically.

## Tech Stack
* **Frontend**: React.js, JavaScript, Vite, Tailwind CSS v4, React Router v6, Axios
* **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, JWT Authentication, Passlib (with bcrypt)
* **Database**: MySQL
* **Tools**: Git, VS Code, Postman

## Project Structure
```
HireFlow/
│
├── frontend/             # React Client
│   ├── src/
│   │   ├── components/   # UI layouts and cards
│   │   ├── pages/        # Dashboard, Login, Jobs, etc.
│   │   ├── services/     # Centralized Axios client
│   │   ├── context/      # Authentication context provider
│   │   └── index.css     # Tailwind custom styling
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/              # Python FastAPI Server
│   ├── app/
│   │   ├── auth/         # JWT generation and verify
│   │   ├── models/       # SQLAlchemy database tables
│   │   ├── schemas/      # Pydantic request validation schemas
│   │   ├── routers/      # Modular endpoint routers
│   │   ├── database.py   # Connection engine & session helper
│   │   └── main.py       # App initiation & CORS config
│   ├── uploads/          # Local resume PDF storage directory
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
├── .gitignore
└── LICENSE
```

## Database Structure

### `users` table
* `id` (INT, Primary Key, Auto-increment)
* `name` (VARCHAR, Not Null)
* `email` (VARCHAR, Unique, Not Null)
* `password_hash` (VARCHAR, Not Null)
* `role` (VARCHAR: 'candidate' or 'recruiter', Not Null)
* `company_name` (VARCHAR, Nullable)
* `phone` (VARCHAR, Nullable)
* `skills` (TEXT, Nullable)
* `location` (VARCHAR, Nullable)
* `experience` (VARCHAR, Nullable)
* `summary` (TEXT, Nullable)
* `created_at` (DATETIME)

### `jobs` table
* `id` (INT, Primary Key, Auto-increment)
* `recruiter_id` (INT, Foreign Key referencing `users.id`)
* `title` (VARCHAR, Not Null)
* `company` (VARCHAR, Not Null)
* `location` (VARCHAR, Not Null)
* `description` (TEXT, Not Null)
* `requirements` (TEXT, Not Null)
* `employment_type` (VARCHAR, Not Null)
* `experience_level` (VARCHAR, Not Null)
* `salary` (VARCHAR, Not Null)
* `created_at` (DATETIME)

### `applications` table
* `id` (INT, Primary Key, Auto-increment)
* `job_id` (INT, Foreign Key referencing `jobs.id`)
* `candidate_id` (INT, Foreign Key referencing `users.id`)
* `resume_path` (VARCHAR, Not Null)
* `status` (VARCHAR, default 'Applied')
* `applied_at` (DATETIME)

## API Endpoints

### Authentication
* `POST /auth/register` - Create a candidate or recruiter account
* `POST /auth/login` - Authenticate and retrieve JWT token
* `GET /auth/me` - Fetch details of the currently logged-in user

### Jobs
* `GET /jobs` - List jobs (with search/filter query parameters)
* `GET /jobs/{job_id}` - Retrieve details of a single job opening
* `POST /jobs` - Create a new job post (Recruiter only)
* `PUT /jobs/{job_id}` - Update a job post (Owner only)
* `DELETE /jobs/{job_id}` - Delete a job post (Owner only)

### Applications
* `POST /jobs/{job_id}/apply` - Submit resume PDF and apply (Candidate only)
* `GET /applications/my` - List current candidate's applications (Candidate only)
* `GET /jobs/{job_id}/applications` - List applicants for a job post (Job Owner only)
* `PUT /applications/{application_id}/status` - Update applicant status (Job Owner only)

### Profile
* `GET /profile` - Retrieve user profile details
* `PUT /profile` - Update profile information

## Local Setup

### Prerequisites
* Python 3.8+
* Node.js (with npm)
* MySQL Server

### Environment Variables
Configure the backend environmental file by creating a `.env` file under `backend/`:
```env
DATABASE_URL=mysql+pymysql://username:password@localhost/hireflow
SECRET_KEY=your_secret_key_here
```

Configure the frontend environmental file by creating a `.env` file under `frontend/`:
```env
VITE_API_URL=http://localhost:8000
```

## Running the Application

### 1. Start the Backend API
Navigate to the `backend` folder, install requirements, and boot up the server:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The interactive Swagger API documentation will be available at `http://localhost:8000/docs`.

### 2. Start the Frontend client
Navigate to the `frontend` folder, install packages, and boot up the dev client:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Screenshots
*(Add screenshots demonstrating the home landing page, search panel, candidate dashboard, and recruiter job publishing workspace)*

## Future Improvements
* **Automated Screening**: Scan resume text against job requirements using standard keywords.
* **Notification Emails**: Notify candidates automatically when their application status is updated.
* **Job Alerts**: Allow candidates to subscribe to new job notifications in their preferred sectors.

## Author
[Your Name / GitHub Profile]
