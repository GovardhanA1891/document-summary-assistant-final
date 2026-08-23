import { DocumentFile, HistoryFilterOptions, HistoryItem, SummaryResultData } from "../types";
import { SAMPLE_DOCUMENTS } from "../data/sampleDocs";

const STORAGE_KEY = "docsum_history_v1";

// Helper to find sample preview if available
export function resolveDocumentPreview(fileName: string, currentPreviewUrl?: string): string | undefined {
  if (currentPreviewUrl && currentPreviewUrl.length < 50000) {
    return currentPreviewUrl;
  }
  const sample = SAMPLE_DOCUMENTS.find(
    (d) => d.name.toLowerCase() === fileName.toLowerCase() || fileName.toLowerCase().includes(d.id)
  );
  if (sample) {
    return sample.dataUri;
  }
  return currentPreviewUrl;
}

// Default initial seeded items for first-time users so the history is immediately rich and testable
const INITIAL_SEEDED_HISTORY: HistoryItem[] = [
  {
    id: "hist-seed-1",
    file: {
      name: "Cloud_Infrastructure_Modernization_Specification.pdf",
      size: 1024 * 145,
      type: "application/pdf",
      base64: "",
    },
    summary: {
      documentTitle: "Cloud Infrastructure Modernization Specification",
      summary:
        "This specification outlines the technical roadmap for migrating monolithic services into an event-driven microservices architecture on Google Kubernetes Engine (GKE). Key objectives include achieving 99.99% availability, reducing operational compute expenditures by 40%, and maintaining sub-50ms P99 latency. Core pillars include Apache Kafka for asynchronous telemetry, Cloud SQL PostgreSQL with distributed Redis caching, and zero-trust mTLS security with automated Secret Manager rotation.",
      keyPoints: [
        "Architectural migration to Google Kubernetes Engine (GKE) distributed across multiple availability zones.",
        "Asynchronous messaging and telemetry routing governed via Apache Kafka clusters.",
        "Zero-trust security enforcement utilizing Istio mTLS and automated 30-day credential rotation.",
        "Projected Phase 1 infrastructure allocation of $120,000 across a 6-week timeline.",
      ],
      improvementSuggestions: [
        "Include formal rollback contingencies and disaster recovery RTO/RPO objectives.",
        "Add explicit load testing benchmark criteria before decommissioning legacy monolithic clusters.",
        "Detail cross-region data replication synchronization guarantees.",
      ],
      documentType: "Architecture Spec (PDF)",
      estimatedWordCount: 420,
      detectedLanguage: "English (US)",
      lengthOption: "medium",
      processedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      fileName: "Cloud_Infrastructure_Modernization_Specification.pdf",
      fileSize: 1024 * 145,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    pinned: true,
  },
  {
    id: "hist-seed-2",
    file: {
      name: "Apex_Cloud_Services_Invoice_INV8841.png",
      size: 1024 * 68,
      type: "image/png",
      base64: "",
    },
    summary: {
      documentTitle: "Apex Cloud Services Monthly Invoice #INV-2024-8841",
      summary:
        "Invoice #INV-2024-8841 issued to Enterprise Global Tech Corp for cloud consumption during the July 2024 billing cycle totaling $4,466.00 USD with Net 30 payment terms. Major line items include Cloud Compute Cluster (c2-standard-16) at $2,450.00, Serverless AI API Token Usage (14.2M tokens) at $1,200.00, High-Throughput NVMe Storage at $416.00, and Premium Enterprise 24/7 SLA Support at $400.00.",
      keyPoints: [
        "Total billing amount payable is $4,466.00 USD due on August 31, 2024.",
        "Serverless AI API Token consumption represents 26.8% ($1,200.00) of overall monthly expenditure.",
        "Compute cluster instances remain the largest expense category at $2,450.00.",
        "Enterprise 24/7 Tier-1 Technical Support billed at fixed rate of $400.00/mo.",
      ],
      improvementSuggestions: [
        "Audit token consumption spike on internal vector embeddings to identify optimization opportunities.",
        "Evaluate 1-year committed use discounts on c2-standard-16 instances to reduce compute costs by ~30%.",
        "Set up real-time billing threshold alerts at $3,500.00 to prevent month-end budget surprises.",
      ],
      documentType: "Invoice / Receipt (Image)",
      estimatedWordCount: 290,
      detectedLanguage: "English (US)",
      lengthOption: "short",
      processedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      fileName: "Apex_Cloud_Services_Invoice_INV8841.png",
      fileSize: 1024 * 68,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    pinned: false,
  },
  {
    id: "hist-seed-3",
    file: {
      name: "Sprint_42_Team_Retrospective_Notes.png",
      size: 1024 * 85,
      type: "image/png",
      base64: "",
    },
    summary: {
      documentTitle: "Sprint 42 Retrospective & Action Items",
      summary:
        "Team retrospective meeting notes from Sprint 42 focusing on what went well, operational bottlenecks, and concrete action items for the upcoming cycle. Highlights include successful zero-downtime database schema migration and improved PR turnaround time to 4 hours. Main pain points identified were flaky end-to-end Cypress tests in CI/CD staging, API documentation drift, and unbudgeted ad-hoc support requests. Immediate action items assigned include test quarantine protocols and rotating on-call support triage.",
      keyPoints: [
        "Zero-downtime schema migration completed with 0 user incidents.",
        "PR turnaround time improved to 4 hours average across engineering squads.",
        "Flaky Cypress UI tests causing 18% false-positive build pipeline failures.",
        "Action item: Alex assigned to implement test quarantine pipeline by Wednesday.",
        "Action item: Maya assigned to automate OpenAPI schema synchronization.",
      ],
      improvementSuggestions: [
        "Establish an explicit SLA for interrupting developers during core sprint focus hours.",
        "Implement automated visual regression testing in addition to functional e2e suites.",
        "Track test stability metrics in engineering weekly dashboards.",
      ],
      documentType: "Handwritten Notes (Image)",
      estimatedWordCount: 340,
      detectedLanguage: "English (US)",
      lengthOption: "medium",
      processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      fileName: "Sprint_42_Team_Retrospective_Notes.png",
      fileSize: 1024 * 85,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    pinned: false,
  },
];

// Helper to sanitize items before writing to localStorage to guarantee we never exceed quota
function sanitizeHistoryForStorage(items: HistoryItem[]): HistoryItem[] {
  return items.map((it) => ({
    ...it,
    file: {
      name: it.file.name,
      size: it.file.size,
      type: it.file.type,
      base64: "", // Never store bulky base64 in localStorage
      previewUrl: undefined, // Resolved on-the-fly or via sample docs
      lastModified: it.file.lastModified || Date.now(),
    },
  }));
}

// Helper to hydrate items with previewUrls if matching samples exist
function hydrateHistoryItems(items: HistoryItem[]): HistoryItem[] {
  return items.map((it) => {
    const preview = resolveDocumentPreview(it.file.name, it.file.previewUrl);
    const sample = SAMPLE_DOCUMENTS.find(
      (d) => d.name.toLowerCase() === it.file.name.toLowerCase() || it.file.name.toLowerCase().includes(d.id)
    );
    return {
      ...it,
      file: {
        ...it.file,
        previewUrl: preview,
        base64: it.file.base64 || (sample ? sample.dataUri.split(",")[1] || "" : ""),
      },
    };
  });
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const sanitized = sanitizeHistoryForStorage(INITIAL_SEEDED_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      return hydrateHistoryItems(INITIAL_SEEDED_HISTORY);
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return hydrateHistoryItems(parsed);
    }
    return hydrateHistoryItems(INITIAL_SEEDED_HISTORY);
  } catch (err) {
    console.warn("Failed to read history from localStorage:", err);
    return hydrateHistoryItems(INITIAL_SEEDED_HISTORY);
  }
}

export function saveHistoryItem(
  file: DocumentFile,
  summary: SummaryResultData
): HistoryItem[] {
  const current = getHistory();
  const newItemId = `hist-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  const newItem: HistoryItem = {
    id: newItemId,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
      base64: file.base64 || "",
      previewUrl: file.previewUrl || (file.base64 ? `data:${file.type};base64,${file.base64}` : undefined),
      lastModified: file.lastModified || Date.now(),
    },
    summary,
    createdAt: new Date().toISOString(),
    pinned: false,
  };

  // Filter out exact duplicate if present and prepend
  const updated = [
    newItem,
    ...current.filter(
      (item) =>
        item.summary.documentTitle !== summary.documentTitle ||
        item.summary.lengthOption !== summary.lengthOption
    ),
  ];

  try {
    const sanitized = sanitizeHistoryForStorage(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn("Error saving to localStorage:", err);
  }

  return updated;
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  const current = getHistory();
  const updated = current.filter((item) => item.id !== id);
  try {
    const sanitized = sanitizeHistoryForStorage(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn("Failed to update history in localStorage:", err);
  }
  return updated;
}

export function deleteMultipleHistoryItems(ids: string[]): HistoryItem[] {
  const set = new Set(ids);
  const current = getHistory();
  const updated = current.filter((item) => !set.has(item.id));
  try {
    const sanitized = sanitizeHistoryForStorage(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn("Failed to delete items from localStorage:", err);
  }
  return updated;
}

export function clearAllHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.warn("Failed to clear history in localStorage:", err);
  }
}

export function togglePinHistoryItem(id: string): HistoryItem[] {
  const current = getHistory();
  const updated = current.map((item) =>
    item.id === id ? { ...item, pinned: !item.pinned } : item
  );
  try {
    const sanitized = sanitizeHistoryForStorage(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn("Failed to update pin state in localStorage:", err);
  }
  return updated;
}

export function filterAndSortHistory(
  items: HistoryItem[],
  filters: HistoryFilterOptions
): HistoryItem[] {
  let result = [...items];

  // 1. Search query filter
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter((item) => {
      const matchTitle = item.summary.documentTitle.toLowerCase().includes(q);
      const matchFileName = item.summary.fileName.toLowerCase().includes(q) || item.file.name.toLowerCase().includes(q);
      const matchSummary = item.summary.summary.toLowerCase().includes(q);
      const matchDocType = item.summary.documentType.toLowerCase().includes(q);
      const matchKeyPoints = item.summary.keyPoints.some((kp) => kp.toLowerCase().includes(q));
      const matchSuggestions = item.summary.improvementSuggestions.some((sug) => sug.toLowerCase().includes(q));
      return matchTitle || matchFileName || matchSummary || matchDocType || matchKeyPoints || matchSuggestions;
    });
  }

  // 2. Document type filter (PDF vs Image)
  if (filters.documentType !== "all") {
    if (filters.documentType === "pdf") {
      result = result.filter((item) => item.file.type.includes("pdf") || item.summary.documentType.toLowerCase().includes("pdf"));
    } else if (filters.documentType === "image") {
      result = result.filter((item) => item.file.type.includes("image") || item.summary.documentType.toLowerCase().includes("image") || item.summary.documentType.toLowerCase().includes("png") || item.summary.documentType.toLowerCase().includes("jpg"));
    }
  }

  // 3. Length option filter
  if (filters.lengthOption !== "all") {
    result = result.filter((item) => item.summary.lengthOption === filters.lengthOption);
  }

  // 4. Sort
  result.sort((a, b) => {
    // Pinned items stay at top unless sorting alphabetically
    if (a.pinned && !b.pinned && filters.sortBy === "newest") return -1;
    if (!a.pinned && b.pinned && filters.sortBy === "newest") return 1;

    switch (filters.sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "title":
        return a.summary.documentTitle.localeCompare(b.summary.documentTitle);
      case "wordCount":
        return (b.summary.estimatedWordCount || 0) - (a.summary.estimatedWordCount || 0);
      default:
        return 0;
    }
  });

  return result;
}
