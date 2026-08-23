import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Trash2,
  FileText,
  Pin,
  Eye,
  ArrowRight,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpDown,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Zap,
  AlignLeft,
  CheckSquare,
  Square,
  Plus,
} from "lucide-react";
import { HistoryFilterOptions, HistoryItem, SummaryLength } from "../types";
import {
  deleteHistoryItem,
  deleteMultipleHistoryItems,
  clearAllHistory,
  togglePinHistoryItem,
  filterAndSortHistory,
} from "../services/historyStorage";
import { HistoryDetailModal } from "./HistoryDetailModal";

interface DocumentHistoryProps {
  historyItems: HistoryItem[];
  onUpdateHistory: (items: HistoryItem[]) => void;
  onOpenItemInWorkspace: (item: HistoryItem) => void;
  onNavigateToUpload: () => void;
  onOpenSamples: () => void;
}

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({
  historyItems,
  onUpdateHistory,
  onOpenItemInWorkspace,
  onNavigateToUpload,
  onOpenSamples,
}) => {
  // Filter state
  const [filters, setFilters] = useState<HistoryFilterOptions>({
    searchQuery: "",
    documentType: "all",
    lengthOption: "all",
    sortBy: "newest",
  });

  // Selection & Modal states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDetailItem, setActiveDetailItem] = useState<HistoryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isConfirmClearAllOpen, setIsConfirmClearAllOpen] = useState<boolean>(false);

  // Compute filtered items
  const filteredItems = useMemo(() => {
    return filterAndSortHistory(historyItems, filters);
  }, [historyItems, filters]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalDocs = historyItems.length;
    const totalWords = historyItems.reduce(
      (acc, it) => acc + (it.summary.estimatedWordCount || 0),
      0
    );
    const pdfCount = historyItems.filter((it) =>
      it.file.type.includes("pdf") || it.summary.documentType.toLowerCase().includes("pdf")
    ).length;
    const imageCount = historyItems.filter((it) =>
      it.file.type.includes("image") || it.summary.documentType.toLowerCase().includes("image")
    ).length;

    return { totalDocs, totalWords, pdfCount, imageCount };
  }, [historyItems]);

  // Handlers
  const handleDeleteSingle = (id: string) => {
    const updated = deleteHistoryItem(id);
    onUpdateHistory(updated);
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setConfirmDeleteId(null);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const updated = deleteMultipleHistoryItems(selectedIds);
    onUpdateHistory(updated);
    setSelectedIds([]);
  };

  const handleClearAll = () => {
    clearAllHistory();
    onUpdateHistory([]);
    setSelectedIds([]);
    setIsConfirmClearAllOpen(false);
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = togglePinHistoryItem(id);
    onUpdateHistory(updated);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopySummary = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `# ${item.summary.documentTitle}
Summary:
${item.summary.summary}

Key Takeaways:
${item.summary.keyPoints.map((kp, i) => `${String(i + 1).padStart(2, "0")}. ${kp}`).join("\n")}
`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleExportMarkdown = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `# ${item.summary.documentTitle}
**Original File**: ${item.file.name} | **Document Type**: ${item.summary.documentType} | **Language**: ${item.summary.detectedLanguage}
**Date Processed**: ${new Date(item.summary.processedAt || item.createdAt).toLocaleString()}

## Executive Summary (${item.summary.lengthOption.toUpperCase()})
${item.summary.summary}

## Key Takeaways
${item.summary.keyPoints.map((kp, i) => `${String(i + 1).padStart(2, "0")}. ${kp}`).join("\n")}

## Improvement Suggestions
${item.summary.improvementSuggestions.map((sug, i) => `- [Recommendation ${i + 1}] ${sug}`).join("\n")}
`;
    const blob = new Blob([fullText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.summary.documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      documentType: "all",
      lengthOption: "all",
      sortBy: "newest",
    });
  };

  const isAllSelected =
    filteredItems.length > 0 && selectedIds.length === filteredItems.length;

  return (
    <div id="document-history-page" className="w-full space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="border-l-4 border-indigo-600 pl-4 space-y-1">
          <label className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-[0.2em] block">
            ARCHIVE & RECORDS
          </label>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Document Summary History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, inspect, and export all previously analyzed documents and summaries.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="btn-history-upload-new"
            type="button"
            onClick={onNavigateToUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Summarize New Document</span>
          </button>

          {historyItems.length > 0 && (
            <button
              id="btn-history-clear-all"
              type="button"
              onClick={() => setIsConfirmClearAllOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              title="Clear all saved history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Analyzed
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {stats.totalDocs} <span className="text-xs font-normal text-slate-500">docs</span>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Words Processed
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-600">
            ~{stats.totalWords.toLocaleString()}{" "}
            <span className="text-xs font-normal text-slate-500">words</span>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            PDF Documents
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-600">
            {stats.pdfCount} <span className="text-xs font-normal text-slate-500">PDFs</span>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Scanned Images
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600">
            {stats.imageCount} <span className="text-xs font-normal text-slate-500">images</span>
          </p>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
        {/* Search Input and Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-history-search"
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Search by title, file name, keywords, key takeaways, or recommendations..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline">
              Sort:
            </span>
            <select
              id="select-history-sort"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as HistoryFilterOptions["sortBy"],
                }))
              }
              className="px-3 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="wordCount">Word Count (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
          <div className="flex flex-wrap items-center gap-4">
            {/* Document Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Format:
              </span>
              {(
                [
                  { id: "all", label: "All Formats" },
                  { id: "pdf", label: "PDFs" },
                  { id: "image", label: "Images" },
                ] as const
              ).map((typeOpt) => (
                <button
                  key={typeOpt.id}
                  id={`btn-filter-type-${typeOpt.id}`}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, documentType: typeOpt.id }))
                  }
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    filters.documentType === typeOpt.id
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  {typeOpt.label}
                </button>
              ))}
            </div>

            {/* Length Option Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Length:
              </span>
              {(
                [
                  { id: "all", label: "All" },
                  { id: "short", label: "Short" },
                  { id: "medium", label: "Medium" },
                  { id: "long", label: "Long" },
                ] as const
              ).map((lenOpt) => (
                <button
                  key={lenOpt.id}
                  id={`btn-filter-len-${lenOpt.id}`}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, lengthOption: lenOpt.id }))
                  }
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    filters.lengthOption === lenOpt.id
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  {lenOpt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Count & Reset */}
          {(filters.searchQuery ||
            filters.documentType !== "all" ||
            filters.lengthOption !== "all" ||
            filters.sortBy !== "newest") && (
            <button
              id="btn-reset-filters"
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. SELECTION TOOLBAR (When items exist) */}
      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 font-bold hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {isAllSelected
                  ? "Deselect All"
                  : `Select All (${filteredItems.length})`}
              </span>
            </button>

            {selectedIds.length > 0 && (
              <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {selectedIds.length} selected
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <button
              id="btn-delete-selected"
              type="button"
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-1.5 px-3 py-1 font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      )}

      {/* 5. HISTORY ITEM LIST */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isPdf = item.file.type.includes("pdf");
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                id={`history-card-${item.id}`}
                className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all relative group shadow-2xs hover:shadow-md ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Selector, Icon, Metadata, & Content */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSelectOne(item.id, e)}
                      className="mt-1 text-slate-400 hover:text-indigo-600 cursor-pointer shrink-0"
                      title="Select item"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    {/* Format Badge / Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-inner shrink-0 ${
                        isPdf
                          ? "bg-rose-100 text-rose-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {isPdf ? "PDF" : "IMG"}
                    </div>

                    {/* Main Content Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Document Title and Pin Button */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3
                            onClick={() => setActiveDetailItem(item)}
                            className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer leading-tight"
                          >
                            {item.summary.documentTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
                            <span className="text-slate-600 font-semibold truncate max-w-[200px] sm:max-w-xs">
                              {item.file.name}
                            </span>
                            <span>•</span>
                            <span className="uppercase text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {item.summary.documentType}
                            </span>
                            <span>•</span>
                            <span>{item.summary.detectedLanguage}</span>
                            {item.summary.estimatedWordCount && (
                              <>
                                <span>•</span>
                                <span>~{item.summary.estimatedWordCount} words</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Pin Button */}
                        <button
                          type="button"
                          onClick={(e) => handleTogglePin(item.id, e)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                            item.pinned
                              ? "text-amber-500 bg-amber-50"
                              : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                          title={item.pinned ? "Unpin from top" : "Pin to top"}
                        >
                          <Pin className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Summary Snippet */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                        {item.summary.summary}
                      </p>

                      {/* Feature Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                          {item.summary.lengthOption} summary
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {item.summary.keyPoints.length} Key Takeaways
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          {item.summary.improvementSuggestions.length} Suggestions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Quick View / Full Modal */}
                    <button
                      id={`btn-view-detail-${item.id}`}
                      type="button"
                      onClick={() => setActiveDetailItem(item)}
                      className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Inspect full summary"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Quick View</span>
                    </button>

                    {/* Export Markdown */}
                    <button
                      id={`btn-export-md-${item.id}`}
                      type="button"
                      onClick={(e) => handleExportMarkdown(item, e)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="Download as .md report"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Copy Summary */}
                    <button
                      id={`btn-copy-history-${item.id}`}
                      type="button"
                      onClick={(e) => handleCopySummary(item, e)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="Copy summary text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Delete Item */}
                    <button
                      id={`btn-delete-item-${item.id}`}
                      type="button"
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors cursor-pointer"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Open in Workspace / Assistant */}
                    <button
                      id={`btn-open-workspace-${item.id}`}
                      type="button"
                      onClick={() => onOpenItemInWorkspace(item)}
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      title="Restore into workspace view"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 sm:p-14 text-center space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <FileText className="w-7 h-7" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {filters.searchQuery ||
              filters.documentType !== "all" ||
              filters.lengthOption !== "all"
                ? "No matching documents found"
                : "Your document history is currently empty"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {filters.searchQuery ||
              filters.documentType !== "all" ||
              filters.lengthOption !== "all"
                ? "Try adjusting your search terms or clearing the filters above to view other records."
                : "Any PDF, image, or invoice you summarize will automatically be stored here with full takeaways and improvement recommendations."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {filters.searchQuery ||
            filters.documentType !== "all" ||
            filters.lengthOption !== "all" ? (
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onNavigateToUpload}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload a Document</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenSamples}
                  className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Load Sample Library</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <HistoryDetailModal
        item={activeDetailItem}
        isOpen={!!activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
        onRestore={onOpenItemInWorkspace}
        onDelete={handleDeleteSingle}
      />

      {/* Confirmation Dialog: Delete Single Item */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Delete Document Summary?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently remove this document and its AI summary from your history? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSingle(confirmDeleteId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Clear All History */}
      {isConfirmClearAllOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Clear Entire History?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete all {historyItems.length} saved document summaries? This will erase all archived takeaways and improvement suggestions.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmClearAllOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Clear All Documents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
