import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import JobCard from "../../components/JobCard";
import JobsLoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { jobApi } from "../../services/api";
import { Search, RotateCcw } from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [expFilter, setExpFilter] = useState("all");

  const loadJobs = () => {
    setLoading(true);
    setError(null);
    jobApi.getAllJobs()
      .then((res) => {
        if (res.data?.success) {
          setJobs(res.data.jobs || []);
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "We encountered an error while loading the available opportunities."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    jobApi.getAllJobs()
      .then((res) => {
        if (isMounted && res.data?.success) {
          setJobs(res.data.jobs || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message || "We encountered an error while loading the available opportunities."
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

  const handleReset = () => {
    setSearchQuery("");
    setExpFilter("all");
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title?.toLowerCase().includes(q) ||
        job.description?.toLowerCase().includes(q) ||
        job.requiredSkills?.some((s) => s.toLowerCase().includes(q));

      const matchesExp =
        expFilter === "all" ||
        (expFilter === "entry" && (job.minimumExperience || 0) === 0) ||
        (expFilter === "mid" && (job.minimumExperience || 0) >= 1 && (job.minimumExperience || 0) <= 2) ||
        (expFilter === "senior" && (job.minimumExperience || 0) >= 3);

      return matchesSearch && matchesExp;
    });
  }, [jobs, searchQuery, expFilter]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Available Opportunities
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Browse elite verified software engineering roles actively matched to our talent pool.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 mb-8 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job title, skills, or tech keywords..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-hidden focus:border-indigo-600 cursor-pointer"
            >
              <option value="all">Experience (All)</option>
              <option value="entry">Entry Level</option>
              <option value="mid">1-2 Years Experience</option>
              <option value="senior">3+ Years Experience</option>
            </select>

            {(searchQuery || expFilter !== "all") && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <JobsLoadingSkeleton />
        ) : error ? (
          <ErrorState
            title="Something Went Wrong"
            message={error}
            onRetry={loadJobs}
          />
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            title="No Jobs Found"
            message="There are no available opportunities matching your criteria. Try adjusting your filters or check back later."
            onAction={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
