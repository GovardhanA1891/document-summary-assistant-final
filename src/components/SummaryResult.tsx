import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Check,
  Copy,
  RotateCcw,
  UploadCloud,
  Eye,
  EyeOff,
  ListChecks,
  Lightbulb,
  Download,
  Calendar,
  Globe,
  Tag,
  Hash,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";
import { SummaryLength, SummaryResultData } from "../types";

interface SummaryResultProps {
  data: SummaryResultData;
  onGenerateAgain: (newLength?: SummaryLength) => void;
  onUploadAnother: () => void;
  onTogglePreview?: () => void;
  isPreviewOpen?: boolean;
  isPdf: boolean;
}

export const SummaryResult: React.FC<SummaryResultProps> = ({
  data,
  onGenerateAgain,
  onUploadAnother,
  onTogglePreview,
  isPreviewOpen,
  isPdf,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(sectionKey);
      setTimeout(() => {
        setCopiedSection(null);
      }, 2200);
    });
  };

  const formattedKeyPointsText = data.keyPoints
    .map((point, i) => `${String(i + 1).padStart(2, "0")}. ${point}`)
    .join("\n");

  const formattedSuggestionsText = data.improvementSuggestions
    .map((sug, i) => `[Suggestion ${i + 1}] ${sug}`)
    .join("\n");

  const fullReportMarkdown = `# ${data.documentTitle}
**Document Type**: ${data.documentType} | **Detected Language**: ${data.detectedLanguage} | **Processed**: ${new Date(data.processedAt).toLocaleString()}

## Executive Summary (${data.lengthOption.toUpperCase()})
${data.summary}

## Key Takeaways
${data.keyPoints.map((kp, i) => `${String(i + 1).padStart(2, "0")}. ${kp}`).join("\n")}

## Improvement Suggestions
${data.improvementSuggestions.map((sug, i) => `- [Recommendation ${i + 1}] ${sug}`).join("\n")}
`;

  const downloadMarkdownReport = () => {
    const blob = new Blob([fullReportMarkdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="summary-results-container" className="w-full space-y-8 animate-in fade-in duration-300">
      {/* 1. DOCUMENT TITLE BANNER (Professional Polish Theme) */}
      <div id="section-document-title" className="border-l-4 border-indigo-600 pl-6 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-[0.2em] block">
            DOCUMENT TITLE
          </label>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {data.documentType}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-medium text-slate-500">
            {data.detectedLanguage}
          </span>
          {data.estimatedWordCount && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-medium text-slate-500">
                ~{data.estimatedWordCount} words
              </span>
            </>
          )}
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          {data.documentTitle}
        </h2>
      </div>

      {/* 2. EXECUTIVE SUMMARY SECTION */}
      <section id="section-summary" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span>Executive Summary</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">
              {data.lengthOption}
            </span>
          </h3>
          <div className="h-px flex-1 mx-4 sm:mx-6 bg-slate-200"></div>
          <button
            id="btn-copy-summary"
            type="button"
            onClick={() => handleCopy(data.summary, "summary")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            {copiedSection === "summary" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied Text</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-50/80 p-6 sm:p-8 rounded-2xl border border-slate-200/80 leading-relaxed text-slate-700 text-base sm:text-lg whitespace-pre-line shadow-2xs font-normal">
          {data.summary}
        </div>
      </section>

      {/* 3. TWO-COLUMN GRID: KEY TAKEAWAYS & IMPROVEMENT SUGGESTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        {/* Left Column: Key Takeaways with Numbered Index (01, 02, 03...) */}
        <section id="section-key-points" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Key Takeaways
            </h3>
            <div className="h-px flex-1 mx-4 bg-slate-200"></div>
            <button
              id="btn-copy-key-points"
              type="button"
              onClick={() => handleCopy(formattedKeyPointsText, "keypoints")}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              {copiedSection === "keypoints" ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <ul className="space-y-4">
            {data.keyPoints.map((point, index) => {
              const formattedNumber = String(index + 1).padStart(2, "0");
              return (
                <li
                  key={index}
                  id={`key-point-item-${index + 1}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 group hover:border-indigo-200 hover:bg-indigo-50/20 transition-all"
                >
                  <span className="text-indigo-600 font-mono font-black text-sm shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                    {formattedNumber}
                  </span>
                  <p className="text-sm text-slate-700 leading-snug font-medium">
                    {point}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Right Column: Improvement Suggestions with Accent Border Strips */}
        <section id="section-improvement-suggestions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Improvement Suggestions
            </h3>
            <div className="h-px flex-1 mx-4 bg-slate-200"></div>
            <button
              id="btn-copy-suggestions"
              type="button"
              onClick={() => handleCopy(formattedSuggestionsText, "suggestions")}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              {copiedSection === "suggestions" ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {data.improvementSuggestions.map((suggestion, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  id={`improvement-suggestion-item-${index + 1}`}
                  className={`p-5 rounded-xl border relative overflow-hidden transition-all ${
                    isEven
                      ? "bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50"
                      : "bg-amber-50/60 border-amber-200/80 hover:bg-amber-50"
                  }`}
                >
                  {/* Right-edge accent indicator bar */}
                  <div
                    className={`absolute right-0 top-0 w-1.5 h-full ${
                      isEven ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                      isEven ? "text-emerald-800" : "text-amber-800"
                    }`}
                  >
                    Recommendation {index + 1}
                  </p>
                  <p
                    className={`text-sm leading-snug font-medium ${
                      isEven ? "text-emerald-950" : "text-amber-950"
                    }`}
                  >
                    {suggestion}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 4. REGENERATION BAR */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Switch Summary Granularity</span>
          </h4>
          <p className="text-xs text-slate-500">
            Re-run Gemini multimodal synthesis at a different depth in 1-click
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["short", "medium", "long"] as SummaryLength[]).map((len) => (
            <button
              key={len}
              id={`btn-regen-${len}`}
              type="button"
              onClick={() => onGenerateAgain(len)}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                data.lengthOption === len
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {len.charAt(0).toUpperCase() + len.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

