import React from "react";
import { X, ShieldCheck, Cpu, Code2, CheckCircle2, Layers, Zap, Database } from "lucide-react";

interface DocInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocInfoModal: React.FC<DocInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="tech-docs-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div
        id="tech-docs-modal-content"
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Technical Assessment & Architecture Overview
              </h3>
              <p className="text-xs text-slate-400">
                Document Summary Assistant • Full-Stack Implementation
              </p>
            </div>
          </div>

          <button
            id="btn-close-tech-docs"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Section 1: Architecture */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Layers className="w-4 h-4 text-indigo-600" />
              1. Full-Stack Architecture & Security
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This application follows a strict full-stack architecture where all AI interactions and credential management reside on the Express server:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>
                <strong className="text-slate-800">Backend API (Express / Node.js)</strong>: Hosts <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">/api/summarize</code> and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">/api/health</code> routes.
              </li>
              <li>
                <strong className="text-slate-800">Zero Client-Side Key Exposure</strong>: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">GEMINI_API_KEY</code> is strictly server-side in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">process.env</code>.
              </li>
              <li>
                <strong className="text-slate-800">In-Memory Transient Processing</strong>: Uploaded document payloads are decoded and streamed directly to Gemini without permanent disk or database storage.
              </li>
            </ul>
          </div>

          {/* Section 2: Multimodal Gemini 3.7 Flash Engine */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Cpu className="w-4 h-4 text-indigo-600" />
              2. Gemini Multimodal Engine & Anti-Hallucination
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The engine utilizes <strong className="text-slate-800">@google/genai</strong> with model <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">gemini-3.7-flash</code>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-1">Native PDF Analysis</p>
                <p className="text-slate-600">
                  Transmits raw PDF binaries via inlineData MIME stream, preserving document structure, columns, and data tables.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-1">Visual OCR & Scanned Docs</p>
                <p className="text-slate-600">
                  Processes PNG, JPG, and WEBP documents using multimodal vision models to extract handwritten notes, receipts, and invoices.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Summary Output Schema */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Output Requirements & Features
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Document Title/Topic</strong>: Extracted high-level subject with document category badge.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Granular Summary (Short / Medium / Long)</strong>: Configurable executive synopsis, multi-paragraph brief, or comprehensive breakdown.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Key Points</strong>: 4-8 itemized bullet points extracted strictly from document facts.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Improvement Suggestions</strong>: Practical recommendations for document clarity, data completeness, and next steps.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Interactive Tools</strong>: Copy individual sections, export markdown, re-generate on demand, and side-by-side source preview.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Powered by Google Gemini 3.7 Flash & Express.js
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
