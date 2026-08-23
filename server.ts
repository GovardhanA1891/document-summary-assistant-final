import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Configure body parser for handling PDF and image uploads up to 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper to initialize Gemini client lazily
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Document summarization endpoint
app.post("/api/summarize", async (req: Request, res: Response) => {
  try {
    const { fileBase64, mimeType, fileName, lengthOption = "medium" } = req.body;

    if (!fileBase64 || typeof fileBase64 !== "string") {
      return res.status(400).json({
        error: "Invalid request: Missing or empty document data (fileBase64).",
      });
    }

    if (!mimeType || typeof mimeType !== "string") {
      return res.status(400).json({
        error: "Invalid request: Missing mimeType.",
      });
    }

    const allowedMimeTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    const normalizedMime = mimeType.toLowerCase();
    if (!allowedMimeTypes.includes(normalizedMime)) {
      return res.status(400).json({
        error: `Unsupported file type: ${mimeType}. Only PDF, PNG, JPG, and WEBP documents are supported.`,
      });
    }

    const validLengths = ["short", "medium", "long"];
    const targetLength = validLengths.includes(lengthOption) ? lengthOption : "medium";

    // Clean base64 data if it includes a data URL prefix
    const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, "");

    // Verify approximate byte size (max 25MB)
    const approximateSizeInBytes = (base64Data.length * 3) / 4;
    if (approximateSizeInBytes > 25 * 1024 * 1024) {
      return res.status(413).json({
        error: "File is too large. The maximum supported file size is 25MB.",
      });
    }

    if (base64Data.length < 10) {
      return res.status(400).json({
        error: "The uploaded file appears to be empty or corrupted.",
      });
    }

    const ai = getGeminiClient();

    // Map MIME type for Gemini API (e.g. image/jpg -> image/jpeg)
    const geminiMime = normalizedMime === "image/jpg" ? "image/jpeg" : normalizedMime;

    const lengthInstructions = {
      short:
        "Provide a concise executive summary (2-3 sentences) covering the essential core points.",
      medium:
        "Provide a well-structured summary (2-3 well-written paragraphs) detailing the background, primary content, findings, and conclusions.",
      long:
        "Provide a comprehensive, in-depth multi-section summary thoroughly detailing context, methodology/content, quantitative metrics, key findings, arguments, and actionable takeaways.",
    };

    const promptText = `
Analyze the attached document ("${fileName || "Uploaded Document"}") with high precision and generate a structured summary.

Target Summary Length: ${targetLength.toUpperCase()}
Length Directive: ${lengthInstructions[targetLength as keyof typeof lengthInstructions]}

ANTI-HALLUCINATION INSTRUCTIONS:
- You must strictly base all statements, key points, and summaries SOLELY on the content visibly or textually present in the attached document.
- Do NOT fabricate facts, figures, names, or assumptions that are not directly supported by the source document.
- If the document is a scanned image or contains OCR-challenging text, carefully inspect the visual elements to extract the true text accurately.
- For key points: Provide 4 to 8 clear, high-impact bullet items directly extracted from the document.
- For improvement suggestions: Provide 3 to 6 practical, constructive suggestions to improve the document's clarity, completeness, structure, missing data, or presentation.
`;

    const documentPart = {
      inlineData: {
        mimeType: geminiMime,
        data: base64Data,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [documentPart, textPart],
      },
      config: {
        systemInstruction: `You are an expert document intelligence and technical summarization system.
Your mission is to perform deep optical, semantic, and structural analysis of PDF and image documents.
Always return accurate, strictly grounded structured data according to the requested JSON schema.
Never fabricate facts not present in the document.`,
        temperature: 0.2, // Low temperature for high factual consistency
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentTitle: {
              type: Type.STRING,
              description: "The official title or primary topic of the document.",
            },
            summary: {
              type: Type.STRING,
              description: `The detailed summary adhering strictly to the requested '${targetLength}' length.`,
            },
            keyPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description:
                "List of 4 to 8 distinct key points or takeaways derived directly from the document.",
            },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description:
                "List of 3 to 6 constructive suggestions to improve the document's clarity, completeness, or actionable quality.",
            },
            documentType: {
              type: Type.STRING,
              description:
                "Detected document format/category (e.g., Technical Paper, Financial Invoice, Legal Contract, Project Proposal, Meeting Minutes, Scanned Note).",
            },
            estimatedWordCount: {
              type: Type.INTEGER,
              description: "Estimated total word count of the document text.",
            },
            detectedLanguage: {
              type: Type.STRING,
              description: "The primary human language of the document (e.g., English, Spanish, French).",
            },
          },
          required: [
            "documentTitle",
            "summary",
            "keyPoints",
            "improvementSuggestions",
            "documentType",
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response generated from Gemini API.");
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch (parseError) {
      // Fallback clean-up if markdown block formatting was attached
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
      parsedResult = JSON.parse(cleanJson);
    }

    // Return the response with processing metadata
    res.json({
      success: true,
      data: {
        documentTitle: parsedResult.documentTitle || fileName || "Untitled Document",
        summary: parsedResult.summary || "",
        keyPoints: Array.isArray(parsedResult.keyPoints) ? parsedResult.keyPoints : [],
        improvementSuggestions: Array.isArray(parsedResult.improvementSuggestions)
          ? parsedResult.improvementSuggestions
          : [],
        documentType: parsedResult.documentType || "General Document",
        estimatedWordCount: parsedResult.estimatedWordCount || null,
        detectedLanguage: parsedResult.detectedLanguage || "English",
        lengthOption: targetLength,
        processedAt: new Date().toISOString(),
        fileName: fileName || "document",
        fileSize: approximateSizeInBytes,
      },
    });
  } catch (error: any) {
    console.error("Error processing document summarization:", error);

    // Provide friendly, actionable error messages
    let statusCode = 500;
    let message = "An error occurred while processing the document with Gemini AI.";

    if (error.message?.includes("GEMINI_API_KEY")) {
      statusCode = 503;
      message = "Gemini API key is not configured. Please verify your environment secrets.";
    } else if (error.message?.includes("RESOURCE_EXHAUSTED") || error.status === 429) {
      statusCode = 429;
      message = "AI service quota temporarily exceeded. Please wait a moment and try again.";
    } else if (error.message?.includes("INVALID_ARGUMENT")) {
      statusCode = 400;
      message = "The document could not be decoded or processed by the AI engine. Please verify the file is not corrupted.";
    } else if (error.message) {
      message = error.message;
    }

    res.status(statusCode).json({
      error: message,
      details: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
  }
});

// Setup Vite middleware for development and static serve for production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Document Summary Assistant server running on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
