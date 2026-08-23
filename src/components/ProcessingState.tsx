import React, { useEffect, useState } from "react";
import { Sparkles, FileText, Cpu, CheckCircle2, ScanText } from "lucide-react";

interface ProcessingStateProps {
  fileName: string;
  isPdf: boolean;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  fileName,
  isPdf,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Reading Document Stream",
      desc: `Decoding ${isPdf ? "PDF bytes & layout streams" : "high-res visual pixels & channels"}`,
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: isPdf ? "Document Structure Analysis" : "Visual OCR & Text Recognition",
      desc: isPdf
        ? "Extracting headings, body copy, tables, and metadata"
        : "Scanning handwritten text, tables, headers, and numeric figures",
      icon: <ScanText className="w-5 h-5" />,
    },
    {
      title: "Gemini 3.7 Flash Reasoning Engine",
      desc: "Synthesizing core themes, eliminating noise, and enforcing anti-hallucination bounds",
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      title: "Structuring Summary & Insights",
      desc: "Compiling executive summary, itemized key takeaways, and improvement suggestions",
      icon: <Sparkles className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div
      id="processing-state-container"
      className="w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8"
    >
      {/* Header animation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
            </span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Processing & Analyzing Document...
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 truncate max-w-md">
              Target: <span className="font-semibold text-slate-700">{fileName}</span>
            </p>
          </div>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping mr-2" />
          AI Engine Active
        </div>
      </div>

      {/* Sequential Processing Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? "border-indigo-500 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-400/30"
                  : isDone
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-slate-100 bg-slate-50/40 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isCurrent
                      ? "bg-indigo-600 text-white animate-pulse"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step.icon}
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                ) : (
                  <span className="text-[10px] text-slate-400 font-semibold">Step {idx + 1}</span>
                )}
              </div>
              <h4
                className={`text-xs font-bold ${
                  isCurrent ? "text-indigo-950" : isDone ? "text-emerald-950" : "text-slate-700"
                }`}
              >
                {step.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Shimmer Skeleton Placeholder */}
      <div className="space-y-4 pt-2">
        <div className="h-6 bg-slate-200 rounded-md w-3/5 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded-sm w-full animate-pulse" />
          <div className="h-4 bg-slate-100 rounded-sm w-11/12 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded-sm w-4/5 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};
