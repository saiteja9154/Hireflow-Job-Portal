from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Import database and models to initialize schema
from app.database import engine, Base, SessionLocal
import app.models as models
from app.models.user import User
from app.models.job import Job
from app.auth.security import get_password_hash

# Import routers
from app.routers import auth, jobs, applications, profile

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        # Check if we already have users (to avoid double seeding)
        user_count = db.query(User).count()
        if user_count == 0:
            print("Seeding database with default recruiter, candidate, and job listings...")
            # Create seed recruiter
            recruiter = User(
                name="Mara Chen",
                email="recruiter@hireflow.co",
                password_hash=get_password_hash("password123"),
                role="recruiter",
                company_name="Northstar Labs",
                phone="+91 98765 43210",
                location="Bengaluru, Karnataka",
                experience="8-12",
                summary="Talent Acquisition Lead at Northstar Labs. We build thoughtful software tools for high-growth engineering teams."
            )
            db.add(recruiter)
            db.commit()
            db.refresh(recruiter)
            
            # Create seed candidate
            candidate = User(
                name="Sai Teja",
                email="candidate@hireflow.co",
                password_hash=get_password_hash("password123"),
                role="candidate",
                phone="+91 88888 77777",
                skills="React, JavaScript, Tailwind CSS, Python, FastAPI, MySQL",
                location="Hyderabad, Telangana",
                experience="1-3",
                summary="Enthusiastic full-stack developer passionate about building high-performance web applications."
            )
            db.add(candidate)
            db.commit()
            
            # Seed jobs
            seed_jobs = [
                Job(
                    recruiter_id=recruiter.id,
                    title="Senior Product Designer",
                    company="Northstar Labs",
                    location="Bengaluru, Karnataka",
                    description="Shape the next generation of collaborative product tools that help modern teams work with maximum velocity and intent. You will own the UX of our flagship platform and collaborate directly with engineering leads.",
                    requirements="• 5+ years of UI/UX design experience for SaaS applications\n• Expert level capability in Figma and interactive prototyping tools\n• Demonstrated portfolio of shipping complex B2B features\n• Solid user research and user testing background",
                    employment_type="Full-time",
                    experience_level="Senior",
                    salary="₹18L – ₹24L"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title="Frontend Engineer (React)",
                    company="Kindred Health",
                    location="Hyderabad, Telangana",
                    description="Build responsive, high-performance web applications that make patient onboarding and healthcare management a calm, delightful process. You will lead UI component design using React and Tailwind CSS.",
                    requirements="• 2+ years of professional React.js & JavaScript experience\n• Strong command of CSS, Tailwind CSS, Flexbox/Grid, and responsive layout design\n• Familiarity with RESTful API integration using Axios\n• Performance debugging, state management (Zustand/Redux), and optimization skills",
                    employment_type="Full-time",
                    experience_level="Mid-level",
                    salary="₹12L – ₹16L"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title="Python Backend Developer",
                    company="CloudScale Solutions",
                    location="Pune, Maharashtra",
                    description="Design scalable microservices, manage REST API endpoints, orchestrate relational databases, and maintain our high-performance FastAPI schemas.",
                    requirements="• Proficient with Python and writing clean, PEP 8 compliant code\n• 3+ years experience using FastAPI or Flask/Django frameworks\n• Database modeling experience (MySQL/PostgreSQL) and ORMs (SQLAlchemy)\n• Understanding of backend security patterns (JWT, CORS, password hashing)",
                    employment_type="Full-time",
                    experience_level="Senior",
                    salary="₹15L – ₹20L"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title="Data Analyst",
                    company="Common Thread",
                    location="Mumbai, Maharashtra",
                    description="Work closely with product and marketing teams to clean raw business datasets, construct interactive visualization panels, and identify conversion optimization opportunities.",
                    requirements="• Mastery of SQL queries, joins, and window functions\n• Programming experience in Python (Pandas, NumPy) for data manipulation\n• Ability to communicate technical insights to non-technical business stakeholders\n• Experience building dashboards in Looker, Tableau, or PowerBI",
                    employment_type="Full-time",
                    experience_level="Entry-level",
                    salary="₹6L – ₹9L"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title="Machine Learning Engineer",
                    company="India AI Labs",
                    location="Chennai, Tamil Nadu",
                    description="Train, fine-tune, and deploy deep learning models on GPU clusters. Optimize and serve open-source Large Language Models efficiently for low-latency conversational user queries.",
                    requirements="• PyTorch or TensorFlow model training expertise\n• Deep understanding of transformer architectures and conversational AI models\n• Experience packaging models with Docker and Python APIs\n• Strong mathematical foundations (linear algebra, probability, calculus)",
                    employment_type="Full-time",
                    experience_level="Senior",
                    salary="₹22L – ₹30L"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title="Technical Product Manager",
                    company="Orbit House",
                    location="Gurgaon, Haryana",
                    description="Own the platform product roadmap. Gather developer feedback, coordinate with backend engineering teams, and deliver robust, developer-friendly API products.",
                    requirements="• 3+ years Product Management experience in the developer tools or SaaS space\n• Technical background (e.g. computer science degree or past software development experience)\n• Ability to write clean, clear product specifications (PRDs)\n• Extensive experience working with Agile/Scrum teams",
                    employment_type="Full-time",
                    experience_level="Lead",
                    salary="₹25L – ₹32L"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title="UI/UX Developer",
                    company="TechSpire Studio",
                    location="Noida, Uttar Pradesh",
                    description="Convert Figma high-fidelity wireframes into semantic HTML/CSS layouts. Build clean, reusable component packages in React.js.",
                    requirements="• Expertise in CSS3, Sass, and modern layouts (Flexbox, Grid)\n• Intermediate React.js and JavaScript knowledge\n• Strict eye for typography, margins, and transition curves\n• Familiarity with SVG optimization and responsive design patterns",
                    employment_type="Hybrid",
                    experience_level="Entry-level",
                    salary="₹5L – ₹8L"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title="React Native Developer",
                    company="Pollen App",
                    location="Remote",
                    description="Build and deploy Android/iOS mobile applications using React Native. Optimize startup speed and coordinate native modules.",
                    requirements="• 3+ years experience with React Native development\n• Familiarity with publishing apps to App Store & Google Play\n• Strong Javascript/ES6 skills\n• State management experience (Redux or Zustand)",
                    employment_type="Contract",
                    experience_level="Mid-level",
                    salary="₹14L – ₹18L"
                )
            ]
            db.bulk_save_objects(seed_jobs)
            db.commit()
            print("Database successfully seeded with recruiters, candidates, and job posts in Indian cities!")
    except Exception as e:
        db.rollback()
        print("Error seeding database:", e)
    finally:
        db.close()

# Run the seeding
seed_database()

app = FastAPI(
    title="HireFlow API",
    description="Full-stack job portal backend APIs built using FastAPI, SQLAlchemy, and MySQL.",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(profile.router)

# Mount uploads directory statically to serve resume PDFs
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "HireFlow Job Portal API",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
