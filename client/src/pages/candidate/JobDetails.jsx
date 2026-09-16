import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import { jobApi } from "../../services/api";
import {
  ChevronRight,
  Briefcase,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJob = () => {
    setLoading(true);
    setError(null);
    jobApi.getJobById(jobId)
      .then((res) => {
        if (res.data?.success) {
          setJob(res.data.job);
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Could not retrieve job specifications."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    jobApi.getJobById(jobId)
      .then((res) => {
        if (isMounted && res.data?.success) {
          setJob(res.data.job);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Could not retrieve job specifications."
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
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <Loading message="Loading job specifications..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <ErrorState
          title="Job Not Found"
          message={error || "The requested job posting could not be found."}
          onRetry={loadJob}
        />
      </div>
    );
  }

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link to="/jobs" className="hover:text-indigo-600 transition-colors">
            Jobs
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
            {job.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <span className="self-start sm:self-auto text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100/70 px-3 py-1 rounded-full">
                {job.status === "active" ? "Active Role" : "Closed"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 mb-6">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>
                  {job.minimumExperience > 0
                    ? `${job.minimumExperience}+ years experience`
                    : "Entry Level"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Full-Time</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Match</span>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />

            <section className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About the Role</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-700 font-medium text-xs sm:text-sm px-3 py-1 rounded-full border border-indigo-100/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Minimum Experience</h2>
              <p className="text-sm text-slate-600">
                {job.minimumExperience > 0
                  ? `${job.minimumExperience}+ years of professional software engineering experience working in a team or modern engineering environment.`
                  : "Open to passionate candidates from entry-level to experienced."}
              </p>
            </section>

            <hr className="my-6 border-slate-100" />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {job.status === "active" ? (
                <Link
                  to={`/jobs/${job._id}/apply`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="px-6 py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm text-center">
                  This job is currently closed
                </div>
              )}

              <button
                onClick={() => navigate("/jobs")}
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Quick Job Facts</h3>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Posted On</span>
                <span className="font-semibold text-slate-900">{formattedDate}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-slate-900 capitalize">{job.status}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Screening Threshold</span>
                <span className="font-semibold text-indigo-600">{job.screeningThreshold}% Match</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Passing Score</span>
                <span className="font-semibold text-indigo-600">{job.assessmentPassingScore}%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Assessment Type</span>
                <span className="font-semibold text-slate-900">5 Technical Scenarios</span>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />

            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/60 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Our AI screening agent reviews incoming submissions and prepares a customized 5-question technical test instantly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
