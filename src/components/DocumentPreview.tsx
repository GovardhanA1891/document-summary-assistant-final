import React from "react";
import { X, FileText, Image as ImageIcon, ExternalLink, Download } from "lucide-react";
import { DocumentFile } from "../types";

interface DocumentPreviewProps {
  file: DocumentFile;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  onClose,
}) => {
  const isPdf = file.type.includes("pdf");

  return (
    <div
      id="document-preview-panel"
      className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[680px]"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="p-1 rounded bg-slate-800 text-indigo-400">
            {isPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold truncate text-white" title={file.name}>
              {file.name}
            </h4>
            <span className="text-[11px] text-slate-400">
              Source Document Verification Viewer
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {file.previewUrl && (
            <a
              href={file.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewer Content */}
      <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-auto flex items-center justify-center">
        {isPdf ? (
          file.previewUrl ? (
            <iframe
              src={file.previewUrl}
              title="PDF Viewer"
              className="w-full h-full rounded-xl border border-slate-300 bg-white shadow-inner"
            />
          ) : (
            <div className="text-center p-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium">PDF content loaded in memory</p>
            </div>
          )
        ) : file.previewUrl ? (
          <div className="max-w-full max-h-full flex items-center justify-center p-2">
            <img
              src={file.previewUrl}
              alt={file.name}
              className="max-w-full max-h-[600px] object-contain rounded-lg shadow-md border border-slate-300 bg-white"
            />
          </div>
        ) : (
          <div className="text-center p-8 text-slate-500">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-medium">Image data loaded in memory</p>
          </div>
        )}
      </div>
    </div>
  );
};
