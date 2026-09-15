# HireFlow AI --- Backend

HireFlow AI is an AI-powered hiring workflow backend built with Node.js
and Express. It automates resume screening, personalized technical
assessments, assessment evaluation, qualification for admin review,
interview scheduling, and email notification.

## Core Workflow

``` text
Admin creates a job
        ↓
Candidate registers/logs in
        ↓
Candidate applies and uploads a PDF resume
        ↓
Resume is uploaded to Cloudinary
        ↓
Gemini extracts structured candidate information
        ↓
Gemini screens the resume against job requirements
        ↓
Gemini generates 5 personalized medium-difficulty questions
        ↓
Candidate retrieves and submits the assessment
        ↓
Gemini evaluates all 5 answers
        ↓
Resume score + assessment score are checked
        ↓
Qualified → Admin Review
Failed → Rejected
        ↓
Admin reviews the qualified candidate
        ↓
Admin selects or rejects candidate
        ↓
Selected → Interview automatically scheduled
        ↓
Resend sends interview notification
```

## Features

### Authentication

-   Separate Admin and Candidate registration/login flows.
-   Password hashing with bcryptjs.
-   JWT authentication stored in an HTTP-only cookie named `token`.
-   Authentication middleware exposes the authenticated user through
    `req.id` and `req.role`.
-   Controller-level role checks protect Admin and Candidate operations.

### Job Management

Admins can create, view, update, and close jobs. A job stores its title,
description, required skills, minimum experience, resume screening
threshold, assessment passing score, creator, and status.

The two configurable thresholds are used later by the automated
qualification workflow.

### Resume Upload

Candidates apply to active jobs by uploading a PDF resume.

The backend: 1. Receives the resume using Multer memory storage. 2.
Uploads the buffer to Cloudinary. 3. Stores the returned resume URL on
the application. 4. Sends the PDF to Gemini for extraction and
screening. 5. Prevents the same candidate from applying to the same job
twice.

### AI Resume Extraction

Gemini extracts structured resume information: - Skills - Education -
Experience - Projects - Total experience

The extracted information is stored on the Application document and
reused by later stages.

### AI Resume Screening

Gemini compares the resume with the selected job and returns: - Matched
skills - Missing skills - Screening score from 0--100 - Screening
summary

The screening uses the submitted resume and job requirements and is
instructed not to invent candidate qualifications.

### Personalized Assessment Generation

After screening, Gemini automatically generates exactly **5
medium-difficulty technical questions**.

The questions are primarily based on the job requirements while also
being personalized using the candidate's resume, projects, experience,
and screening result.

Each generated question also contains hidden `expectedKeyPoints` used
later for evaluation.

These key points are stored in MongoDB but are **never returned by the
candidate-facing assessment GET API**. Candidates receive only the
assessment ID, question IDs, question text, and assessment status.

### Assessment Submission and AI Evaluation

Candidates submit answers for all five questions. The backend validates
ownership, assessment status, question IDs, and that every question has
an answer.

Gemini evaluates all five answers in one request based on: - Technical
correctness - Coverage of expected concepts - Practical understanding

Semantically correct explanations can receive credit even when the
candidate does not use the exact wording of the expected key points.

Each answer receives a score and short feedback. The backend calculates
the final assessment percentage from the individual question scores.

### Automated Qualification

After assessment evaluation, the backend checks both job-defined
criteria:

``` js
application.screening.score >= job.screeningThreshold &&
assessment.totalScore >= job.assessmentPassingScore
```

If both conditions pass:

``` text
application.status = admin_review
screening.recommendation = qualified
```

Otherwise:

``` text
application.status = rejected
screening.recommendation = rejected
```

This automatically flags candidates who meet the defined criteria for
human review.

### Admin Review

Admins can view candidates waiting in `admin_review`, open an
application, inspect candidate/resume screening information, review
assessment results, and select or reject the candidate.

The final selection remains a human/admin decision.

### Automatic Interview Scheduling

When the admin selects a qualified candidate, the backend automatically
creates an Interview document.

The current MVP schedules the interview **2 days after selection at
11:00 AM**.

The Interview stores: - Application - Candidate - Job - Interview
date/time - Mode - Optional meeting link - Interview status

After successful scheduling, the application moves to
`interview_scheduled`.

### Interview Email Notification

After creating the interview, HireFlow AI uses Resend to send an
interview notification containing the candidate name, job title,
interview date/time, mode, and meeting link when available.

## Resend Development Limitation

The current project uses Resend's default testing sender:

``` text
HireFlow AI <onboarding@resend.dev>
```

Resend's testing domain cannot send to arbitrary candidate email
addresses. During development/testing, delivery is restricted to the
recipient permitted for the Resend account.

Therefore the development configuration uses:

``` env
TEST_EMAIL=your_resend_account_email@example.com
```

The candidate's **real email address is still stored correctly** in
MongoDB and remains part of the hiring workflow, but the actual test
interview email is redirected to `TEST_EMAIL`.

This is a limitation of the **Resend testing domain**, not of the
HireFlow AI application architecture.

For production, a custom sending domain should be verified in Resend.
Once configured, the email utility can send directly to:

``` js
to: candidate.email
```

This enables every selected candidate to receive the interview
notification at their registered email address.

## Technology Stack

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB, Mongoose
-   **Authentication:** JWT, HTTP-only cookies, bcryptjs
-   **AI:** Google Gemini via `@google/genai`, Gemini 2.5 Flash
-   **Resume Upload:** Multer, Cloudinary
-   **Email:** Resend
-   **Other:** CORS, cookie-parser, dotenv

## Project Structure

``` text
server/
├── config/
│   └── db.js
├── controllers/
│   ├── admin.controller.js
│   ├── candidate.controller.js
│   ├── job.controller.js
│   ├── application.controller.js
│   └── assessment.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── multer.js
├── models/
│   ├── admin.model.js
│   ├── candidate.model.js
│   ├── job.model.js
│   ├── application.model.js
│   ├── assessment.model.js
│   └── interview.model.js
├── routes/
│   ├── admin.routes.js
│   ├── candidate.routes.js
│   ├── job.routes.js
│   ├── application.routes.js
│   └── assessment.routes.js
├── utils/
│   ├── ai.js
│   ├── cloudinary.js
│   ├── uploadFile.js
│   ├── screenResume.js
│   ├── generateAssessment.js
│   ├── evaluateAssessment.js
│   ├── resend.js
│   └── sendInterviewEmail.js
├── server.js
├── package.json
└── .env
```

## Environment Variables

Create a `.env` file:

``` env
PORT=3000

MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key

RESEND_API_KEY=your_resend_api_key
TEST_EMAIL=your_resend_account_email
```

Never commit `.env` or real credentials. Commit a `.env.example`
containing only placeholders if needed.

## Installation

``` bash
git clone <repository-url>
cd <backend-directory>
npm install
```

Configure `.env`, then run:

``` bash
npm run dev
```

Default API URL:

``` text
http://localhost:3000
```

## Main API Flow

### Authentication

``` text
POST /api/admin/register
POST /api/admin/login
POST /api/admin/logout

POST /api/candidate/register
POST /api/candidate/login
POST /api/candidate/logout
```

### Jobs

``` text
POST /api/job/create
GET  /api/job/all
GET  /api/job/my-jobs
GET  /api/job/details/:id
PUT  /api/job/update/:id
PUT  /api/job/close/:id
```

### Applications

Apply with `multipart/form-data` using the resume field name `file`:

``` text
POST /api/application/apply/:jobId
```

Admin review:

``` text
GET /api/application/admin-review
GET /api/application/details/:applicationId
PUT /api/application/select/:applicationId
PUT /api/application/reject/:applicationId
```

### Assessments

``` text
GET  /api/assessment/application/:applicationId
POST /api/assessment/submit/:assessmentId
```

Example assessment submission:

``` json
{
  "answers": [
    {
      "questionId": "question_id_1",
      "answer": "Candidate answer..."
    },
    {
      "questionId": "question_id_2",
      "answer": "Candidate answer..."
    }
  ]
}
```

The real assessment contains five answers; all generated questions must
be answered before evaluation.

## Application Status Flow

``` text
applied
   ↓
assessment_sent
   ↓
assessment evaluation
   ↓
admin_review ─────────→ rejected
   ↓
admin selection
   ↓
interview_scheduled
```

Some transitions happen within the same request. For example, a
qualified candidate moves into `admin_review` immediately after
assessment evaluation, and admin selection can immediately create the
interview and move the application to `interview_scheduled`.

## Assessment Security

Candidate-facing APIs must never expose: - `expectedKeyPoints` -
Internal evaluation criteria - Scores before evaluation - Feedback
before submission/evaluation

The Admin can access assessment evaluation information for review.

## Authentication Note

The current MVP uses the same `token` cookie name for both Admin and
Candidate sessions. Logging into another role in the same
browser/Postman cookie session replaces the previous authentication
cookie. This is acceptable for the current MVP/demo.

## Current MVP Scheduling Limitation

Interview scheduling is intentionally simple:

``` text
Admin selects candidate
        ↓
Current date + 2 days
        ↓
11:00 AM interview
```

A production version could add admin/candidate availability, explicit
timezone handling, Google Calendar or Outlook integration, automatic
Google Meet/Zoom links, and rescheduling.

## Tested End-to-End

The core backend workflow has been tested through:

``` text
Job creation                         ✓
Candidate application               ✓
PDF resume upload                    ✓
Cloudinary storage                   ✓
Gemini resume extraction             ✓
Gemini resume screening              ✓
5 personalized assessment questions ✓
Candidate assessment retrieval       ✓
Assessment submission                ✓
Gemini answer evaluation             ✓
Threshold-based qualification        ✓
Admin review                         ✓
Admin selection                      ✓
Automatic interview creation         ✓
Resend interview email delivery      ✓
```

## Future Improvements

-   Verify a Resend custom domain and send directly to
    `candidate.email`.
-   Availability-aware and timezone-aware interview scheduling.
-   Google Calendar / Outlook integration.
-   Google Meet / Zoom meeting generation.
-   Assessment deadlines and expiry.
-   Assessment-ready email notifications.
-   Background queues and retry handling for AI/email tasks.
-   Stronger per-admin authorization so admins only manage applications
    for their own jobs.
-   Interview rescheduling/cancellation.
-   Candidate application-history dashboard.
-   Hiring analytics and audit logs.
-   Rate limiting and additional production security hardening.

## Summary

HireFlow AI connects the complete workflow:

``` text
Job Requirements + Candidate Resume
              ↓
         AI Screening
              ↓
 Personalized AI Assessment
              ↓
        AI Evaluation
              ↓
 Defined Qualification Criteria
              ↓
       Human Admin Review
              ↓
 Automatic Interview Scheduling
              ↓
       Email Notification
```

AI automates repetitive screening and assessment work, while the final
candidate selection remains with the hiring admin.
