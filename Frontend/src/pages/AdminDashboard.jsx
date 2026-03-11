import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserCard from "../components/UserCard";
import { getDashboardData } from '../services/api';

function StatCard({ label, value, icon, delay }) {
  return (
    <div className={`card fade-up stagger-${delay} flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-2xl font-semibold text-gray-100">{value}</p>
    </div>
  );
}

function SkeletonLog() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: 'var(--dark-500)' }}>
      <div className="skeleton w-9 h-9 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-2.5 w-1/3" />
      </div>
      <div className="skeleton h-5 w-14 rounded-full" />
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const username = data?.user?.username ?? '';
  const logs = data?.logs ?? [];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--dark-900)' }}>
      <Navbar username={username} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Page header */}
          <div className="fade-up">
            <h1 className="font-display text-3xl font-semibold text-gradient">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              {username ? `Logged in as ${username}` : 'Overview of platform activity'}
            </p>
          </div>

          {/* Error state */}
          {error && (
            <div className="fade-up flex items-center gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-medium">Failed to load dashboard</p>
                <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
              </div>
              <button
                className="ml-auto text-xs btn-outline px-3 py-1.5"
                onClick={() => { setError(''); setLoading(true); getDashboardData().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false)); }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Logs"  value={loading ? '—' : logs.length}  icon="📋" delay={1} />
            <StatCard label="AI Queries"  value={loading ? '—' : logs.filter(l => l.action === 'AI Query').length}  icon="🤖" delay={2} />
            <StatCard label="Uploads"     value={loading ? '—' : logs.filter(l => l.action === 'Document Uploaded').length} icon="📄" delay={3} />
            <StatCard label="Summaries"   value={loading ? '—' : logs.filter(l => l.action === 'Generated Summary').length} icon="✨" delay={4} />
          </div>

          {/* Logs panel */}
          <div className="fade-up stagger-3 card p-0 overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: 'var(--dark-500)' }}
            >
              <div>
                <h2 className="text-sm font-semibold text-gray-200">Activity Logs</h2>
                <p className="text-xs text-gray-500 mt-0.5">Recent user actions across the platform</p>
              </div>
              {!loading && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(201,169,110,0.1)', color: 'var(--gold-400)', border: '1px solid rgba(201,169,110,0.2)' }}
                >
                  {logs.length} events
                </span>
              )}
            </div>

            {loading ? (
              <div>
                {[...Array(5)].map((_, i) => <SkeletonLog key={i} />)}
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                <span className="text-4xl mb-3">📭</span>
                <p className="text-sm">No activity logs found</p>
              </div>
            ) : (
              <div id="logs">
                {logs.map((log, i) => (
                  <LogCard key={i} log={log} index={i} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}