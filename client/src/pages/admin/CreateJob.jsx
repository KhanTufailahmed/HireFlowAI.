import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { jobApi } from "../../services/api";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";

const CreateJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [minimumExperience, setMinimumExperience] = useState(1);
  const [screeningThreshold, setScreeningThreshold] = useState(70);
  const [assessmentPassingScore, setAssessmentPassingScore] = useState(60);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!title.trim() || !description.trim() || skillsArray.length === 0) {
      setError("Title, description, and at least one required skill are required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        requiredSkills: skillsArray,
        minimumExperience: Number(minimumExperience) || 0,
        screeningThreshold: Number(screeningThreshold) || 70,
        assessmentPassingScore: Number(assessmentPassingScore) || 60,
      };

      const res = await jobApi.createJob(payload);

      if (res.data.success) {
        navigate("/admin/jobs");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create job posting. Please check inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Link
            to="/admin/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to My Jobs
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create New Job Posting
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Define requirements and qualification thresholds for automatic candidate screening.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Job Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Backend Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Job Description *
              </label>
              <textarea
                id="description"
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe role responsibilities, team environment, and core objectives..."
                className="w-full p-4 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Required Skills (Comma Separated) *
              </label>
              <input
                id="skills"
                type="text"
                required
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Node.js, Express, MongoDB, Docker, REST APIs"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">
                Gemini will use these exact skills to match against candidate resumes.
              </p>
            </div>

            <div>
              <label
                htmlFor="exp"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Minimum Experience (Years)
              </label>
              <input
                id="exp"
                type="number"
                min={0}
                max={20}
                value={minimumExperience}
                onChange={(e) => setMinimumExperience(e.target.value)}
                className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="screeningThreshold"
                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Resume Screening Threshold:{" "}
                    <span className="text-indigo-600 font-bold">{screeningThreshold}%</span>
                  </label>
                  <span className="text-xs text-slate-400">Default: 70%</span>
                </div>
                <input
                  id="screeningThreshold"
                  type="range"
                  min={10}
                  max={95}
                  value={screeningThreshold}
                  onChange={(e) => setScreeningThreshold(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Candidates below this AI resume match score will be filtered out.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="assessmentPassingScore"
                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Assessment Passing Score:{" "}
                    <span className="text-indigo-600 font-bold">{assessmentPassingScore}%</span>
                  </label>
                  <span className="text-xs text-slate-400">Default: 60%</span>
                </div>
                <input
                  id="assessmentPassingScore"
                  type="range"
                  min={10}
                  max={95}
                  value={assessmentPassingScore}
                  onChange={(e) => setAssessmentPassingScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Minimum technical evaluation score required to advance to Admin Review.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/admin/jobs"
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Job...
                  </>
                ) : (
                  "Create Job Posting"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
