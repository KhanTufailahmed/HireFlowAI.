import { Briefcase } from "lucide-react";

const EmptyState = ({
  title = "No Jobs Found",
  message = "There are no available opportunities matching your criteria. Try adjusting your filters or check back later.",
  actionText = "Clear All Filters",
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-2xl mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100/50">
        <Briefcase className="w-7 h-7 stroke-[1.75]" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-indigo-600 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
