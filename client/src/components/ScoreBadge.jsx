const ScoreBadge = ({ score = 0, label = "", size = "md" }) => {
  const num = Math.round(score);

  let colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (num < 60) {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (num < 75) {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
  }

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-base px-3.5 py-1.5 font-bold"
      : "text-sm px-2.5 py-1 font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${colorClasses} ${sizeClasses}`}
    >
      {label && <span className="opacity-75">{label}:</span>}
      <span>{num}%</span>
    </span>
  );
};

export default ScoreBadge;
