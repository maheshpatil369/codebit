import { useEffect, useState } from "react";

import ActivityLog from "../components/ActivityLog";
import ChartCard from "../components/ChartCard";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { getUserDashboard } from "../services/api";

const sidebarItems = [
  { label: "User Dashboard", path: "/dashboard" },
  { label: "Company Dashboard", path: "/company-dashboard" },
  { label: "Admin Dashboard", path: "/admin-dashboard" },
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function riskBadge(riskLevel) {
  if (riskLevel === "High") return "badge-high";
  if (riskLevel === "Medium") return "badge-medium";
  return "badge-low";
}

export default function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getUserDashboard();
        setDashboard(data);
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
        { label: "Total Documents", value: dashboard.documentsCount, icon: "D", tone: "gold", helper: "Uploaded for review" },
        { label: "AI Queries", value: dashboard.aiQueries, icon: "AI", tone: "blue", helper: "Questions asked to Lex" },
        { label: "Risk Alerts", value: dashboard.riskAlerts, icon: "!", tone: "rose", helper: "Potential issues flagged" },
        { label: "Reports Generated", value: dashboard.reportsGenerated, icon: "R", tone: "emerald", helper: "Exports and summaries" },
      ]
    : [];

  const activityMix = dashboard
    ? dashboard.recentActivity.reduce((acc, item) => {
        acc[item.action] = (acc[item.action] ?? 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div className="min-h-screen lg:flex bg-[var(--dark-900)]">
      <Sidebar title="User Workspace" subtitle="B2C Dashboard" items={sidebarItems} footerLabel="Personal analytics live" />

      <main className="flex-1 p-5 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <section
            className="card overflow-hidden fade-up"
            style={{ background: "linear-gradient(135deg, rgba(212,168,71,0.12), rgba(17,17,21,0.94))" }}
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500">User Dashboard</p>
                <h1 className="font-display text-4xl md:text-5xl text-white mt-3">
                  {loading ? "Loading profile..." : `Welcome back, ${dashboard?.user?.name}`}
                </h1>
                <p className="text-sm md:text-base text-gray-400 mt-3 max-w-2xl">
                  Track personal document activity, AI usage, and risk trends from one place.
                </p>
              </div>
              <div
                className="rounded-2xl border px-5 py-4"
                style={{ borderColor: "rgba(201,169,110,0.24)", background: "rgba(13,13,15,0.54)" }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Current plan</p>
                <p className="text-xl text-white mt-2">{dashboard?.user?.plan ?? "Loading..."}</p>
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

          <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
            <ActivityLog
              title="Recent Activity"
              subtitle="Latest actions across your personal workspace."
              items={dashboard?.recentActivity ?? []}
            />
            <ChartCard
              title="Activity Mix"
              subtitle="How your recent work is distributed."
              helper="Last 4 events"
              type="donut"
              data={Object.entries(activityMix).map(([label, value]) => ({ label, value }))}
            />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <section className="card fade-up overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg text-white font-semibold">Document History</h2>
                  <p className="text-sm text-gray-400 mt-1">Uploaded documents with detected risk level and type.</p>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">
                  {(dashboard?.documentHistory ?? []).length} files
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b" style={{ borderColor: "var(--dark-500)" }}>
                      <th className="pb-3 font-medium">Document name</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Risk level</th>
                      <th className="pb-3 font-medium">Date uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard?.documentHistory ?? []).map((document) => (
                      <tr key={document.id} className="border-b last:border-0" style={{ borderColor: "rgba(38,38,47,0.8)" }}>
                        <td className="py-4 text-white">{document.name}</td>
                        <td className="py-4 text-gray-400">{document.type}</td>
                        <td className="py-4">
                          <span className={riskBadge(document.riskLevel)}>{document.riskLevel}</span>
                        </td>
                        <td className="py-4 text-gray-500">{formatDate(document.uploadedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <ChartCard
              title="Document Risk Spread"
              subtitle="Current distribution across uploaded documents."
              helper="Portfolio"
              type="bar"
              data={[
                {
                  label: "High",
                  value: (dashboard?.documentHistory ?? []).filter((item) => item.riskLevel === "High").length,
                },
                {
                  label: "Medium",
                  value: (dashboard?.documentHistory ?? []).filter((item) => item.riskLevel === "Medium").length,
                },
                {
                  label: "Low",
                  value: (dashboard?.documentHistory ?? []).filter((item) => item.riskLevel === "Low").length,
                },
              ]}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
