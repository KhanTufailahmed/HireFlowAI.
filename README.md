# 🚀 HireFlow AI — Intelligent AI-Powered Hiring Platform

> **An automated end-to-end hiring platform that combines Google Gemini AI resume screening, personalized dynamic technical assessments, automated scoring, and human-in-the-loop decision-making with automated interview scheduling and email notifications.**

---

## 📌 Repository Information

- **GitHub Repository**: [https://github.com/KhanTufailahmed/HireFlowAI.git](https://github.com/KhanTufailahmed/HireFlowAI.git)
- **Monorepo Architecture**:
  - `client/` — Modern React + Vite Single Page Application (Candidate & Admin Dashboards)
  - `server/` — Robust Node.js + Express RESTful API with MongoDB, Gemini AI, Cloudinary & Resend

---

## 💡 What is HireFlow AI?

Modern recruitment faces two major bottlenecks: **resume screening fatigue** and **manual candidate assessment**. HireFlow AI completely streamlines this workflow:

1. **Admins** post jobs with skill requirements, experience criteria, and custom threshold scores (screening score % and assessment passing score %).
2. **Candidates** discover jobs and submit their PDF resume.
3. **Google Gemini AI** extracts structured candidate profile data and screens the resume against job requirements in seconds.
4. **Dynamic AI Assessment**: Gemini generates **5 personalized medium-difficulty technical questions** tailored to both the job requirements and the candidate's unique resume & projects.
5. **AI Answer Evaluation**: The candidate answers the questions, and Gemini evaluates each answer against expected technical key points, scoring correctness and providing detailed feedback.
6. **Automated Qualification Gate**: If candidate meets both thresholds:
   > **Qualification Rule**:
   > `Screening Score ≥ Job Screening Threshold` &nbsp;**AND**&nbsp; `Assessment Score ≥ Job Passing Score`

   The candidate is automatically marked as **Qualified** (`status: "admin_review"`) and forwarded to the Admin Review queue. If either score is below threshold, status is set to `rejected`.
7. **Human Decision & Instant Scheduling**: The Admin reviews the AI screening summary, matched/missing skills, and question-by-question evaluation. With 1-click **Select**, an interview is automatically scheduled (2 days ahead at 11:00 AM) and an email confirmation is delivered via **Resend**.

---

## 🔄 End-to-End Workflow Diagram

```text
                                 ┌─────────────────────────┐
                                 │       HireFlow AI       │
                                 │  AI Recruitment Engine  │
                                 └────────────┬────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
         ┌───────────────────────┐                         ┌───────────────────────┐
         │    CANDIDATE TRACK    │                         │      ADMIN TRACK      │
         └───────────┬───────────┘                         └───────────┬───────────┘
                     │                                                 │
                     ▼                                                 ▼
         ┌───────────────────────┐                         ┌───────────────────────┐
         │  Register / Login     │                         │  Register / Login     │
         │  (/register, /login)  │                         │  (/register, /login)  │
         └───────────┬───────────┘                         └───────────┬───────────┘
                     │                                                 │
                     ▼                                                 ▼
         ┌───────────────────────┐                         ┌───────────────────────┐
         │  Explore Jobs List    │                         │  Admin Dashboard      │
         │  (/jobs)              │                         │  (/admin)             │
         └───────────┬───────────┘                         └───────────┬───────────┘
                     │                                                 │
                     ▼                                                 ▼
         ┌───────────────────────┐                         ┌───────────────────────┐
         │  View Job Details     │                         │  Create New Job       │
         │  (/jobs/:jobId)       │                         │  (/admin/jobs/create) │
         └───────────┬───────────┘                         │  • Skills & Exp       │
                     │                                     │  • Score Thresholds   │
                     ▼                                     └───────────┬───────────┘
         ┌───────────────────────┐                                     │
         │  Apply + Upload PDF   │                                     ▼
         │  (/jobs/:jobId/apply) │                         ┌───────────────────────┐
         └───────────┬───────────┘                         │  Manage My Jobs       │
                     │                                     │  (/admin/jobs)        │
                     ▼                                     └───────────────────────┘
         ┌───────────────────────┐
         │  AI Automated Engine  │
         │  • Cloudinary Upload  │
         │  • Gemini Extraction  │
         │  • Gemini Screening   │
         │  • 5 Custom Questions │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Take Assessment      │
         │  5 Tailored Questions │
         │  (/assessment/:id)    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  AI Answer Evaluation │
         │  Gemini scores 0-100  │
         │  Generates Feedback   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Dual Threshold Gate  │
         │  Screening >= Cutoff  │
         │  Assessment >= Cutoff │
         └───────┬───────┬───────┘
                 │       │
        Qualified│       │Failed
                 │       ▼
                 │  ┌───────────────────────┐
                 │  │  Application Rejected │
                 │  │  (Status: rejected)   │
                 │  └───────────────────────┘
                 ▼
     ┌─────────────────────────────────────────────────────────────────┐
     │                  CANDIDATES AWAITING REVIEW                     │
     │                  Route: /admin/review                           │
     └────────────────────────────────┬────────────────────────────────┘
                                      │
                                      ▼
     ┌─────────────────────────────────────────────────────────────────┐
     │                  CANDIDATE REVIEW & DECISION                    │
     │                  Route: /admin/application/:id                  │
     │  • AI Resume Match Score (0-100) & Summary                      │
     │  • Matched vs Missing Skills Badges                             │
     │  • 5 Assessment Questions, Candidate Answers & AI Feedback      │
     └────────────────────────┬────────────────────────┬───────────────┘
                              │                        │
                     [ Select Candidate ]      [ Reject Candidate ]
                              │                        │
                              ▼                        ▼
     ┌─────────────────────────────────┐      ┌────────────────────────┐
     │  Automatic Interview Scheduled  │      │  Application Rejected  │
     │  • Date: Current Date + 2 Days  │      │  (Status: rejected)    │
     │  • Time: 11:00 AM (Online)      │      └────────────────────────┘
     │  • Status: interview_scheduled  │
     └────────────────┬────────────────┘
                      │
                      ▼
     ┌─────────────────────────────────┐
     │  Resend Email Notification Sent │
     │  • Sent via Resend API          │
     │  • Date, Time & Meeting Details │
     └─────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### **Frontend (`client/`)**
- **Core**: React 19, JavaScript (ES Modules)
- **Bundler & Dev Server**: Vite 8 with HMR
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + Custom Glassmorphism UI
- **Routing**: React Router DOM v7 (Route-level protection for Candidate and Admin roles)
- **HTTP Client**: Axios (pre-configured with `withCredentials: true` for HTTP-only cookie JWTs)
- **Icons**: Lucide React

### **Backend (`server/`)**
- **Runtime & Framework**: Node.js, Express.js 5
- **Database**: MongoDB with Mongoose 9 (Models for Admin, Candidate, Job, Application, Assessment, Interview)
- **Authentication**: JWT (JSON Web Tokens) stored securely in **HTTP-only cookies** (`token`), encrypted with `bcryptjs`
- **Generative AI**: Google Gemini (`@google/genai` v2.22.0) using model `gemini-2.5-flash`
- **File & Media Storage**: Cloudinary v2 for PDF resumes via Multer memory storage
- **Email Delivery**: Resend API (`resend` v6.28.1)
- **Middleware**: CORS, Cookie-Parser, Multer, Custom Authentication & Role Validation

---

## 📁 Repository Structure

```text
HireFlowAI/
├── README.md                          # Root project documentation
├── .gitignore
│
├── client/                            # React + Vite Frontend Application
│   ├── index.html
│   ├── vite.config.js                 # Proxy config (/api -> http://localhost:3000)
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── main.jsx                   # Application bootstrap
│   │   ├── App.jsx                    # Root Router Provider
│   │   ├── index.css                  # Global styles & Tailwind imports
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx          # Route definitions & Role-based guards
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Adaptive navigation bar
│   │   │   ├── ProtectedRoute.jsx     # Candidate & Admin route protection
│   │   │   ├── JobCard.jsx            # Reusable job card
│   │   │   ├── Loading.jsx            # Loading spinners & AI processing states
│   │   │   └── ScoreBadge.jsx         # Visual score indicator
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with credentials & endpoints
│   │   └── pages/
│   │       ├── Landing.jsx            # Modern landing page
│   │       ├── auth/
│   │       │   ├── Login.jsx          # Dual-role tabbed authentication
│   │       │   └── Register.jsx       # Candidate & Admin registration
│   │       ├── candidate/
│   │       │   ├── Jobs.jsx           # Browse active jobs
│   │       │   ├── JobDetails.jsx     # Job details & requirements
│   │       │   ├── ApplyJob.jsx       # Drag-and-drop PDF resume upload
│   │       │   └── Assessment.jsx     # 5-Question technical test interface
│   │       └── admin/
│   │           ├── Dashboard.jsx      # Admin overview & statistics
│   │           ├── CreateJob.jsx      # Job creation form with thresholds
│   │           ├── MyJobs.jsx         # Admin's active & closed listings
│   │           ├── ReviewCandidates.jsx # Qualified candidates queue
│   │           └── CandidateDetails.jsx # Comprehensive AI screening & answer breakdown
│
└── server/                            # Node.js + Express Backend
    ├── server.js                      # Express app setup, DB connection & route mounting
    ├── package.json
    ├── .env.example
    ├── config/
    │   └── db.js                      # MongoDB Mongoose connection
    ├── middleware/
    │   ├── auth.middleware.js         # JWT cookie validation & role extraction
    │   └── multer.js                  # In-memory file upload middleware (field: "file")
    ├── models/
    │   ├── admin.model.js             # Admin schema
    │   ├── candidate.model.js         # Candidate schema
    │   ├── job.model.js               # Job schema (thresholds, status, skills)
    │   ├── application.model.js       # Resume URL, extracted data, screening scores
    │   ├── assessment.model.js        # Questions, expectedKeyPoints, answers, feedback
    │   └── interview.model.js         # Scheduled date, mode, meeting link, status
    ├── routes/
    │   ├── admin.routes.js            # /api/admin
    │   ├── candidate.routes.js        # /api/candidate
    │   ├── job.routes.js              # /api/job
    │   ├── application.routes.js      # /api/application
    │   └── assessment.routes.js       # /api/assessment
    ├── controllers/
    │   ├── admin.controller.js
    │   ├── candidate.controller.js
    │   ├── job.controller.js
    │   ├── application.controller.js
    │   └── assessment.controller.js
    └── utils/
        ├── ai.js                      # Google Gen AI client initialization
        ├── cloudinary.js              # Cloudinary SDK credentials setup
        ├── uploadFile.js              # PDF buffer upload to Cloudinary
        ├── screenResume.js            # Gemini resume parsing & scoring
        ├── generateAssessment.js      # Gemini 5-question test generator
        ├── evaluateAssessment.js      # Gemini multi-question evaluation engine
        ├── resend.js                  # Resend client initialization
        └── sendInterviewEmail.js      # HTML interview notification sender
```

---

## 🌐 Frontend Pages & Routes

The client application separates public, candidate, and admin experiences cleanly using role-based routing:

| Route Path | Access Role | Description & Functionality |
| :--- | :--- | :--- |
| `/` | Public | Interactive landing page showcasing HireFlow AI features. |
| `/login` | Public | Single card with `Candidate` / `Admin` tabs. Logs in and sets role. |
| `/register` | Public | Register as Candidate or Admin. |
| `/jobs` | Candidate | Displays list of all active jobs matching qualifications. |
| `/jobs/:jobId` | Candidate | Detailed job description, required skills, and experience. |
| `/jobs/:jobId/apply` | Candidate | Drag-and-drop PDF resume upload with live AI processing state. |
| `/assessment/:applicationId` | Candidate | Dynamic 5-question test interface with submission and immediate score result. |
| `/admin` | Admin | Executive dashboard with quick links to manage jobs and candidates. |
| `/admin/jobs` | Admin | View active & closed job postings with options to edit or close. |
| `/admin/jobs/create` | Admin | Form to configure job title, skills, experience, and AI threshold scores. |
| `/admin/review` | Admin | Queue of all candidates who passed AI thresholds and await review. |
| `/admin/application/:applicationId` | Admin | **Detailed inspection view**: AI resume screening breakdown, matched/missing skills, candidate answers, AI evaluation scores, and 1-click **Select** / **Reject** buttons. |

---

## 🔌 API Endpoints & Contract Reference

All endpoints requiring authentication verify the JWT stored inside the HTTP-only cookie named `token`. Frontend requests must include `withCredentials: true`.

### 1. Candidate Authentication (`/api/candidate`)
- **`POST /api/candidate/register`**
  - **Body**: `{ "name": "John Doe", "email": "john@example.com", "phone": "1234567890", "password": "secretpassword" }`
  - **Response**: `{ "success": true, "message": "Candidate account created successfully" }`
- **`POST /api/candidate/login`**
  - **Body**: `{ "email": "john@example.com", "password": "secretpassword" }`
  - **Response**: Sets HTTP-only `token` cookie; returns candidate details.
- **`GET /api/candidate/logout`**
  - **Response**: Clears `token` cookie.

### 2. Admin Authentication (`/api/admin`)
- **`POST /api/admin/register`**
  - **Body**: `{ "name": "Recruiter Jane", "email": "admin@example.com", "password": "secretpassword" }`
  - **Response**: `{ "success": true, "message": "Admin account created successfully" }`
- **`POST /api/admin/login`**
  - **Body**: `{ "email": "admin@example.com", "password": "secretpassword" }`
  - **Response**: Sets HTTP-only `token` cookie; returns admin details.
- **`GET /api/admin/logout`**
  - **Response**: Clears `token` cookie.

### 3. Job Management (`/api/job`)
- **`GET /api/job/all`** *(Candidate / Authenticated)*
  - **Response**: List of all jobs with `status: "active"`.
- **`GET /api/job/details/:id`** *(Candidate / Authenticated)*
  - **Response**: Job details by ID.
- **`POST /api/job/create`** *(Admin)*
  - **Body**:
    ```json
    {
      "title": "Senior Backend Engineer",
      "description": "Looking for Node.js & MongoDB expert...",
      "requiredSkills": ["Node.js", "Express", "MongoDB", "Docker"],
      "minimumExperience": 2,
      "screeningThreshold": 70,
      "assessmentPassingScore": 60
    }
    ```
- **`GET /api/job/my-jobs`** *(Admin)*
  - **Response**: All jobs created by the authenticated admin.
- **`PUT /api/job/update/:id`** *(Admin)*
  - **Body**: Any editable job fields (`title`, `description`, `requiredSkills`, thresholds).
- **`PUT /api/job/close/:id`** *(Admin)*
  - **Response**: Marks job `status = "closed"`.

### 4. Applications & AI Screening (`/api/application`)
- **`POST /api/application/apply/:jobId`** *(Candidate)*
  - **Form Data**: `file` (PDF format)
  - **Internal Process**:
    1. Uploads PDF to Cloudinary.
    2. Gemini extracts skills, education, projects, experience.
    3. Gemini screens resume against job requirements (0–100 score, matched/missing skills).
    4. Gemini creates 5 tailored assessment questions.
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Application submitted and assessment generated successfully",
      "application": { "_id": "65e0...", "status": "applied" }
    }
    ```
- **`GET /api/application/admin-review`** *(Admin)*
  - **Response**: All applications currently in `status: "admin_review"`.
- **`GET /api/application/details/:applicationId`** *(Admin)*
  - **Response**: Complete application record (including parsed resume, screening result, and candidate's assessment).
- **`PUT /api/application/select/:applicationId`** *(Admin)*
  - **Action**: Automatically creates an Interview (2 days later at 11:00 AM), updates application status to `interview_scheduled`, and dispatches notification email via Resend.
- **`PUT /api/application/reject/:applicationId`** *(Admin)*
  - **Action**: Updates application status to `rejected`.

### 5. Assessments & AI Evaluation (`/api/assessment`)
- **`GET /api/assessment/application/:applicationId`** *(Candidate)*
  - **Response**: Assessment ID, application reference, and 5 questions.
  - *Note: `expectedKeyPoints` are strictly filtered out to prevent leaks to candidate.*
- **`POST /api/assessment/submit/:assessmentId`** *(Candidate)*
  - **Body**:
    ```json
    {
      "answers": [
        { "questionId": "q_id_1", "answer": "Detailed technical answer..." },
        { "questionId": "q_id_2", "answer": "Detailed technical answer..." },
        { "questionId": "q_id_3", "answer": "Detailed technical answer..." },
        { "questionId": "q_id_4", "answer": "Detailed technical answer..." },
        { "questionId": "q_id_5", "answer": "Detailed technical answer..." }
      ]
    }
    ```
  - **Action**: Gemini evaluates answers against expected key points, calculates percentage score, checks job thresholds, and moves status to `admin_review` (if passed) or `rejected`.

---

## ⚙️ Environment Variables Reference

### Backend (`server/.env`)

Create `server/.env` with the following variables:

| Variable Name | Required | Description & Example |
| :--- | :---: | :--- |
| `PORT` | Optional | Server port (Default: `3000`) |
| `MONGODB_URL` | **Yes** | MongoDB connection string (e.g. `mongodb+srv://...` or `mongodb://localhost:27017/hireflowai`) |
| `SECRET_KEY` | **Yes** | Secret string used for signing and verifying JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary cloud name for file uploads |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API Secret |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API Key from Google AI Studio |
| `RESEND_API_KEY` | **Yes** | Resend API key starting with `re_...` |
| `TEST_EMAIL` | **Yes** | Recipient email address for Resend testing domain (e.g., your Resend verified account email) |

#### 📧 Resend Test Domain Note
> When using Resend's free tier sandbox (`onboarding@resend.dev`), emails can only be sent to the email address registered with your Resend account (`TEST_EMAIL`). The candidate's real email is safely stored in MongoDB, and the email utility directs test deliveries to `TEST_EMAIL`. In production, verifying a custom domain allows sending directly to `candidate.email`.

### Frontend (`client/.env`)

Create `client/.env` (optional in development due to Vite proxy):

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `VITE_API_URL` | Optional | Backend URL. Leave empty to use Vite proxy (`/api`), or set `http://localhost:3000` |

---

## 🚀 Step-by-Step Installation & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **MongoDB**: Local instance or MongoDB Atlas cluster
- **API Keys**: Google Gemini, Cloudinary, and Resend

---

### 2. Clone the Repository
```bash
git clone https://github.com/KhanTufailahmed/HireFlowAI.git
cd HireFlowAI
```

---

### 3. Backend Setup (`server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and fill in your actual credentials (`MONGODB_URL`, `SECRET_KEY`, `GEMINI_API_KEY`, `CLOUDINARY_*`, `RESEND_API_KEY`, `TEST_EMAIL`).*

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will start at `http://localhost:3000`. You should see:
   ```text
   Server is running on port 3000
   MongoDB connected successfully
   ```

---

### 4. Frontend Setup (`client`)

1. In a new terminal window, navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create the `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at:
   ```text
   http://localhost:5173
   ```

---


## 🔒 Security & Best Practices

- **HTTP-Only Cookies**: JWT tokens cannot be accessed via JavaScript (`document.cookie`), preventing XSS token theft.
- **Hidden Assessment Criteria**: Evaluation criteria (`expectedKeyPoints`) are stored exclusively on the server and stripped from candidate-facing APIs.
- **Role Verification**: Middleware validates both JWT signatures and role claims on every protected action.
- **Duplicate Prevention**: Candidates cannot submit multiple applications to the same job.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👥 Contributors & Contact

- **Author**: Tufail Ahmed Khan
- **GitHub**: [@KhanTufailahmed](https://github.com/KhanTufailahmed)
- **Repository**: [HireFlowAI](https://github.com/KhanTufailahmed/HireFlowAI.git)
