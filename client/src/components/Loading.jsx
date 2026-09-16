const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mb-4"></div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default Loading;
