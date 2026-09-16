import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

import Jobs from "../pages/candidate/Jobs.jsx";
import JobDetails from "../pages/candidate/JobDetails.jsx";
import ApplyJob from "../pages/candidate/ApplyJob.jsx";
import Assessment from "../pages/candidate/Assessment.jsx";

import Dashboard from "../pages/admin/Dashboard.jsx";
import MyJobs from "../pages/admin/MyJobs.jsx";
import CreateJob from "../pages/admin/CreateJob.jsx";
import ReviewCandidates from "../pages/admin/ReviewCandidates.jsx";
import CandidateDetails from "../pages/admin/CandidateDetails.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Auth Routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Candidate Routes
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/jobs/:jobId",
    element: <JobDetails />,
  },
  {
    path: "/jobs/:jobId/apply",
    element: <ApplyJob />,
  },
  {
    path: "/assessment/:applicationId",
    element: <Assessment />,
  },

  // Admin Routes
  {
    path: "/admin",
    element: <Dashboard />,
  },
  {
    path: "/admin/jobs",
    element: <MyJobs />,
  },
  {
    path: "/admin/jobs/create",
    element: <CreateJob />,
  },
  {
    path: "/admin/review",
    element: <ReviewCandidates />,
  },
  {
    path: "/admin/application/:applicationId",
    element: <CandidateDetails />,
  },
]);

export default appRouter;