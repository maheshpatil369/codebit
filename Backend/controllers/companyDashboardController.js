const team = [
  {
    id: 1,
    name: "Priya Menon",
    role: "Admin",
    email: "priya.menon@northstarlegal.com",
    lastActivity: "2026-03-11T09:20:00.000Z",
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Legal Manager",
    email: "rahul.verma@northstarlegal.com",
    lastActivity: "2026-03-11T08:54:00.000Z",
  },
  {
    id: 3,
    name: "Sana Ali",
    role: "Analyst",
    email: "sana.ali@northstarlegal.com",
    lastActivity: "2026-03-11T08:18:00.000Z",
  },
  {
    id: 4,
    name: "Karthik Iyer",
    role: "Viewer",
    email: "karthik.iyer@northstarlegal.com",
    lastActivity: "2026-03-10T19:36:00.000Z",
  },
];

const activity = [
  {
    id: 1,
    action: "User login",
    actor: "Priya Menon",
    detail: "Successful admin sign-in from Bengaluru, IN",
    timestamp: "2026-03-11T09:21:00.000Z",
  },
  {
    id: 2,
    action: "Document upload",
    actor: "Sana Ali",
    detail: "Uploaded vendor_msa_q2.pdf",
    timestamp: "2026-03-11T08:45:00.000Z",
  },
  {
    id: 3,
    action: "AI query",
    actor: "Rahul Verma",
    detail: "Asked for clause comparison across two procurement agreements",
    timestamp: "2026-03-11T08:17:00.000Z",
  },
  {
    id: 4,
    action: "Report generation",
    actor: "Priya Menon",
    detail: "Generated enterprise risk summary",
    timestamp: "2026-03-10T18:28:00.000Z",
  },
];

export const getCompanyDashboard = (req, res) => {
  res.json({
    company: {
      name: "Northstar Legal Ops",
      industry: "B2B SaaS",
      currentPlan: "Enterprise",
    },
    overview: {
      totalEmployees: 184,
      totalDocumentsAnalyzed: 4821,
      aiRequests: 12940,
      riskClausesDetected: 1762,
    },
    modelUsageAnalytics: {
      aiRequestsPerDay: [
        { label: "Mar 5", value: 1380 },
        { label: "Mar 6", value: 1495 },
        { label: "Mar 7", value: 1612 },
        { label: "Mar 8", value: 1541 },
        { label: "Mar 9", value: 1728 },
        { label: "Mar 10", value: 1862 },
        { label: "Mar 11", value: 1914 },
      ],
      tokenUsage: [
        { label: "Input", value: 3.2 },
        { label: "Output", value: 1.8 },
        { label: "Embeddings", value: 0.9 },
      ],
      estimatedCost: [
        { label: "Week 1", value: 420 },
        { label: "Week 2", value: 468 },
        { label: "Week 3", value: 451 },
        { label: "Week 4", value: 497 },
      ],
    },
    documentInsights: [
      { label: "Contracts", value: 2124, percentage: 44 },
      { label: "NDAs", value: 1148, percentage: 24 },
      { label: "Policies", value: 733, percentage: 15 },
      { label: "Agreements", value: 816, percentage: 17 },
    ],
    riskAnalytics: {
      high: 214,
      medium: 621,
      low: 927,
    },
    apiUsage: {
      totalRequests: 54211,
      responseTimeMs: 342,
      errorRate: 0.82,
    },
    securityMonitoring: {
      failedLoginAttempts: 7,
      suspiciousAccess: 2,
      loginLocations: ["Bengaluru, IN", "Mumbai, IN", "London, UK"],
    },
    billing: {
      currentPlan: "Enterprise",
      monthlyAiUsage: "4.9M tokens",
      estimatedCost: "$1,836",
      nextBillingDate: "2026-04-01",
    },
  });
};

export const getCompanyTeam = (req, res) => {
  res.json({ team });
};

export const getCompanyActivity = (req, res) => {
  res.json({ activity });
};
