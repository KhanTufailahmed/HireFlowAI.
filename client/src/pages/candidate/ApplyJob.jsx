import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AIProcessingView from "../../components/AIProcessingView";
import { jobApi, applicationApi } from "../../services/api";
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

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
          setError(err.response?.data?.message || "Failed to load job details.");
        }
      });
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const handleFile = (file) => {
    setError("");
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF document (.pdf) for AI screening.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please attach your PDF resume to proceed.");
      return;
    }

    setError("");
    setLoading(true);
    setIsProcessingAI(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await applicationApi.apply(jobId, formData);

      if (res.data.success && res.data.application?._id) {
        setTimeout(() => {
          navigate(`/assessment/${res.data.application._id}`);
        }, 3000);
      } else {
        setIsProcessingAI(false);
        setLoading(false);
        setError("Failed to generate application. Please try again.");
      }
    } catch (err) {
      setIsProcessingAI(false);
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Application submission failed. You may have already applied for this role."
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = Math.round(bytes / 1024);
    if (kb > 1024) {
      return `${(kb / 1024).toFixed(1)} MB`;
    }
    return `${kb} KB`;
  };

  if (isProcessingAI) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <AIProcessingView activeStep={3} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Apply for {job?.title || "Developer Role"}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Upload your resume. HireFlow AI extracts your skills and screens you instantly.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Upload Resume / CV
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-indigo-600 bg-indigo-50/50"
                : "border-indigo-200 bg-indigo-50/20 hover:bg-indigo-50/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100/60">
              <UploadCloud className="w-7 h-7" />
            </div>

            <p className="text-sm font-semibold text-slate-800 mb-1">
              Drag and drop your resume here
            </p>
            <p className="text-xs text-indigo-600 font-semibold mb-2">
              or browse files
            </p>
            <p className="text-xs text-slate-400">
              Supports PDF documents up to 10MB
            </p>
          </div>

          {selectedFile && (
            <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(selectedFile.size)} • Ready for AI screening
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedFile}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Submit Application
            </button>

            <div className="text-center">
              <Link
                to={`/jobs/${jobId}`}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Job Description
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplyJob;
