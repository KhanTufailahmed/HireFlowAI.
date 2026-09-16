import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import ScoreBadge from "../../components/ScoreBadge";
import { applicationApi } from "../../services/api";
import {
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
} from "lucide-react";

const CandidateDetails = () => {
  const { applicationId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [interviewData, setInterviewData] = useState(null);

  const loadDetails = () => {
    setLoading(true);
    setError(null);
    applicationApi.getDetails(applicationId)
      .then((res) => {
        if (res.data?.success) {
          setData(res.data);
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to load candidate application details."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    applicationApi.getDetails(applicationId)
      .then((res) => {
        if (isMounted && res.data?.success) {
          setData(res.data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load candidate application details."
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
  }, [applicationId]);

  const handleSelect = async () => {
    if (!window.confirm("Are you sure you want to select this candidate? This will automatically schedule the interview and notify the candidate.")) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await applicationApi.selectCandidate(applicationId);
      if (res.data.success) {
        setActionSuccess("selected");
        setInterviewData(res.data.interview);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to select candidate.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject this candidate?")) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await applicationApi.rejectCandidate(applicationId);
      if (res.data.success) {
        setActionSuccess("rejected");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject candidate.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <Loading message="Loading candidate profile and evaluation report..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <ErrorState
          title="Application Not Found"
          message={error || "Could not retrieve the requested candidate application."}
          onRetry={loadDetails}
        />
      </div>
    );
  }

  const { application, assessment } = data;
  const candidate = application.candidate;
  const job = application.job;
  const screening = application.screening;
  const resumeData = application.resumeData;

  const formatInterviewTime = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <Link
            to="/admin/review"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Candidates Awaiting Review
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {candidate?.name || "Candidate Evaluation"}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Applied for <strong>{job?.title || "Engineering Role"}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  actionSuccess === "selected" || application.status === "interview_scheduled"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : actionSuccess === "rejected" || application.status === "rejected"
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {actionSuccess === "selected"
                  ? "Interview Scheduled"
                  : actionSuccess === "rejected"
                  ? "Rejected"
                  : "Awaiting Admin Decision"}
              </span>
            </div>
          </div>
        </div>

        {actionSuccess === "selected" && interviewData && (
          <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-emerald-900 mb-1">
                  Candidate Selected & Interview Scheduled
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 mb-4">
                  The candidate has been accepted. An interview has been automatically scheduled in the system and an interview notification was sent.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/80 rounded-xl p-4 border border-emerald-200/70 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs">Date & Time</span>
                    <strong className="text-slate-900">
                      {formatInterviewTime(interviewData.interviewDate)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Interview Mode</span>
                    <strong className="text-slate-900 capitalize">
                      {interviewData.mode || "Online"} Interview
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Notification</span>
                    <strong className="text-emerald-700">Sent to Candidate</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {actionSuccess === "rejected" && (
          <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-sm text-rose-800">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <strong>Candidate Rejected.</strong> Application status has been updated to rejected.
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Candidate Information</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {candidate?.email}
                </span>
                {candidate?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {candidate?.phone}
                  </span>
                )}
                {resumeData?.totalExperience !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {resumeData.totalExperience} {resumeData.totalExperience === 1 ? "yr" : "yrs"} total exp
                  </span>
                )}
              </div>
            </div>

            {application.resumeUrl && (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm font-semibold transition-colors shrink-0"
              >
                <FileText className="w-4 h-4" />
                View Uploaded PDF Resume
              </a>
            )}
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  AI Resume Screening Report
                </h3>
              </div>
              <ScoreBadge score={screening?.score || 0} label="Screening Score" size="sm" />
            </div>

            {screening?.summary && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {screening.summary}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 text-xs">
              <div>
                <span className="font-semibold text-emerald-700 block mb-1.5">
                  Matched Skills ({screening?.matchedSkills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {screening?.matchedSkills?.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-md border border-emerald-200"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-rose-700 block mb-1.5">
                  Missing Skills ({screening?.missingSkills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {screening?.missingSkills?.length > 0 ? (
                    screening.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-rose-50 text-rose-700 font-medium px-2 py-0.5 rounded-md border border-rose-200"
                      >
                        ✗ {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None identified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Technical Assessment Evaluation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                5 Scenario questions evaluated by Gemini AI
              </p>
            </div>

            <ScoreBadge
              score={assessment?.totalScore || 0}
              label="Assessment Score"
              size="lg"
            />
          </div>

          {assessment?.questions && assessment.questions.length > 0 ? (
            <div className="space-y-6 divide-y divide-slate-100">
              {assessment.questions.map((q, idx) => (
                <div key={q._id || idx} className={idx > 0 ? "pt-6" : ""}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Question {idx + 1} of {assessment.questions.length}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Score: {q.score !== undefined ? `${q.score} / 10` : "Pending"}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3">
                    {q.question}
                  </h3>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Candidate's Answer
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                      {q.candidateAnswer || "No answer provided"}
                    </p>
                  </div>

                  {q.feedback && (
                    <div className="bg-indigo-50/40 rounded-xl p-3.5 border border-indigo-100/60 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-indigo-900 block mb-0.5">
                          AI Assessment Feedback
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {q.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No assessment questions found for this candidate.
            </p>
          )}
        </div>

        {!actionSuccess && application.status === "admin_review" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Final Recruiter Decision
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Selecting the candidate automatically creates the interview and notifies them.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Reject Candidate
              </button>

              <button
                type="button"
                onClick={handleSelect}
                disabled={actionLoading}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Select Candidate"
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateDetails;
