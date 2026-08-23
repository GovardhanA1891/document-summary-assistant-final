export type SummaryLength = "short" | "medium" | "long";

export interface DocumentFile {
  name: string;
  size: number;
  type: string;
  base64: string;
  previewUrl?: string;
  lastModified?: number;
}

export interface SummaryResultData {
  documentTitle: string;
  summary: string;
  keyPoints: string[];
  improvementSuggestions: string[];
  documentType: string;
  estimatedWordCount: number | null;
  detectedLanguage: string;
  lengthOption: SummaryLength;
  processedAt: string;
  fileName: string;
  fileSize: number;
}

export interface HistoryItem {
  id: string;
  file: DocumentFile;
  summary: SummaryResultData;
  createdAt: string;
  pinned?: boolean;
}

export interface HistoryFilterOptions {
  searchQuery: string;
  documentType: "all" | "pdf" | "image";
  lengthOption: "all" | SummaryLength;
  sortBy: "newest" | "oldest" | "title" | "wordCount";
}

export interface SummarizeApiResponse {
  success: boolean;
  data: SummaryResultData;
  error?: string;
}

export interface SampleDoc {
  id: string;
  name: string;
  category: string;
  description: string;
  type: "application/pdf" | "image/png" | "image/jpeg";
  sizeDisplay: string;
  dataUri: string;
}
