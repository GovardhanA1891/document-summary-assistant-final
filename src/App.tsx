import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { Dropzone } from "./components/Dropzone";
import { LengthSelector } from "./components/LengthSelector";
import { ProcessingState } from "./components/ProcessingState";
import { SummaryResult } from "./components/SummaryResult";
import { DocumentPreview } from "./components/DocumentPreview";
import { SampleDocuments } from "./components/SampleDocuments";
import { ErrorAlert } from "./components/ErrorAlert";
import { DocInfoModal } from "./components/DocInfoModal";
import { DocumentHistory } from "./components/DocumentHistory";
import { DocumentFile, HistoryItem, SummaryLength, SummaryResultData } from "./types";
import { summarizeDocument, checkServerHealth } from "./services/api";
import { getHistory, saveHistoryItem } from "./services/historyStorage";
import {
  Sparkles,
  FileText,
  UploadCloud,
  Layers,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  Download,
  Copy,
  Check,
  RefreshCw,
  X,
  FileCheck,
  History,
  LayoutDashboard,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"workspace" | "history">("workspace");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);
  const [lengthOption, setLengthOption] = useState<SummaryLength>("medium");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isSamplesOpen, setIsSamplesOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<"checking" | "connected" | "warning">("checking");
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Initialize history and check server health on load
  useEffect(() => {
    // Load persisted history
    const savedHistory = getHistory();
    setHistoryItems(savedHistory);

    // Check API health
    checkServerHealth()
      .then((res) => {
        if (res.status === "ok") {
          setServerStatus(res.geminiConfigured ? "connected" : "warning");
        } else {
          setServerStatus("warning");
        }
      })
      .catch(() => setServerStatus("warning"));
  }, []);

  const handleFileSelect = (file: DocumentFile) => {
    setSelectedFile(file);
    setError(null);
    setSummaryResult(null);
    setIsPreviewOpen(false);
    setActiveTab("workspace");
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setSummaryResult(null);
    setError(null);
    setIsPreviewOpen(false);
  };

  const executeSummarization = useCallback(
    async (fileToProcess?: DocumentFile, lengthToUse?: SummaryLength) => {
      const file = fileToProcess || selectedFile;
      const length = lengthToUse || lengthOption;

      if (!file) {
        setError("Please select or drop a document to summarize.");
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const result = await summarizeDocument({
          fileBase64: file.base64,
          mimeType: file.type,
          fileName: file.name,
          lengthOption: length,
        });

        setSummaryResult(result);

        // Automatically persist into Document History
        const updatedHistory = saveHistoryItem(file, result);
        setHistoryItems(updatedHistory);
      } catch (err: any) {
        console.error("Summarization failed:", err);
        setError(err.message || "Failed to process document with Gemini AI.");
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedFile, lengthOption]
  );

  const handleGenerateAgain = (newLength?: SummaryLength) => {
    const targetLength = newLength || lengthOption;
    if (newLength) {
      setLengthOption(newLength);
    }
    executeSummarization(selectedFile || undefined, targetLength);
  };

  const handleOpenItemFromHistory = (item: HistoryItem) => {
    setSelectedFile(item.file);
    setSummaryResult(item.summary);
    setLengthOption(item.summary.lengthOption);
    setError(null);
    setIsPreviewOpen(!!item.file.previewUrl);
    setActiveTab("workspace");
  };

  const handleCopyAll = () => {
    if (!summaryResult) return;
    const fullText = `# ${summaryResult.documentTitle}
Summary:
${summaryResult.summary}

Key Takeaways:
${summaryResult.keyPoints.map((kp, i) => `${String(i + 1).padStart(2, "0")}. ${kp}`).join("\n")}

Improvement Suggestions:
${summaryResult.improvementSuggestions.map((sug, i) => `- [Recommendation ${i + 1}] ${sug}`).join("\n")}
`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2200);
    });
  };

  const downloadMarkdownReport = () => {
    if (!summaryResult) return;
    const fullText = `# ${summaryResult.documentTitle}
**Document Type**: ${summaryResult.documentType} | **Detected Language**: ${summaryResult.detectedLanguage} | **Processed**: ${new Date(summaryResult.processedAt).toLocaleString()}

## Executive Summary (${summaryResult.lengthOption.toUpperCase()})
${summaryResult.summary}

## Key Takeaways
${summaryResult.keyPoints.map((kp, i) => `${String(i + 1).padStart(2, "0")}. ${kp}`).join("\n")}

## Improvement Suggestions
${summaryResult.improvementSuggestions.map((sug, i) => `- [Recommendation ${i + 1}] ${sug}`).join("\n")}
`;
    const blob = new Blob([fullText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${summaryResult.documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isPdf = !!selectedFile?.type.includes("pdf");

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
      {/* Top App Header with Tab Switcher */}
      <Header
        currentTab={activeTab}
        onTabChange={setActiveTab}
        historyCount={historyItems.length}
        onOpenSamples={() => setIsSamplesOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        serverStatus={serverStatus}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] w-full mx-auto border-x border-slate-200/80 bg-white shadow-sm">
        {/* LEFT SIDEBAR / CONTROL PANEL (Visible in Workspace mode, or quick launcher) */}
        <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0">
          {/* Workspace Controls or Navigation shortcuts */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* View Selector Card */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Workspace Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("workspace")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "workspace"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Assistant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "history"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History ({historyItems.length})</span>
                </button>
              </div>
            </div>

            {/* Current Active Document Info */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">
                Active Document
              </label>

              {selectedFile ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 relative group">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner shrink-0 ${
                      isPdf
                        ? "bg-rose-100 text-rose-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {isPdf ? "PDF" : "IMG"}
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p
                      className="text-xs font-bold text-slate-800 truncate"
                      title={selectedFile.name}
                    >
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {formatFileSize(selectedFile.size)} • Validated
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleFileRemove}
                    disabled={isProcessing}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove document"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setActiveTab("workspace");
                    setIsSamplesOpen(true);
                  }}
                  className="bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all hover:bg-indigo-50/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-700">No document loaded</p>
                    <p className="text-[11px] text-slate-400">Choose file or pick sample</p>
                  </div>
                </div>
              )}
            </div>

            {/* Granularity / Summary Length Option */}
            <LengthSelector
              value={lengthOption}
              onChange={(newLen) => {
                setLengthOption(newLen);
                if (summaryResult && !isProcessing && activeTab === "workspace") {
                  executeSummarization(selectedFile || undefined, newLen);
                }
              }}
              disabled={isProcessing}
              layout="vertical"
            />

            {/* Quick History Recent Items Preview in Sidebar */}
            {historyItems.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Recent History
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("history")}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    View All ({historyItems.length})
                  </button>
                </div>

                <div className="space-y-1.5">
                  {historyItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenItemFromHistory(item)}
                      className="p-2 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          item.file.type.includes("pdf")
                            ? "bg-rose-100 text-rose-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.file.type.includes("pdf") ? "PDF" : "IMG"}
                      </span>
                      <p className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 truncate flex-1">
                        {item.summary.documentTitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engine Info Box */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 space-y-1">
              <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                Multimodal AI Engine
              </p>
              <p className="text-xs text-indigo-700/80 leading-relaxed">
                Gemini 3.7 Flash parses PDFs, charts, receipts, and notes without OCR degradation.
              </p>
            </div>
          </div>

          {/* Sidebar Action Buttons */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
            <button
              id="btn-sidebar-generate"
              type="button"
              onClick={() => {
                setActiveTab("workspace");
                executeSummarization();
              }}
              disabled={!selectedFile || isProcessing}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{summaryResult ? "Re-Generate Summary" : "Generate Summary"}</span>
            </button>

            <div className="flex gap-2">
              <button
                id="btn-sidebar-upload-new"
                type="button"
                onClick={() => {
                  handleFileRemove();
                  setActiveTab("workspace");
                }}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
              >
                Upload New
              </button>

              <button
                id="btn-sidebar-browse-samples"
                type="button"
                onClick={() => {
                  setIsSamplesOpen(true);
                }}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-white text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all cursor-pointer text-center"
              >
                Browse Samples
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT / MAIN CONTENT STAGE */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden shadow-2xl min-w-0">
          {/* Main Top Header Ribbon */}
          <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 sm:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-3">
              {activeTab === "history" ? (
                <>
                  <History className="w-4 h-4 text-indigo-600" />
                  <p className="text-sm font-semibold text-slate-700">
                    Document History Archive ({historyItems.length} records)
                  </p>
                </>
              ) : isProcessing ? (
                <>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-ping shadow-sm shadow-indigo-200"></span>
                  <p className="text-sm font-semibold text-slate-700">
                    Gemini AI analyzing document structure and content...
                  </p>
                </>
              ) : summaryResult ? (
                <>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200"></span>
                  <p className="text-sm font-semibold text-slate-700">
                    Processing complete. Saved to History.
                  </p>
                </>
              ) : (
                <>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                  <p className="text-sm font-semibold text-slate-500">
                    {selectedFile
                      ? `"${selectedFile.name}" selected. Click Generate Summary.`
                      : "Ready. Select or drop a document to begin."}
                  </p>
                </>
              )}
            </div>

            {/* Quick action tools on header */}
            {activeTab === "workspace" && summaryResult && (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* View Original Source Document */}
                <button
                  id="btn-header-view-source"
                  type="button"
                  onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isPreviewOpen
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                  title="Toggle side-by-side source document preview"
                >
                  {isPreviewOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">
                    {isPreviewOpen ? "Hide Source" : "View Source"}
                  </span>
                </button>

                {/* Export Markdown */}
                <button
                  id="btn-header-export-md"
                  type="button"
                  onClick={downloadMarkdownReport}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download .md summary report"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Export .md</span>
                </button>

                {/* Copy All */}
                <button
                  id="btn-header-copy-all"
                  type="button"
                  onClick={handleCopyAll}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy full summary report to clipboard"
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copy All</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </header>

          {/* Scrollable Stage Body */}
          <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-10 lg:p-12 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Error Alert Display */}
              {error && (
                <ErrorAlert
                  error={error}
                  onRetry={() => executeSummarization()}
                  onDismiss={() => setError(null)}
                />
              )}

              {/* TAB 1: DOCUMENT HISTORY VIEW */}
              {activeTab === "history" && (
                <DocumentHistory
                  historyItems={historyItems}
                  onUpdateHistory={setHistoryItems}
                  onOpenItemInWorkspace={handleOpenItemFromHistory}
                  onNavigateToUpload={() => {
                    handleFileRemove();
                    setActiveTab("workspace");
                  }}
                  onOpenSamples={() => setIsSamplesOpen(true)}
                />
              )}

              {/* TAB 2: ASSISTANT WORKSPACE VIEW */}
              {activeTab === "workspace" && (
                <>
                  {/* State 1: Upload View */}
                  {!summaryResult && !isProcessing && (
                    <div className="space-y-8">
                      {/* Hero Introduction */}
                      <div className="border-l-4 border-indigo-600 pl-6 space-y-2">
                        <label className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-[0.2em] block">
                          DOCUMENT INTELLIGENCE
                        </label>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                          Summarize any PDF, Invoice, or Scanned Document
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl pt-1">
                          Upload research papers, technical specs, scanned receipts, or handwritten notes. Gemini extracts key takeaways and suggests actionable improvements without hallucination.
                        </p>
                      </div>

                      {/* Dropzone container */}
                      <div className="bg-white rounded-2xl">
                        <Dropzone
                          currentFile={selectedFile}
                          onFileSelect={handleFileSelect}
                          onFileRemove={handleFileRemove}
                          isProcessing={isProcessing}
                        />
                      </div>

                      {/* Ready Presets Bar */}
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              Pre-loaded Assessment Test Documents
                            </h4>
                            <p className="text-xs text-slate-500">
                              Test architecture PDFs, clinical studies, cloud invoices, and scanned sprint retro notes
                            </p>
                          </div>
                        </div>

                        <button
                          id="btn-open-sample-library-body"
                          type="button"
                          onClick={() => setIsSamplesOpen(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all shadow-2xs cursor-pointer"
                        >
                          <span>Explore Sample Library</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* State 2: Processing / Loading State */}
                  {isProcessing && selectedFile && (
                    <div className="space-y-6">
                      <ProcessingState fileName={selectedFile.name} isPdf={isPdf} />
                    </div>
                  )}

                  {/* State 3: Summary Results & Side-by-Side Verification */}
                  {summaryResult && !isProcessing && (
                    <div
                      className={`grid grid-cols-1 ${
                        isPreviewOpen ? "xl:grid-cols-12" : "w-full"
                      } gap-8 items-start`}
                    >
                      <div className={isPreviewOpen ? "xl:col-span-7" : "w-full"}>
                        <SummaryResult
                          data={summaryResult}
                          onGenerateAgain={handleGenerateAgain}
                          onUploadAnother={handleFileRemove}
                          onTogglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
                          isPreviewOpen={isPreviewOpen}
                          isPdf={isPdf}
                        />
                      </div>

                      {/* Right Column: Source Document Verification Previewer */}
                      {isPreviewOpen && selectedFile && (
                        <div className="xl:col-span-5 sticky top-6">
                          <DocumentPreview
                            file={selectedFile}
                            onClose={() => setIsPreviewOpen(false)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer Ribbon (Professional Polish Theme) */}
          <footer className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Security Mode
                </span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded">
                  ENCRYPTED
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  API Engine
                </span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-bold rounded uppercase">
                  Gemini 3.7 Flash
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Saved Records
                </span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded">
                  {historyItems.length}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium italic">
              Confidential Output • Technical Evaluation Sandbox
            </p>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <SampleDocuments
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        onSelectSample={handleFileSelect}
      />

      <DocInfoModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}

