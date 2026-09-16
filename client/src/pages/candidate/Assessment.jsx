import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import CircularScore from "../../components/CircularScore";
import { assessmentApi } from "../../services/api";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  Send,
  Check,
  AlertCircle,
} from "lucide-react";

const Assessment = () => {
  const { applicationId } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [isCompleted, setIsCompleted] = useState(false);
  const [resultScore, setResultScore] = useState(null);
  const [resultStatus, setResultStatus] = useState("Under Admin Review");

  const [timeLeft, setTimeLeft] = useState(45 * 60);

  const loadAssessment = () => {
    setLoading(true);
    setError(null);
    assessmentApi.getByApplicationId(applicationId)
      .then((res) => {
        if (res.data?.success) {
          const assess = res.data.assessment;
          setAssessment(assess);
          const initialAnswers = {};
          assess.questions?.forEach((q) => {
            initialAnswers[q._id] = "";
          });
          setAnswers(initialAnswers);
          if (assess.status === "submitted" || assess.status === "evaluated") {
            setIsCompleted(true);
            if (assess.totalScore !== undefined) {
              setResultScore(assess.totalScore);
            }
          }
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to load assessment questions."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    assessmentApi.getByApplicationId(applicationId)
      .then((res) => {
        if (isMounted && res.data?.success) {
          const assess = res.data.assessment;
          setAssessment(assess);
          const initialAnswers = {};
          assess.questions?.forEach((q) => {
            initialAnswers[q._id] = "";
          });
          setAnswers(initialAnswers);
          if (assess.status === "submitted" || assess.status === "evaluated") {
            setIsCompleted(true);
            if (assess.totalScore !== undefined) {
              setResultScore(assess.totalScore);
            }
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load assessment questions."
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

  useEffect(() => {
    if (isCompleted || loading || error) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, loading, error]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const currentQuestion = assessment?.questions?.[currentIndex];
  const totalQuestions = assessment?.questions?.length || 5;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const currentAnswer = currentQuestion ? answers[currentQuestion._id] || "" : "";

  const handleAnswerChange = (text) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: text,
    }));
  };

  const getWordCount = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const handleSubmit = async () => {
    setSubmitError("");

    const unanswered = assessment.questions.some(
      (q) => !answers[q._id] || !answers[q._id].trim()
    );

    if (unanswered) {
      setSubmitError(
        "Please provide answers for all questions before submitting."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = assessment.questions.map((q) => ({
        questionId: q._id,
        answer: answers[q._id].trim(),
      }));

      const res = await assessmentApi.submit(assessment._id, payload);

      if (res.data.success) {
        setResultScore(res.data.totalScore);
        if (res.data.status === "admin_review") {
          setResultStatus("Under Admin Review");
        } else if (res.data.status === "rejected") {
          setResultStatus("Evaluation Completed");
        }
        setIsCompleted(true);
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Error evaluating assessment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <Loading message="Preparing personalized technical assessment..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <ErrorState
          title="Assessment Unavailable"
          message={error}
          onRetry={loadAssessment}
        />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 sm:py-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 border border-indigo-100/60 shadow-xs">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Assessment Completed
          </h1>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-xs mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {resultStatus}
          </div>

          <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 shadow-xs mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              YOUR SCORE
            </p>

            <CircularScore score={resultScore ?? 80} size={170} strokeWidth={12} />
          </div>

          <p className="text-sm text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
            Your application and assessment results have been submitted successfully. Our hiring team will review your application and you will be notified of next steps.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              Back to Jobs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Technical Assessment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Personalized Engineering Evaluation
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-semibold text-indigo-600 mb-2">
            <span>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-slate-500">{progressPercent}% Complete</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              SCENARIO-BASED QUESTION
            </span>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)} remaining</span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed mb-6">
            {currentQuestion?.question}
          </h2>

          <div className="relative">
            <textarea
              rows={8}
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm leading-relaxed transition-all resize-y"
            ></textarea>

            <div className="text-right text-xs text-slate-400 mt-1.5">
              {getWordCount(currentAnswer)} / 1000 words
            </div>
          </div>

          {submitError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Evaluating..." : "Submit Assessment"}
            </button>

            {currentIndex < totalQuestions - 1 && (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assessment;
