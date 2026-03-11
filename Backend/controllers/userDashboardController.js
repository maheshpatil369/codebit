const recentActivity = [
  {
    id: 1,
    action: "Document uploaded",
    detail: "Employment_Contract_March.pdf added for analysis",
    timestamp: "2026-03-11T09:14:00.000Z",
    type: "upload",
  },
  {
    id: 2,
    action: "AI query submitted",
    detail: "Asked Lex to explain the indemnity clause",
    timestamp: "2026-03-11T08:42:00.000Z",
    type: "query",
  },
  {
    id: 3,
    action: "Report downloaded",
    detail: "Risk summary exported for NDA review",
    timestamp: "2026-03-10T18:27:00.000Z",
    type: "report",
  },
  {
    id: 4,
    action: "Risk alert detected",
    detail: "Auto-renewal clause flagged as medium risk",
    timestamp: "2026-03-10T15:03:00.000Z",
    type: "risk",
  },
];

const documentHistory = [
  {
    id: 1,
    name: "Employment_Contract_March.pdf",
    type: "Employment Contract",
    riskLevel: "High",
    uploadedAt: "2026-03-11T09:10:00.000Z",
  },
  {
    id: 2,
    name: "Mutual_NDA_Startup.docx",
    type: "NDA",
    riskLevel: "Medium",
    uploadedAt: "2026-03-10T17:55:00.000Z",
  },
  {
    id: 3,
    name: "Lease_Renewal_Apartment.pdf",
    type: "Lease Agreement",
    riskLevel: "Low",
    uploadedAt: "2026-03-08T13:24:00.000Z",
  },
  {
    id: 4,
    name: "Consulting_Agreement_Q1.pdf",
    type: "Service Agreement",
    riskLevel: "Medium",
    uploadedAt: "2026-03-06T11:48:00.000Z",
  },
];

export const getUserDashboard = (req, res) => {
  res.json({
    user: {
      name: "Aarav Sharma",
      plan: "Pro Individual",
    },
    documentsCount: 24,
    aiQueries: 86,
    riskAlerts: 13,
    reportsGenerated: 11,
    recentActivity,
    documentHistory,
  });
};
