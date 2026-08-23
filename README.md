# Document Summary Assistant

A full-stack, enterprise-grade document intelligence and summarization web application powered by **Google Gemini 3.7 Flash** and **Express.js**.

---

## 1. Project Overview

The **Document Summary Assistant** allows users to upload PDF documents, scanned images, handwritten notes, and invoices, then extracts structured intelligence using Google's multimodal Gemini AI. The application delivers factual, zero-hallucination executive summaries, key takeaways, and constructive improvement recommendations with configurable granularity (Short, Medium, Long).

---

## 2. Key Features

- **Multimodal Document Ingestion**:
  - Full support for **PDF**, **PNG**, **JPG**, **JPEG**, and **WEBP** documents up to 25 MB.
  - Native drag-and-drop file upload with visual drop states.
  - Device file picker with automated MIME validation, empty file prevention, and size verification.
  - Real-time document replacement and removal controls.

- **Document Processing & Visual OCR**:
  - Direct native PDF binary stream ingestion preserving document layout, tables, and hierarchical structure.
  - Optical character recognition (OCR) and visual parsing for scanned documents, receipts, and handwritten notes.
  - Strict anti-hallucination prompt boundary conditions ensuring all extracted facts are strictly derived from source content.

- **Configurable AI Granularity**:
  - **Short Summary**: 2–3 concise sentences delivering a rapid executive synopsis.
  - **Medium Summary**: 2–3 structured paragraphs detailing background, core content, and findings.
  - **Long Summary**: Comprehensive, multi-section breakdown with quantitative data, arguments, and methodology.

- **Structured Output Presentation**:
  - **DOCUMENT TITLE**: Extracted title/topic with document classification tags, language identification, and estimated word count.
  - **SUMMARY**: Formatted summary text with one-click clipboard copying.
  - **KEY POINTS**: 4–8 bullet points itemizing essential takeaways with section-level copying.
  - **IMPROVEMENT SUGGESTIONS**: 3–6 constructive, actionable recommendations to improve document completeness and clarity.
  - **Export & Utility**: Markdown report export (`.md`), regeneration at any granularity without re-uploading, and live side-by-side source document verification viewer.

- **Security & Privacy First**:
  - **Server-Side API Key Isolation**: The `GEMINI_API_KEY` is maintained exclusively on the Express backend and is never exposed to the client browser.
  - **In-Memory Transient Processing**: Uploaded documents are processed in-memory and discarded post-analysis without permanent disk persistence.

- **Evaluator Convenience**:
  - Built-in **Sample Document Library** featuring technical architecture PDFs, medical clinical research PDFs, cloud infrastructure invoices, and scanned sprint retrospective notes.

---

## 3. Technology Stack

- **Frontend**:
  - **React 19** with TypeScript
  - **Vite 6** (Modern build tooling and asset pipeline)
  - **Tailwind CSS v4** (Utility-first styling with custom typography and clean aesthetics)
  - **Lucide React** (Consistent icon system)
  - **Motion** (Smooth micro-interactions and transitions)

- **Backend**:
  - **Node.js** with **Express.js**
  - **@google/genai** SDK (`v2.4.0`)
  - **Gemini 3.7 Flash** (`gemini-3.7-flash`)
  - **tsx** (Direct TypeScript execution in development)
  - **esbuild** (High-performance production server bundling to `dist/server.cjs`)

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React / Vite)                    │
│  - Drag & Drop / File Validation                            │
│  - Granularity Controls (Short, Medium, Long)               │
│  - Multi-Step Animated Progress Feedback                    │
│  - Structured Intelligence UI & Side-by-Side Previewer      │
└──────────────────────────────┬──────────────────────────────┘
                               │ POST /api/summarize
                               │ (In-memory Base64 Payload)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Server (Express / Node)                   │
│  - Payload Validation & MIME Type Sanitization              │
│  - In-Memory Buffer Decoding                                │
│  - Strict Anti-Hallucination Prompt Engineering             │
│  - Structured JSON Schema Enforcement                       │
└──────────────────────────────┬──────────────────────────────┘
                               │ @google/genai SDK
                               │ Model: gemini-3.7-flash
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Google Gemini 3.7 Flash AI                   │
│  - Multimodal PDF & Visual OCR Ingestion                    │
│  - Grounded Semantic Summarization                          │
│  - Structured JSON Response Schema Output                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Environment Variables

Create or configure `.env` (refer to `.env.example`):

```bash
# GEMINI_API_KEY: Required for Gemini AI API calls (configured via Secrets panel in AI Studio)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# APP_URL: Optional base URL for self-referential links
APP_URL="http://localhost:3000"
```

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Installation Steps

1. Clone the repository or navigate to the workspace directory:
   ```bash
   cd document-summary-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `GEMINI_API_KEY` is present in `.env` or system environment.

4. Start the development server (boots both Express backend and Vite frontend on port 3000):
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3000`.

---

## 7. How Gemini is Used

The application utilizes the modern `@google/genai` TypeScript SDK:

1. **Model Selection**: `gemini-3.7-flash` is selected for rapid, accurate multimodal parsing of text, complex PDF formatting, tables, and visual imagery.
2. **Multimodal Ingestion**: Documents are provided directly to Gemini using `inlineData`:
   ```typescript
   const documentPart = {
     inlineData: {
       mimeType: geminiMime, // 'application/pdf', 'image/png', 'image/jpeg'
       data: base64Data,
     },
   };
   ```
3. **Structured JSON Output**: A strict `responseSchema` (using `@google/genai`'s `Type.OBJECT`) ensures that the model outputs strongly-typed JSON containing `documentTitle`, `summary`, `keyPoints` array, and `improvementSuggestions` array.
4. **Anti-Hallucination Directives**: System instructions and low temperature (0.2) constrain reasoning strictly to explicit document contents.

---

## 8. Testing & Validation

The application contains built-in features to test every assessment requirement:

1. **PDF Summarization**:
   - Upload any custom PDF, or click **"Samples"** -> **"Cloud Infrastructure Spec (PDF)"**.
   - Verify that headings, budgets, and architecture strategies are preserved.
2. **Image / Scanned Document OCR**:
   - Upload a JPEG/PNG receipt, invoice, or handwritten note, or click **"Samples"** -> **"Apex Cloud Invoice (PNG)"** or **"Sprint Retrospective Notes (PNG)"**.
   - Verify that line items, currency values, and action items are accurately recognized.
3. **Granularity Variations**:
   - Test with **Short** (2–3 sentences), **Medium** (2–3 paragraphs), and **Long** (comprehensive breakdown).
   - Use the **Generate Again** bar to switch lengths dynamically.
4. **Error Recovery**:
   - Attempt uploading an unsupported format or corrupted file; verify clear error banners with dismiss and retry triggers.

---

## 9. Production Build & Deployment

To compile and produce a production-ready bundled build:

```bash
# Build Vite client assets and bundle server.ts with esbuild
npm run build

# Launch the production server
npm run start
```

The production server starts on port `3000` (binding to `0.0.0.0`) and serves optimized static assets with SPA fallback routing.
