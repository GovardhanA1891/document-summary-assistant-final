import React from "react";
import { X, FileText, Image as ImageIcon, Sparkles, Check, ArrowRight, BookOpen } from "lucide-react";
import { DocumentFile, SampleDoc } from "../types";
import { SAMPLE_DOCUMENTS, generateImageDocBase64 } from "../data/sampleDocs";

interface SampleDocumentsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (docFile: DocumentFile) => void;
}

export const SampleDocuments: React.FC<SampleDocumentsProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  const handleSelect = (sample: SampleDoc) => {
    let base64 = "";
    let dataUri = sample.dataUri;

    if (sample.id === "sample-img-invoice") {
      base64 = generateImageDocBase64("invoice");
      dataUri = `data:image/png;base64,${base64}`;
    } else if (sample.id === "sample-img-retro-notes") {
      base64 = generateImageDocBase64("notes");
      dataUri = `data:image/png;base64,${base64}`;
    } else {
      // PDF samples
      base64 = sample.dataUri.split(",")[1] || "";
    }

    onSelectSample({
      name: sample.name,
      size: Math.round((base64.length * 3) / 4),
      type: sample.type,
      base64,
      previewUrl: dataUri,
      lastModified: Date.now(),
    });

    onClose();
  };

  return (
    <div
      id="sample-docs-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div
        id="sample-docs-modal-content"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sample Document Library
              </h3>
              <p className="text-xs text-slate-500">
                Select a preset to test Gemini AI document processing in 1-click
              </p>
            </div>
          </div>

          <button
            id="btn-close-sample-docs"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Sample Docs */}
        <div className="p-6 overflow-y-auto space-y-3">
          {SAMPLE_DOCUMENTS.map((sample) => {
            const isPdf = sample.type.includes("pdf");
            return (
              <div
                key={sample.id}
                id={`sample-item-${sample.id}`}
                onClick={() => handleSelect(sample)}
                className="group border border-slate-200 hover:border-indigo-500 rounded-xl p-4 transition-all duration-150 cursor-pointer bg-white hover:bg-indigo-50/30 flex items-start justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isPdf
                        ? "bg-rose-100 text-rose-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isPdf ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                        {sample.name}
                      </h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {isPdf ? "PDF Document" : "PNG Image / OCR"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 mt-1">
                  <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>All sample documents adhere to strict factual extraction.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
