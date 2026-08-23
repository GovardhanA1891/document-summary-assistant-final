import React, { useState } from "react";
import {
  X,
  FileText,
  Copy,
  Check,
  Download,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  ListChecks,
  Lightbulb,
  Globe,
  Tag,
  Hash,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { HistoryItem } from "../types";

interface HistoryDetailModalProps {
  item: HistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onRestore,
  onDelete,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showDocPreview, setShowDocPreview] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const { summary, file, createdAt } = item;
  const isPdf = file.type.includes("pdf");

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  const formattedKeyPointsText = summary.keyPoints
    .map((point, i) => `${String(i + 1).padStart(2, "0")}. ${point}`)
    .join("\n");

  const formattedSuggestionsText = summary.improvementSuggestions
    .map((sug, i) => `[Recommendation ${i + 1}] ${sug}`)
    .join("\n");

  const fullReportMarkdown = `# ${summary.documentTitle}
**Original File**: ${file.name} | **Document Type**: ${summary.documentType} | **Detected Language**: ${summary.detectedLanguage}
**Processed Date**: ${new Date(summary.processedAt || createdAt).toLocaleString()}

## Executive Summary (${summary.lengthOption.toUpperCase()})
${summary.summary}

## Key Takeaways
${summary.keyPoints.map((kp, i) => `${String(i + 1).padStart(2, "0")}. ${kp}`).join("\n")}

## Improvement Suggestions
${summary.improvementSuggestions.map((sug, i) => `- [Recommendation ${i + 1}] ${sug}`).join("\n")}
`;

  const downloadMarkdownReport = () => {
    const blob = new Blob([fullReportMarkdown], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${summary.documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="history-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="history-detail-modal-content"
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {summary.documentTitle}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 uppercase tracking-wider shrink-0">
                  {summary.lengthOption}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {file.name} • {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Download Report */}
            <button
              id="btn-modal-download-md"
              type="button"
              onClick={downloadMarkdownReport}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Download Markdown Report"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Copy All */}
            <button
              id="btn-modal-copy-all"
              type="button"
              onClick={() => handleCopy(fullReportMarkdown, "full")}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy entire report"
            >
              {copiedSection === "full" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Close */}
            <button
              id="btn-modal-close"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 flex-1">
          {/* Document Title Banner */}
          <div className="border-l-4 border-indigo-600 pl-4 space-y-1">
            <label className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-[0.2em] block">
              HISTORICAL SUMMARY
            </label>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {summary.documentTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {summary.documentType}
              </span>
              <span>•</span>
              <span>{summary.detectedLanguage}</span>
              {summary.estimatedWordCount && (
                <>
                  <span>•</span>
                  <span>~{summary.estimatedWordCount} words</span>
                </>
              )}
              <span>•</span>
              <span>Archived {new Date(createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Toggle Source Document Preview (if preview URL exists) */}
          {file.previewUrl && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div
                onClick={() => setShowDocPreview(!showDocPreview)}
                className="flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  {showDocPreview ? <EyeOff className="w-4 h-4 text-indigo-600" /> : <Eye className="w-4 h-4 text-indigo-600" />}
                  <span>{showDocPreview ? "Hide Original Source Document" : "Inspect Original Source Document"}</span>
                </div>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  {showDocPreview ? "Collapse" : "Expand"}
                </span>
              </div>

              {showDocPreview && (
                <div className="p-4 bg-slate-100 border-t border-slate-200 max-h-72 overflow-auto flex justify-center">
                  {isPdf ? (
                    <iframe
                      src={file.previewUrl}
                      title={file.name}
                      className="w-full h-64 border border-slate-300 rounded-lg bg-white"
                    />
                  ) : (
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      referrerPolicy="no-referrer"
                      className="max-h-64 object-contain rounded-lg border border-slate-300 shadow-xs"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* 1. Executive Summary */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span>Executive Summary</span>
              </h4>
              <button
                type="button"
                onClick={() => handleCopy(summary.summary, "summary")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
              >
                {copiedSection === "summary" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {summary.summary}
            </div>
          </section>

          {/* 2. Key Takeaways & Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Takeaways */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Key Takeaways</span>
                </h4>
                <button
                  type="button"
                  onClick={() => handleCopy(formattedKeyPointsText, "keypoints")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  {copiedSection === "keypoints" ? "Copied" : "Copy"}
                </button>
              </div>

              <ul className="space-y-2.5">
                {summary.keyPoints.map((kp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium"
                  >
                    <span className="text-indigo-600 font-mono font-bold text-xs shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Improvement Suggestions */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Improvement Suggestions</span>
                </h4>
                <button
                  type="button"
                  onClick={() => handleCopy(formattedSuggestionsText, "suggestions")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  {copiedSection === "suggestions" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="space-y-2.5">
                {summary.improvementSuggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs sm:text-sm text-amber-950 font-medium relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 w-1 h-full bg-amber-400" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">
                      Recommendation {idx + 1}
                    </p>
                    <p>{sug}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onDelete(item.id);
              onClose();
            }}
            className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Document</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onRestore(item);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>Open in Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
