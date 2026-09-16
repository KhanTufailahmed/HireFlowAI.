import { AlertCircle } from "lucide-react";

const ErrorState = ({
  title = "Something Went Wrong",
  message = "We encountered an error while processing your request. Please try again.",
  onRetry,
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100">
        <AlertCircle className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
      <div className="space-y-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
          >
            Try Again
          </button>
        )}
        <div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors underline underline-offset-4 cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
