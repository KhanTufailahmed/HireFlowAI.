import { createBrowserRouter, Navigate } from "react-router-dom";

import Landing from "../pages/Landing.jsx";
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

import ProtectedRoute from "../components/ProtectedRoute.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/jobs",
    element: (
      <ProtectedRoute allowedRoles={["candidate"]}>
        <Jobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobs/:jobId",
    element: (
      <ProtectedRoute allowedRoles={["candidate"]}>
        <JobDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobs/:jobId/apply",
    element: (
      <ProtectedRoute allowedRoles={["candidate"]}>
        <ApplyJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment/:applicationId",
    element: (
      <ProtectedRoute allowedRoles={["candidate"]}>
        <Assessment />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <MyJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <CreateJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/review",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <ReviewCandidates />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/application/:applicationId",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <CandidateDetails />
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default appRouter;