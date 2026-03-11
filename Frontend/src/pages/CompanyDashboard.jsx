import { useCallback, useEffect, useState } from "react";

import ActivityLog from "../components/ActivityLog";
import ChartCard from "../components/ChartCard";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TeamTable from "../components/TeamTable";
import { getCompanyActivity, getCompanyDashboard, getCompanyTeam } from "../services/api";

const sidebarItems = [
  { label: "Company Dashboard", path: "/company-dashboard" },
  { label: "User Dashboard", path: "/dashboard" },
  { label: "Admin Dashboard", path: "/admin-dashboard" },
];

function titleize(value) {
  return String(value ?? "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFirstValue(source, keys, fallback = 0) {
  for (const key of keys) {
    if (source?.[key] != null) return source[key];
  }
  return fallback;
}

function toNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.-]/g, "");
    return normalized ? Number(normalized) : 0;
  }
  return 0;
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(toNumber(value));
}

function formatPercent(value) {
  return `${toNumber(value).toFixed(1)}%`;
}

function formatCurrency(value) {
  if (typeof value === "string" && value.trim()) return value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

function formatMilliseconds(value) {
  return `${Math.round(toNumber(value))} ms`;
}

function normalizeSeries(input, fallbackLabel) {
  if (Array.isArray(input)) {
    return input.map((item, index) => ({
      label: item.label ?? item.name ?? item.date ?? `${fallbackLabel} ${index + 1}`,
      value: toNumber(item.value ?? item.count ?? item.total),
    }));
  }

  if (input && typeof input === "object") {
    if (input.value != null || input.total != null || input.count != null) {
      return [{ label: fallbackLabel, value: toNumber(input.value ?? input.total ?? input.count) }];
    }

    return Object.entries(input).map(([label, value]) => ({
      label: titleize(label),
      value: toNumber(value),
    }));
  }

  if (input != null) {
    return [{ label: fallbackLabel, value: toNumber(input) }];
  }

  return [];
}

function normalizeDocumentInsights(input) {
  if (Array.isArray(input)) {
    return input.map((item) => ({
      label: item.label ?? titleize(item.type ?? item.name),
      value: toNumber(item.value ?? item.count ?? item.total),
    }));
  }

  if (input && typeof input === "object") {
    return ["contracts", "ndas", "policies", "agreements"]
      .filter((key) => input[key] != null)
      .map((key) => ({ label: titleize(key), value: toNumber(input[key]) }));
  }

  return [];
}

function SecurityPanel({ security }) {
  return (
    <section className="card fade-up">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg text-white font-semibold">Security Monitoring</h2>
          <p className="text-sm text-gray-400 mt-1">Failed logins, suspicious access, and recent login locations.</p>
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">Ops</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.72)" }}>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Failed login attempts</p>
          <p className="text-3xl text-white mt-3">{security.failedLoginAttempts ?? 0}</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.72)" }}>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Suspicious access</p>
          <p className="text-3xl text-white mt-3">{security.suspiciousAccess ?? 0}</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.72)" }}>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Login locations</p>
          <div className="mt-3 space-y-2">
            {(security.loginLocations ?? []).map((location) => (
              <p key={location} className="text-sm text-gray-300">{location}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BillingPanel({ billing }) {
  return (
    <section className="card fade-up">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg text-white font-semibold">Billing & Subscription</h2>
          <p className="text-sm text-gray-400 mt-1">Plan, monthly AI consumption, and estimated costs.</p>
        </div>
        <span className="badge-info">{billing.plan ?? billing.currentPlan ?? "Unknown"}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["Current plan", billing.plan ?? billing.currentPlan ?? "Unknown"],
          ["Monthly usage", billing.monthlyUsage ?? billing.monthlyAiUsage ?? "Unavailable"],
          ["Estimated cost", billing.estimatedCost ? formatCurrency(billing.estimatedCost) : "Unavailable"],
          ["Next billing date", billing.nextBillingDate ?? "Unavailable"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border px-4 py-4"
            style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.72)" }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</p>
            <p className="text-xl text-white mt-3">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CompanyDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [team, setTeam] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setError("");
    setLoadingDashboard(true);
    setLoadingTeam(true);
    setLoadingActivity(true);

    try {
      const [dashboardData, teamData, activityData] = await Promise.all([
        getCompanyDashboard(),
        getCompanyTeam(),
        getCompanyActivity(),
      ]);

      setDashboard(dashboardData);
      setTeam(teamData.team ?? []);
      setActivity(
        (activityData.activity ?? []).map((item) => ({
          ...item,
          user: item.user ?? item.actor ?? "Unknown",
          resource: item.resource ?? item.detail ?? "Not specified",
          type: String(item.type ?? "default").toLowerCase(),
        }))
      );
    } catch (err) {
      setError(err.message || "Unable to load the company dashboard.");
    } finally {
      setLoadingDashboard(false);
      setLoadingTeam(false);
      setLoadingActivity(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const overview = dashboard?.overview ?? {};
  const company = dashboard?.company ?? {};
  const modelUsage = dashboard?.modelUsageAnalytics ?? {};
  const documentInsights = normalizeDocumentInsights(dashboard?.documentInsights);
  const riskAnalytics = dashboard?.riskAnalytics ?? {};
  const apiUsage = dashboard?.apiUsage ?? {};
  const securityMonitoring = dashboard?.securityMonitoring ?? {};
  const billing = dashboard?.billing ?? {};

  const stats = [
    {
      label: "Total Users",
      value: formatCompactNumber(getFirstValue(overview, ["totalUsers", "totalEmployees"], 0)),
      icon: "U",
      tone: "gold",
      helper: "Users across the workspace",
    },
    {
      label: "Documents Analyzed",
      value: formatCompactNumber(getFirstValue(overview, ["documentsAnalyzed", "totalDocumentsAnalyzed"], 0)),
      icon: "D",
      tone: "blue",
      helper: "Documents reviewed by the platform",
    },
    {
      label: "AI Requests",
      value: formatCompactNumber(getFirstValue(overview, ["aiRequests"], 0)),
      icon: "AI",
      tone: "emerald",
      helper: "Requests handled by the model layer",
    },
    {
      label: "Risky Clauses",
      value: formatCompactNumber(getFirstValue(overview, ["riskyClauses", "riskClausesDetected"], 0)),
      icon: "!",
      tone: "rose",
      helper: "Potential issues flagged for review",
    },
  ];

  const modelUsageCards = [
    {
      title: "AI Requests",
      subtitle: "Request volume from the analytics API.",
      helper: "Usage",
      type: "bar",
      data: normalizeSeries(modelUsage.aiRequests ?? modelUsage.aiRequestsPerDay, "AI Requests"),
    },
    {
      title: "Token Usage",
      subtitle: "Input and output tokens consumed.",
      helper: "Tokens",
      type: "donut",
      data: normalizeSeries(modelUsage.tokenUsage, "Token Usage"),
    },
    {
      title: "Estimated Cost",
      subtitle: "Current spend across model usage.",
      helper: "Cost",
      type: "bar",
      data: normalizeSeries(modelUsage.estimatedCost, "Estimated Cost"),
    },
    {
      title: "Response Time",
      subtitle: "Average latency for model-backed operations.",
      helper: "Latency",
      type: "bar",
      data: normalizeSeries(modelUsage.responseTime, "Response Time"),
    },
  ];

  const riskChartData = [
    { label: "High", value: toNumber(getFirstValue(riskAnalytics, ["high", "highRiskClauses"], 0)) },
    { label: "Medium", value: toNumber(getFirstValue(riskAnalytics, ["medium", "mediumRiskClauses"], 0)) },
    { label: "Low", value: toNumber(getFirstValue(riskAnalytics, ["low", "lowRiskClauses"], 0)) },
  ];

  const apiUsageCards = [
    ["Requests today", formatCompactNumber(getFirstValue(apiUsage, ["requestsToday", "totalRequests"], 0))],
    [
      "Success rate",
      apiUsage.successRate != null
        ? formatPercent(apiUsage.successRate)
        : formatPercent(100 - toNumber(apiUsage.errorRate ?? 0)),
    ],
    [
      "Average response time",
      formatMilliseconds(getFirstValue(apiUsage, ["averageResponseTime", "responseTimeMs", "responseTime"], 0)),
    ],
  ];

  return (
    <div className="min-h-screen lg:flex bg-[var(--dark-900)]">
      <Sidebar title="Enterprise Workspace" subtitle="B2B Dashboard" items={sidebarItems} footerLabel="Enterprise telemetry live" />

      <main className="flex-1 p-5 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <section
            className="card overflow-hidden fade-up"
            style={{ background: "linear-gradient(135deg, rgba(147,197,253,0.12), rgba(17,17,21,0.94))" }}
          >
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Company Dashboard</p>
                <h1 className="font-display text-4xl md:text-5xl text-white mt-3">
                  {loadingDashboard ? "Loading company analytics..." : company.name ?? "Company overview"}
                </h1>
                <p className="text-sm md:text-base text-gray-400 mt-3 max-w-3xl">
                  Enterprise analytics across users, documents, model usage, security posture, and billing.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border px-5 py-4" style={{ borderColor: "rgba(147,197,253,0.2)", background: "rgba(13,13,15,0.54)" }}>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Industry</p>
                  <p className="text-xl text-white mt-2">{company.industry ?? "Loading..."}</p>
                </div>
                <div className="rounded-2xl border px-5 py-4" style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(13,13,15,0.54)" }}>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Plan</p>
                  <p className="text-xl text-white mt-2">{company.plan ?? company.currentPlan ?? "Loading..."}</p>
                </div>
              </div>
            </div>
          </section>

          {error ? (
            <section className="card border-red-500/30 text-red-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Dashboard unavailable</h2>
                  <p className="text-sm mt-2 text-red-200/80">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={loadDashboard}
                  className="px-4 py-2 rounded-xl border text-sm text-white"
                  style={{ borderColor: "rgba(248,113,113,0.35)", background: "rgba(127,29,29,0.2)" }}
                >
                  Retry
                </button>
              </div>
            </section>
          ) : null}

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {(loadingDashboard ? new Array(4).fill(null) : stats).map((stat, index) =>
              stat ? (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  helper={stat.helper}
                  tone={stat.tone}
                />
              ) : (
                <div key={index} className="card h-40 skeleton" />
              )
            )}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {(loadingDashboard ? new Array(4).fill(null) : modelUsageCards).map((card, index) =>
              card ? (
                <ChartCard
                  key={card.title}
                  title={card.title}
                  subtitle={card.subtitle}
                  helper={card.helper}
                  type={card.type}
                  data={card.data}
                />
              ) : (
                <div key={index} className="card h-72 skeleton" />
              )
            )}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {loadingDashboard ? (
              <div className="card h-72 skeleton" />
            ) : (
              <ChartCard
                title="Document Insights"
                subtitle="Processed documents by category."
                helper="Volume"
                type="bar"
                data={documentInsights}
              />
            )}
            {loadingDashboard ? (
              <div className="card h-72 skeleton" />
            ) : (
              <ChartCard
                title="Risk Analytics"
                subtitle="Clause severity distribution across analyzed content."
                helper="Severity"
                type="donut"
                data={riskChartData}
              />
            )}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            {loadingTeam ? <div className="card h-80 skeleton" /> : <TeamTable members={team} />}

            <section className="card fade-up">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg text-white font-semibold">API Usage</h2>
                  <p className="text-sm text-gray-400 mt-1">Operational metrics for enterprise API consumption.</p>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">Live</span>
              </div>

              <div className="space-y-4">
                {loadingDashboard ? (
                  <div className="h-52 skeleton rounded-2xl" />
                ) : (
                  apiUsageCards.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border px-4 py-4"
                      style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.72)" }}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</p>
                      <p className="text-2xl text-white mt-3">{value}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </section>

          {loadingActivity ? (
            <div className="card h-72 skeleton" />
          ) : (
            <ActivityLog title="Activity Logs" subtitle="Audit trail of admin and analyst actions." items={activity} />
          )}

          {loadingDashboard ? <div className="card h-64 skeleton" /> : <SecurityPanel security={securityMonitoring} />}
          {loadingDashboard ? <div className="card h-64 skeleton" /> : <BillingPanel billing={billing} />}
        </div>
      </main>
    </div>
  );
}
