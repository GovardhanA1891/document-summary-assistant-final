import { SummaryLength, SummaryResultData } from "../types";

export interface SummarizeParams {
  fileBase64: string;
  mimeType: string;
  fileName: string;
  lengthOption: SummaryLength;
}

export async function summarizeDocument(params: SummarizeParams): Promise<SummaryResultData> {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const json = await response.json();

  if (!response.ok) {
    const errorMessage = json.error || `Server returned error (${response.status}): ${response.statusText}`;
    throw new Error(errorMessage);
  }

  if (!json.success || !json.data) {
    throw new Error("Invalid or missing response data from server.");
  }

  return json.data;
}

export async function checkServerHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      return { status: "error", geminiConfigured: false };
    }
    const data = await response.json();
    return {
      status: data.status || "ok",
      geminiConfigured: !!data.geminiConfigured,
    };
  } catch {
    return { status: "unreachable", geminiConfigured: false };
  }
}
