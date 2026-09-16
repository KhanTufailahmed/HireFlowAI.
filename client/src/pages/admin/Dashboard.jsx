import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { jobApi, applicationApi } from "../../services/api";
import {
  Briefcase,
  Users,
  CheckSquare,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      jobApi.getMyJobs(),
      applicationApi.getAdminReview(),
    ])
      .then(([jobsRes, appsRes]) => {
        if (!isMounted) return;
        if (jobsRes.status === "fulfilled" && jobsRes.value?.data?.success) {
          setJobs(jobsRes.value.data.jobs || []);
        }
        if (appsRes.status === "fulfilled" && appsRes.value?.data?.success) {
          setApplications(appsRes.value.data.applications || []);
        }
      })
      .catch(() => {
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <Loading message="Loading recruiter dashboard..." />
      </div>
    );
  }

  const activeJobs = jobs.filter((j) => j.status === "active");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Recruiter Cockpit
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor active roles, review qualified candidates, and schedule interviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/jobs/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Role
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Job Postings
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {activeJobs.length}
              </span>
              <span className="text-xs text-slate-500">
                of {jobs.length} total
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Awaiting Admin Review
              </span>
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600">
                {applications.length}
              </span>
              <span className="text-xs text-slate-500">Qualified by AI</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Decision Pipeline
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {applications.length > 0 ? "Action Needed" : "Clear"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Candidates Awaiting Decision
              </h2>
              <Link
                to="/admin/review"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all ({applications.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No candidates currently awaiting review.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app._id}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {app.candidate?.name || "Candidate"}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Applied for {app.job?.title || "Engineering Role"}
                      </p>
                    </div>

                    <Link
                      to={`/admin/application/${app._id}`}
                      className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Your Job Postings
              </h2>
              <Link
                to="/admin/jobs"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Manage jobs ({jobs.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No jobs created yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {jobs.slice(0, 4).map((job) => (
                  <div
                    key={job._id}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Threshold: {job.screeningThreshold}% • Passing:{" "}
                        {job.assessmentPassingScore}%
                      </p>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        job.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
