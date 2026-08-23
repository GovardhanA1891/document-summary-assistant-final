import React, { useRef, useState } from "react";
import { UploadCloud, FileText, Image as ImageIcon, X, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { DocumentFile } from "../types";

interface DropzoneProps {
  currentFile: DocumentFile | null;
  onFileSelect: (file: DocumentFile) => void;
  onFileRemove: () => void;
  isProcessing: boolean;
}

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export const Dropzone: React.FC<DropzoneProps> = ({
  currentFile,
  onFileSelect,
  onFileRemove,
  isProcessing,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const processSelectedFile = (file: File) => {
    setValidationError(null);

    // 1. Validate MIME type or extension
    const mimeType = file.type.toLowerCase();
    const extension = file.name.split(".").pop()?.toLowerCase();
    const isPdf = mimeType === "application/pdf" || extension === "pdf";
    const isImage =
      ALLOWED_MIME_TYPES.includes(mimeType) ||
      ["png", "jpg", "jpeg", "webp"].includes(extension || "");

    if (!isPdf && !isImage) {
      setValidationError(
        `Unsupported file type: "${file.name}". Please upload a PDF or an image file (PNG, JPG, JPEG, WEBP).`
      );
      return;
    }

    // 2. Validate empty file
    if (file.size === 0) {
      setValidationError(
        `The selected file "${file.name}" is empty (0 bytes). Please upload a valid document.`
      );
      return;
    }

    // 3. Validate file size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(
        `File is too large (${formatBytes(file.size)}). The maximum supported file size is 25 MB.`
      );
      return;
    }

    const resolvedMime = isPdf
      ? "application/pdf"
      : mimeType || (extension === "png" ? "image/png" : "image/jpeg");

    // Read file as Base64 data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(",")[1] || "";

      onFileSelect({
        name: file.name,
        size: file.size,
        type: resolvedMime,
        base64: base64Data,
        previewUrl: dataUrl,
        lastModified: file.lastModified,
      });
    };

    reader.onerror = () => {
      setValidationError("Failed to read file from your device. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const isPdfFile = currentFile?.type.includes("pdf");

  return (
    <div className="w-full space-y-3">
      <input
        ref={fileInputRef}
        id="document-file-input"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Dropzone container */}
      {!currentFile ? (
        <div
          id="dropzone-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? "border-indigo-500 bg-indigo-50/70 scale-[1.008]"
              : "border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center ring-8 ring-indigo-50/50">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base sm:text-lg font-semibold text-slate-800">
                Drag & drop your document here, or{" "}
                <span className="text-indigo-600 underline underline-offset-4 font-bold">
                  browse
                </span>
              </p>
              <p className="text-sm text-slate-500">
                Supported formats: PDF, PNG, JPG, JPEG, and WEBP (Up to 25 MB)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <FileText className="w-3.5 h-3.5 mr-1" />
                PDF Documents
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <ImageIcon className="w-3.5 h-3.5 mr-1" />
                Scanned Images & Receipts
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                OCR & Table Parsing
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Selected file card */
        <div
          id="selected-file-card"
          className="border border-slate-200 bg-white rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0">
              {/* File Icon / Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                {isPdfFile ? (
                  <div className="w-full h-full bg-rose-50 text-rose-600 flex flex-col items-center justify-center font-bold text-xs">
                    <FileText className="w-7 h-7" />
                    <span className="mt-0.5 text-[10px] uppercase tracking-wider">PDF</span>
                  </div>
                ) : currentFile.previewUrl ? (
                  <img
                    src={currentFile.previewUrl}
                    alt={currentFile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-bold text-xs">
                    <ImageIcon className="w-7 h-7" />
                    <span className="mt-0.5 text-[10px] uppercase tracking-wider">IMG</span>
                  </div>
                )}
              </div>

              {/* File details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900 truncate" title={currentFile.name}>
                    {currentFile.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                      isPdfFile
                        ? "bg-rose-100 text-rose-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {isPdfFile ? "PDF" : "IMAGE"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mt-1">
                  <span>{formatBytes(currentFile.size)}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Validated & Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons: Replace or Remove */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <button
                id="btn-replace-file"
                type="button"
                onClick={triggerFileInput}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change File
              </button>
              <button
                id="btn-remove-file"
                type="button"
                onClick={onFileRemove}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Alert */}
      {validationError && (
        <div
          id="dropzone-error-banner"
          className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Upload Validation Notice</p>
            <p className="mt-0.5 text-amber-800">{validationError}</p>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-amber-700 hover:text-amber-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
