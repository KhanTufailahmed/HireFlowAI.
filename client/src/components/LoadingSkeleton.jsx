export const JobCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-slate-200 rounded w-28"></div>
      <div className="h-4 bg-slate-200 rounded w-20"></div>
    </div>
    <div className="h-6 bg-slate-200 rounded w-48 mb-3"></div>
    <div className="h-3.5 bg-slate-200 rounded w-full mb-2"></div>
    <div className="h-3.5 bg-slate-200 rounded w-4/5 mb-6"></div>
    <div className="flex gap-2 mb-6">
      <div className="h-6 bg-slate-200 rounded-full w-16"></div>
      <div className="h-6 bg-slate-200 rounded-full w-20"></div>
      <div className="h-6 bg-slate-200 rounded-full w-14"></div>
    </div>
    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
    </div>
  </div>
);

export const JobsLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="h-12 bg-slate-200/80 rounded-xl animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
    </div>
  </div>
);

export default JobsLoadingSkeleton;
