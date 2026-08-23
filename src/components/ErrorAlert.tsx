import React from "react";
import { AlertOctagon, RefreshCw, X, FileQuestion, HelpCircle } from "lucide-react";

interface ErrorAlertProps {
  error: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  const isKeyError = error.toLowerCase().includes("api key") || error.toLowerCase().includes("gemini_api_key");
  const isQuotaError = error.toLowerCase().includes("quota") || error.toLowerCase().includes("rate limit") || error.toLowerCase().includes("429");
  const isCorruptError = error.toLowerCase().includes("corrupt") || error.toLowerCase().includes("empty") || error.toLowerCase().includes("unsupported");

  return (
    <div
      id="error-alert-card"
      className="w-full bg-rose-50/90 border border-rose-200 rounded-2xl p-5 sm:p-6 shadow-xs text-rose-950 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-rose-900">
              {isKeyError
                ? "Gemini API Configuration Notice"
                : isQuotaError
                ? "AI Service Rate Limit"
                : isCorruptError
                ? "Document Processing Notice"
                : "Unable to Summarize Document"}
            </h4>
            <p className="text-sm text-rose-800 leading-relaxed">{error}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-rose-500 hover:text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
          title="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Helpful context */}
      <div className="bg-white/70 border border-rose-200/80 rounded-xl p-3.5 text-xs text-rose-900 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div>
          {isKeyError ? (
            <span>
              The server communicates with Gemini via <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">GEMINI_API_KEY</code>. Verify your AI Studio Secrets panel configuration.
            </span>
          ) : isQuotaError ? (
            <span>
              Gemini API rate limits are temporarily active. Waiting a few seconds before retrying usually resolves this.
            </span>
          ) : isCorruptError ? (
            <span>
              Ensure the document is a valid PDF or standard image (PNG, JPG, WEBP) under 25 MB and contains legible text or visual content.
            </span>
          ) : (
            <span>
              Check your network connection and retry the analysis, or try selecting one of the built-in sample documents.
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          id="btn-retry-analysis"
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="px-3 py-2 text-xs sm:text-sm font-medium text-rose-800 hover:text-rose-900 bg-rose-100 hover:bg-rose-200 rounded-xl transition-colors cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
