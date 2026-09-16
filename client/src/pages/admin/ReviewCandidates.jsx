import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import ScoreBadge from "../../components/ScoreBadge";
import { applicationApi } from "../../services/api";
import {
  ArrowRight,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";

const ReviewCandidates = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApplications = () => {
    setLoading(true);
    setError(null);
    applicationApi.getAdminReview()
      .then((res) => {
        if (res.data?.success) {
          setApplications(res.data.applications || []);
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to load candidates awaiting review."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    applicationApi.getAdminReview()
      .then((res) => {
        if (isMounted && res.data?.success) {
          setApplications(res.data.applications || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load candidates awaiting review."
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Candidates Awaiting Review
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review candidates who passed automated resume screening and technical assessments.
          </p>
        </div>

        {loading ? (
          <Loading message="Loading candidate applications..." />
        ) : error ? (
          <ErrorState
            title="Failed to Load Candidates"
            message={error}
            onRetry={loadApplications}
          />
        ) : applications.length === 0 ? (
          <EmptyState
            title="No Candidates Awaiting Review"
            message="There are currently no candidates pending review. When applicants pass both the screening and assessment thresholds, they will appear here."
            actionText="View Job Postings"
            onAction={() => (window.location.href = "/admin/jobs")}
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-indigo-200 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {app.candidate?.name || "Candidate Name"}
                    </h3>
                    <ScoreBadge
                      score={app.screening?.score || 0}
                      label="AI Match"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      Role: <strong>{app.job?.title || "Engineering Role"}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {app.candidate?.email}
                    </span>
                    {app.candidate?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {app.candidate?.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {app.screening?.matchedSkills?.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-emerald-200"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                    {app.screening?.missingSkills?.slice(0, 2).map((skill, i) => (
                      <span
                        key={i}
                        className="bg-rose-50 text-rose-600 text-[11px] font-medium px-2 py-0.5 rounded-md border border-rose-200"
                      >
                        ✗ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <Link
                    to={`/admin/application/${app._id}`}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
                  >
                    Review Application
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewCandidates;
