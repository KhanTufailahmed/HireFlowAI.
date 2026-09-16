import { Link } from "react-router-dom";
import { Briefcase, ArrowRight } from "lucide-react";

const JobCard = ({ job }) => {
  if (!job) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50/60 px-2.5 py-0.5 rounded-md">
            ENGINEERING
          </span>
          <span className="text-xs font-medium text-slate-500">
            {job.status === "active" ? "Active Role" : "Closed"}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
          {job.title}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {job.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-indigo-50 text-indigo-700 font-medium text-xs px-2.5 py-1 rounded-full border border-indigo-100/60"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {job.minimumExperience > 0
              ? `${job.minimumExperience}+ year${job.minimumExperience === 1 ? "" : "s"} experience`
              : "Entry Level"}
          </span>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 border border-indigo-600/70 hover:bg-indigo-50 active:bg-indigo-100 px-3.5 py-1.5 rounded-lg transition-colors"
        >
          View Job
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
