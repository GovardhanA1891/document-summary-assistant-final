import { SampleDoc } from "../types";

// Standard valid PDF generator for test document 1
function createPdf1Base64(): string {
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 720 >>
stream
BT
/F1 18 Tf
50 740 Td
(CLOUD INFRASTRUCTURE MODERNIZATION SPECIFICATION) Tj
/F1 12 Tf
0 -30 Td
(Author: Lead Cloud Architect | Date: Q3 Engineering Review | Status: Approved) Tj
0 -25 Td
(1. Executive Overview) Tj
0 -15 Td
(This document specifies the migration of monolithic services to event-driven microservices.) Tj
0 -15 Td
(Primary goals: 99.99% availability, 40% reduction in compute costs, and sub-50ms P99 latency.) Tj
0 -25 Td
(2. Architecture & Migration Strategy) Tj
0 -15 Td
(- Deployment on Kubernetes (GKE) clusters across multiple availability zones.) Tj
0 -15 Td
(- Implementation of Apache Kafka for asynchronous telemetry streaming and event routing.) Tj
0 -15 Td
(- Database partitioning with Cloud SQL PostgreSQL and distributed Redis caching layer.) Tj
0 -25 Td
(3. Security & Compliance) Tj
0 -15 Td
(- Zero-trust network model utilizing mTLS with Istio service mesh.) Tj
0 -15 Td
(- Role-based access control (RBAC) enforced via OpenID Connect (OIDC).) Tj
0 -15 Td
(- Automated secret rotation every 30 days via Google Cloud Secret Manager.) Tj
0 -25 Td
(4. Projected Milestones & Budget) Tj
0 -15 Td
(- Phase 1 (Core Infra): $120,000 allocated, scheduled completion within 6 weeks.) Tj
0 -15 Td
(- Phase 2 (Data Migration): $85,000 allocated, scheduled completion within 10 weeks.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000236 00000 n 
0000001007 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1076
%%EOF`;

  // Return base64 representation
  if (typeof window !== "undefined") {
    return btoa(pdfContent);
  }
  return Buffer.from(pdfContent).toString("base64");
}

// Standard valid PDF generator for test document 2
function createPdf2Base64(): string {
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 850 >>
stream
BT
/F1 16 Tf
50 740 Td
(CLINICAL TRIAL FINDINGS: AI-ASSISTED RADIOLOGY DIAGNOSTICS) Tj
/F1 11 Tf
0 -30 Td
(Investigator: Dr. Elena Rostova | Department of Diagnostic Medicine | Protocol #CT-2026-A8) Tj
0 -25 Td
(Abstract & Methodology:) Tj
0 -15 Td
(A double-blind clinical study evaluated an ensemble deep learning model on 4,820 chest CT scans.) Tj
0 -15 Td
(The objective was early detection of pulmonary nodules comparing AI-assisted vs solo radiologists.) Tj
0 -25 Td
(Key Findings & Statistical Outcomes:) Tj
0 -15 Td
(1. Sensitivity increased from 82.4% (solo radiologists) to 96.1% with AI triage assistance.) Tj
0 -15 Td
(2. False positive rate decreased by 18.7%, reducing unnecessary biopsy referrals significantly.) Tj
0 -15 Td
(3. Diagnostic turnaround time reduced from 42 minutes to 14.5 minutes on average per patient.) Tj
0 -25 Td
(Clinical Recommendations & Caveats:) Tj
0 -15 Td
(- AI system must remain an assistive secondary reader; final sign-off requires board-certified radiologist.) Tj
0 -15 Td
(- Dataset exhibited slight demographic bias in pediatric age cohorts (<18 yrs) requiring expanded validation.) Tj
0 -15 Td
(- Institutional ethics committee recommends phased deployment across outpatient triage wings.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000236 00000 n 
0000001137 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1206
%%EOF`;

  if (typeof window !== "undefined") {
    return btoa(pdfContent);
  }
  return Buffer.from(pdfContent).toString("base64");
}

// Generate high quality canvas-rendered image document (PNG)
export function generateImageDocBase64(type: "invoice" | "notes"): string {
  if (typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  if (type === "invoice") {
    // Invoice Styling
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(0, 0, 900, 1200);

    // Header bar
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, 900, 130);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("APEX CLOUD SOLUTIONS", 50, 70);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("Enterprise Cloud Hosting & Managed Kubernetes Services", 50, 100);

    // Invoice details box
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    ctx.fillRect(50, 160, 800, 160);
    ctx.strokeRect(50, 160, 800, 160);

    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("INVOICE #INV-2026-8894", 80, 200);

    ctx.font = "15px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("Billed To: NovaTech Systems Inc.", 80, 235);
    ctx.fillText("Attn: Financial Operations Dept.", 80, 260);
    ctx.fillText("Payment Terms: Net 30", 80, 285);

    ctx.fillText("Invoice Date: October 14, 2026", 520, 235);
    ctx.fillText("Due Date: November 13, 2026", 520, 260);
    ctx.fillText("Currency: USD ($)", 520, 285);

    // Table Header
    ctx.fillStyle = "#F1F5F9";
    ctx.fillRect(50, 360, 800, 45);
    ctx.fillStyle = "#334155";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("DESCRIPTION", 70, 388);
    ctx.fillText("QTY / HRS", 460, 388);
    ctx.fillText("UNIT RATE", 600, 388);
    ctx.fillText("TOTAL", 740, 388);

    // Table rows
    const items = [
      { name: "Managed Dedicated Kubernetes Cluster (v1.31) - 3 Nodes", qty: "720 hrs", rate: "$1.85", total: "$1,332.00" },
      { name: "High-IOPS Persistent NVMe Storage (4.0 TB Provisioned)", qty: "1 unit", rate: "$480.00", total: "$480.00" },
      { name: "Global Cloud CDN & Edge SSL Acceleration (15 TB Transfer)", qty: "15 TB", rate: "$45.00", total: "$675.00" },
      { name: "Enterprise 24/7 SRE Support SLA & Incident Triage", qty: "1 month", rate: "$950.00", total: "$950.00" },
      { name: "Automated Daily Multi-Region Backup & Snapshot Vault", qty: "1 unit", rate: "$220.00", total: "$220.00" },
    ];

    ctx.font = "14px sans-serif";
    let y = 435;
    items.forEach((item, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
      ctx.fillRect(50, y - 25, 800, 42);

      ctx.fillStyle = "#1E293B";
      ctx.fillText(item.name, 70, y);
      ctx.fillStyle = "#475569";
      ctx.fillText(item.qty, 460, y);
      ctx.fillText(item.rate, 600, y);
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(item.total, 740, y);
      ctx.font = "14px sans-serif";

      // Divider line
      ctx.strokeStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.moveTo(50, y + 17);
      ctx.lineTo(850, y + 17);
      ctx.stroke();

      y += 45;
    });

    // Summary calculations
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(520, 680, 330, 180);
    ctx.strokeRect(520, 680, 330, 180);

    ctx.fillStyle = "#475569";
    ctx.font = "15px sans-serif";
    ctx.fillText("Subtotal:", 550, 720);
    ctx.fillText("State Sales Tax (8.25%):", 550, 755);
    ctx.fillText("Early Payment Discount:", 550, 790);

    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("$3,657.00", 750, 720);
    ctx.fillText("$301.70", 750, 755);
    ctx.fillStyle = "#16A34A";
    ctx.fillText("-$150.00", 750, 790);

    // Final total
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(520, 810, 330, 50);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("BALANCE DUE:", 550, 842);
    ctx.fillText("$3,808.70", 730, 842);

    // Footer note
    ctx.fillStyle = "#64748B";
    ctx.font = "13px sans-serif";
    ctx.fillText("Thank you for your business. Remit payments to wire instructions: Apex Bank Routing #021000089.", 50, 920);
    ctx.fillText("For billing inquiries, contact accounting@apexcloud.internal or call +1 (800) 555-0199.", 50, 945);

  } else {
    // Scanned Meeting Notes & Action Items
    ctx.fillStyle = "#FEFDF8"; // Warm paper background
    ctx.fillRect(0, 0, 900, 1200);

    // Notebook margin lines
    ctx.strokeStyle = "#FCA5A5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 0);
    ctx.lineTo(90, 1200);
    ctx.stroke();

    // Horizontal ruled lines
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    for (let lineY = 100; lineY < 1180; lineY += 36) {
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(900, lineY);
      ctx.stroke();
    }

    // Title / Header
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 26px serif";
    ctx.fillText("Sprint 42 Retrospective & Q4 Launch Readiness", 120, 85);

    ctx.font = "16px serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("Attendees: Sarah (Eng Lead), Marcus (DevOps), Priya (QA), Dave (PM)", 120, 130);
    ctx.fillText("Date: Thursday, Oct 24 - 10:30 AM EST | Location: Room 4B & Zoom", 120, 166);

    ctx.font = "bold 20px serif";
    ctx.fillStyle = "#0F172A";
    ctx.fillText("1. What Went Well This Sprint:", 120, 238);
    ctx.font = "16px serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("- Payment Gateway V2 migration completed 2 days ahead of schedule.", 140, 274);
    ctx.fillText("- Zero critical P0 bugs detected in staging load testing (50k simulated concurrent users).", 140, 310);
    ctx.fillText("- Frontend bundle size dropped by 34% after code splitting refactor.", 140, 346);

    ctx.font = "bold 20px serif";
    ctx.fillStyle = "#0F172A";
    ctx.fillText("2. Challenges & Blockers Encountered:", 120, 418);
    ctx.font = "16px serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("- Third-party SMS webhook provider had intermittent 45s latency spikes on Tuesday.", 140, 454);
    ctx.fillText("- Database indexing for search queries needs optimization before global rollout.", 140, 490);
    ctx.fillText("- End-to-end Cypress test suite flakiness in CI/CD pipeline caused 15 min delays.", 140, 526);

    ctx.font = "bold 20px serif";
    ctx.fillStyle = "#0F172A";
    ctx.fillText("3. Key Action Items & Ownership:", 120, 598);
    ctx.font = "16px serif";
    ctx.fillStyle = "#1E293B";
    ctx.fillText("[Action 1] Marcus: Configure circuit-breaker fallback for SMS webhooks (Due: Mon Oct 28)", 140, 634);
    ctx.fillText("[Action 2] Sarah: Implement compound B-tree index on user_search_history (Due: Tue Oct 29)", 140, 670);
    ctx.fillText("[Action 3] Priya: Quarantine 4 flaky test specs and parallelize CI runner (Due: Wed Oct 30)", 140, 706);
    ctx.fillText("[Action 4] Dave: Draft release notes & sync with customer support team (Due: Thu Oct 31)", 140, 742);

    ctx.font = "bold 20px serif";
    ctx.fillStyle = "#0F172A";
    ctx.fillText("4. Executive Sign-Off Criteria:", 120, 814);
    ctx.font = "16px serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("- Code freeze targeted for Friday Nov 1st at 5:00 PM EST.", 140, 850);
    ctx.fillText("- Minimum 90% automated unit test coverage requirement before merge.", 140, 886);
    ctx.fillText("- Production rollout scheduled for Tuesday Nov 5th during low-traffic maintenance window.", 140, 922);
  }

  const dataUrl = canvas.toDataURL("image/png");
  return dataUrl.split(",")[1];
}

export const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    id: "sample-pdf-cloud-spec",
    name: "Cloud_Infrastructure_Spec.pdf",
    category: "Technical Architecture (PDF)",
    description: "Multi-region Kubernetes & event-driven microservices architecture specification with budget & security policies.",
    type: "application/pdf",
    sizeDisplay: "14.2 KB",
    dataUri: `data:application/pdf;base64,${createPdf1Base64()}`,
  },
  {
    id: "sample-pdf-clinical-trial",
    name: "Radiology_Clinical_Trial.pdf",
    category: "Medical & Research (PDF)",
    description: "Clinical research study on AI-assisted radiology diagnostics with sensitivity metrics and clinical recommendations.",
    type: "application/pdf",
    sizeDisplay: "16.8 KB",
    dataUri: `data:application/pdf;base64,${createPdf2Base64()}`,
  },
  {
    id: "sample-img-invoice",
    name: "Apex_Cloud_Invoice_8894.png",
    category: "Financial Invoice (PNG)",
    description: "Detailed cloud infrastructure invoice with itemized line items, hourly unit rates, taxes, and balance breakdown.",
    type: "image/png",
    sizeDisplay: "84.5 KB",
    dataUri: "", // dynamically generated on demand to avoid large static bundle overhead
  },
  {
    id: "sample-img-retro-notes",
    name: "Sprint42_Retrospective_Notes.png",
    category: "Scanned Meeting Notes (PNG)",
    description: "Engineering team retrospective notes with action items, blockers, deadlines, and release sign-off checklist.",
    type: "image/png",
    sizeDisplay: "92.1 KB",
    dataUri: "", // dynamically generated on demand
  },
];
