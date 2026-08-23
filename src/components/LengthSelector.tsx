import React from "react";
import { Zap, AlignLeft, FileSpreadsheet, Check } from "lucide-react";
import { SummaryLength } from "../types";

interface LengthSelectorProps {
  value: SummaryLength;
  onChange: (length: SummaryLength) => void;
  disabled?: boolean;
  layout?: "grid" | "vertical";
}

interface OptionConfig {
  id: SummaryLength;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
}

export const LengthSelector: React.FC<LengthSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  layout = "vertical",
}) => {
  const options: OptionConfig[] = [
    {
      id: "short",
      title: "Short",
      badge: "2-3 Sentences",
      description: "Quick executive synopsis with core bottom line.",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      id: "medium",
      title: "Medium",
      badge: "2-3 Paragraphs",
      description: "Balanced overview with context, findings, and analysis.",
      icon: <AlignLeft className="w-3.5 h-3.5" />,
    },
    {
      id: "long",
      title: "Long",
      badge: "Comprehensive",
      description: "In-depth multi-section breakdown with data points.",
      icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
    },
  ];

  if (layout === "vertical") {
    return (
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Summary Length
        </label>
        <div className="space-y-2">
          {options.map((option) => {
            const isSelected = value === option.id;
            return (
              <button
                key={option.id}
                id={`btn-length-${option.id}`}
                type="button"
                disabled={disabled}
                onClick={() => onChange(option.id)}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-all cursor-pointer text-left ${
                  isSelected
                    ? "border-2 border-indigo-600 bg-indigo-50/50 text-indigo-700 text-sm font-bold shadow-xs"
                    : "border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "border-4 border-indigo-600 bg-white"
                        : "border-2 border-slate-300 bg-white"
                    }`}
                  />
                  <div>
                    <span className="leading-none">{option.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-2">
                      ({option.badge})
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Grid layout fallback
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Summary Granularity
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              id={`btn-length-${option.id}`}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex flex-col justify-between ${
                isSelected
                  ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {option.icon}
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        isSelected ? "text-indigo-950" : "text-slate-900"
                      }`}
                    >
                      {option.title}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {option.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {option.description}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span className={isSelected ? "text-indigo-600 font-bold" : ""}>
                  {isSelected ? "● Selected Mode" : "○ Click to Select"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

