import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { jobApi } from "../../services/api";
import {
  PlusCircle,
  XCircle,
} from "lucide-react";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const loadJobs = () => {
    setLoading(true);
    setError(null);
    jobApi.getMyJobs()
      .then((res) => {
        if (res.data?.success) {
          setJobs(res.data.jobs || []);
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to load admin job postings."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    jobApi.getMyJobs()
      .then((res) => {
        if (isMounted && res.data?.success) {
          setJobs(res.data.jobs || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load admin job postings."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCloseJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to close this job posting? Candidates will no longer be able to apply.")) {
      return;
    }
    setActionLoading(jobId);
    try {
      const res = await jobApi.closeJob(jobId);
      if (res.data.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: "closed" } : j))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to close job posting.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Job Postings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure screening thresholds, view requirements, and manage role availability.
            </p>
          </div>

          <Link
            to="/admin/jobs/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Create Job
          </Link>
        </div>

        {loading ? (
          <Loading message="Fetching job listings..." />
        ) : error ? (
          <ErrorState
            title="Failed to Load Jobs"
            message={error}
            onRetry={loadJobs}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No Jobs Created Yet"
            message="You haven't posted any jobs yet. Create your first role to start screening candidates with AI."
            actionText="Create First Job"
            onAction={() => (window.location.href = "/admin/jobs/create")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        job.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {job.status}
                    </span>

                    <span className="text-xs text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {job.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Screening Threshold</span>
                      <span className="font-bold text-indigo-600">
                        {job.screeningThreshold}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Assessment Passing</span>
                      <span className="font-bold text-indigo-600">
                        {job.assessmentPassingScore}%
                      </span>
                    </div>
                  </div>

                  {job.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-md border border-indigo-100/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Min Exp: {job.minimumExperience} {job.minimumExperience === 1 ? "yr" : "yrs"}
                  </span>

                  {job.status === "active" && (
                    <button
                      onClick={() => handleCloseJob(job._id)}
                      disabled={actionLoading === job._id}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {actionLoading === job._id ? "Closing..." : "Close Job"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyJobs;
