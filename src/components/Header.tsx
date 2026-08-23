import React from "react";
import {
  FileText,
  Sparkles,
  BookOpen,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  History,
  LayoutDashboard,
} from "lucide-react";

interface HeaderProps {
  currentTab: "workspace" | "history";
  onTabChange: (tab: "workspace" | "history") => void;
  historyCount: number;
  onOpenSamples: () => void;
  onOpenDocs: () => void;
  serverStatus: "checking" | "connected" | "warning";
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  historyCount,
  onOpenSamples,
  onOpenDocs,
  serverStatus,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                    DocSum AI
                  </h1>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:inline">
                    • Technical Assessment
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden md:block">
                  Multimodal Document Intelligence & Synthesis
                </p>
              </div>
            </div>

            {/* Primary View Switcher Tabs */}
            <nav className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="tab-nav-workspace"
                type="button"
                onClick={() => onTabChange("workspace")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === "workspace"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Assistant</span>
              </button>

              <button
                id="tab-nav-history"
                type="button"
                onClick={() => onTabChange("history")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === "history"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
                {historyCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                      currentTab === "history"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {historyCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Actions & Health indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile View Switcher */}
            <div className="flex sm:hidden items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 mr-1">
              <button
                type="button"
                onClick={() => onTabChange("workspace")}
                className={`p-1.5 rounded-md text-xs font-bold cursor-pointer ${
                  currentTab === "workspace"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-600"
                }`}
                title="Assistant Workspace"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onTabChange("history")}
                className={`p-1.5 rounded-md text-xs font-bold cursor-pointer relative ${
                  currentTab === "history"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-600"
                }`}
                title="Document History"
              >
                <History className="w-4 h-4" />
                {historyCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </button>
            </div>

            {/* Server health badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Backend:</span>
              {serverStatus === "checking" ? (
                <span className="text-amber-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Connecting...
                </span>
              ) : serverStatus === "connected" ? (
                <span className="text-emerald-600 flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Ready
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Online
                </span>
              )}
            </div>

            {/* Sample Documents Button */}
            <button
              id="btn-sample-docs"
              type="button"
              onClick={onOpenSamples}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Load ready-made PDF and image samples"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Samples</span>
            </button>

            {/* Assessment Docs Button */}
            <button
              id="btn-tech-docs"
              type="button"
              onClick={onOpenDocs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="View Architecture and Technical Details"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-300" />
              <span>Docs</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

