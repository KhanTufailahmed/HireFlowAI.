import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const AIProcessingView = ({ activeStep = 3 }) => {
  const [step, setStep] = useState(activeStep);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 1200);
    const timer2 = setTimeout(() => setStep(3), 2600);
    const timer3 = setTimeout(() => setStep(4), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: "Uploading Resume",
      desc: "Resume securely transmitted to servers",
    },
    {
      id: 2,
      title: "Extracting Information",
      desc: "Extracting text layers, history, and education blocks",
    },
    {
      id: 3,
      title: "AI Resume Screening",
      desc: "Matching technical qualifications and experience",
    },
    {
      id: 4,
      title: "Preparing Assessment",
      desc: "Readying customizable technical queries",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Analyzing Your Application
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Please wait while our AI reviews your resume and extracts key skill criteria.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-6">
        <div className="space-y-6">
          {steps.map((item) => {
            const isCompleted = step > item.id;
            const isCurrent = step === item.id;

            return (
              <div key={item.id} className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center relative">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs flex items-center justify-center">
                      {item.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-base font-semibold ${
                      isCompleted
                        ? "text-slate-900"
                        : isCurrent
                        ? "text-indigo-600 font-bold"
                        : "text-slate-500"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <hr className="my-6 border-slate-100" />

        <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
            Real-Time Skill Classification Vector
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>Backend Core</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full w-[90%] transition-all duration-700"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>API Design</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full w-[85%] transition-all duration-700"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>DevOps & DB</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full w-[70%] transition-all duration-700"></div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Match probability calculated: 94% compatibility detected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIProcessingView;
