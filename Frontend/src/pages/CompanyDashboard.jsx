import { useEffect, useState } from "react";

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
          <p className="text-3xl text-white mt-3">{security.failedLoginAttempts}</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.72)" }}>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Suspicious access</p>
          <p className="text-3xl text-white mt-3">{security.suspiciousAccess}</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.72)" }}>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Login locations</p>
          <div className="mt-3 space-y-2">
            {security.loginLocations.map((location) => (
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
        <span className="badge-info">{billing.currentPlan}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["Current plan", billing.currentPlan],
          ["Monthly AI usage", billing.monthlyAiUsage],
          ["Estimated cost", billing.estimatedCost],
          ["Next billing date", billing.nextBillingDate],
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardData, teamData, activityData] = await Promise.all([
          getCompanyDashboard(),
          getCompanyTeam(),
          getCompanyActivity(),
        ]);

        setDashboard(dashboardData);
        setTeam(teamData.team ?? []);
        setActivity(activityData.activity?.map((item) => ({ ...item, type: "default" })) ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = dashboard
    ? [
        { label: "Total Employees", value: dashboard.overview.totalEmployees, icon: "E", tone: "gold", helper: "Active seats" },
        { label: "Documents Analyzed", value: dashboard.overview.totalDocumentsAnalyzed, icon: "D", tone: "blue", helper: "Across company workspaces" },
        { label: "AI Requests", value: dashboard.overview.aiRequests, icon: "AI", tone: "emerald", helper: "Processed this cycle" },
        { label: "Risk Clauses", value: dashboard.overview.riskClausesDetected, icon: "!", tone: "rose", helper: "Flagged across reviews" },
      ]
    : [];

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
                  {loading ? "Loading company analytics..." : dashboard?.company?.name}
                </h1>
                <p className="text-sm md:text-base text-gray-400 mt-3 max-w-3xl">
                  Enterprise analytics across users, documents, model usage, security posture, and billing.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border px-5 py-4" style={{ borderColor: "rgba(147,197,253,0.2)", background: "rgba(13,13,15,0.54)" }}>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Industry</p>
                  <p className="text-xl text-white mt-2">{dashboard?.company?.industry ?? "Loading..."}</p>
                </div>
                <div className="rounded-2xl border px-5 py-4" style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(13,13,15,0.54)" }}>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Plan</p>
                  <p className="text-xl text-white mt-2">{dashboard?.company?.currentPlan ?? "Loading..."}</p>
                </div>
              </div>
            </div>
          </section>

          {error ? (
            <section className="card border-red-500/30 text-red-300">
              <h2 className="text-lg font-semibold">Dashboard unavailable</h2>
              <p className="text-sm mt-2 text-red-200/80">{error}</p>
            </section>
          ) : null}

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {(loading ? new Array(4).fill(null) : stats).map((stat, index) =>
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

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <ChartCard
              title="AI Requests Per Day"
              subtitle="Daily request volume across the model layer."
              helper="7 days"
              type="line"
              data={dashboard?.modelUsageAnalytics?.aiRequestsPerDay ?? []}
            />
            <ChartCard
              title="Token Usage"
              subtitle="Breakdown across input, output, and embeddings."
              helper="M tokens"
              type="donut"
              data={dashboard?.modelUsageAnalytics?.tokenUsage ?? []}
            />
            <ChartCard
              title="Estimated Cost"
              subtitle="Weekly run-rate for AI operations."
              helper="USD"
              type="bar"
              data={dashboard?.modelUsageAnalytics?.estimatedCost ?? []}
            />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard
              title="Document Insights"
              subtitle="Processed documents by category."
              helper="Volume"
              type="bar"
              data={dashboard?.documentInsights ?? []}
            />
            <ChartCard
              title="Risk Analytics"
              subtitle="Clause severity distribution across analyzed content."
              helper="Severity"
              type="donut"
              data={
                dashboard
                  ? [
                      { label: "High", value: dashboard.riskAnalytics.high },
                      { label: "Medium", value: dashboard.riskAnalytics.medium },
                      { label: "Low", value: dashboard.riskAnalytics.low },
                    ]
                  : []
              }
            />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <TeamTable members={team} />
            <section className="card fade-up">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg text-white font-semibold">API Usage</h2>
                  <p className="text-sm text-gray-400 mt-1">Operational metrics for enterprise API consumption.</p>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">Live</span>
              </div>

              <div className="space-y-4">
                {dashboard
                  ? [
                      ["Total API requests", dashboard.apiUsage.totalRequests],
                      ["Response time", `${dashboard.apiUsage.responseTimeMs} ms`],
                      ["Error rate", `${dashboard.apiUsage.errorRate}%`],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border px-4 py-4"
                        style={{ borderColor: "var(--dark-500)", background: "rgba(17,17,21,0.72)" }}
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</p>
                        <p className="text-2xl text-white mt-3">{value}</p>
                      </div>
                    ))
                  : null}
              </div>
            </section>
          </section>

          <ActivityLog title="Activity Logs" subtitle="Audit trail of admin and analyst actions." items={activity} />
          {dashboard ? <SecurityPanel security={dashboard.securityMonitoring} /> : null}
          {dashboard ? <BillingPanel billing={dashboard.billing} /> : null}
        </div>
      </main>
    </div>
  );
}
